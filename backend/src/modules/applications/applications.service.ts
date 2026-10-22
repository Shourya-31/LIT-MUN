import { randomBytes } from 'node:crypto';
import type { ApplicationInput } from './applications.schemas.js';
import { conflict, forbidden, notFound } from '../../common/errors.js';
import { prisma } from '../../plugins/prisma.js';

async function validatePreferences(input: ApplicationInput) {
  const committees = await prisma.committee.findMany({
    where: { code: { in: input.committees.map((choice) => choice.committeeCode) } },
    include: { portfolios: true },
  });
  const byCode = new Map(committees.map((committee) => [committee.code, committee]));

  if (byCode.size !== input.committees.length) {
    throw conflict('One or more selected committees are unavailable');
  }

  return input.committees.map((choice, index) => {
    const committee = byCode.get(choice.committeeCode);
    if (!committee) {
      throw conflict('One or more selected committees are unavailable');
    }

    const portfoliosByName = new Map(committee.portfolios.map((portfolio) => [portfolio.name, portfolio]));
    const portfolios = choice.portfolios.map((name) => {
      const portfolio = portfoliosByName.get(name);
      if (!portfolio) {
        throw conflict(`A selected portfolio is not available for ${committee.code}`);
      }
      return portfolio;
    });

    return { committeeId: committee.id, rank: index + 1, portfolios };
  });
}

function applicationReference(): string {
  return `LIT-${new Date().getFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function submitApplication(userId: string, input: ApplicationInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw notFound('Delegate account was not found');
  if (user.email.toLowerCase() !== input.email.toLowerCase()) {
    throw forbidden('Application email must match the signed-in account');
  }

  const preferences = await validatePreferences(input);
  const alreadySubmitted = await prisma.delegateApplication.findUnique({ where: { userId } });
  if (alreadySubmitted) {
    throw conflict('An application already exists for this account');
  }

  try {
    const application = await prisma.$transaction(async (transaction) => {
      await transaction.user.update({
        where: { id: userId },
        data: { fullName: input.fullName, phone: input.phone, institution: input.institution },
      });
      return transaction.delegateApplication.create({
        data: {
          userId,
          reference: applicationReference(),
          fullName: input.fullName,
          email: input.email.toLowerCase(),
          phone: input.phone,
          institution: input.institution,
          academicLevel: input.academicLevel,
          city: input.city,
          country: input.country,
          experienceLevel: input.experienceLevel,
          pastConferences: input.pastConferences || null,
          statementOfIntent: input.statementOfIntent || null,
          agreedToTerms: input.agreedToTerms,
          preferences: {
            create: preferences.map((preference) => ({
              committeeId: preference.committeeId,
              rank: preference.rank,
              portfolios: {
                create: preference.portfolios.map((portfolio, rank) => ({
                  portfolioId: portfolio.id,
                  rank: rank + 1,
                })),
              },
            })),
          },
        },
        include: { preferences: { include: { committee: true, portfolios: { include: { portfolio: true } } } } },
      });
    });
    return application;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      throw conflict('An application already exists for this account');
    }
    throw error;
  }
}

export async function getApplication(userId: string) {
  return prisma.delegateApplication.findUnique({
    where: { userId },
    include: {
      preferences: {
        orderBy: { rank: 'asc' },
        include: {
          committee: true,
          portfolios: { orderBy: { rank: 'asc' }, include: { portfolio: true } },
        },
      },
      allocation: { include: { committee: true, portfolio: true } },
    },
  });
}

export async function updateApplication(userId: string, input: ApplicationInput) {
  const existing = await prisma.delegateApplication.findUnique({ where: { userId } });
  if (!existing) throw notFound('No application exists for this account');
  if (existing.status !== 'SUBMITTED') {
    throw conflict('Applications can only be edited before review begins');
  }
  if (existing.email.toLowerCase() !== input.email.toLowerCase()) {
    throw forbidden('Application email must match the signed-in account');
  }

  const preferences = await validatePreferences(input);
  return prisma.$transaction(async (transaction) => {
    await transaction.applicationCommitteePreference.deleteMany({ where: { applicationId: existing.id } });
    await transaction.user.update({
      where: { id: userId },
      data: { fullName: input.fullName, phone: input.phone, institution: input.institution },
    });
    return transaction.delegateApplication.update({
      where: { id: existing.id },
      data: {
        fullName: input.fullName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        institution: input.institution,
        academicLevel: input.academicLevel,
        city: input.city,
        country: input.country,
        experienceLevel: input.experienceLevel,
        pastConferences: input.pastConferences || null,
        statementOfIntent: input.statementOfIntent || null,
        agreedToTerms: input.agreedToTerms,
        preferences: {
          create: preferences.map((preference) => ({
            committeeId: preference.committeeId,
            rank: preference.rank,
            portfolios: {
              create: preference.portfolios.map((portfolio, rank) => ({
                portfolioId: portfolio.id,
                rank: rank + 1,
              })),
            },
          })),
        },
      },
      include: { preferences: { include: { committee: true, portfolios: { include: { portfolio: true } } } } },
    });
  });
}
