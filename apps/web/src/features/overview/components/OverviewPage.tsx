"use client";

import { useAuth } from "@/features/auth";
import { ROLE_LABELS, ROLE_PERMISSIONS } from "@placeflow/shared";

export function OverviewPage() {
  const { user, role, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-36 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-36 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-36 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20">
        <h2 className="text-lg font-semibold text-red-800 dark:text-red-300">
          Authentication Sync Error
        </h2>
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">
          {error.message}
        </p>
        <p className="mt-1 text-xs text-red-600 dark:text-red-500">
          Please ensure your Express API is running and configured with Clerk keys.
        </p>
      </div>
    );
  }

  const permissions = role ? ROLE_PERMISSIONS[role] || [] : [];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome back, {user?.name || user?.email || "User"}
          </h1>
          {role && (
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200">
              {ROLE_LABELS[role] ?? role}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          PlaceFlow Identity & Role-Based Access Dashboard
        </p>
      </div>

      {/* Identity & Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Internal ID
          </p>
          <p className="mt-2 font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {user?.id}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Clerk User ID
          </p>
          <p className="mt-2 font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            {user?.clerkUserId}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Account Status
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {user?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Role-Specific Workspace Banner */}
      {role === "SUPER_ADMIN" && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-900/50 dark:bg-indigo-950/20">
          <h2 className="text-lg font-semibold text-indigo-950 dark:text-indigo-200">
            System Administration Console
          </h2>
          <p className="mt-1 text-sm text-indigo-800 dark:text-indigo-300">
            You have full system access to configure global settings, manage administrative privileges, and inspect audit logs.
          </p>
        </div>
      )}

      {role === "COLLEGE_ADMIN" && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/50 dark:bg-blue-950/20">
          <h2 className="text-lg font-semibold text-blue-950 dark:text-blue-200">
            College Administration Console
          </h2>
          <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
            Manage your institution&apos;s users, students, companies, placement drives, and placement performance analytics.
          </p>
        </div>
      )}

      {role === "PLACEMENT_OFFICER" && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <h2 className="text-lg font-semibold text-emerald-950 dark:text-emerald-200">
            Placement Operations Workspace
          </h2>
          <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">
            Create placement drives, define candidate eligibility, manage applications, shortlist students, and schedule interviews.
          </p>
        </div>
      )}

      {role === "RECRUITER" && (
        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-6 dark:border-purple-900/50 dark:bg-purple-950/20">
          <h2 className="text-lg font-semibold text-purple-950 dark:text-purple-200">
            Recruiter Portal
          </h2>
          <p className="mt-1 text-sm text-purple-800 dark:text-purple-300">
            Access authorized placement drives, review candidate profiles, manage shortlists, and submit recruitment outcomes.
          </p>
        </div>
      )}

      {role === "STUDENT" && (
        <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-6 dark:border-sky-900/50 dark:bg-sky-950/20">
          <h2 className="text-lg font-semibold text-sky-950 dark:text-sky-200">
            Student Placement Portal
          </h2>
          <p className="mt-1 text-sm text-sky-800 dark:text-sky-300">
            Discover active campus placement drives, check your eligibility status, submit applications, and track interview stages.
          </p>
        </div>
      )}

      {/* Permissions Breakdown */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Server-Enforced Permissions ({permissions.length})
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          These capabilities are granted by the backend and verified on every API request.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {permissions.map((perm) => (
            <span
              key={perm}
              className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-mono font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {perm}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
