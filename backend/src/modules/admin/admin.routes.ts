import { ApplicationStatus, UserRole } from '../../generated/prisma/client.js';
import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import { ApiError, conflict, notFound } from '../../common/errors.js';
import { authenticate, requireRole } from '../../middleware/authenticate.js';
import { prisma } from '../../plugins/prisma.js';

const staffOnly = [authenticate, requireRole(UserRole.ADMIN, UserRole.SECRETARIAT)];
const applicationStatuses = Object.values(ApplicationStatus);

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  q: z.string().trim().max(160).optional(),
  status: z.enum(applicationStatuses as [ApplicationStatus, ...ApplicationStatus[]]).optional(),
  committee: z.string().trim().max(16).optional(),
  allocation: z.enum(['ALLOCATED', 'PENDING']).optional(),
  sortBy: z.enum(['submittedAt', 'reference', 'fullName', 'status']).default('submittedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

const statusBodySchema = z.object({
  status: z.enum(applicationStatuses as [ApplicationStatus, ...ApplicationStatus[]]),
  reviewNote: z.string().trim().max(2000).optional(),
});

const allocationBodySchema = z.object({
  committeeCode: z.string().trim().min(2).max(16),
  portfolioId: z.string().uuid(),
});

const roleBodySchema = z.object({ role: z.nativeEnum(UserRole) });

const transitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  SUBMITTED: ['UNDER_REVIEW', 'WAITLISTED', 'REJECTED', 'WITHDRAWN'],
  UNDER_REVIEW: ['ACCEPTED', 'WAITLISTED', 'REJECTED', 'WITHDRAWN'],
  ACCEPTED: ['WITHDRAWN'],
  WAITLISTED: ['ACCEPTED', 'REJECTED', 'WITHDRAWN'],
  REJECTED: [],
  WITHDRAWN: [],
};

function csvCell(value: string | null | undefined): string {
  const safe = (value ?? '').replace(/[\r\n]+/g, ' ').replace(/^([=+\-@])/, "'$1");
  return `"${safe.replace(/"/g, '""')}"`;
}

