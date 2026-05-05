# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `frontend/` directory:

```bash
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint check
```

No test suite is configured yet.

## Architecture

**Frontend only** — the backend (Spring Boot) is a separate repo and must run on `localhost:8080`. Configure via `frontend/.env`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Framework & Libraries
- Next.js 16 App Router with TypeScript 5
- styled-components v6 (SSR-enabled via `compiler.styledComponents` in `next.config.ts`)
- Redux Toolkit + react-redux for global state
- Path alias: `@/*` → `src/*`

### Directory Layout
```
frontend/src/
├── api/          # All fetch calls to the backend (single index.ts)
├── app/          # Next.js App Router pages (file-based routing)
├── components/   # Shared React components
└── store/        # Redux store + slices
    └── slices/   # authSlice.ts, booksSlice.ts
```

### State Management
Two Redux slices, both accessed via typed `useAppDispatch` / `useAppSelector` hooks from `src/store/index.ts`:

- **authSlice** — `user`, `token`, `status`, `initializing`. Async thunks: `login`, `register`, `fetchProfile`. Sync: `logout`, `hydrate`, `clearError`.
- **booksSlice** — paginated book list. Async thunk: `fetchBooks({page, size})`.

### Auth Flow
On app boot, `AuthHydrator` (inside `Providers.tsx`) reads the JWT from `localStorage`, dispatches `hydrate(token)`, then `fetchProfile(token)`. The `initializing` flag prevents a flash before hydration completes.

Protected pages (e.g. `/profile`) redirect to `/login` when no token is present. The `Navbar` component toggles between guest links and a logged-in state (username + logout) based on Redux auth state.

### API Layer
`src/api/index.ts` exports plain async functions used by Redux thunks:
- `POST /auth/login` — `{ email, password }` → `{ token, user }`
- `POST /auth/register` — `{ username, email, password }` → `{ token? }`
- `GET /user/me/get` — Bearer token → user profile
- `GET /books/get/page?page=X&size=Y` — paginated book list

All authenticated requests send `Authorization: Bearer <token>`.
