"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth as useClerkAuth, useUser as useClerkUser } from "@clerk/nextjs";
import type { SafeUser, UserRole, Permission } from "@placeflow/shared";
import { ROLE_PERMISSIONS } from "@placeflow/shared";
import { getMe } from "../api/auth.api";
import type { AuthState } from "../types";

/**
 * PlaceFlow Auth Hook
 *
 * Integrates Clerk identity with PlaceFlow server-side roles and permissions.
 * The role is ALWAYS sourced from the PlaceFlow API (/api/v1/auth/me) after
 * token verification.
 */
export function useAuth(): AuthState {
  const { isSignedIn, isLoaded: isClerkLoaded, getToken } = useClerkAuth();
  const { user: clerkUser } = useClerkUser();

  const [placeflowUser, setPlaceflowUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    if (!isClerkLoaded) return;

    if (!isSignedIn) {
      setPlaceflowUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) {
        throw new Error("Failed to retrieve Clerk session token");
      }

      const user = await getMe(token);
      setPlaceflowUser(user);
    } catch (err) {
      console.error("[useAuth] Failed to load PlaceFlow user:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch user"));
    } finally {
      setIsLoading(false);
    }
  }, [isClerkLoaded, isSignedIn, getToken]);

  useEffect(() => {
    let isSubscribed = true;

    async function load() {
      if (!isClerkLoaded) return;
      if (!isSignedIn) {
        if (isSubscribed) {
          setPlaceflowUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const token = await getToken();
        if (!token) return;
        const user = await getMe(token);
        if (isSubscribed) {
          setPlaceflowUser(user);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(err instanceof Error ? err : new Error("Failed to fetch user"));
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isSubscribed = false;
    };
  }, [isClerkLoaded, isSignedIn, getToken, clerkUser?.id]);

  const hasRole = useCallback(
    (allowedRoles: UserRole | UserRole[]): boolean => {
      if (!placeflowUser?.role) return false;
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      return rolesArray.includes(placeflowUser.role);
    },
    [placeflowUser],
  );

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!placeflowUser?.role) return false;
      const permissions = ROLE_PERMISSIONS[placeflowUser.role] || [];
      return permissions.includes(permission);
    },
    [placeflowUser],
  );

  return {
    user: placeflowUser,
    role: placeflowUser?.role ?? null,
    isLoading: !isClerkLoaded || isLoading,
    isAuthenticated: Boolean(isSignedIn && placeflowUser),
    error,
    hasRole,
    hasPermission,
    refetchUser: fetchUser,
  };
}