function csvRow(values: Array<string | null | undefined>): string {
  return values.map(csvCell).join(',');
}

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/dashboard/stats', {
    preHandler: staffOnly,
    schema: {
      tags: ['admin'],
      summary: 'Get staff dashboard statistics',
      security: [{ bearerAuth: [] }],
    },
  }, async (_request, reply) => {
    const [users, statuses, allocated, awaitingAllocation, committeeRows] = await Promise.all([
      prisma.user.count(),
      prisma.delegateApplication.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.allocation.count({ where: { status: 'ALLOCATED' } }),
      prisma.delegateApplication.count({
        where: { status: 'ACCEPTED', allocation: { isNot: { status: 'ALLOCATED' } } },
      }),
      prisma.committee.findMany({
        orderBy: { code: 'asc' },
        include: {
          _count: { select: { preferences: true, allocations: true } },
        },
      }),
    ]);
    const counts = Object.fromEntries(statuses.map(({ status, _count }) => [status, _count._all]));
    const submitted = Object.values(counts).reduce((total, count) => total + count, 0);

    return reply.send({
      success: true,
      data: {
        totalUsers: users,
        totalApplications: submitted,
        draftApplications: 0,
        awaitingReview: counts.SUBMITTED ?? 0,
        underReview: counts.UNDER_REVIEW ?? 0,
        accepted: counts.ACCEPTED ?? 0,
        waitlisted: counts.WAITLISTED ?? 0,
        rejected: counts.REJECTED ?? 0,
        withdrawn: counts.WITHDRAWN ?? 0,
        allocatedDelegates: allocated,
        awaitingAllocation,
        byCommittee: committeeRows.map((committee) => ({
          code: committee.code,
          name: committee.name,
          preferenceCount: committee._count.preferences,
          allocationCount: committee._count.allocations,
        })),
        countDefinitions: {
          totalApplications: 'All persisted applications, grouped by their current exclusive status.',
          awaitingReview: 'Applications currently in SUBMITTED status.',
          awaitingAllocation: 'Accepted applications without a current allocation.',
          draftApplications: 'Always zero: the current registration workflow saves only submitted applications.',
        },
      },
      message: 'Statistics loaded',
    });
  });

  fastify.get('/applications', {
    preHandler: staffOnly,
    schema: {
      tags: ['admin'],
      summary: 'Search and filter delegate applications',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const query = listQuerySchema.parse(request.query);
    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.committee ? { preferences: { some: { committee: { code: query.committee } } } } : {}),
      ...(query.allocation
        ? { allocation: query.allocation === 'ALLOCATED' ? { is: { status: 'ALLOCATED' as const } } : { isNot: { status: 'ALLOCATED' as const } } }
        : {}),
      ...(query.q
        ? {
            OR: [
              { reference: { contains: query.q, mode: 'insensitive' as const } },
              { fullName: { contains: query.q, mode: 'insensitive' as const } },
              { email: { contains: query.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      prisma.delegateApplication.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: [{ [query.sortBy]: query.order }, { id: 'asc' }],
        include: {
          preferences: { orderBy: { rank: 'asc' }, include: { committee: true } },
          allocation: { include: { committee: true, portfolio: true } },
        },
      }),
      prisma.delegateApplication.count({ where }),
    ]);
    return reply.send({
      success: true,
      data: { items, page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
      message: 'Applications loaded',
    });
  });

  fastify.get('/applications/export', {
    preHandler: staffOnly,
    schema: {
      tags: ['admin'],
      summary: 'Export filtered applications as CSV',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const query = listQuerySchema.omit({ page: true, pageSize: true, sortBy: true, order: true }).parse(request.query);
    const items = await prisma.delegateApplication.findMany({
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(query.committee ? { preferences: { some: { committee: { code: query.committee } } } } : {}),
        ...(query.allocation
          ? { allocation: query.allocation === 'ALLOCATED' ? { is: { status: 'ALLOCATED' as const } } : { isNot: { status: 'ALLOCATED' as const } } }
          : {}),
        ...(query.q
          ? {
              OR: [
                { reference: { contains: query.q, mode: 'insensitive' as const } },
                { fullName: { contains: query.q, mode: 'insensitive' as const } },
                { email: { contains: query.q, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      orderBy: [{ submittedAt: 'desc' }, { id: 'asc' }],
      include: {
        preferences: { orderBy: { rank: 'asc' }, include: { committee: true } },
        allocation: { include: { committee: true, portfolio: true } },
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: request.user.sub,
        action: 'APPLICATION_EXPORT',
        resourceType: 'DelegateApplication',
        resourceId: 'filtered-export',
        metadata: { exportedCount: items.length, status: query.status ?? null },
      },
    });

    const lines = [
      csvRow(['Reference', 'Full Name', 'Email', 'Institution', 'Status', 'Committee Preferences', 'Allocation']),
      ...items.map((application) => csvRow([
        application.reference,
        application.fullName,
        application.email,
        application.institution,
        application.status,
        application.preferences.map(({ committee }) => committee.code).join(' > '),
        application.allocation?.status === 'ALLOCATED'
          ? `${application.allocation.committee.code}: ${application.allocation.portfolio.name}`
          : 'PENDING',
      ])),
    ];
    return reply
      .header('content-type', 'text/csv; charset=utf-8')
      .header('content-disposition', 'attachment; filename="litmun-applications.csv"')
      .send(lines.join('\r\n'));
  });

  fastify.get('/applications/:id', {
    preHandler: staffOnly,
    schema: {
      tags: ['admin'],
      summary: 'Get an application and its preferences',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const application = await prisma.delegateApplication.findUnique({
      where: { id },
      include: {
        preferences: {
          orderBy: { rank: 'asc' },
          include: {
            committee: true,
            portfolios: { orderBy: { rank: 'asc' }, include: { portfolio: true } },
          },
        },
        allocation: { include: { committee: true, portfolio: true, assignedBy: { select: { id: true, fullName: true } } } },
      },
    });
    if (!application) throw notFound('Application was not found');
    return reply.send({ success: true, data: application, message: 'Application loaded' });
  });

  fastify.patch('/applications/:id/status', {
    preHandler: staffOnly,
    schema: {
      tags: ['admin'],
      summary: 'Update an application review status',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = statusBodySchema.parse(request.body);
    const result = await prisma.$transaction(async (transaction) => {
      const current = await transaction.delegateApplication.findUnique({ where: { id } });
      if (!current) throw notFound('Application was not found');
      if (current.status !== body.status && !transitions[current.status].includes(body.status)) {
        throw conflict(`Application cannot move from ${current.status} to ${body.status}`);
      }
      const now = new Date();
      const updated = await transaction.delegateApplication.update({
        where: { id },
        data: {
          status: body.status,
          reviewerId: request.user.sub,
          reviewedAt: now,
          reviewNote: body.reviewNote || null,
        },
      });
      await transaction.auditLog.create({
        data: {
          actorId: request.user.sub,
          action: 'APPLICATION_STATUS_UPDATED',
          resourceType: 'DelegateApplication',
          resourceId: id,
          metadata: { from: current.status, to: body.status },
        },
      });
      return updated;
    });
    return reply.send({ success: true, data: result, message: 'Application status updated' });
  });

  fastify.post('/applications/:id/allocate', {
    preHandler: staffOnly,
    schema: {
      tags: ['admin'],
      summary: 'Allocate an accepted delegate to a portfolio',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = allocationBodySchema.parse(request.body);
    const result = await prisma.$transaction(async (transaction) => {
      const application = await transaction.delegateApplication.findUnique({
        where: { id },
        include: { allocation: true },
      });
      if (!application) throw notFound('Application was not found');
      if (application.status !== 'ACCEPTED') {
        throw conflict('Only accepted applications can be allocated');
      }

      const committee = await transaction.committee.findUnique({
        where: { code: body.committeeCode },
        include: { portfolios: { where: { id: body.portfolioId } } },
      });
      const portfolio = committee?.portfolios[0];
      if (!committee || !portfolio) {
        throw new ApiError(422, 'INVALID_ALLOCATION', 'The portfolio does not belong to the selected committee');
      }

      if (application.allocation?.status === 'ALLOCATED') {
        throw conflict('This application already has an allocation; unallocate it before assigning another');
      }

      const allocation = application.allocation
        ? await transaction.allocation.update({
            where: { applicationId: id },
            data: {
              committeeId: committee.id,
              portfolioId: portfolio.id,
              assignedById: request.user.sub,
              status: 'ALLOCATED',
              assignedAt: new Date(),
            },
          })
        : await transaction.allocation.create({
            data: {
              applicationId: id,
              committeeId: committee.id,
              portfolioId: portfolio.id,
              assignedById: request.user.sub,
            },
          });
      await transaction.auditLog.create({
        data: {
          actorId: request.user.sub,
          action: 'APPLICATION_ALLOCATED',
          resourceType: 'DelegateApplication',
          resourceId: id,
          metadata: { committeeCode: committee.code, portfolioId: portfolio.id },
        },
      });
      return allocation;
    });
    return reply.code(201).send({ success: true, data: result, message: 'Delegate allocated' });
  });

  fastify.post('/applications/:id/unallocate', {
    preHandler: staffOnly,
    schema: {
      tags: ['admin'],
      summary: 'Remove an active delegate allocation',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = await prisma.$transaction(async (transaction) => {
      const allocation = await transaction.allocation.findUnique({ where: { applicationId: id } });
      if (!allocation || allocation.status !== 'ALLOCATED') {
        throw conflict('This application does not have an active allocation');
      }
      const updated = await transaction.allocation.update({
        where: { id: allocation.id },
        data: { status: 'UNALLOCATED' },
      });
      await transaction.auditLog.create({
        data: {
          actorId: request.user.sub,
          action: 'APPLICATION_UNALLOCATED',
          resourceType: 'DelegateApplication',
          resourceId: id,
          metadata: { previousCommitteeId: allocation.committeeId, previousPortfolioId: allocation.portfolioId },
        },
      });
      return updated;
    });
    return reply.send({ success: true, data: result, message: 'Allocation removed' });
  });

  fastify.patch('/users/:id/role', {
    preHandler: [authenticate, requireRole(UserRole.ADMIN)],
    schema: {
      tags: ['admin'],
      summary: 'Change a user role',
      security: [{ bearerAuth: [] }],
    },
    handler: async (request, reply) => {
      const { id } = request.params as { id: string };
      const { role } = roleBodySchema.parse(request.body);
      if (id === request.user.sub && role !== UserRole.ADMIN) {
        throw conflict('You cannot remove your own administrator role');
      }
      const result = await prisma.$transaction(async (transaction) => {
        const user = await transaction.user.findUnique({ where: { id } });
        if (!user) throw notFound('User was not found');
        const updated = await transaction.user.update({ where: { id }, data: { role } });
        await transaction.auditLog.create({
          data: {
            actorId: request.user.sub,
            action: 'USER_ROLE_CHANGED',
            resourceType: 'User',
            resourceId: id,
            metadata: { from: user.role, to: role },
          },
        });
        return { id: updated.id, email: updated.email, role: updated.role };
      });
      return reply.send({ success: true, data: result, message: 'User role updated' });
    },
  });
}
