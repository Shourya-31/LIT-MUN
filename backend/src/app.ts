import 'dotenv/config';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Fastify, { type FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { ZodError } from 'zod';
import { env } from './config/env.js';
import { ApiError } from './common/errors.js';
import { prisma } from './plugins/prisma.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { applicationRoutes } from './modules/applications/applications.routes.js';
import { adminRoutes } from './modules/admin/admin.routes.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    bodyLimit: 64 * 1024,
    logger: {
      level: env.NODE_ENV === 'test' ? 'silent' : 'info',
      redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers.set-cookie'],
        censor: '[REDACTED]',
      },
    },
    requestIdHeader: 'x-request-id',
    genReqId: () => crypto.randomUUID(),
  });

  await app.register(helmet);
  await app.register(cookie);
  await app.register(jwt, { secret: env.JWT_ACCESS_SECRET });
  await app.register(rateLimit, { max: 120, timeWindow: '15 minutes' });
  await app.register(swagger, {
    openapi: {
      info: { title: 'LIT-MUN API', version: '1.0.0' },
      servers: [{ url: '/api/v1' }],
      tags: [
        { name: 'health', description: 'Service availability' },
        { name: 'auth', description: 'Account and session operations' },
        { name: 'applications', description: 'Delegate applications and preferences' },
        { name: 'admin', description: 'Restricted application management' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
    },
  });
  await app.register(swaggerUi, { routePrefix: '/docs' });

  const hasStaticAssets = existsSync(join(env.STATIC_DIR, 'index.html'));
  if (env.NODE_ENV === 'production' && !hasStaticAssets) {
    throw new Error(`Frontend assets were not found in STATIC_DIR: ${env.STATIC_DIR}`);
  }
  if (hasStaticAssets) {
    await app.register(fastifyStatic, {
      root: env.STATIC_DIR,
      wildcard: true,
      index: false,
    });
  }

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ApiError) {
      return reply.code(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details === undefined ? {} : { details: error.details }),
        },
        requestId: request.id,
      });
    }

    if (error instanceof ZodError) {
      return reply.code(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please check the submitted information',
          details: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
        requestId: request.id,
      });
    }

    const candidateStatusCode = error instanceof Error && 'statusCode' in error
      ? error.statusCode
      : undefined;
    const statusCode = typeof candidateStatusCode === 'number'
      && candidateStatusCode >= 400
      && candidateStatusCode < 500
      ? candidateStatusCode
      : 500;
    request.log.error({
      errorType: error instanceof Error ? error.name : 'UnknownError',
      errorCode: error instanceof Error && 'code' in error ? error.code : undefined,
    }, 'Request failed');
    return reply.code(statusCode).send({
      success: false,
      error: {
        code: statusCode === 429 ? 'RATE_LIMITED' : 'INTERNAL_ERROR',
        message: statusCode === 429 ? 'Too many requests. Please try again later.' : 'An unexpected error occurred',
      },
      requestId: request.id,
    });
  });

  app.get('/api/v1/health', {
    schema: { tags: ['health'], summary: 'Check service health' },
    handler: async () => ({
      success: true,
      data: { status: 'ok' },
      message: 'Service is healthy',
    }),
  });

  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(applicationRoutes, { prefix: '/api/v1' });
  await app.register(adminRoutes, { prefix: '/api/v1/admin' });

  app.get('/', {
    schema: { hide: true },
    handler: async (_request, reply) => {
      if (!hasStaticAssets) {
        return reply.code(404).send({
          success: false,
          error: { code: 'NOT_FOUND', message: 'The requested resource was not found' },
          requestId: reply.request.id,
        });
      }
      return reply.type('text/html').sendFile('index.html');
    },
  });

  app.setNotFoundHandler((request, reply) => {
    const pathname = request.url.split('?')[0] ?? '/';
    if (
      hasStaticAssets
      && request.method === 'GET'
      && !pathname.startsWith('/api/')
      && pathname !== '/api'
      && !pathname.startsWith('/docs')
      && !/\.[^/]+$/.test(pathname)
      && request.headers.accept?.includes('text/html')
    ) {
      return reply.type('text/html').sendFile('index.html');
    }

    return reply.code(404).send({
      success: false,
      error: { code: 'NOT_FOUND', message: 'The requested resource was not found' },
      requestId: request.id,
    });
  });

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  return app;
}
