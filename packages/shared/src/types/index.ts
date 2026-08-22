// ─── Shared TypeScript Types ───────────────────────────────────────────────────
// These are plain TS types (no Zod), used for API response shapes
// that both web and mobile consume.

export type UserRole = "STUDENT" | "FACULTY" | "ADMIN" | "RECRUITER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number;
  total: number;
}
