import { type Request, type Response, type NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import type { UserRole, Permission } from "@placeflow/shared";
import { ROLE_PERMISSIONS } from "@placeflow/shared";

// ─── requireAuth ────────────────────────────────────────────────────────────
/**
 * Middleware that verifies the Clerk JWT in the `Authorization: Bearer <token>`
 * header, looks up the PlaceFlow user record, and attaches `req.auth`.
 *
 * Security guarantees:
 * - The user ID is extracted from the VERIFIED Clerk JWT (`sub` claim).
 * - The role is read from the PlaceFlow DATABASE, never from the client.
 * - A missing PlaceFlow user record is treated as unauthenticated (401).
 * - A suspended user is treated as forbidden (403).
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Missing or malformed Authorization header",
        },
      });
      return;
    }

    const token = authHeader.slice(7);

    // Verify Clerk JWT — throws if invalid or expired
    let verifiedClaims;
    try {
      verifiedClaims = await verifyToken(token, {
        secretKey: env.CLERK_SECRET_KEY,
      });
    } catch {
      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid or expired token",
        },
      });
      return;
    }

    const clerkUserId = verifiedClaims.sub;
    if (!clerkUserId) {
      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid token payload: missing sub claim",
        },
      });
      return;
    }

    // Look up the PlaceFlow user by Clerk user ID.
    // The role and status come ONLY from the database — never from the client.
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true, role: true, status: true },
    });

    // If no record exists yet, auto-provision as STUDENT (safe lowest privilege)
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email: `${clerkUserId}@placeholder.placeflow.local`,
          role: "STUDENT",
          status: "ACTIVE",
        },
        select: { id: true, role: true, status: true },
      });
    }

    if (user.status === "SUSPENDED") {
      res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Your account has been suspended",
        },
      });
      return;
    }

    if (user.status === "INACTIVE") {
      res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Your account is inactive",
        },
      });
      return;
    }

    // Attach auth context — role is strictly from DB, never from the client
    req.auth = {
      clerkUserId,
      userId: user.id,
      role: user.role as UserRole,
      status: user.status as "ACTIVE" | "INACTIVE" | "SUSPENDED",
    };

    next();
  } catch (err) {
    next(err);
  }
}

// ─── requireRole ─────────────────────────────────────────────────────────────
/**
 * Middleware factory that allows only the specified roles.
 * Must be used AFTER `requireAuth`.
 *
 * Usage: `router.get("/", requireAuth, requireRole("SUPER_ADMIN", "COLLEGE_ADMIN"), controller.fn)`
 */
export function requireRole(
  ...allowedRoles: UserRole[]
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Access requires one of: ${allowedRoles.join(", ")}`,
        },
      });
      return;
    }

    next();
  };
}

// ─── requirePermission ───────────────────────────────────────────────────────
/**
 * Middleware factory that checks a named permission against the user's role.
 * Must be used AFTER `requireAuth`.
 *
 * Usage: `router.post("/", requireAuth, requirePermission("create:drives"), controller.fn)`
 */
export function requirePermission(
  permission: Permission,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
      return;
    }

    const userPermissions = ROLE_PERMISSIONS[req.auth.role];
    if (!userPermissions.includes(permission)) {
      res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Missing required permission: ${permission}`,
        },
      });
      return;
    }

    next();
  };
}
