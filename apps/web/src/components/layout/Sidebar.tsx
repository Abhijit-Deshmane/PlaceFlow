"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, RoleGuard } from "@/features/auth";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  roles?: ("SUPER_ADMIN" | "COLLEGE_ADMIN" | "PLACEMENT_OFFICER" | "RECRUITER" | "STUDENT")[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/overview",
  },
  {
    label: "User Management",
    href: "/users",
    roles: ["SUPER_ADMIN", "COLLEGE_ADMIN"],
  },
  {
    label: "Students",
    href: "/students",
    roles: ["COLLEGE_ADMIN", "PLACEMENT_OFFICER"],
  },
  {
    label: "Companies",
    href: "/companies",
    roles: ["COLLEGE_ADMIN", "PLACEMENT_OFFICER"],
  },
  {
    label: "Placement Drives",
    href: "/drives",
    roles: ["SUPER_ADMIN", "COLLEGE_ADMIN", "PLACEMENT_OFFICER", "RECRUITER", "STUDENT"],
  },
  {
    label: "Applications",
    href: "/applications",
    roles: ["PLACEMENT_OFFICER", "STUDENT"],
  },
  {
    label: "Candidates",
    href: "/candidates",
    roles: ["RECRUITER"],
  },
  {
    label: "Analytics",
    href: "/analytics",
    roles: ["SUPER_ADMIN", "COLLEGE_ADMIN", "PLACEMENT_OFFICER"],
  },
  {
    label: "System Settings",
    href: "/system",
    roles: ["SUPER_ADMIN"],
  },
  {
    label: "Audit Logs",
    href: "/audit-logs",
    roles: ["SUPER_ADMIN", "COLLEGE_ADMIN"],
  },
  {
    label: "My Profile",
    href: "/profile",
    roles: ["STUDENT"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isLoading } = useAuth();

  return (
    <aside className="flex flex-col w-64 border-r border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="mb-6 px-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Navigation
        </p>
      </div>

      <nav className="flex flex-col space-y-1">
        {isLoading ? (
          <div className="space-y-2 px-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70 animate-pulse"
              />
            ))}
          </div>
        ) : (
          NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            if (item.roles) {
              return (
                <RoleGuard key={item.href} allowedRoles={item.roles}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-zinc-700 hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:bg-zinc-800/60",
                    )}
                  >
                    {item.label}
                  </Link>
                </RoleGuard>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200/60 dark:text-zinc-300 dark:hover:bg-zinc-800/60",
                )}
              >
                {item.label}
              </Link>
            );
          })
        )}
      </nav>

      <div className="mt-auto p-3">
        <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            PlaceFlow V1
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Role-Based Access Active
          </p>
        </div>
      </div>
    </aside>
  );
}
