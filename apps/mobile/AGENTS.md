# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

---

# PlaceFlow Mobile — Agent Instructions

> This file extends the root `AGENTS.md`. Both files apply when working in
> `apps/mobile/`.

---

## Architecture: Feature-Based (Feature Slice)

Code is organized by **feature/domain**. `app/` is a thin Expo Router routing
skeleton. All real UI, logic, and API calls live inside `features/`.

```
apps/mobile/
├── app/                              # Expo Router — ROUTING ONLY
│   ├── _layout.tsx                   # Root layout: providers (Clerk, Query)
│   ├── index.tsx                     # Redirect entry point
│   ├── (auth)/                       # Public auth group
│   │   ├── _layout.tsx
│   │   ├── sign-in.tsx               # → renders <SignInScreen /> from features/auth
│   │   └── sign-up.tsx
│   ├── (tabs)/                       # Authenticated tab navigator
│   │   ├── _layout.tsx               # Tab bar configuration
│   │   ├── home.tsx                  # → renders <HomeScreen /> from features/overview
│   │   ├── jobs/
│   │   │   ├── index.tsx             # → renders <JobsScreen /> from features/jobs
│   │   │   └── [id].tsx              # → renders <JobDetailScreen /> from features/jobs
│   │   ├── applications.tsx          # → renders <ApplicationsScreen />
│   │   └── profile.tsx               # → renders <ProfileScreen />
│   └── (modals)/                     # Modal group
│       └── apply/
│           └── [jobId].tsx           # → renders <ApplyModal /> from features/jobs
│
├── features/                         # ← FEATURE SLICES (where real code lives)
│   ├── jobs/
│   │   ├── index.ts                  # Public barrel export
│   │   ├── screens/
│   │   │   ├── JobsScreen.tsx        # Top-level screen component
│   │   │   ├── JobDetailScreen.tsx
│   │   │   └── ApplyModal.tsx
│   │   ├── components/
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobList.tsx           # FlatList wrapper with loading/empty states
│   │   │   └── JobFilters.tsx
│   │   ├── hooks/
│   │   │   ├── use-jobs.ts
│   │   │   └── use-job-detail.ts
│   │   ├── api/
│   │   │   └── jobs.api.ts           # Typed API call functions (no hooks)
│   │   └── types.ts
│   │
│   ├── applications/
│   │   ├── index.ts
│   │   ├── screens/
│   │   │   └── ApplicationsScreen.tsx
│   │   ├── components/
│   │   │   └── ApplicationCard.tsx
│   │   ├── hooks/
│   │   │   └── use-applications.ts
│   │   └── api/
│   │       └── applications.api.ts
│   │
│   ├── users/
│   │   ├── index.ts
│   │   ├── screens/
│   │   │   └── ProfileScreen.tsx
│   │   ├── components/
│   │   │   └── UserAvatar.tsx
│   │   ├── hooks/
│   │   │   └── use-profile.ts
│   │   └── api/
│   │       └── users.api.ts
│   │
│   └── auth/
│       ├── index.ts
│       ├── screens/
│       │   ├── SignInScreen.tsx
│       │   └── SignUpScreen.tsx
│       └── hooks/
│           └── use-auth.ts
│
├── components/                       # Cross-feature shared UI primitives
│   ├── ui/                           # Base primitives (Button, Card, Input)
│   └── shared/
│       ├── EmptyState.tsx
│       ├── LoadingSkeleton.tsx
│       ├── ErrorBoundary.tsx
│       └── ScreenWrapper.tsx         # SafeAreaView + KeyboardAvoidingView
│
├── lib/
│   ├── api-client.ts                 # Typed fetch wrapper (RN-compatible)
│   └── query-client.ts              # TanStack Query client config
│
├── constants/
│   └── theme.ts                      # Design tokens: colors, spacing, typography
│
├── assets/                           # Fonts, images, icons
├── app.json                          # Expo config
├── babel.config.js
├── tailwind.config.js                # NativeWind config (Tailwind v3 syntax)
└── index.ts                          # Expo entry point
```

---

## The Core Rule: App Routes Are Thin, Features Are Fat

**`app/` = routing skeleton only.** Real screens live in `features/`.

```typescript
// ✅ CORRECT — app/(tabs)/jobs/index.tsx is a thin wrapper
import { JobsScreen } from "@/features/jobs";
export default function JobsRoute() {
  return <JobsScreen />;
}

// ❌ WRONG — don't put UI/logic directly in the app/ directory
export default function JobsRoute() {
  const { data } = useJobs();
  return <View>{/* 80 lines of UI */}</View>;
}
```

---

## React Native Specifics — CRITICAL

- **No HTML elements exist in React Native.** These will crash the app:
  `<div>`, `<span>`, `<p>`, `<button>`, `<a>`, `<img>`, `<ul>`, `<li>`
- **Always use RN primitives:**

| Web         | React Native equivalent         |
| ----------- | ------------------------------- |
| `<div>`     | `<View>`                        |
| `<p>`, `<span>` | `<Text>`                   |
| `<button>`  | `<Pressable>` (preferred)       |
| `<a>`       | `<Link>` from `expo-router`     |
| `<img>`     | `<Image>` from `expo-image`     |
| `<ul>/<li>` | `<FlatList>` or `<FlashList>`  |

- **Navigation:** Use `<Link>` for declarative navigation; `router.push()`,
  `router.replace()` for programmatic.
- **Lists:** ALWAYS use `<FlatList>` or `<FlashList>` for lists of 10+ items.
  NEVER `.map()` inside `<ScrollView>`.

