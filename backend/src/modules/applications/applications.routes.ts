import type { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/authenticate.js';
import { prisma } from '../../plugins/prisma.js';
import { applicationInputSchema } from './applications.schemas.js';
import { getApplication, submitApplication, updateApplication } from './applications.service.js';

export async function applicationRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/committees', {
    schema: { tags: ['applications'], summary: 'List available committees and portfolios' },
  }, async (_request, reply) => {
    const committees = await prisma.committee.findMany({
      orderBy: { code: 'asc' },
      include: { portfolios: { orderBy: { name: 'asc' } } },
    });
    return reply.send({ success: true, data: committees, message: 'Committees loaded' });
  });

  fastify.get('/committees/:committeeId/portfolios', {
    schema: { tags: ['applications'], summary: 'List portfolios for a committee' },
  }, async (request, reply) => {
    const { committeeId } = request.params as { committeeId: string };
    const portfolios = await prisma.portfolio.findMany({
      where: { committee: { OR: [{ id: committeeId }, { code: committeeId }] } },
      orderBy: { name: 'asc' },
    });
    return reply.send({ success: true, data: portfolios, message: 'Portfolios loaded' });
  });

  fastify.get('/applications/me', {
    preHandler: authenticate,
    schema: {
      tags: ['applications'],
      summary: 'Get the current delegate application',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const application = await getApplication(request.user.sub);
    return reply.send({
      success: true,
      data: application,
      message: application ? 'Application loaded' : 'No application has been submitted',
    });
  });

  fastify.post('/applications', {
    preHandler: authenticate,
    config: { rateLimit: { max: 5, timeWindow: '15 minutes' } },
    schema: {
      tags: ['applications'],
      summary: 'Submit a delegate application',
      security: [{ bearerAuth: [] }],
    },
    handler: async (request, reply) => {
      const input = applicationInputSchema.parse(request.body);
      const application = await submitApplication(request.user.sub, input);
      return reply.code(201).send({ success: true, data: application, message: 'Application submitted' });
    },
  });

  fastify.patch('/applications/me', {
    preHandler: authenticate,
    config: { rateLimit: { max: 10, timeWindow: '15 minutes' } },
    schema: {
      tags: ['applications'],
      summary: 'Update the current delegate application',
      security: [{ bearerAuth: [] }],
    },
    handler: async (request, reply) => {
      const input = applicationInputSchema.parse(request.body);
      const application = await updateApplication(request.user.sub, input);
      return reply.send({ success: true, data: application, message: 'Application updated' });
    },
  });

  fastify.get('/dashboard/me', {
    preHandler: authenticate,
    schema: {
      tags: ['applications'],
      summary: 'Get the current delegate dashboard',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        institution: true,
        role: true,
        createdAt: true,
        application: {
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
        },
      },
    });
    return reply.send({ success: true, data: user, message: 'Dashboard loaded' });
  });
}
