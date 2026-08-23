import { createClerkClient } from "@clerk/backend";
import { env } from "../config/env";

// ─── Clerk Backend Client ───────────────────────────────────────────────────
// Single Clerk backend SDK instance for the entire API.
// Used by auth middleware to verify JWTs and look up Clerk users.
// The secret key MUST never be exposed to clients.

export const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
});
