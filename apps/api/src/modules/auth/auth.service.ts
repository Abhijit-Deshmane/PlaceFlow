import { prisma } from "../../lib/prisma";
import { clerkClient } from "../../lib/clerk";
import { AppError } from "../../middleware/error-handler";
import type { SafeUser } from "@placeflow/shared";

// ─── getMe ───────────────────────────────────────────────────────────────────
/**
 * Returns the PlaceFlow user record for the authenticated Clerk user.
 *
 * If the user exists in Clerk but has no PlaceFlow record yet, we create one
 * with the default role (STUDENT) — the lowest privilege level.
 *
 * Security:
 * - The clerkUserId comes from the VERIFIED Clerk JWT, never from the client.
 * - The role is assigned server-side from the DB, never from the client.
 * - A new user ALWAYS receives STUDENT — never a privileged role.
 */
export async function getMe(clerkUserId: string): Promise<SafeUser> {
  // Try to find the existing PlaceFlow user
  let user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    // Fetch the Clerk user to get email/name for first-time provisioning
    let clerkUser: Awaited<ReturnType<typeof clerkClient.users.getUser>>;
    try {
      clerkUser = await clerkClient.users.getUser(clerkUserId);
    } catch {
      throw new AppError(
        401,
        "UNAUTHORIZED",
        "Could not retrieve Clerk user profile",
      );
    }

    const primaryEmail = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    );

    if (!primaryEmail) {
      throw new AppError(
        422,
        "UNPROCESSABLE",
        "Clerk user has no primary email address",
      );
    }

    const fullName =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      null;

    // Create PlaceFlow user — always defaults to STUDENT, never a privileged role
    user = await prisma.user.create({
      data: {
        clerkUserId,
        email: primaryEmail.emailAddress,
        name: fullName,
        role: "STUDENT",   // immutable default — role is assigned by admins
        status: "ACTIVE",
      },
    });
  }

  return toSafeUser(user);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toSafeUser(user: {
  id: string;
  clerkUserId: string;
  email: string;
  name: string | null;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}): SafeUser {
  return {
    id: user.id,
    clerkUserId: user.clerkUserId,
    email: user.email,
    name: user.name,
    role: user.role as SafeUser["role"],
    status: user.status as SafeUser["status"],
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
