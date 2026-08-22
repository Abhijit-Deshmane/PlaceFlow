# PlaceFlow

> Training & Placement Management System

A full-stack monorepo for managing college training and placement activities — built for students, faculty, admins, and recruiters.

## Tech Stack

| Layer | Technology |
|---|---|
| **Monorepo** | pnpm Workspaces + Turborepo |
| **Web** | Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui |
| **Mobile** | Expo 57 + Expo Router + NativeWind |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Shared** | Zod schemas + TypeScript types |

## Project Structure

```
PlaceFlow/
├── apps/
│   ├── web/        # Next.js web app (port 3000)
│   ├── mobile/     # Expo React Native app
│   └── api/        # Express REST API (port 3001)
└── packages/
    └── shared/     # Shared Zod schemas & TypeScript types
```

## Getting Started

### Prerequisites
- Node.js >= 20
- pnpm >= 9
- PostgreSQL

### Install

```bash
pnpm install
```

### Environment Setup

```bash
cp apps/api/.env.example apps/api/.env
# Update DATABASE_URL in apps/api/.env
```

### Database

```bash
cd apps/api
pnpm db:migrate --name init
```

### Development

```bash
# Run all apps concurrently
pnpm dev

# Or run individually
pnpm --filter @placeflow/api dev      # API on :3001
pnpm --filter @placeflow/web dev      # Web on :3000
pnpm --filter @placeflow/mobile dev   # Expo
```

### Verify API

```
GET http://localhost:3001/health
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps |
| `pnpm typecheck` | Run TypeScript checks across all packages |
| `pnpm lint` | Lint all packages |
