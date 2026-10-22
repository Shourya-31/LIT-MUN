import type { FastifyInstance, FastifyRequest } from 'fastify';
import { ApiError } from '../../common/errors.js';
import { env } from '../../config/env.js';
import { authenticate } from '../../middleware/authenticate.js';
import { prisma } from '../../plugins/prisma.js';
import {
  clearRefreshCookie,
  login,
  logout,
  refresh,
  refreshCookieNameForRequest,
  register,
  requestPasswordReset,
  resendVerification,
  resetPassword,
  safeUser,
  verifyEmail,
} from './auth.service.js';
import {
  emailSchemaBody,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  tokenSchema,
} from './auth.schemas.js';

function assertTrustedOrigin(request: FastifyRequest): void {
  const origin = request.headers.origin;
  const trustedOrigins = new Set([
    ...env.FRONTEND_ORIGINS,
    new URL(env.APP_BASE_URL).origin,
  ]);
  if (!origin || !trustedOrigins.has(origin)) {
    throw new ApiError(403, 'UNTRUSTED_ORIGIN', 'Request origin is not allowed');
  }
}

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/register', {
    config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
    schema: { tags: ['auth'], summary: 'Register a delegate account' },
    handler: async (request, reply) => {
      const body = registerSchema.parse(request.body);
      const result = await register(fastify, reply, body);
      return reply.code(201).send({
        success: true,
        data: result,
        message: result.verificationEmailStatus === 'sent'
          ? 'Account created. Check your email to verify your address.'
          : result.verificationEmailStatus === 'not_configured'
            ? 'Account created. Email verification delivery is not configured.'
            : 'Account created, but the verification email could not be delivered.',
      });
    },
  });

  fastify.post('/login', {
    config: { rateLimit: { max: 10, timeWindow: '15 minutes' } },
    schema: { tags: ['auth'], summary: 'Sign in and create a session' },
    handler: async (request, reply) => {
      const body = loginSchema.parse(request.body);
      const data = await login(fastify, reply, body.email, body.password);
      return reply.send({ success: true, data, message: 'Signed in successfully' });
    },
  });

  fastify.post('/refresh', {
    config: { rateLimit: { max: 30, timeWindow: '15 minutes' } },
    schema: {
      tags: ['auth'],
      summary: 'Rotate the refresh session cookie',
      description: 'Requires the refresh cookie and an allowed Origin header.',
    },
    handler: async (request, reply) => {
      assertTrustedOrigin(request);
      const refreshToken = request.cookies[refreshCookieNameForRequest()];
      if (!refreshToken) {
        clearRefreshCookie(reply);
        return reply.code(204).send();
      }
      const data = await refresh(
        fastify,
        reply,
        refreshToken,
      );
      return reply.send({ success: true, data, message: 'Session refreshed' });
    },
  });

  fastify.post('/logout', {
    config: { rateLimit: { max: 30, timeWindow: '15 minutes' } },
    schema: {
      tags: ['auth'],
      summary: 'End the current refresh session',
      description: 'Requires the refresh cookie and an allowed Origin header.',
    },
    handler: async (request, reply) => {
      assertTrustedOrigin(request);
      await logout(reply, request.cookies[refreshCookieNameForRequest()]);
      return reply.send({ success: true, data: null, message: 'Signed out successfully' });
    },
  });

  fastify.post('/forgot-password', {
    config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
    schema: { tags: ['auth'], summary: 'Request password-reset instructions' },
    handler: async (request, reply) => {
      const { email } = emailSchemaBody.parse(request.body);
      await requestPasswordReset(email);
      return reply.send({
        success: true,
        data: null,
        message: 'If an active account exists for that address, password reset instructions will be sent.',
      });
    },
  });

  fastify.post('/reset-password', {
    config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
    schema: { tags: ['auth'], summary: 'Reset a password with a single-use token' },
    handler: async (request, reply) => {
      const { token, password } = resetPasswordSchema.parse(request.body);
      await resetPassword(token, password);
      return reply.send({ success: true, data: null, message: 'Password updated successfully' });
    },
  });

  fastify.post('/verify-email', {
    config: { rateLimit: { max: 10, timeWindow: '15 minutes' } },
    schema: { tags: ['auth'], summary: 'Verify an email address with a single-use token' },
    handler: async (request, reply) => {
      const { token } = tokenSchema.parse(request.body);
      await verifyEmail(token);
      return reply.send({ success: true, data: null, message: 'Email address verified' });
    },
  });

  fastify.post('/resend-verification', {
    config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
    schema: { tags: ['auth'], summary: 'Resend email-verification instructions' },
    handler: async (request, reply) => {
      const { email } = emailSchemaBody.parse(request.body);
      await resendVerification(email);
      return reply.send({
        success: true,
        data: null,
        message: 'If the account needs verification, instructions will be sent when email delivery is configured.',
      });
    },
  });

  fastify.get('/me', {
    preHandler: authenticate,
    schema: {
      tags: ['auth'],
      summary: 'Get the current account profile',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const user = await prisma.user.findUnique({ where: { id: request.user.sub } });
    if (!user || user.status !== 'ACTIVE') {
      clearRefreshCookie(reply);
      return reply.code(401).send({
        success: false,
        error: { code: 'UNAUTHENTICATED', message: 'Authentication is required' },
        requestId: request.id,
      });
    }
    return reply.send({ success: true, data: safeUser(user), message: 'Profile loaded' });
  });
}
