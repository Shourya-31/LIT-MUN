import { createHash, randomBytes, randomUUID } from 'node:crypto';
import argon2 from 'argon2';
import type { FastifyInstance, FastifyReply } from 'fastify';
import type { User, UserRole } from '../../generated/prisma/client.js';
import { env } from '../../config/env.js';
import { ApiError, conflict, unauthorized } from '../../common/errors.js';
import { prisma } from '../../plugins/prisma.js';
import { sendAccountEmail } from '../email/email.service.js';

const refreshCookieName = 'litmun_refresh';
const accessTokenTtl = env.ACCESS_TOKEN_TTL_SECONDS;

type SafeUser = Pick<User, 'id' | 'email' | 'fullName' | 'phone' | 'institution' | 'role' | 'emailVerifiedAt'>;

export function safeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    institution: user.institution,
    role: user.role,
    emailVerifiedAt: user.emailVerifiedAt,
  };
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function createOpaqueToken(): string {
  return randomBytes(48).toString('base64url');
}

function setRefreshCookie(reply: FastifyReply, token: string): void {
  reply.setCookie(refreshCookieName, token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    path: '/api/v1/auth',
    maxAge: env.REFRESH_TOKEN_DAYS * 24 * 60 * 60,
  });
}

export function clearRefreshCookie(reply: FastifyReply): void {
  reply.clearCookie(refreshCookieName, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    path: '/api/v1/auth',
  });
}

async function issueSession(
  fastify: FastifyInstance,
  reply: FastifyReply,
  user: User,
  familyId = randomUUID(),
): Promise<{ accessToken: string; user: SafeUser }> {
  const refreshToken = createOpaqueToken();
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
  await prisma.refreshSession.create({
    data: { userId: user.id, familyId, tokenHash: hashToken(refreshToken), expiresAt },
  });
  setRefreshCookie(reply, refreshToken);
  const accessToken = fastify.jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    { expiresIn: accessTokenTtl },
  );
  return { accessToken, user: safeUser(user) };
}

async function issueVerification(user: User): Promise<'sent' | 'not_configured' | 'delivery_failed'> {
  if (!env.SMTP_CONFIGURED) return 'not_configured';
  const token = createOpaqueToken();
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  const link = `${env.APP_BASE_URL}/#verifyEmail=${encodeURIComponent(token)}`;
  const sent = await sendAccountEmail(
    user.email,
    'Verify your LIT-MUN account',
    `Hello ${user.fullName},\n\nVerify your email address within 24 hours:\n${link}\n\nIf you did not create this account, you can ignore this email.`,
  );
  return sent ? 'sent' : 'delivery_failed';
}

