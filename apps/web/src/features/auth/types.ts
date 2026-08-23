import type { SafeUser, UserRole, Permission } from "@placeflow/shared";

export interface AuthState {
  user: SafeUser | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
  refetchUser: () => Promise<void>;
}
