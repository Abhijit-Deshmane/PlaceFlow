import type { UserRole, UserStatus } from "@placeflow/shared";

// ─── Express Request Augmentation ───────────────────────────────────────────
// Extends the Express Request with the `auth` property that is attached by
// the `requireAuth` middleware after successful Clerk JWT verification.
//
// The client MUST never be trusted to provide userId or role.
// These values are ALWAYS derived server-side from the verified Clerk token
// and the PlaceFlow database record.

declare global {
  namespace Express {
    interface Request {
      /**
       * Attached by `requireAuth` middleware after Clerk JWT verification
       * and PlaceFlow user lookup.
       *
       * - `clerkUserId`: The Clerk user ID from the verified JWT (`sub` claim).
       * - `userId`: The PlaceFlow internal user ID (cuid).
       * - `role`: The PlaceFlow role from the database — NOT from the client.
       * - `status`: The PlaceFlow user status from the database.
       */
      auth: {
        clerkUserId: string;
        userId: string;
        role: UserRole;
        status: UserStatus;
      };
    }
  }
}
