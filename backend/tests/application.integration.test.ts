import { createHash, randomUUID } from 'node:crypto';
import argon2 from 'argon2';
import type { FastifyInstance } from 'fastify';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { PrismaClient } from '../src/generated/prisma/client.js';

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (testDatabaseUrl) {
  const databaseName = new URL(testDatabaseUrl).pathname.slice(1);
  if (!/test/i.test(databaseName) || /prod/i.test(databaseName)) {
    throw new Error('TEST_DATABASE_URL must point to a dedicated database whose name contains "test" and is not production.');
  }
  process.env.DATABASE_URL = testDatabaseUrl;
}
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET ??= 'integration-test-secret-with-at-least-32-characters';

let app: FastifyInstance | undefined;
let prisma: PrismaClient | undefined;
if (testDatabaseUrl) {
  const [{ buildApp }, { prisma: database }] = await Promise.all([
    import('../src/app.js'),
    import('../src/plugins/prisma.js'),
  ]);
  app = await buildApp();
  prisma = database;
}
const integrationDescribe = testDatabaseUrl ? describe : describe.skip;

function getTestRuntime(): { app: FastifyInstance; prisma: PrismaClient } {
  if (!app || !prisma) throw new Error('Integration-test runtime is unavailable');
  return { app, prisma };
}

function tokenFrom(response: { json: () => { data: { accessToken: string } } }): string {
  return response.json().data.accessToken;
}

function authHeaders(token: string): { authorization: string } {
  return { authorization: ['Bearer', token].join(' ') };
}

function cookieFrom(response: { headers: Record<string, string | string[] | undefined> }): string {
  const header = response.headers['set-cookie'];
  const cookie = Array.isArray(header) ? header[0] : header;
  if (!cookie) throw new Error('Expected refresh cookie in authentication response');
  return cookie.split(';')[0];
}

