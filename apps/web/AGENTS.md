<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# PlaceFlow Web — Agent Instructions

> This file extends the root `AGENTS.md`. Both files apply when working in
> `apps/web/`.

---

## Architecture: Feature-Based (Feature Slice)

Code is organized by **feature/domain**, not by technical role. Each feature
is a self-contained slice that owns its own components, hooks, API calls, and
types. Shared infrastructure lives in top-level directories.

```
apps/web/src/
├── app/                              # Next.js App Router — ROUTING ONLY
│   ├── layout.tsx                    # Root layout: providers (Clerk, Query, Theme)
│   ├── page.tsx                      # Landing/home page
│   ├── middleware.ts                 # Clerk route protection
│   ├── (auth)/                       # Public auth group
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/                  # Authenticated group
│   │   ├── layout.tsx                # Dashboard shell (sidebar + header)
│   │   ├── overview/
│   │   │   └── page.tsx              # Thin page — imports from features/overview
│   │   ├── jobs/
│   │   │   ├── page.tsx              # → renders <JobsPage /> from features/jobs
│   │   │   └── [id]/
│   │   │       └── page.tsx          # → renders <JobDetailPage /> from features/jobs
│   │   ├── applications/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── api/                          # Next.js Route Handlers (webhooks only)
│       └── webhooks/
│           └── clerk/
│               └── route.ts
│
├── features/                         # ← FEATURE SLICES (where real code lives)
│   ├── jobs/
│   │   ├── index.ts                  # Public barrel export of this feature
│   │   ├── components/
│   │   │   ├── JobsPage.tsx          # Top-level page component (used by app/jobs/page.tsx)
│   │   │   ├── JobDetailPage.tsx
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobList.tsx
│   │   │   ├── JobFilters.tsx
│   │   │   └── CreateJobDialog.tsx
│   │   ├── hooks/
│   │   │   ├── use-jobs.ts           # Query + mutation hooks for jobs
│   │   │   └── use-job-filters.ts
│   │   ├── api/
│   │   │   └── jobs.api.ts           # Typed API call functions (not hooks)
│   │   └── types.ts                  # Feature-local types (extends @placeflow/shared)
│   │
│   ├── applications/
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── ApplicationsPage.tsx
│   │   │   ├── ApplicationCard.tsx
│   │   │   └── ApplyDialog.tsx
│   │   ├── hooks/
│   │   │   └── use-applications.ts
│   │   ├── api/
│   │   │   └── applications.api.ts
│   │   └── types.ts
│   │
│   ├── users/
│   │   ├── index.ts
│   │   ├── components/
│   │   │   ├── ProfilePage.tsx
│   │   │   └── UserAvatar.tsx
│   │   ├── hooks/
│   │   │   └── use-profile.ts
│   │   └── api/
│   │       └── users.api.ts
│   │
│   └── auth/
│       ├── index.ts
│       ├── components/
│       │   └── RoleGuard.tsx         # Role-based conditional render
│       └── hooks/
│           └── use-auth.ts           # Clerk auth wrapper
│
├── components/                       # Cross-feature shared UI
│   ├── ui/                           # shadcn/ui (DO NOT EDIT MANUALLY)
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── shared/
│       ├── DataTable.tsx
│       ├── EmptyState.tsx
│       ├── LoadingSkeleton.tsx
│       └── PageHeader.tsx
│
├── lib/
│   ├── api-client.ts                 # Typed fetch wrapper (base — used by feature APIs)
│   ├── query-client.ts               # TanStack Query client instance + config
│   └── utils.ts                      # cn(), formatDate(), etc.
│
└── styles/
    └── globals.css                   # Tailwind v4 @theme tokens + base styles
```

---

## The Core Rule: Pages Are Thin, Features Are Fat

**`app/` directory = routing skeleton only.**  
Actual UI and logic live inside `features/`.

