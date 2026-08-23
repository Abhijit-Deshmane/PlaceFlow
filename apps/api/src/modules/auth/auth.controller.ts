import { type Request, type Response, type NextFunction } from "express";
import * as authService from "./auth.service";

// ─── me ──────────────────────────────────────────────────────────────────────
/**
 * GET /api/v1/auth/me
 *
 * Returns the authenticated PlaceFlow user's safe identity and role.
 * On first access, provisions a new PlaceFlow user record (role: STUDENT).
 *
 * Returns:
 * - 200 SafeUser on success
 * - 401 if token is missing/invalid (handled by requireAuth middleware)
 * - 403 if account is suspended (handled by requireAuth middleware)
 */
export async function me(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // req.auth.clerkUserId is set by requireAuth — never trust client input
    const user = await authService.getMe(req.auth.clerkUserId);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
