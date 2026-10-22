import type { UserRole } from '../generated/prisma/client.js';

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: AccessTokenPayload;
    user: AccessTokenPayload;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