```typescript
// ✅ CORRECT — app/jobs/page.tsx is a thin shell
import { JobsPage } from "@/features/jobs";

export default function Page() {
  return <JobsPage />;
}

// ❌ WRONG — don't put real components/hooks directly in app/
export default function Page() {
  const { data } = useJobs(); // TanStack Query hook in a Server Component = ERROR
  return <div>{/* 100 lines of UI */}</div>;
}
```

---

## Feature Slice Rules

### Internal boundaries

- Features **MUST NOT import from each other** directly:
  ```typescript
  // ❌ WRONG
  import { useJobs } from "@/features/jobs/hooks/use-jobs";  // in applications feature
  
  // ✅ Correct — import through the public barrel
  import { useJobs } from "@/features/jobs";
  ```
- Each feature exposes only what's in its `index.ts` barrel. Everything else
  is private to the feature.
- If two features need the same data, put the shared hook/call in
  `components/shared/` or `lib/`.

### Feature-local types

- `features/{name}/types.ts` holds types that **extend or narrow** shared
  types from `@placeflow/shared`.
- Never duplicate or redefine types that already exist in `@placeflow/shared`.

---

## TanStack Query Hooks (Inside Features)

Every API interaction goes through a custom hook inside the feature's `hooks/`
directory. Follow the query key factory pattern:

```typescript
// File: features/jobs/hooks/use-jobs.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJobs, createJob } from "../api/jobs.api";
import type { JobQuery, CreateJobInput } from "@placeflow/shared";

// Query key factory — single source of truth for cache keys
export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  list: (filters: JobQuery) => [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
};

export function useJobs(filters?: JobQuery) {
  return useQuery({
    queryKey: jobKeys.list(filters ?? {}),
    queryFn: () => fetchJobs(filters),
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobInput) => createJob(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() }),
  });
}
```

### API call functions (separate from hooks)

```typescript
// File: features/jobs/api/jobs.api.ts
import { apiClient } from "@/lib/api-client";
import type { JobListing, CreateJobInput, JobQuery } from "@placeflow/shared";

// These are plain async functions — no hooks, no React
export function fetchJobs(query?: JobQuery): Promise<JobListing[]> {
  return apiClient.get("/jobs", { params: query });
}

export function createJob(data: CreateJobInput): Promise<JobListing> {
  return apiClient.post("/jobs", data);
}
```

---

## Server vs Client Components

- **Default to Server Components.** Add `"use client"` only when you need:
  - `useState`, `useEffect`, `useRef`, or any React hook
  - Browser APIs (`window`, `localStorage`)
  - Event handlers
  - TanStack Query hooks
- **TanStack Query hooks ONLY in Client Components.** Never in RSC.
- **Async Server Components** can fetch data directly:
  ```typescript
  // Server Component — no "use client" needed
  async function JobDetailPage({ params }: { params: { id: string } }) {
    const job = await fetchJobById(params.id); // direct fetch, no hook
    return <JobDetail job={job} />;
  }
  ```

---

## Component Conventions

- One component per file. **PascalCase** for component names, **kebab-case**
  for file names when in `components/shared/`, **PascalCase** file names when
  inside `features/`.
- Props interfaces defined in the same file: `interface {Name}Props { ... }`.
- Use `cn()` from `@/lib/utils` for all conditional className merging.

```typescript
// File: features/jobs/components/JobCard.tsx
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { JobListing } from "@placeflow/shared";

interface JobCardProps {
  job: JobListing;
  onApply?: (jobId: string) => void;
  className?: string;
}

export function JobCard({ job, onApply, className }: JobCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{job.title}</h3>
        <p className="text-muted-foreground text-sm">{job.company}</p>
        <Badge variant="secondary">{job.status}</Badge>
      </CardContent>
    </Card>
  );
}
```

---

## shadcn/ui Rules

- **NEVER manually edit** files in `src/components/ui/`. Managed by CLI.
- To add a component: `npx shadcn@latest add <component-name>`
- Always wrap shadcn primitives in your own feature components. Don't use
  `<Button>` from shadcn directly in page files — create a domain component.
