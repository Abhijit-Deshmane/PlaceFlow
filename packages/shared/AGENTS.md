# PlaceFlow Shared Package — Agent Instructions

> This file extends the root `AGENTS.md`. Both files apply when working in
> `packages/shared/`.

---

## Purpose

`@placeflow/shared` is the **single source of truth** for data contracts
between all three apps. It contains:

- **Zod schemas** — validation + type inference (used in API for validation AND
  in clients for type safety)
- **TypeScript types** — derived from Zod schemas via `z.infer<>`
- **Constants** — enums, role definitions, config values
- **Pure utilities** — framework-agnostic helper functions

---

## Architecture

```
packages/shared/src/
├── index.ts                  # Barrel export — re-export everything public
├── schemas/
│   ├── index.ts              # Re-export all schemas
│   ├── user.schema.ts        # User-related Zod schemas
│   ├── job.schema.ts         # Job listing schemas
│   ├── application.schema.ts # Application schemas
│   └── common.schema.ts      # Shared schemas (pagination, filters, etc.)
├── types/
│   ├── index.ts              # Re-export all types
│   ├── user.types.ts         # User types (inferred from Zod + extras)
│   ├── job.types.ts
│   ├── application.types.ts
│   └── api.types.ts          # API envelope types (ApiResponse<T>, ApiError)
├── constants/
│   ├── index.ts
│   ├── roles.ts              # UserRole enum/values
│   └── status.ts             # Application statuses, job statuses
└── utils/
    ├── index.ts
    └── format.ts             # Date formatting, string helpers, etc.
```

---

## STRICT Rules

### What BELONGS here

✅ Zod validation schemas (create, update, query schemas)
✅ TypeScript types derived from schemas (`z.infer<typeof schema>`)
✅ TypeScript types for API responses (`ApiResponse<T>`, `ApiError`)
✅ Shared constants and enums (roles, statuses, limits)
✅ Pure utility functions (string formatting, date helpers — NO side effects)

### What DOES NOT belong here

❌ React components (use `apps/web/` or `apps/mobile/`)
❌ React hooks (TanStack Query, useState, etc.)
❌ Express middleware or route handlers
❌ Prisma client or database logic
❌ Node.js-specific APIs (fs, path, crypto)
❌ Browser-specific APIs (window, document, localStorage)
❌ Any code that imports from `react`, `react-native`, `express`, or `@prisma`
❌ Environment variable access
❌ Side effects of any kind

### The Litmus Test

> Can this code run in Node.js, the browser, AND React Native without any
> polyfills or platform checks? If **yes**, it belongs in shared. If **no**,
> it belongs in the specific app.

---

## Schema Pattern

Every entity follows this pattern:

```typescript
// File: src/schemas/job.schema.ts
import { z } from "zod";

// ─── Base Schema ──────────────────────────────────────────────────────────────
// Represents the full entity as returned by the API.
export const jobListingSchema = z.object({
  id: z.string().cuid2(),
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  company: z.string(),
  location: z.string(),
  salary: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
    currency: z.string().default("INR"),
  }).optional(),
  status: z.enum(["DRAFT", "ACTIVE", "CLOSED"]),
  postedBy: z.string().cuid2(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// ─── Input Schemas ────────────────────────────────────────────────────────────
// Used for request validation. Omit server-generated fields.
export const createJobSchema = jobListingSchema.omit({
  id: true,
  postedBy: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const updateJobSchema = createJobSchema.partial();

// ─── Query Schema ─────────────────────────────────────────────────────────────
export const jobQuerySchema = z.object({
  status: z.enum(["DRAFT", "ACTIVE", "CLOSED"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
```

### Type Derivation

**Always derive types from schemas. Never define types separately.**

```typescript
// File: src/types/job.types.ts
import type { z } from "zod";
import type {
  jobListingSchema,
  createJobSchema,
  updateJobSchema,
  jobQuerySchema,
} from "../schemas/job.schema";

export type JobListing = z.infer<typeof jobListingSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobQuery = z.infer<typeof jobQuerySchema>;
```

---

## API Response Types

Define the standard response envelope here so all apps share the same type:

```typescript
// File: src/types/api.types.ts
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

---

## Barrel Exports

Every subdirectory has an `index.ts` that re-exports public symbols.
The root `src/index.ts` re-exports from subdirectories:

```typescript
// src/index.ts
export * from "./schemas";
export * from "./types";
export * from "./constants";
export * from "./utils";
```

**Only export what consuming apps actually need.** Don't export internal
helpers.

---

## Adding a New Entity (Checklist)

When adding a new entity (e.g., "Company"):

1. Create `src/schemas/company.schema.ts` — base + create + update + query schemas
2. Create `src/types/company.types.ts` — types derived from schemas
3. Export from `src/schemas/index.ts` and `src/types/index.ts`
4. Run `pnpm typecheck` from the root to verify no circular deps
5. Then implement in `apps/api/` (routes, controllers, services, Prisma model)
6. Then implement in `apps/web/` and/or `apps/mobile/` (hooks, components, pages)
