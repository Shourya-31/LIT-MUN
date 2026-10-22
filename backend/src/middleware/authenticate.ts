import type { FastifyRequest, preHandlerHookHandler } from 'fastify';
import type { UserRole } from '../generated/prisma/client.js';
import { forbidden, unauthorized } from '../common/errors.js';

export const authenticate: preHandlerHookHandler = async (request) => {
  try {
    await request.jwtVerify();
  } catch {
    throw unauthorized();
  }
};

export function requireRole(...roles: UserRole[]): preHandlerHookHandler {
  return async (request: FastifyRequest) => {
    if (!roles.includes(request.user.role)) {
      throw forbidden();
    }
  };
}
