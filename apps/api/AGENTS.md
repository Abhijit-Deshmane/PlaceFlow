# PlaceFlow API — Agent Instructions

> This file extends the root `AGENTS.md`. Both files apply when working in
> `apps/api/`.

---

## Architecture: Modular Monolith

The API is a **single deployable Express server** (monolith) but organized
as **independent feature modules** — each module owns everything it needs
(routes, controller, service, and module-local types). Shared infrastructure
lives in top-level directories.

```
apps/api/src/
├── index.ts                        # Express app bootstrap — mounts all modules
├── config/
│   └── env.ts                      # Zod-validated environment config (single source)
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   └── clerk.ts                    # Clerk backend SDK instance
├── middleware/
│   ├── auth.ts                     # requireAuth, requireRole — global
│   ├── validate.ts                 # Zod request body/query validation
│   └── error-handler.ts            # Global Express error handler (last middleware)
├── modules/                        # ← Feature modules (THE core of this app)
│   ├── health/
│   │   └── health.routes.ts
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── users/
│   │   ├── users.routes.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.types.ts          # Module-local types (NOT in @placeflow/shared)
│   ├── jobs/
│   │   ├── jobs.routes.ts
│   │   ├── jobs.controller.ts
│   │   ├── jobs.service.ts
│   │   └── jobs.types.ts
│   ├── applications/
│   │   ├── applications.routes.ts
│   │   ├── applications.controller.ts
│   │   ├── applications.service.ts
│   │   └── applications.types.ts
│   └── notifications/              # Future: planned for real-time
│       └── notifications.routes.ts
└── types/
    └── express.d.ts                # Express augmentations (req.auth shape)
```

### Module Structure Rules

Every module under `modules/` follows this **internal layout**:

```
modules/{feature}/
├── {feature}.routes.ts       # Express Router + middleware wiring. THIN.
├── {feature}.controller.ts   # HTTP layer: parse req → call service → send res
├── {feature}.service.ts      # Business logic + Prisma. No req/res.
└── {feature}.types.ts        # Module-local types (NOT cross-module, NOT shared)
```

### Module Mounting (index.ts)

Each module exposes one router. `index.ts` mounts them all:

```typescript
// src/index.ts
import { healthRouter } from "./modules/health/health.routes";
import { authRouter }   from "./modules/auth/auth.routes";
import { usersRouter }  from "./modules/users/users.routes";
import { jobsRouter }   from "./modules/jobs/jobs.routes";

app.use("/health",       healthRouter);
app.use("/auth",         authRouter);
app.use("/users",        usersRouter);
app.use("/jobs",         jobsRouter);
```

---

## Layer Responsibilities (Inside Each Module)

| File           | Responsibility                                        | Strict Rules                                                |
| -------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| `.routes.ts`   | Declare HTTP methods + paths, attach middleware        | No logic. Just `router.get("/", requireAuth, controller.fn)` |
| `.controller.ts` | Parse req, invoke service, shape and send response  | Never call Prisma. Never contain business logic.            |
| `.service.ts`  | Business logic, data access via Prisma                | Never reference `req`, `res`, or `next`. Returns plain data. |
| `.types.ts`    | Module-local TS types only                            | Only types consumed within THIS module. Nothing shared.     |

### Cross-Module Communication

- Modules **NEVER import from each other's** service or controller files.
- If Module A needs data from Module B, it goes through the API (or a shared
  service utility if both use Prisma). Do not create tight coupling.
- Types shared across modules live in `@placeflow/shared`, not in a module's
  `types.ts`.

---

## Adding a New Module (Checklist)

When adding a feature module (e.g., `companies`):

1. Create the directory: `src/modules/companies/`
2. Create all four files: `companies.routes.ts`, `companies.controller.ts`,
   `companies.service.ts`, `companies.types.ts`
3. Add Prisma model to `prisma/schema.prisma` and run `pnpm db:generate`
4. Add the Zod schemas + shared types to `@placeflow/shared` first
5. Mount the router in `src/index.ts`
6. Update `.env.example` if new env vars are needed

---

## API Response Envelope (MANDATORY)

Every API response MUST follow this envelope. No exceptions.

```typescript
// Success response
{
  success: true,
  data: T,               // The payload
  message?: string       // Optional human-readable message
}

// Error response
{
  success: false,
  error: {
    code: string,        // Machine-readable error code (e.g. "VALIDATION_ERROR")
    message: string,     // Human-readable description
    details?: unknown    // Optional extra info (e.g. Zod flatten output)
  }
}
```

### Standard Error Codes

