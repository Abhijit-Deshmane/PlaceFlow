import { z } from "zod";

// ─── Environment Schema ─────────────────────────────────────────────────────
// Single source of truth for all validated environment variables.
// Import `env` from this module. NEVER use raw process.env in business logic.

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3001),

  // Database
  DATABASE_URL: z.string().url({ message: "DATABASE_URL must be a valid URL" }),

  // CORS
  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  // Clerk — never expose secret keys to clients
  CLERK_SECRET_KEY: z.string({ required_error: "CLERK_SECRET_KEY is required" }),
  CLERK_WEBHOOK_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
