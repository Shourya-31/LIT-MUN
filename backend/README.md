# LIT-MUN API

The backend is a Fastify 5 / TypeScript API using Prisma 7 with the PostgreSQL driver adapter. Configuration is parsed and validated at startup; the database connection is disconnected during graceful shutdown. Runtime and Prisma migration errors are surfaced as structured API responses without returning stack traces or secret values.

## Local setup

Prerequisites: Node.js 22.12+, npm, and PostgreSQL 16+ (or Docker Compose).

```powershell
Copy-Item .env.example .env
npm ci
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Edit `.env` to set `DATABASE_URL` and a random `JWT_ACCESS_SECRET` of at least 32 characters. Never commit `.env`. Fastify serves the frontend and API together on port 9090 by default. Swagger UI is available at `/docs`.

To use Compose from the repository root:

```powershell
Copy-Item backend\.env.example backend\.env
docker compose --env-file backend\.env up --build -d
```

Compose builds Vite assets into the Fastify image, starts PostgreSQL with a health check and persistent volume, waits for database health, and applies versioned migrations with `prisma migrate deploy` before starting the integrated app. Only port 9090 is published; PostgreSQL is private to the Compose network. Startup does not reset or seed a database. Run `docker compose exec backend npm run db:seed` when you want the catalog seeded.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | No | `development`, `test`, or `production` |
| `PORT` | No | Integrated app listener port; defaults to `9090` |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `FRONTEND_ORIGINS` | No | Comma-separated trusted origins for refresh/logout Origin checks |
| `STATIC_DIR` | No | Built frontend assets path; defaults to `../frontend/dist` locally and `public` in Docker |
| `JWT_ACCESS_SECRET` | Yes | Random signing secret, at least 32 characters |
| `ACCESS_TOKEN_TTL_SECONDS` | No | Access-token lifetime (60–3600 seconds; default 900) |
| `REFRESH_TOKEN_DAYS` | No | Refresh-session lifetime (1–90 days; default 14) |
| `COOKIE_SECURE` | Production | Must be `true` over HTTPS in production |
| `APP_BASE_URL` | No | Frontend origin used for email links |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM` | Optional together | SMTP delivery; no email is claimed delivered when unset or failed |
| `ADMIN_EMAIL`, `ADMIN_FULL_NAME`, `ADMIN_PASSWORD` | Optional together | Explicit seed-time first administrator; password must be at least 12 characters |

The migration CLI has a local-only fallback URL solely to permit schema generation/build without a running database. Server startup still requires a real `DATABASE_URL`. Production must provide all required secrets and `COOKIE_SECURE=true`.

## Data and state rules

- User roles are `DELEGATE`, `SECRETARIAT`, and `ADMIN`; public registration never accepts a role.
- Applications preserve three ranked committee choices and up to three ranked portfolios per committee, matching the current registration form. The primary committee requires three preferences; secondary/tertiary preference groups may be empty or complete.
- Application states are `SUBMITTED`, `UNDER_REVIEW`, `ACCEPTED`, `WAITLISTED`, `REJECTED`, and `WITHDRAWN`. Transitions are enforced by the staff API.
- Allocation is separate from acceptance. Only accepted applications can receive an allocation, and an existing allocation must be explicitly unallocated before replacement.
- Refresh tokens, verification tokens, and reset tokens are stored only as SHA-256 hashes; password hashes use Argon2id.
- Every application query for a delegate is scoped to the authenticated user. Staff routes use server-side role checks.
- Staff status/role/allocation changes and CSV exports write audit records.

Committee and portfolio options are defined in `backend/prisma/committee-data.ts`; the seed inserts/updates known options and does not delete database records.

## Migrations and administrator setup

- `npm run db:migrate` — development migration command, may prompt to create a new migration.
- `npm run db:deploy` — applies committed migrations and is used for deployment.
- `npm run db:seed` — idempotently seeds committee options; it creates the initial admin only when all `ADMIN_*` variables are explicitly configured.
- `npm run admin:create` — creates an administrator from `ADMIN_EMAIL`, `ADMIN_FULL_NAME`, and `ADMIN_PASSWORD`; refuses to overwrite or promote an existing account.

Never run a database reset command against an existing database. Back up the database before production migrations.

## Testing and checks

```powershell
npm run build
npm run lint
npm run typecheck
npm test
```

Tests use Vitest. PostgreSQL-backed route tests should target a dedicated database, never a production URL. To create one for local integration work, use a separate PostgreSQL database such as `litmun_test`, set `DATABASE_URL` to that database, apply migrations and seed it, and run the tests. Do not use a database with production data.

## API endpoints

All endpoints are under `/api/v1`; successful JSON responses use `{ success, data, message }` and errors include `{ success: false, error, requestId }`. SPA routes serve `index.html`; unknown `/api/v1/*` routes return JSON 404 responses.

| Method and path | Authorization |
| --- | --- |
| `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` | Public/session |
| `POST /auth/forgot-password`, `/auth/reset-password` | Public |
| `POST /auth/verify-email`, `/auth/resend-verification` | Public |
| `GET /auth/me` | Authenticated |
| `GET /committees`, `/committees/:committeeId/portfolios` | Public |
| `POST /applications`, `GET /applications/me`, `PATCH /applications/me` | Delegate |
| `GET /dashboard/me` | Authenticated |
| `GET /admin/dashboard/stats`, `/admin/applications`, `/admin/applications/:id` | Secretariat/Admin |
| `PATCH /admin/applications/:id/status` | Secretariat/Admin |
| `POST /admin/applications/:id/allocate`, `/unallocate` | Secretariat/Admin |
| `GET /admin/applications/export` | Secretariat/Admin |
| `PATCH /admin/users/:id/role` | Admin |

Authentication failures do not reveal account existence. Rate limiting applies to authentication and application submissions. Cookie-authenticated refresh/logout requests require an allowed `Origin`; normal protected API calls use the in-memory bearer access token.

## Deployment and troubleshooting

Deploy the integrated Fastify application behind HTTPS with managed PostgreSQL. Configure the app origin, SMTP, production cookie security, strong signing key, and public app base URL using the hosting platform's secret manager. The React frontend is built into the same image and uses relative `/api/v1` requests.

- Use `localhost` in `DATABASE_URL` when the API runs on the host; use the Compose service name `db` from the backend container.
- A refresh/logout origin error generally means the app origin is missing from `FRONTEND_ORIGINS` and differs from `APP_BASE_URL`.
- Browser cookies require `COOKIE_SECURE=true` on production HTTPS and an appropriate same-site deployment.
- If a migration fails, inspect the migration and live database before retrying; do not reset.
- SMTP is optional locally. When unset, account creation reports that verification delivery is unavailable; password reset stays non-enumerating.
