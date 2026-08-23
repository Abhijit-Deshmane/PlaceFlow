import { z } from "zod";

// ─── Role & Status Enums ────────────────────────────────────────────────────

export const userRoleSchema = z.enum([
  "SUPER_ADMIN",
  "COLLEGE_ADMIN",
  "PLACEMENT_OFFICER",
  "RECRUITER",
  "STUDENT",
]);

export const userStatusSchema = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);

// ─── Safe User Schema ───────────────────────────────────────────────────────
// Matches the SafeUser interface. Used to validate GET /api/v1/auth/me response.

export const safeUserSchema = z.object({
  id: z.string(),
  clerkUserId: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  role: userRoleSchema,
  status: userStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

// ─── API Response Schema ────────────────────────────────────────────────────

export const meResponseSchema = z.object({
  success: z.literal(true),
  data: safeUserSchema,
});

// ─── Inferred Types ─────────────────────────────────────────────────────────

export type SafeUserInput = z.infer<typeof safeUserSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
