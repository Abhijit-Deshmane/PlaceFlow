// ─── Shared TypeScript Types ───────────────────────────────────────────────────
// Plain TS types (no Zod). Used for API response shapes consumed by web and mobile.
// Authentication is handled by Clerk. PlaceFlow controls roles and permissions.

// ─── Roles ──────────────────────────────────────────────────────────────────

/** The five application roles in PlaceFlow. Clerk handles identity; PlaceFlow controls roles. */
export type UserRole =
  | "SUPER_ADMIN"
  | "COLLEGE_ADMIN"
  | "PLACEMENT_OFFICER"
  | "RECRUITER"
  | "STUDENT";

// ─── Status ─────────────────────────────────────────────────────────────────

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

// ─── User Shapes ─────────────────────────────────────────────────────────────

/**
 * The safe, public-facing PlaceFlow user shape returned by the API.
 * Never includes passwords, Clerk internals, or sensitive fields.
 */
export interface SafeUser {
  id: string;
  clerkUserId: string;
  email: string;
  name: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Envelope ───────────────────────────────────────────────────
// All API responses MUST use this envelope. See apps/api/AGENTS.md.

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}
