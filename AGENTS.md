# PlaceFlow — Agent Instructions (Root)

> **What is PlaceFlow?**
> A college placement management system connecting Students, Faculty, Admins,
> and Recruiters. It consists of a mobile app (Expo/React Native), a web
> dashboard (Next.js), and a shared Express API backend — all in one Turborepo
> monorepo.

---

## Monorepo Architecture

### Architecture Style Per App

| App       | Style                  | Key rule                                                   |
| --------- | ---------------------- | ---------------------------------------------------------- |
| `api`     | **Modular Monolith**   | Feature modules under `modules/`; shared infra at top level |
| `web`     | **Feature Slice**      | `app/` = routing only; all code in `features/`             |
| `mobile`  | **Feature Slice**      | `app/` = routing only; all code in `features/`             |

```
PlaceFlow/
├── apps/
│   ├── api/            # @placeflow/api   — Express + Prisma (PostgreSQL)
│   ├── web/            # @placeflow/web   — Next.js 16 + Tailwind v4 + shadcn/ui
│   └── mobile/         # @placeflow/mobile — Expo 57 + React Native + NativeWind
├── packages/
│   └── shared/         # @placeflow/shared — Zod schemas, TypeScript types, constants
├── turbo.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

### Dependency Flow (STRICT)

```
  mobile ──┐
            ├──▶ shared ◀── api
  web ─────┘
