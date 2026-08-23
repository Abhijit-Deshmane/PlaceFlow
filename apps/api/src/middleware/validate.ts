import { type Request, type Response, type NextFunction } from "express";
import { type ZodSchema } from "zod";

// ─── Validate Middleware ────────────────────────────────────────────────────
/**
 * Middleware factory that validates `req.body` against a Zod schema.
 * On success, replaces `req.body` with the parsed (coerced/defaulted) value.
 * On failure, returns 400 with a VALIDATION_ERROR response.
 *
 * Usage: `router.post("/", requireAuth, validate(createJobSchema), controller.fn)`
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: result.error.flatten(),
        },
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
