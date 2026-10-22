# LIT-MUN

LIT-MUN is the web platform for Literati Model United Nations. It combines the conference website and delegate experience with an authenticated application workflow and a staff-only administration portal.

The React site preserves the conference's navy-and-gold visual identity, responsive layouts, animations, gallery, and public information. A Fastify API and PostgreSQL database power accounts, delegate applications, review, and committee/portfolio allocation.

## At a glance

- **Integrated production app:** one Fastify server serves the built frontend and API.
- **Public application origin:** [https://nitrrmun.in](https://nitrrmun.in).
- **API prefix:** `/api/v1`.
- **Staff portal:** `/admin/login` and `/admin`.
- **Database:** PostgreSQL with Prisma-managed migrations.
- **Persistence:** Docker Compose named volume `litmun-postgres-data`.

## Requirements

- Docker with Docker Compose for the containerized deployment, or a Node.js 22.12+ runtime and PostgreSQL 16+ for an independently managed deployment.
- PowerShell examples below assume Windows and commands run from the repository root unless stated otherwise.

## Run the integrated application with Docker

Docker Compose builds the React/Vite frontend into the backend image. A single Fastify container then serves the website and API on port 9090; PostgreSQL is only accessible inside the Compose network.

### 1. Prepare configuration

Compose reads the root `.env` file. Preserve any existing configuration; do not copy over or replace it. If there is no root `.env`, create one from the example and configure it for the `nitrrmun.in` deployment before starting:

```powershell
if (-not (Test-Path .env)) {
    Copy-Item backend\.env.example .env
}
```

Set `NODE_ENV=production`, `COOKIE_SECURE=true`, `APP_BASE_URL=https://nitrrmun.in`, and `FRONTEND_ORIGINS=https://nitrrmun.in`. Also set `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and a stable, unique, randomly generated `JWT_ACCESS_SECRET` of at least 32 characters. Use only database credentials verified for the intended deployment. Never commit `.env`, paste its contents into issue reports, or reuse example credentials in a public deployment.

For the public site, set these exact origin values in the root `.env`:

```dotenv
APP_BASE_URL=https://nitrrmun.in
FRONTEND_ORIGINS=https://nitrrmun.in
```

The domain must resolve to the deployment and HTTPS must terminate at the server or its reverse proxy. Keep the integrated Fastify listener on port 9090 behind that HTTPS entry point. Frontend pages, staff pages, API requests, cookies, and email links all use the same `https://nitrrmun.in` origin.

> **Existing database caution:** `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` initialize a new PostgreSQL data directory; they do not rename a database, change a password, or migrate existing records in a previously initialized volume. Before connecting an existing volume, verify its actual database, role, and credentials. Do not switch to another database because its name appears more suitable.

### 2. Start the app

```powershell
docker compose --env-file .env up --build -d
docker compose ps
```

The backend waits for PostgreSQL health, applies committed migrations with `prisma migrate deploy`, then starts Fastify. This does not reset or seed the database.

Use the public application:

- Website: [https://nitrrmun.in](https://nitrrmun.in)
- Staff login: [https://nitrrmun.in/admin/login](https://nitrrmun.in/admin/login)
- API health: [https://nitrrmun.in/api/v1/health](https://nitrrmun.in/api/v1/health)
- OpenAPI UI: [https://nitrrmun.in/docs](https://nitrrmun.in/docs)

The HTTPS reverse proxy or hosting ingress for `nitrrmun.in` must forward requests to the Fastify service on port 9090. Fastify serves the frontend and API from the same origin; do not deploy a separate production frontend server. The public links above are the canonical URLs for all application routes.

Seed committee and portfolio options when needed:

```powershell
docker compose --env-file .env exec backend npm run db:seed
```

The seed uses idempotent upserts for catalog data and does not delete existing options. It only creates an initial administrator if all `ADMIN_EMAIL`, `ADMIN_FULL_NAME`, and `ADMIN_PASSWORD` values are explicitly configured. Do not add administrator credentials to source files or commit an environment file.

### Stop and restart

Stop the app without deleting its database:

```powershell
docker compose --env-file .env stop
```

Start stopped services again:

```powershell
docker compose --env-file .env start
```

Never use `docker compose down -v` for routine maintenance: `-v` deletes Compose-managed volumes. Rebuilding or recreating the app container does not require deleting the PostgreSQL volume.

### If port 9090 is already in use (Windows)

Identify the listener and inspect it before stopping anything:

```powershell
Get-NetTCPConnection -LocalPort 9090 -State Listen |
    Select-Object LocalAddress, LocalPort, OwningProcess
Get-Process -Id <PID>
```

Stop only the process you have identified and intend to stop:

```powershell
Stop-Process -Id <PID>
```

If the listener belongs to this Compose project, stop only its backend service:

```powershell
docker compose --env-file .env stop backend
```

## Build and validate

The Docker image build compiles the Vite frontend and Fastify backend together. To run build, lint, and test checks in a development environment:

```powershell
Set-Location frontend
npm ci
npm run build
npm run lint

Set-Location ..\backend
npm ci
npm run build
npm run lint
npm run typecheck
npm test
```

Use an isolated test database for database-backed tests. These checks do not deploy the site or change the running containers. No separate frontend server is required or used by the deployed application.

## Accounts and roles

- Public signup creates a `DELEGATE`; users cannot grant themselves staff roles.
- Delegates can submit and manage their own application while it is editable.
- `SECRETARIAT` and `ADMIN` users can review applications and manage allocations.
- Only `ADMIN` users can change account roles.
- Staff authentication uses the separate `/admin/login` experience.

To create the first administrator, provide `ADMIN_EMAIL`, `ADMIN_FULL_NAME`, and `ADMIN_PASSWORD` (at least 12 characters) to the seed command, or use the backend's `npm run admin:create` command with those values in its environment. The setup refuses to promote an existing non-admin account. Store administrator credentials in a local ignored environment file or secret manager, not in this README.

## Application workflow

1. A delegate creates an account, signs in, and submits an application with ranked committee and portfolio preferences.
2. The backend assigns an application reference and persists the application in PostgreSQL.
3. Authorized staff search applications, review preferences, and apply permitted status changes.
4. Staff allocate an accepted application to a committee and portfolio.
5. The delegate sees their current status and allocation in their dashboard.

Application status transitions are validated by the API. Allocation is separate from acceptance; an existing allocation must be explicitly removed before replacement. A unique user/application relationship prevents duplicate submissions.

## Authentication and security

- Passwords are hashed with Argon2id.
- Short-lived access tokens are held in frontend memory, not local storage.
- Refresh tokens are stored as hashes, rotated on use, and transported in an HttpOnly cookie.
- API authorization is enforced server-side; frontend route guards are not treated as security boundaries.
- Delegate application reads and updates are scoped to the authenticated account.
- Staff changes and CSV exports are audited.
- Authentication and application submission endpoints are rate-limited.
- Refresh/logout requests validate the request origin against configured origins.

## API overview

All API routes use the `/api/v1` prefix. Successful responses use a JSON envelope; unknown API routes return JSON 404 responses instead of the SPA page.

| Route | Access | Purpose |
| --- | --- | --- |
| `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` | Public/session | Registration and session management |
| `POST /auth/forgot-password`, `/auth/reset-password` | Public | Password recovery |
| `POST /auth/verify-email`, `/auth/resend-verification` | Public | Email verification |
| `GET /auth/me` | Signed in | Current account profile |
| `GET /committees`, `/committees/:committeeId/portfolios` | Public | Registration options |
| `POST /applications`, `GET /applications/me`, `PATCH /applications/me` | Delegate | Submit, read, or edit own application |
| `GET /dashboard/me` | Signed in | Current dashboard data |
| `GET /admin/dashboard/stats`, `/admin/applications` | Secretariat/Admin | Statistics and application search |
| `GET /admin/applications/:id` | Secretariat/Admin | Application review details |
| `PATCH /admin/applications/:id/status` | Secretariat/Admin | Update an allowed status |
| `POST /admin/applications/:id/allocate`, `/unallocate` | Secretariat/Admin | Manage allocation |
| `GET /admin/applications/export` | Secretariat/Admin | Filtered CSV export |
| `PATCH /admin/users/:id/role` | Admin | Change a user's role |

## Environment configuration

Compose reads variables from the root `.env` file. Do not print the resolved Compose configuration: it contains secrets. Validate it safely with:

```powershell
docker compose --env-file .env config --quiet
```

| Variable | Required | Notes |
| --- | --- | --- |
| `POSTGRES_DB` | Yes for Compose | Database name used to initialize a new PostgreSQL volume; does not switch an existing initialized volume to another database. |
| `POSTGRES_USER` | Yes for Compose | PostgreSQL role used by the Compose database service. |
| `POSTGRES_PASSWORD` | Yes for Compose | Database password; keep it private. |
| `JWT_ACCESS_SECRET` | Yes | At least 32 characters; changing it invalidates existing signed access tokens. Keep a stable secret across app restarts. |
| `NODE_ENV` | No | `development`, `test`, or `production`; defaults to `development` in Compose. |
| `PORT` | No | Compose pins the integrated server to port `9090`. |
| `FRONTEND_ORIGINS` | No | Comma-separated origins allowed for cookie-backed refresh/logout; production value: `https://nitrrmun.in`. |
| `COOKIE_SECURE` | Production | Must be `true` when the public app is served over HTTPS. |
| `APP_BASE_URL` | No | Public application URL used in verification and password-reset links; production value: `https://nitrrmun.in`. |
| `ACCESS_TOKEN_TTL_SECONDS` | No | Access-token lifetime from 60 to 3600 seconds; default 900. |
| `REFRESH_TOKEN_DAYS` | No | Refresh-session lifetime from 1 to 90 days; default 14. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM` | Optional together | Configure all SMTP fields together to send verification and password-reset emails. |
| `ADMIN_EMAIL`, `ADMIN_FULL_NAME`, `ADMIN_PASSWORD` | Optional together | Used only by administrator setup; password must be at least 12 characters. |

The backend uses `DATABASE_URL`. Compose constructs it from `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`, using the internal hostname `db`. For deployments that run the backend outside Compose, configure `DATABASE_URL` with the PostgreSQL host name/address reachable from that service.

Without SMTP, verification email delivery is unavailable. Password-recovery responses remain generic and do not reveal whether an account exists. The public contact form retains its existing `mailto:` behavior and does not send messages from the server.

## Database migrations, backups, and tests

Backend commands (run from `backend/`):

```powershell
npm run db:generate
npm run db:migrate       # Local development migration workflow
npm run db:deploy        # Apply committed migrations
npm run db:seed          # Idempotently seed committee/portfolio catalog
npm run admin:create
```

Back up the intended database before production migrations. Verify the database name and target before running a restore; restores can overwrite data. Never run `prisma migrate reset` against a database containing user data.

Run backend checks from `backend/`:

```powershell
npm run build
npm run lint
npm run typecheck
npm test
```

Run frontend checks from `frontend/`:

```powershell
npm run build
npm run lint
```

PostgreSQL-backed integration tests require `TEST_DATABASE_URL` to point to a dedicated test database whose name includes `test`. Never point this variable at a production or user-data database. If it is absent, the database integration tests are skipped; report them as skipped rather than passed.

## Production deployment

The public application origin is `https://nitrrmun.in`. Ensure DNS and HTTPS termination for that domain point to the integrated Fastify application before opening production traffic. The public website, staff portal, API, and email links all use this HTTPS origin; the Fastify container listens on port 9090 behind the HTTPS reverse proxy or hosting ingress. Do not treat example credentials or a database named `litmun_test` as production configuration without explicit verification.

Before deployment:

1. Confirm the intended PostgreSQL host, database, role, and credentials. Inspect existing data before changing database targets.
2. Configure secrets through the hosting platform's secret manager; never commit `.env`.
3. Set `NODE_ENV=production`, `COOKIE_SECURE=true`, a stable high-entropy `JWT_ACCESS_SECRET`, `APP_BASE_URL=https://nitrrmun.in`, and `FRONTEND_ORIGINS=https://nitrrmun.in`.
4. Configure SMTP if verification and reset email delivery are required.
5. Back up the target database and review migrations before applying them.
6. Build and run the integrated Fastify image on port 9090. Place the HTTPS reverse proxy/load balancer in front of that single app server; do not run a separate production frontend server.
7. Verify `/`, `/admin/login`, `/api/v1/health`, authentication, and authorization after deployment.

Deploy with Docker Compose only after the root `.env` has been verified for the production target:

```powershell
docker compose --env-file .env config --quiet
docker compose --env-file .env up --build -d
docker compose --env-file .env ps
```

Compose applies committed migrations at backend startup. This command does not delete the persistent database volume, but migrations can change the schema; back up and verify the intended database first. Never use `docker compose down -v` to deploy or troubleshoot.

## Troubleshooting

- **Backend cannot connect to PostgreSQL:** use `db` from the Compose backend container. For a backend running outside Compose, configure a host name reachable from that service. Confirm the configured database and role match the existing server.
- **Port 9090 is occupied:** identify the owning process with `Get-NetTCPConnection` and `Get-Process`; stop it only after confirming it is safe to do so.
- **Refresh/logout reports an origin error:** configure the exact browser origin in `FRONTEND_ORIGINS` and align it with `APP_BASE_URL`.
- **Production cookie is rejected:** serve the site over HTTPS and set `COOKIE_SECURE=true`.
- **Migration fails:** inspect the migration error and live database before retrying. Do not reset the database to clear the error.
- **Email is not delivered:** confirm all SMTP settings and inspect the provider's delivery logs; the app does not provide a development bypass that exposes email tokens.
- **Compose reports a missing variable:** check that the root `.env` exists, contains the required database credentials, JWT secret, and public settings (`APP_BASE_URL=https://nitrrmun.in` and `FRONTEND_ORIGINS=https://nitrrmun.in`), and is passed with `--env-file .env`.

## Project structure

```text
frontend/                 React, TypeScript, Vite, conference website
  src/Component/          Public pages, registration, dashboard, and admin UI
  src/contexts/           Shared authentication/session state
  src/lib/api.ts          Frontend API client
backend/
  src/                    Fastify server, auth, applications, admin, and services
  prisma/                 PostgreSQL schema, migrations, and seed data
  tests/                  Unit/schema and database-backed integration tests
docker-compose.yml        Integrated app and private PostgreSQL service
```

For backend-specific configuration and API details, see [backend/README.md](./backend/README.md). For frontend-specific setup, see [frontend/README.md](./frontend/README.md).
