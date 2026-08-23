import { type Request, type Response, type NextFunction } from "express";

// ─── AppError ───────────────────────────────────────────────────────────────
/**
 * Typed application error. Throw this from services/controllers to produce
 * a structured API error response. The global error handler catches it.
 */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// ─── Global Error Handler ───────────────────────────────────────────────────
/**
 * Express global error handler — must be the LAST middleware registered.
 * Converts AppError and unexpected errors into the standard API envelope.
 *
 * Usage in index.ts: `app.use(errorHandler)` — after all routes.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined && { details: err.details }),
      },
    });
    return;
  }

  // Unexpected error — log it, return a safe 500
  console.error("[ErrorHandler] Unhandled error:", err);

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    },
  });
}
