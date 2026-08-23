"use client";

import React, { type ReactNode } from "react";
import type { UserRole, Permission } from "@placeflow/shared";
import { useAuth } from "../hooks/use-auth";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole | UserRole[];
  requiredPermission?: Permission;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
}

/**
 * RoleGuard Component
 *
 * Conditionally renders UI elements based on verified PlaceFlow roles and permissions.
 * NOTE: UI guards are purely for UX and workflow guidance. Server-side middleware
 * strictly enforces security.
 */
export function RoleGuard({
  children,
  allowedRoles,
  requiredPermission,
  fallback = null,
  loadingFallback = (
    <div className="animate-pulse flex space-x-4 p-4">
      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-24"></div>
    </div>
  ),
}: RoleGuardProps) {
  const { role, isLoading, hasRole, hasPermission } = useAuth();

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (!role) {
    return <>{fallback}</>;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
