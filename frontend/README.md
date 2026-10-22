# LIT-MUN frontend

The existing React, TypeScript, and Vite website remains the public-facing application. Delegate sign-up/sign-in, application submission, the delegate dashboard, and staff management use the typed API layer in `src/lib/api.ts`; access tokens are kept in memory and refresh uses the backend's HttpOnly cookie.

## Run locally

```powershell
npm ci
npm run dev
```

In production, Fastify builds and serves the frontend and API together from `http://localhost:9090`; browser requests use relative `/api/v1` paths. For frontend development, Vite runs at `http://localhost:5173` and proxies `/api` to port 9090. Start the integrated server and PostgreSQL as described in the repository root README.

## Public and administration portals

The public site links to `/admin/login`, which renders an isolated staff sign-in layout. Staff accounts are redirected to the protected `/admin` interface; unauthenticated deep links return to the login screen, and signed-in delegates receive an access-denied page. These frontend guards are not an authorization boundary: the Fastify admin routes enforce roles independently. Public navigation updates from the shared authentication context and hides sign-in/account-creation actions for signed-in users.

## Checks

```powershell
npm run build
npm run lint
```

The public landing page, conference sections, gallery, animations, and contact `mailto:` workflow remain frontend-owned. Public content does not require authentication.
