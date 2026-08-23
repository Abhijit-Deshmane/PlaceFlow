import "dotenv/config";
import { env } from "./config/env";
import express from "express";
import cors from "cors";
import { healthRouter } from "./modules/health/health.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/health", healthRouter);
app.use("/api/v1/auth", authRouter);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Not found" },
  });
});

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`🚀 PlaceFlow API running on http://localhost:${env.PORT}`);
});
