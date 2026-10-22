import { afterAll, beforeAll, describe, expect, it } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgresql://litmun:local-only@localhost:5432/litmun?schema=public';
process.env.JWT_ACCESS_SECRET ??= 'test-only-secret-that-is-long-enough-for-jwt';

const { buildApp } = await import('../src/app.js');
const app = await buildApp();

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('health endpoint', () => {
  it('returns the documented success response without requiring a database query', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      success: true,
      data: { status: 'ok' },
      message: 'Service is healthy',
    });
    expect(response.headers['x-frame-options']).toBeDefined();
  });

  it('publishes endpoint summaries and bearer authentication in the OpenAPI document', async () => {
    const response = await app.inject({ method: 'GET', url: '/docs/json' });
    const document = response.json() as {
      paths: Record<string, Record<string, { summary?: string }>>;
      components: { securitySchemes: Record<string, { scheme?: string }> };
    };

    expect(response.statusCode).toBe(200);
    expect(Object.values(document.paths).some(
      (operations) => operations.get?.summary === 'Check service health',
    )).toBe(true);
    expect(document.components.securitySchemes.bearerAuth.scheme).toBe('bearer');
  });
});