| HTTP Status | Error Code         | When to use                                |
| ----------- | ------------------ | ------------------------------------------ |
| 400         | `VALIDATION_ERROR` | Invalid request body/params (Zod failure)  |
| 401         | `UNAUTHORIZED`     | Missing or invalid Clerk JWT               |
| 403         | `FORBIDDEN`        | Valid JWT but insufficient role            |
| 404         | `NOT_FOUND`        | Resource doesn't exist                     |
| 409         | `CONFLICT`         | Duplicate resource (e.g. duplicate apply)  |
| 422         | `UNPROCESSABLE`    | Semantically invalid request               |
| 500         | `INTERNAL_ERROR`   | Unexpected server error                    |

---

## Route File Pattern

```typescript
// File: src/modules/jobs/jobs.routes.ts
import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { createJobSchema, updateJobSchema } from "@placeflow/shared";
import * as jobsController from "./jobs.controller";

export const jobsRouter = Router();

jobsRouter.use(requireAuth);

jobsRouter.get("/",      jobsController.list);
jobsRouter.get("/:id",   jobsController.getById);
jobsRouter.post(
  "/",
  requireRole("RECRUITER", "ADMIN"),
  validate(createJobSchema),
  jobsController.create,
);
jobsRouter.put(
  "/:id",
  requireRole("RECRUITER", "ADMIN"),
  validate(updateJobSchema),
  jobsController.update,
);
jobsRouter.delete("/:id", requireRole("ADMIN"), jobsController.remove);
```

### URL Patterns

- Plural nouns: `/jobs`, `/applications`, `/users`
- Kebab-case multi-word: `/job-categories`
- Path params for specific resources: `/jobs/:id`
- Query params for filtering/pagination: `/jobs?status=active&page=2`
- Nested for ownership: `/jobs/:jobId/applications`

---

## Controller Pattern

```typescript
// File: src/modules/jobs/jobs.controller.ts
import { Request, Response, NextFunction } from "express";
import * as jobsService from "./jobs.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const jobs = await jobsService.getAllJobs(req.query);
    res.json({ success: true, data: jobs });
  } catch (err) {
    next(err); // Pass to global error handler
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const job = await jobsService.createJob(req.body, req.auth.userId);
    res.status(201).json({ success: true, data: job, message: "Job created" });
  } catch (err) {
    next(err);
  }
}
```

---

## Service Pattern

```typescript
// File: src/modules/jobs/jobs.service.ts
import { prisma } from "../../lib/prisma";
import type { CreateJobInput, JobQuery } from "@placeflow/shared";

// Services return plain typed data. No req, no res, no HTTP concerns.
export async function getAllJobs(query: JobQuery) {
  return prisma.jobListing.findMany({
    where: { status: query.status ?? "ACTIVE" },
    take: query.limit,
    skip: (query.page - 1) * query.limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function createJob(data: CreateJobInput, postedBy: string) {
  return prisma.jobListing.create({
    data: { ...data, postedBy, status: "DRAFT" },
  });
}
```

---

## Validation Middleware

```typescript
// File: src/middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: result.error.flatten(),
        },
      });
    }
    req.body = result.data;
    next();
  };
};
```

---

## Prisma Conventions

- **Singleton client** in `src/lib/prisma.ts` only. Never `new PrismaClient()` elsewhere.
- **`@@map("snake_case")`** on every model. PascalCase model → snake_case table.
- **Every model must have**: `id` (cuid), `createdAt`, `updatedAt`.
- **Use `select`/`include` explicitly** — never fetch whole rows when 2 fields suffice.
- **Multi-step mutations use `prisma.$transaction()`**.

---

## Environment Variables (API)

All vars validated in `src/config/env.ts`:

```typescript
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url(),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  CLERK_SECRET_KEY: z.string(),
  CLERK_WEBHOOK_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

Import `env` from `@/config/env`. Never use raw `process.env` in business logic.

---

## File Naming (Inside a Module)

| File type   | Pattern                      | Example                          |
| ----------- | ---------------------------- | -------------------------------- |
| Routes      | `{module}.routes.ts`         | `jobs.routes.ts`                 |
| Controller  | `{module}.controller.ts`     | `jobs.controller.ts`             |
| Service     | `{module}.service.ts`        | `jobs.service.ts`                |
| Local types | `{module}.types.ts`          | `jobs.types.ts`                  |
| Middleware  | `{name}.ts` (in middleware/) | `auth.ts`, `validate.ts`         |
| Config      | `{name}.ts` (in config/)     | `env.ts`                         |