```

- `apps/*` may depend on `packages/shared`. Never the reverse.
- `apps/*` must NEVER import from each other.
- `packages/shared` must have ZERO app-specific logic. It holds only schemas,
  types, constants, and pure utility functions.

---

## Technology Stack

| Layer           | Technology                              | Version Constraint  |
| --------------- | --------------------------------------- | ------------------- |
| Runtime         | Node.js                                 | ≥ 20                |
| Package Manager | pnpm (workspaces)                       | ≥ 9                 |
| Monorepo        | Turborepo                               | ^2.x                |
| API Framework   | Express                                 | ^4.x                |
| ORM             | Prisma                                  | ^6.x                |
| Database        | PostgreSQL                              | —                   |
| Validation      | Zod                                     | ^3.x                |
| Form Handling   | React Hook Form + @hookform/resolvers (Zod) | ^7.x / ^3.x          |
| Auth            | Clerk (managed — used on web, mobile, API) | Latest             |
| Web Framework   | Next.js (App Router)                    | 16.x                |
| Web UI          | shadcn/ui + Tailwind CSS v4             | Latest              |
| Mobile          | Expo (expo-router) + React Native       | SDK 57 / RN 0.86    |
| Mobile Styling  | NativeWind (Tailwind for RN)            | ^4.x                |
| Data Fetching   | TanStack Query (React Query)            | ^5.x                |
| Language        | TypeScript                              | ^5.x (strict mode)  |

---

## Cross-Cutting Rules

### 1. TypeScript

- Enable `strict: true` in all `tsconfig.json` files.
- Prefer `interface` for object shapes, `type` for unions/intersections/mapped types.
- Use explicit return types on exported functions. Inferred types are fine for
  internal/private helpers.
- NEVER use `any`. Use `unknown` and narrow, or use Zod's `z.infer<>` to
  derive types from schemas.

### 2. Imports

- Use path aliases (`@/` or `~`) where configured. Avoid deep relative imports
  (`../../../`).
- Import from `@placeflow/shared` for all shared types, schemas, and constants.
  Never duplicate definitions across apps.
- Barrel exports (`index.ts`) are used in `packages/shared`. Re-export only
  what is public.

### 3. Naming Conventions

| Thing           | Convention         | Example                     |
| --------------- | ------------------ | --------------------------- |
| Files (general) | `kebab-case`       | `job-listing.ts`            |
| React components| `PascalCase`       | `JobCard.tsx`               |
| Functions       | `camelCase`        | `getJobListings()`          |
| Constants       | `UPPER_SNAKE_CASE` | `MAX_APPLICATIONS_PER_DAY`  |
| Types/Interfaces| `PascalCase`       | `JobListing`, `UserProfile` |
| Zod schemas     | `camelCase` + Schema suffix | `jobListingSchema`   |
| API routes      | `kebab-case` plural | `/job-listings`            |
| DB tables       | `snake_case` plural via `@@map` | `job_listings`     |
| Env vars        | `UPPER_SNAKE_CASE` | `DATABASE_URL`              |

### 4. Error Handling

- Never swallow errors silently. Always log or propagate.
- API errors must return the standard response envelope (see API AGENTS.md).
- Use `try/catch` at service boundaries, not in every function.

### 5. Environment Variables

- `.env` files are gitignored. Always update `.env.example` when adding a new
  variable.
- Access env vars through a validated config object (using Zod), never raw
  `process.env` in business logic.
- Sensitive values (API keys, DB URLs) must never appear in client bundles.

### 6. Authentication (Clerk)

- Clerk handles all user authentication and session management.
- The API validates Clerk JWTs via middleware. Do not roll custom auth.
- Web uses `@clerk/nextjs`. Mobile uses `@clerk/expo`.
- User roles (`STUDENT`, `FACULTY`, `ADMIN`, `RECRUITER`) are synced from
  Clerk metadata to the local `users` table via webhook or on-first-access.

### 7. Data Flow Pattern

```
Client (Web/Mobile)
  → TanStack Query hook (e.g., useJobListings)
    → fetch/axios call to API
      → Express route → controller → service → Prisma
        → PostgreSQL
      ← service returns data
    ← API returns { success, data } envelope
  ← Query cache is updated
UI re-renders
```

### 8. Form Handling & Validation (React Hook Form + Zod)

- **React Hook Form (`react-hook-form`)** is the mandatory standard for form state
  management across both **Web** and **Mobile** apps.
- **Zod Validation (`@hookform/resolvers/zod`)**: All forms must be validated using
  Zod schemas with `zodResolver(schema)`.
- **Shared Schema Reuse**: Reuse schemas from `@placeflow/shared` for domain
  mutations (e.g. `createJobSchema`, `updateUserSchema`). For UI-specific forms,
  define schemas with Zod and infer types via `z.infer<typeof formSchema>`.
- **Web App**: Integrate `react-hook-form` with shadcn/ui form primitives (`<Form>`,
  `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>`).
- **Mobile App**: Use the `<Controller />` component from `react-hook-form` to wrap
  React Native inputs (`TextInput`, custom inputs) and display errors via
  `fieldState.error?.message`.
- **No Manual State Accumulators**: Never build multi-field forms using raw
  `useState` state dictionaries and ad-hoc manual validation functions.

### 9. Git & Code Quality

- Write small, focused commits.
- Run `pnpm lint` and `pnpm typecheck` before considering work complete.
- When adding a new feature, implement across the full stack: schema → API →
  shared types → frontend. Don't leave partial implementations.

---

## Working with This Monorepo

### Running the project

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all apps in parallel (turbo)
pnpm build            # Build all apps
pnpm lint             # Lint all apps
pnpm typecheck        # Type-check all apps
```

### Running a single app

```bash
pnpm --filter @placeflow/api dev      # API only
pnpm --filter @placeflow/web dev      # Web only
pnpm --filter @placeflow/mobile dev   # Mobile only
```

### Database commands (from apps/api/)

```bash
pnpm db:generate      # Regenerate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema to DB (dev shortcut)
pnpm db:studio        # Open Prisma Studio
```

---

## What Goes Where? (Decision Guide)

| What you're building                          | Where it goes                                    |
| --------------------------------------------- | ------------------------------------------------ |
| Zod validation schema                         | `packages/shared/src/schemas/`                   |
| TypeScript type/interface                     | `packages/shared/src/types/`                     |
| Shared constants or enums                     | `packages/shared/src/constants/`                 |
| Pure utility function (no app deps)           | `packages/shared/src/utils/`                     |
| API feature (routes + controller + service)   | `apps/api/src/modules/{feature}/`                |
| API global middleware                         | `apps/api/src/middleware/`                       |
| API infrastructure (Prisma, Clerk client)     | `apps/api/src/lib/`                              |
| Prisma schema or migration                    | `apps/api/prisma/`                               |
| Next.js page or layout (routing only)         | `apps/web/src/app/`                              |
| Web feature (components + hooks + API calls)  | `apps/web/src/features/{feature}/`               |
| Web cross-feature shared component            | `apps/web/src/components/shared/`                |
| shadcn/ui primitive                           | `apps/web/src/components/ui/` (CLI-managed)      |
| Expo route file (routing only)                | `apps/mobile/app/`                               |
| Mobile feature (screens + components + hooks) | `apps/mobile/features/{feature}/`                |
| Mobile cross-feature shared component         | `apps/mobile/components/shared/`                 |