integrationDescribe('PostgreSQL-backed delegate workflow', () => {
  const suffix = randomUUID();
  const email = `integration-${suffix}@example.test`;
  const password = 'integration-test-password-24!';
  let userId = '';
  let secondUserId = '';
  let adminId = '';
  let noApplicationUserId = '';
  let applicationId = '';
  let reference = '';

  beforeAll(async () => {
    const { app, prisma } = getTestRuntime();
    await app.ready();
    const committeeData = [
      { code: 'UNSC', name: 'United Nations Security Council', portfolios: ['France', 'Japan', 'India'] },
      { code: 'UNHRC', name: 'United Nations Human Rights Council', portfolios: ['Canada'] },
      { code: 'AIPPM', name: 'All India Political Parties Meet', portfolios: ['Party portfolio'] },
    ];
    for (const data of committeeData) {
      const committee = await prisma.committee.upsert({
        where: { code: data.code },
        update: {},
        create: {
          code: data.code,
          name: data.name,
          category: 'Integration test',
          description: 'Dedicated integration-test fixture.',
        },
      });
      for (const name of data.portfolios) {
        await prisma.portfolio.upsert({
          where: { committeeId_name: { committeeId: committee.id, name } },
          update: {},
          create: { committeeId: committee.id, name },
        });
      }
    }
  });

  afterAll(async () => {
    if (!app || !prisma) return;
    if (applicationId) {
      await prisma.delegateApplication.deleteMany({ where: { id: applicationId } });
    }
    const userIds = [userId, secondUserId, adminId, noApplicationUserId].filter(Boolean);
    if (userIds.length) {
      await prisma.auditLog.deleteMany({ where: { actorId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await app.close();
  });

  it('registers, persists, reviews, allocates, exports safely, and rotates sessions', async () => {
    const { app, prisma } = getTestRuntime();
    const registration = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        fullName: '=1+1',
        email,
        phone: '+91 98765 43210',
        institution: 'Integration Test University',
        password,
      },
    });
    expect(registration.statusCode).toBe(201);
    const user = registration.json().data.user as { id: string; passwordHash?: string };
    userId = user.id;
    expect(user.passwordHash).toBeUndefined();
    const delegateToken = tokenFrom(registration);
    const originalRefreshCookie = cookieFrom(registration);

    const invalidLogin = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email, password: 'incorrect-password' },
    });
    expect(invalidLogin.statusCode).toBe(401);
    expect(invalidLogin.json().error.message).toBe('Email or password is incorrect');

    const unauthorizedRequest = await app.inject({ method: 'GET', url: '/api/v1/applications/me' });
    expect(unauthorizedRequest.statusCode).toBe(401);
    const emptySession = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      headers: { origin: 'http://localhost:9090' },
    });
    expect(emptySession.statusCode).toBe(204);

    const applicationPayload = {
      fullName: '=1+1',
      email,
      phone: '+91 98765 43210',
      institution: 'Integration Test University',
      academicLevel: 'Undergraduate',
      city: 'Raipur',
      country: 'India',
      committees: [
        { committeeCode: 'UNSC', portfolios: ['France', 'Japan', 'India'] },
        { committeeCode: 'UNHRC', portfolios: [] },
        { committeeCode: 'AIPPM', portfolios: [] },
      ],
      experienceLevel: '1+',
      pastConferences: '',
      statementOfIntent: '',
      agreedToTerms: true,
    };
    const invalidApplication = await app.inject({
      method: 'POST',
      url: '/api/v1/applications',
      headers: authHeaders(delegateToken),
      payload: { ...applicationPayload, agreedToTerms: false },
    });
    expect(invalidApplication.statusCode).toBe(400);

    const application = await app.inject({
      method: 'POST',
      url: '/api/v1/applications',
      headers: { authorization: `Bearer ${delegateToken}` },
      payload: applicationPayload,
    });
    expect(application.statusCode).toBe(201);
    applicationId = application.json().data.id as string;
    reference = application.json().data.reference as string;
    expect(reference).toMatch(/^LIT-\d{4}-[A-F0-9]{8}$/);
    expect(application.json().data.preferences).toHaveLength(3);

    const duplicateApplication = await app.inject({
      method: 'POST',
      url: '/api/v1/applications',
      headers: { authorization: `Bearer ${delegateToken}` },
      payload: applicationPayload,
    });
    expect(duplicateApplication.statusCode).toBe(409);

    const secondUser = await prisma.user.create({
      data: {
        email: `other-${suffix}@example.test`,
        fullName: 'Other Integration Delegate',
        phone: '+91 11111 11111',
        institution: 'Other Integration University',
        passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
      },
    });
    secondUserId = secondUser.id;
    const secondLogin = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: secondUser.email, password },
    });
    expect(secondLogin.statusCode).toBe(200);
    const secondToken = tokenFrom(secondLogin);
    const secondApplication = await app.inject({
      method: 'GET',
      url: '/api/v1/applications/me',
      headers: authHeaders(secondToken),
    });
    expect(secondApplication.statusCode).toBe(200);
    expect(secondApplication.json().data).toBeNull();
    const secondDashboard = await app.inject({
      method: 'GET',
      url: '/api/v1/dashboard/me',
      headers: authHeaders(secondToken),
    });
    expect(secondDashboard.statusCode).toBe(200);
    expect(secondDashboard.json().data.application).toBeNull();

    const expiredAccessToken = app.jwt.sign(
      { sub: userId, email, role: 'DELEGATE' },
      { expiresIn: -1 },
    );
    const expiredAccess = await app.inject({
      method: 'GET',
      url: '/api/v1/applications/me',
      headers: authHeaders(expiredAccessToken),
    });
    expect(expiredAccess.statusCode).toBe(401);

    const deniedStats = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/dashboard/stats',
      headers: { authorization: `Bearer ${delegateToken}` },
    });
    expect(deniedStats.statusCode).toBe(403);
    const deniedProfile = await app.inject({
      method: 'GET',
      url: `/api/v1/admin/applications/${applicationId}`,
      headers: authHeaders(delegateToken),
    });
    expect(deniedProfile.statusCode).toBe(403);

    const admin = await prisma.user.create({
      data: {
        email: `staff-${suffix}@example.test`,
        fullName: 'Integration Staff',
        phone: '+91 00000 00000',
        institution: 'LIT-MUN Secretariat',
        passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
        role: 'ADMIN',
        emailVerifiedAt: new Date(),
      },
    });
    adminId = admin.id;
    const adminLogin = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: admin.email, password },
    });
    expect(adminLogin.statusCode).toBe(200);
    const adminToken = tokenFrom(adminLogin);
    const invalidProfileId = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/applications/not-a-uuid',
      headers: authHeaders(adminToken),
    });
    expect(invalidProfileId.statusCode).toBe(400);
    const missingProfile = await app.inject({
      method: 'GET',
      url: `/api/v1/admin/applications/${randomUUID()}`,
      headers: authHeaders(adminToken),
    });
    expect(missingProfile.statusCode).toBe(404);

    const noApplicationUser = await prisma.user.create({
      data: {
        email: `no-app-${suffix}@example.test`,
        fullName: 'No Application Delegate',
        phone: '+91 55555 12345',
        institution: 'Legacy delegate without an application',
        passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
      },
    });
    noApplicationUserId = noApplicationUser.id;

    const noApplicationProfile = await app.inject({
      method: 'GET',
      url: `/api/v1/admin/applications/${noApplicationUser.id}`,
      headers: authHeaders(adminToken),
    });
    expect(noApplicationProfile.statusCode).toBe(200);
    expect(noApplicationProfile.json().data).toMatchObject({
      id: noApplicationUser.id,
      userId: noApplicationUser.id,
      fullName: 'No Application Delegate',
      email: `no-app-${suffix}@example.test`,
      reference: null,
      status: 'NO_APPLICATION',
      preferences: [],
      allocation: null,
      user: { id: noApplicationUser.id, fullName: 'No Application Delegate' },
    });

    for (const status of ['UNDER_REVIEW', 'ACCEPTED']) {
      const update = await app.inject({
        method: 'PATCH',
        url: `/api/v1/admin/applications/${applicationId}/status`,
        headers: { authorization: `Bearer ${adminToken}` },
        payload: { status },
      });
      expect(update.statusCode).toBe(200);
    }

    const france = await prisma.portfolio.findFirst({
      where: { name: 'France', committee: { code: 'UNSC' } },
    });
    if (!france) throw new Error('Integration fixture portfolio was not found');
    const allocation = await app.inject({
      method: 'POST',
      url: `/api/v1/admin/applications/${applicationId}/allocate`,
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { committeeCode: 'UNSC', portfolioId: france.id },
    });
    expect(allocation.statusCode).toBe(201);

    const profileResponse = await app.inject({
      method: 'GET',
      url: `/api/v1/admin/applications/${applicationId}`,
      headers: authHeaders(adminToken),
    });
    expect(profileResponse.statusCode).toBe(200);
    const profile = profileResponse.json().data;
    expect(profile).toMatchObject({
      id: applicationId,
      reference,
      fullName: '=1+1',
      email,
      phone: '+91 98765 43210',
      institution: 'Integration Test University',
      academicLevel: 'Undergraduate',
      city: 'Raipur',
      country: 'India',
      experienceLevel: '1+',
      pastConferences: null,
      statementOfIntent: null,
      agreedToTerms: true,
      status: 'ACCEPTED',
      user: {
        id: userId,
        email,
        fullName: '=1+1',
        phone: '+91 98765 43210',
        institution: 'Integration Test University',
      },
      preferences: [
        {
          rank: 1,
          committee: { code: 'UNSC' },
          portfolios: [
            { rank: 1, portfolio: { name: 'France' } },
            { rank: 2, portfolio: { name: 'Japan' } },
            { rank: 3, portfolio: { name: 'India' } },
          ],
        },
        { rank: 2, committee: { code: 'UNHRC' }, portfolios: [] },
        { rank: 3, committee: { code: 'AIPPM' }, portfolios: [] },
      ],
      allocation: {
        status: 'ALLOCATED',
        committee: { code: 'UNSC' },
        portfolio: { name: 'France' },
        assignedBy: { id: adminId, fullName: 'Integration Staff' },
      },
    });
    expect(profile.user.createdAt).toBeTruthy();
    expect(profile.reviewedAt).toBeTruthy();
    for (const sensitiveField of [
      'passwordHash',
      'tokenHash',
      'refreshSessions',
      'verificationTokens',
      'passwordResetTokens',
    ]) {
      expect(profileResponse.body).not.toContain(sensitiveField);
    }

    const dashboard = await app.inject({
      method: 'GET',
      url: '/api/v1/dashboard/me',
      headers: { authorization: `Bearer ${delegateToken}` },
    });
    expect(dashboard.statusCode).toBe(200);
    expect(dashboard.json().data.application.reference).toBe(reference);
    expect(dashboard.json().data.application.allocation.portfolio.name).toBe('France');

    const exportResponse = await app.inject({
      method: 'GET',
      url: `/api/v1/admin/applications/export?q=${encodeURIComponent(reference)}`,
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(exportResponse.statusCode).toBe(200);
    expect(exportResponse.body).toContain(reference);
    expect(exportResponse.body).toContain("\"'=1+1\"");

    const refreshed = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      headers: {
        origin: 'http://localhost:9090',
        cookie: originalRefreshCookie,
      },
    });
    expect(refreshed.statusCode).toBe(200);
    expect(cookieFrom(refreshed)).not.toBe(originalRefreshCookie);

    const reused = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      headers: {
        origin: 'http://localhost:9090',
        cookie: originalRefreshCookie,
      },
    });
    expect(reused.statusCode).toBe(401);

    const expiredRefreshToken = randomUUID() + randomUUID();
    await prisma.refreshSession.create({
      data: {
        userId,
        familyId: randomUUID(),
        tokenHash: createHash('sha256').update(expiredRefreshToken).digest('hex'),
        expiresAt: new Date(Date.now() - 60_000),
      },
    });
    const expiredRefresh = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      headers: {
        origin: 'http://localhost:9090',
        cookie: `litmun_refresh=${expiredRefreshToken}`,
      },
    });
    expect(expiredRefresh.statusCode).toBe(401);

    const unknownApi = await app.inject({
      method: 'GET',
      url: '/api/v1/does-not-exist',
      headers: { accept: 'text/html' },
    });
    expect(unknownApi.statusCode).toBe(404);
    expect(unknownApi.headers['content-type']).toContain('application/json');
    expect(unknownApi.json().error.code).toBe('NOT_FOUND');
  });

  it('consumes password-reset and verification tokens only once', async () => {
    const resetToken = randomUUID() + randomUUID();
    const verificationToken = randomUUID() + randomUUID();
    const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');
    const now = new Date();
    await prisma.passwordResetToken.create({
      data: { userId, tokenHash: tokenHash(resetToken), expiresAt: new Date(now.getTime() + 60_000) },
    });
    await prisma.emailVerificationToken.create({
      data: { userId, tokenHash: tokenHash(verificationToken), expiresAt: new Date(now.getTime() + 60_000) },
    });

    const reset = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/reset-password',
      payload: { token: resetToken, password: 'integration-reset-password-26!' },
    });
    expect(reset.statusCode).toBe(200);
    const reusedReset = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/reset-password',
      payload: { token: resetToken, password: 'integration-reset-password-26!' },
    });
    expect(reusedReset.statusCode).toBe(400);

    const verification = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/verify-email',
      payload: { token: verificationToken },
    });
    expect(verification.statusCode).toBe(200);
    const reusedVerification = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/verify-email',
      payload: { token: verificationToken },
    });
    expect(reusedVerification.statusCode).toBe(400);
  });
});
