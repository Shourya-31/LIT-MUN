import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { COMMITTEE_PORTFOLIOS } from './committee-data.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required to seed conference data.');

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function seed(): Promise<void> {
  for (const committee of Object.values(COMMITTEE_PORTFOLIOS)) {
    const savedCommittee = await prisma.committee.upsert({
      where: { code: committee.code },
      update: {
        name: committee.name,
        category: committee.category,
        description: committee.description,
      },
      create: {
        code: committee.code,
        name: committee.name,
        category: committee.category,
        description: committee.description,
      },
    });

    for (const name of committee.portfolios) {
      await prisma.portfolio.upsert({
        where: { committeeId_name: { committeeId: savedCommittee.id, name } },
        update: {},
        create: { committeeId: savedCommittee.id, name },
      });
    }
  }

  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FULL_NAME } = process.env;
  if (ADMIN_EMAIL || ADMIN_PASSWORD || ADMIN_FULL_NAME) {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_FULL_NAME || ADMIN_PASSWORD.length < 12) {
      throw new Error('Set ADMIN_EMAIL, ADMIN_FULL_NAME, and an ADMIN_PASSWORD of at least 12 characters together.');
    }
    const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL.toLowerCase() } });
    if (!existing) {
      const { default: argon2 } = await import('argon2');
      await prisma.user.create({
        data: {
          email: ADMIN_EMAIL.toLowerCase(),
          fullName: ADMIN_FULL_NAME,
          phone: 'Not provided',
          institution: 'LIT-MUN Secretariat',
          passwordHash: await argon2.hash(ADMIN_PASSWORD, { type: argon2.argon2id }),
          role: 'ADMIN',
          emailVerifiedAt: new Date(),
        },
      });
    } else if (existing.role !== 'ADMIN') {
      throw new Error('The configured administrator email already belongs to a non-admin account.');
    }
  }
}

try {
  await seed();
  console.info('Conference committee and portfolio data seeded.');
} finally {
  await prisma.$disconnect();
  await pool.end();
}