- Use: `Button`, `Card`, `Input`, `Dialog`, `Sheet`, `Table`, `Badge`,
  `Avatar`, `Select`, `Skeleton`, `Separator`, `Tabs`, `Form`, etc.

---

## Form Handling (React Hook Form + Zod)

Forms in the web app **MUST** use **`react-hook-form`** with **`@hookform/resolvers/zod`** and Zod schemas (from `@placeflow/shared` or feature-local).

### Rules
- Always use `useForm<FormValues>` with `resolver: zodResolver(schema)`.
- Always declare explicit `defaultValues` matching the form type.
- Derive TypeScript types via `z.infer<typeof schema>`.
- Use shadcn/ui `<Form>` primitives (`FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`) for consistent layout and accessibility.
- Bind mutation state (`isPending`, `error`) from TanStack Query directly to the form submit button and status feedback.
- Never write manual `useState` objects to manage multi-field form state.

### Web Form Example

```tsx
// File: features/jobs/components/CreateJobDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJobSchema, type CreateJobInput } from "@placeflow/shared";
import { useCreateJob } from "../hooks/use-jobs";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateJobDialog({ open, onOpenChange }: CreateJobDialogProps) {
  const { mutateAsync: createJob, isPending } = useCreateJob();

  const form = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      description: "",
    },
  });

  const onSubmit = async (values: CreateJobInput) => {
    try {
      await createJob(values);
      form.reset();
      onOpenChange(false);
    } catch {
      // Error is handled by mutation / toast notification
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post New Job</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating..." : "Create Job"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Styling (Tailwind CSS v4)

- Utility classes in JSX. No CSS modules, no styled-components.
- Use `cn()` (clsx + tailwind-merge) for conditional classes.
- Design tokens in `globals.css` via Tailwind v4's `@theme {}` block.
- Mobile-first responsive: `sm:` `md:` `lg:` `xl:`
- Dark mode via `dark:` variant (class strategy via `next-themes`).

---

## Clerk Auth (Web)

- `ClerkProvider` wraps root layout.
- `src/middleware.ts` protects routes (Clerk's `clerkMiddleware()`).
- Client components: `useUser()`, `useAuth()`, `<UserButton />`
- Server components: `auth()`, `currentUser()` from `@clerk/nextjs/server`
- Auth pages: `app/(auth)/sign-in/[[...sign-in]]/page.tsx` with `<SignIn />`

---

## Environment Variables (Web)

| Variable                            | Scope      | Description                 |
| ----------------------------------- | ---------- | --------------------------- |
| `NEXT_PUBLIC_API_URL`               | Client     | Backend API base URL        |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client     | Clerk publishable key       |
| `CLERK_SECRET_KEY`                  | Server     | Clerk secret key            |

- `NEXT_PUBLIC_` vars are bundled into client JS — NEVER put secrets there.

---

## File Naming

| Type                 | Convention    | Example                               |
| -------------------- | ------------- | ------------------------------------- |
| Next.js page         | `page.tsx`    | `app/(dashboard)/jobs/page.tsx`       |
| Next.js layout       | `layout.tsx`  | `app/(dashboard)/layout.tsx`          |
| Feature page comp.   | `PascalCase`  | `features/jobs/components/JobsPage.tsx` |
| Feature component    | `PascalCase`  | `features/jobs/components/JobCard.tsx`|
| Feature hook         | `use-{name}`  | `features/jobs/hooks/use-jobs.ts`     |
| Feature API fn       | `{name}.api.ts` | `features/jobs/api/jobs.api.ts`     |
| Shared component     | `PascalCase`  | `components/shared/DataTable.tsx`     |
| Utility              | `kebab-case`  | `lib/api-client.ts`                   |
| Feature barrel       | `index.ts`    | `features/jobs/index.ts`             |
