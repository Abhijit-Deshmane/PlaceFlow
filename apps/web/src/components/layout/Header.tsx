"use client";

import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@/features/auth";
import { ROLE_LABELS } from "@placeflow/shared";

export function Header() {
  const { user, role, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-sm shadow-indigo-500/30">
          P
        </div>
        <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          PlaceFlow
        </span>
      </div>

      <div className="flex items-center gap-4">
        {!isLoading && role && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
              {ROLE_LABELS[role] ?? role}
            </span>
          </div>
        )}

        {!isLoading && user && (
          <div className="flex flex-col text-right hidden sm:block">
            <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
              {user.name || user.email}
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
              {user.email}
            </span>
          </div>
        )}

        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-9 w-9 ring-2 ring-indigo-500/20",
            },
          }}
        />
      </div>
    </header>
  );
}