---

## Feature Slice Rules

### Internal boundaries

- Features **MUST NOT import from each other directly** — only through a
  feature's public `index.ts` barrel.
- `features/jobs/components/JobCard.tsx` must NOT import from
  `features/applications/hooks/use-applications.ts`.
- If you need shared data, put the hook in `components/shared/` or `lib/`.

### Screens vs Components

| `screens/`                         | `components/`                        |
| ----------------------------------- | ------------------------------------ |
| Full-screen views (used by routes)  | Smaller building blocks              |
| Directly imported by `app/` route files | Used within screens or other components |
| Can use `useFocusEffect`, navigation hooks | Should be navigation-agnostic    |

---

## TanStack Query Hooks (Inside Features)

Follow the same query key factory pattern as the web app for maximum
consistency:

```typescript
// File: features/jobs/hooks/use-jobs.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJobs, createJob } from "../api/jobs.api";
import type { JobQuery, CreateJobInput } from "@placeflow/shared";

export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  list: (filters: JobQuery) => [...jobKeys.lists(), filters] as const,
  detail: (id: string) => [...jobKeys.all, "detail", id] as const,
};

export function useJobs(filters?: JobQuery) {
  return useQuery({
    queryKey: jobKeys.list(filters ?? {}),
    queryFn: () => fetchJobs(filters),
  });
}
```

---

## NativeWind (Tailwind CSS for React Native)

Uses NativeWind v4 with Tailwind **v3** syntax (`tailwind.config.js`).

- Apply via `className` prop: `<View className="flex-1 bg-white p-4">`
- **Supported layout:** `flex` only. No CSS `grid`.
- **No `hover:`.** Use `active:` for press feedback.
- **No `position: fixed`.** Use `absolute` relative to parent.
- **`gap-*` works** in NativeWind v4.
- Safe area: Use `<ScreenWrapper>` (wraps SafeAreaView) for all top-level screens.

### Design Tokens

Define in `constants/theme.ts` and reference in NativeWind config:

```typescript
// constants/theme.ts
export const colors = {
  primary: "#4F46E5",
  primaryForeground: "#FFFFFF",
  muted: "#F3F4F6",
  mutedForeground: "#6B7280",
};
```

---

## Component Conventions

- **PascalCase filenames** for all components: `JobCard.tsx`, `EmptyState.tsx`
- **kebab-case** for non-component files: `use-jobs.ts`, `jobs.api.ts`
- Props interface in same file. Name: `{ComponentName}Props`

```typescript
// File: features/jobs/components/JobCard.tsx
import { View, Text, Pressable } from "react-native";
import type { JobListing } from "@placeflow/shared";

interface JobCardProps {
  job: JobListing;
  onPress?: () => void;
}

export function JobCard({ job, onPress }: JobCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-xl p-4 shadow-sm active:opacity-70"
    >
      <Text className="text-lg font-semibold text-gray-900">{job.title}</Text>
      <Text className="text-sm text-gray-500">{job.company}</Text>
    </Pressable>
  );
}
```

---

## Performance Rules

- **`<FlatList>` for all lists.** Never `.map()` on 10+ items in a ScrollView.
- **`React.memo()`** for list item components (e.g., `JobCard`).
- **`useCallback`** for functions passed as props (e.g., `onPress` in a list).
- **`expo-image`** instead of RN's `<Image>` — better caching and performance.
- **Avoid inline styles.** Use NativeWind classes or `StyleSheet.create()`.
- **Avoid re-renders:** don't define objects/arrays inline in JSX props.

---

## Clerk Auth (Mobile)

- `@clerk/expo` + `expo-secure-store` for secure token storage.
- `<ClerkProvider>` in `app/_layout.tsx`.
- `<SignedIn>`, `<SignedOut>` for conditional rendering.
- `useAuth()`, `useUser()` for auth state in any component.
- API token attached automatically via `getToken()` in the api-client.

---

## Platform-Specific Code

```typescript
import { Platform } from "react-native";

// Inline platform check
const topPadding = Platform.OS === "ios" ? 44 : 24;

// Platform-specific files (Expo resolves automatically)
// Button.ios.tsx    → loaded on iOS
// Button.android.tsx → loaded on Android
```

---

## Environment Variables (Mobile)

| Variable                            | Description              |
| ----------------------------------- | ------------------------ |
| `EXPO_PUBLIC_API_URL`               | Backend API base URL     |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key    |

- Prefix `EXPO_PUBLIC_` for client-accessible vars.
- Access via `process.env.EXPO_PUBLIC_API_URL` (Expo inlines at build time).

---

## File Naming

| Type                  | Convention      | Example                                  |
| --------------------- | --------------- | ---------------------------------------- |
| Expo route (screen)   | `kebab-case.tsx`| `app/(tabs)/jobs/index.tsx`              |
| Expo layout           | `_layout.tsx`   | `app/(tabs)/_layout.tsx`                 |
| Feature screen        | `PascalCase`    | `features/jobs/screens/JobsScreen.tsx`   |
| Feature component     | `PascalCase`    | `features/jobs/components/JobCard.tsx`   |
| Feature hook          | `use-{name}.ts` | `features/jobs/hooks/use-jobs.ts`        |
| Feature API fn        | `{name}.api.ts` | `features/jobs/api/jobs.api.ts`          |
| Shared component      | `PascalCase`    | `components/shared/EmptyState.tsx`       |
| Feature barrel        | `index.ts`      | `features/jobs/index.ts`                 |
