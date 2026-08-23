import { apiClient } from "@/lib/api-client";
import type { SafeUser } from "@placeflow/shared";

/**
 * Fetches the authenticated PlaceFlow user and verified role from the backend.
 * The backend verifies the Clerk JWT and looks up or provisions the user.
 */
export async function getMe(token: string): Promise<SafeUser> {
  return apiClient.get<SafeUser>("/api/v1/auth/me", { token });
}