export async function register(
  fastify: FastifyInstance,
  reply: FastifyReply,
  input: { fullName: string; email: string; phone: string; institution: string; password: string },
) {
  const passwordHash = await argon2.hash(input.password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  let user: User;
  const refreshToken = createOpaqueToken();
  const familyId = randomUUID();
  const verificationToken = env.SMTP_CONFIGURED ? createOpaqueToken() : null;
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
  try {
    user = await prisma.$transaction(async (transaction) => {
      const createdUser = await transaction.user.create({
        data: {
          fullName: input.fullName,
          email: input.email.toLowerCase(),
          phone: input.phone,
          institution: input.institution,
          passwordHash,
        },
      });
      await transaction.refreshSession.create({
        data: {
          userId: createdUser.id,
          familyId,
          tokenHash: hashToken(refreshToken),
          expiresAt,
        },
      });
      if (verificationToken) {
        await transaction.emailVerificationToken.create({
          data: {
            userId: createdUser.id,
            tokenHash: hashToken(verificationToken),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });
      }
      return createdUser;
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      throw conflict('An account with this email address already exists');
    }
    throw error;
  }

  setRefreshCookie(reply, refreshToken);
  const accessToken = fastify.jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    { expiresIn: accessTokenTtl },
  );
  const verificationEmailStatus = verificationToken
    ? await sendAccountEmail(
        user.email,
        'Verify your LIT-MUN account',
        `Hello ${user.fullName},\n\nVerify your email address within 24 hours:\n${env.APP_BASE_URL}/?verifyEmail=${encodeURIComponent(verificationToken)}\n\nIf you did not create this account, you can ignore this email.`,
      ).then((sent) => sent ? 'sent' as const : 'delivery_failed' as const)
    : 'not_configured';

  return {
    accessToken,
    user: safeUser(user),
    verificationEmailStatus,
  };
}

export async function login(
  fastify: FastifyInstance,
  reply: FastifyReply,
  email: string,
  password: string,
) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.status !== 'ACTIVE' || !(await argon2.verify(user.passwordHash, password))) {
    throw unauthorized('Email or password is incorrect');
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  return issueSession(fastify, reply, updatedUser);
}

export async function refresh(fastify: FastifyInstance, reply: FastifyReply, rawToken?: string) {
  if (!rawToken) {
    clearRefreshCookie(reply);
    throw unauthorized('Session has expired');
  }

  const existing = await prisma.refreshSession.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: { user: true },
  });

  if (!existing) {
    clearRefreshCookie(reply);
    throw unauthorized('Session has expired');
  }

  if (existing.revokedAt) {
    await prisma.refreshSession.updateMany({
      where: { familyId: existing.familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    clearRefreshCookie(reply);
    throw unauthorized('Session is no longer valid');
  }

  if (existing.expiresAt <= new Date() || existing.user.status !== 'ACTIVE') {
    await prisma.refreshSession.update({
      where: { id: existing.id },
      data: { revokedAt: new Date() },
    });
    clearRefreshCookie(reply);
    throw unauthorized('Session has expired');
  }

  const nextToken = createOpaqueToken();
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
  const accessToken = fastify.jwt.sign(
    { sub: existing.user.id, email: existing.user.email, role: existing.user.role },
    { expiresIn: accessTokenTtl },
  );

  const rotated = await prisma.$transaction(async (transaction) => {
    const result = await transaction.refreshSession.updateMany({
      where: { id: existing.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (result.count !== 1) {
      await transaction.refreshSession.updateMany({
        where: { familyId: existing.familyId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      return false;
    }
    await transaction.refreshSession.create({
      data: {
        userId: existing.userId,
        familyId: existing.familyId,
        tokenHash: hashToken(nextToken),
        expiresAt,
      },
    });
    return true;
  });
  if (!rotated) {
    clearRefreshCookie(reply);
    throw unauthorized('Session is no longer valid');
  }
  setRefreshCookie(reply, nextToken);

  return { accessToken, user: safeUser(existing.user) };
}

export async function logout(reply: FastifyReply, rawToken?: string): Promise<void> {
  if (rawToken) {
    await prisma.refreshSession.updateMany({
      where: { tokenHash: hashToken(rawToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  clearRefreshCookie(reply);
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (!env.SMTP_CONFIGURED) return;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.status !== 'ACTIVE') return;

  const token = createOpaqueToken();
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
  const link = `${env.APP_BASE_URL}/#resetToken=${encodeURIComponent(token)}`;
  await sendAccountEmail(
    user.email,
    'Reset your LIT-MUN password',
    `Hello ${user.fullName},\n\nReset your password within one hour:\n${link}\n\nIf you did not request this, ignore this email.`,
  );
}

export async function resetPassword(token: string, password: string): Promise<void> {
  const tokenHash = hashToken(token);
  const reset = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!reset || reset.usedAt || reset.expiresAt <= new Date()) {
    throw new ApiError(400, 'INVALID_RESET_TOKEN', 'This password reset link is invalid or expired');
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
  const now = new Date();
  await prisma.$transaction(async (transaction) => {
    const used = await transaction.passwordResetToken.updateMany({
      where: { id: reset.id, usedAt: null, expiresAt: { gt: now } },
      data: { usedAt: now },
    });
    if (used.count !== 1) {
      throw new ApiError(400, 'INVALID_RESET_TOKEN', 'This password reset link is invalid or expired');
    }
    await transaction.user.update({
      where: { id: reset.userId },
      data: { passwordHash, refreshSessions: { updateMany: { where: { revokedAt: null }, data: { revokedAt: now } } } },
    });
  });
}

export async function verifyEmail(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  const verification = await prisma.emailVerificationToken.findUnique({ where: { tokenHash } });
  if (!verification || verification.usedAt || verification.expiresAt <= new Date()) {
    throw new ApiError(400, 'INVALID_VERIFICATION_TOKEN', 'This verification link is invalid or expired');
  }

  const now = new Date();
  await prisma.$transaction(async (transaction) => {
    const used = await transaction.emailVerificationToken.updateMany({
      where: { id: verification.id, usedAt: null, expiresAt: { gt: now } },
      data: { usedAt: now },
    });
    if (used.count !== 1) {
      throw new ApiError(400, 'INVALID_VERIFICATION_TOKEN', 'This verification link is invalid or expired');
    }
    await transaction.user.update({ where: { id: verification.userId }, data: { emailVerifiedAt: now } });
  });
}

export async function resendVerification(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || user.emailVerifiedAt || user.status !== 'ACTIVE') return;
  await issueVerification(user);
}

export function refreshCookieNameForRequest(): string {
  return refreshCookieName;
}

export type AuthRole = UserRole;
