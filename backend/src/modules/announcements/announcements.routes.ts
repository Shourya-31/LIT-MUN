import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { notFound } from '../../common/errors.js';
import { UserRole } from '../../generated/prisma/client.js';
import { authenticate, requireRole } from '../../middleware/authenticate.js';
import { prisma } from '../../plugins/prisma.js';

const announcementPayloadSchema = z.object({
  heading: z.string().trim().min(1).max(200),
  subheading: z.string().trim().max(300).optional().transform((value) => value === '' ? undefined : value),
  content: z.string().trim().min(1),
  isPublished: z.boolean().optional().default(true),
});

const announcementUpdateSchema = z.object({
  heading: z.string().trim().min(1).max(200).optional(),
  subheading: z.string().trim().max(300).optional().transform((value) => value === '' ? undefined : value),
  content: z.string().trim().min(1).optional(),
  isPublished: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided',
});

const announcementIdSchema = z.object({ id: z.string().uuid() });

function normaliseAnnouncement(record: {
  id: string;
  heading: string;
  subheading: string | null;
  content: string;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: record.id,
    heading: record.heading,
    subheading: record.subheading,
    content: record.content,
    isPublished: record.isPublished,
    publishedAt: record.publishedAt ? record.publishedAt.toISOString() : null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function getPublishedOrder() {
  return [{ publishedAt: 'desc' as const }, { createdAt: 'desc' as const }];
}

export async function announcementRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/announcements', {
    schema: { tags: ['announcements'], summary: 'List published announcements' },
  }, async (_request, reply) => {
    const announcements = await prisma.announcement.findMany({
      where: { isPublished: true },
      orderBy: getPublishedOrder(),
    });

    return reply.send({
      success: true,
      data: announcements.map(normaliseAnnouncement),
      message: 'Announcements loaded',
    });
  });

  fastify.get('/announcements/:id', {
    schema: {
      tags: ['announcements'],
      summary: 'Get a published announcement by id',
    },
  }, async (request, reply) => {
    const { id } = announcementIdSchema.parse(request.params);
    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement || !announcement.isPublished) {
      throw notFound('Announcement was not found');
    }

    return reply.send({
      success: true,
      data: normaliseAnnouncement(announcement),
      message: 'Announcement loaded',
    });
  });

  fastify.get('/admin/announcements', {
    preHandler: [authenticate, requireRole(UserRole.ADMIN, UserRole.SECRETARIAT)],
    schema: {
      tags: ['admin'],
      summary: 'List all announcements for administrators',
      security: [{ bearerAuth: [] }],
    },
  }, async (_request, reply) => {
    const announcements = await prisma.announcement.findMany({
      orderBy: getPublishedOrder(),
    });

    return reply.send({
      success: true,
      data: announcements.map(normaliseAnnouncement),
      message: 'Announcement management list loaded',
    });
  });

  fastify.post('/admin/announcements', {
    preHandler: [authenticate, requireRole(UserRole.ADMIN, UserRole.SECRETARIAT)],
    config: { rateLimit: { max: 15, timeWindow: '15 minutes' } },
    schema: {
      tags: ['admin'],
      summary: 'Create an announcement',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const payload = announcementPayloadSchema.parse(request.body);

    const announcement = await prisma.announcement.create({
      data: {
        heading: payload.heading,
        subheading: payload.subheading ?? null,
        content: payload.content,
        isPublished: payload.isPublished,
        publishedAt: payload.isPublished ? new Date() : null,
      },
    });

    return reply.code(201).send({
      success: true,
      data: normaliseAnnouncement(announcement),
      message: 'Announcement created',
    });
  });

  fastify.patch('/admin/announcements/:id', {
    preHandler: [authenticate, requireRole(UserRole.ADMIN, UserRole.SECRETARIAT)],
    config: { rateLimit: { max: 15, timeWindow: '15 minutes' } },
    schema: {
      tags: ['admin'],
      summary: 'Update an announcement',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = announcementIdSchema.parse(request.params);
    const payload = announcementUpdateSchema.parse(request.body);
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) throw notFound('Announcement was not found');

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        ...(payload.heading !== undefined ? { heading: payload.heading } : {}),
        ...(payload.subheading !== undefined ? { subheading: payload.subheading ?? null } : {}),
        ...(payload.content !== undefined ? { content: payload.content } : {}),
        ...(payload.isPublished !== undefined ? { isPublished: payload.isPublished } : {}),
        ...(payload.isPublished === true && !existing.publishedAt ? { publishedAt: new Date() } : {}),
        ...(payload.isPublished === false ? { publishedAt: null } : {}),
      },
    });

    return reply.send({
      success: true,
      data: normaliseAnnouncement(announcement),
      message: 'Announcement updated',
    });
  });

  fastify.delete('/admin/announcements/:id', {
    preHandler: [authenticate, requireRole(UserRole.ADMIN, UserRole.SECRETARIAT)],
    config: { rateLimit: { max: 15, timeWindow: '15 minutes' } },
    schema: {
      tags: ['admin'],
      summary: 'Delete an announcement',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = announcementIdSchema.parse(request.params);
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) throw notFound('Announcement was not found');

    await prisma.announcement.delete({ where: { id } });

    return reply.send({
      success: true,
      data: null,
      message: 'Announcement deleted',
    });
  });
}
