import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import * as authController from "./auth.controller";

export const authRouter = Router();

// GET /api/v1/auth/me
// Returns the authenticated user's PlaceFlow identity and role.
// requireAuth verifies the Clerk JWT and attaches req.auth before the controller runs.
authRouter.get("/me", requireAuth, authController.me);
