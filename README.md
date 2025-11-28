# Nodejs---Using-Typescript

Minimal Express + TypeScript backend scaffold.

Run locally:

```powershell
npm install
npm run dev
```

Endpoints:

- `GET /health` - health check
- `GET /error` - sample operational error to verify error handling

Notes:

- Config validated via `src/config/env.ts` using `zod`.
- Centralized error handling in `src/middlewares/errorHandler.ts`.
- Structured logging via `pino` wrapper at `src/utils/logger.ts`.

## Authentication (Better Auth)

Mounted under `app.all('/api/auth/*splat', ...)` before `express.json()`.

### Features Configured

- Email & Password: enabled (`emailAndPassword.enabled = true`).
- Optional Google OAuth: auto-configured if `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are present.
- JWT Plugin: issues JWT via `/api/auth/token`, JWKS via `/api/auth/jwks`.
- Bearer Plugin: allows using `Authorization: Bearer <token>` instead of cookies (for mobile / non-cookie clients).

### Sign Up / Sign In (Client Flow)

Use the client SDK (`createAuthClient`) and call:

```ts
await authClient.signUp.email({ email, password, name });
await authClient.signIn.email({ email, password });
```

On success you can capture the session token and/or JWT headers.

### Capturing Bearer Token

Header: `set-auth-token` after sign-in.

```ts
const authToken = ctx.response.headers.get('set-auth-token');
localStorage.setItem('bearer_token', authToken!);
```

Configure client to send it automatically:

```ts
createAuthClient({
  fetchOptions: {
    auth: {
      type: 'Bearer',
      token: () => localStorage.getItem('bearer_token') || '',
    },
  },
});
```

### Retrieving JWT

Methods:

1. Client plugin `jwtClient()` then `authClient.token()` → `{ token }`.
2. Direct fetch: `GET /api/auth/token` with existing session (or Bearer if bearer plugin added).
3. From `set-auth-jwt` response header after `authClient.getSession()`.

### Session Endpoint

`GET /api/v1/me` returns current session via `auth.api.getSession` server-side.

### Example Curl (after browser sign-in storing cookies)

```bash
curl -i http://localhost:3000/api/auth/token
curl -i http://localhost:3000/api/v1/me
```

### Using Bearer Token Manually

```bash
TOKEN="<saved-set-auth-token>"
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/me
```

### Verifying JWT in External Service (Remote JWKS)

JWKS: `GET /api/auth/jwks` (cache keys). Example using `jose` (pseudocode):

```ts
const JWKS = createRemoteJWKSet(new URL('http://localhost:3000/api/auth/jwks'));
const { payload } = await jwtVerify(token, JWKS, {
  issuer: 'http://localhost:3000',
  audience: 'http://localhost:3000',
});
```

### Environment Variables

Add (optional) for Google provider:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Security Notes

- Store Bearer/JWT tokens securely (native secure storage on mobile; avoid exposing in logs).
- JWT is not a session replacement; use only where cookies/session not supported.
- Refresh tokens and advanced social scope flows require proper provider configuration (see Google section in auth docs).

### Correlation IDs & Logging

Each request gets a `correlationId` (see `requestContext` middleware) returned in error responses; include it when reporting issues.

### Next Enhancements

- Add email verification, password reset configurations (placeholders not yet enabled).
- Add more social providers as needed following same pattern as Google.
