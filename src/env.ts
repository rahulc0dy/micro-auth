import { createEnv } from "@t3-oss/env-core";
import { z, type ZodIssue } from "zod";
import { configDotenv } from "dotenv";

configDotenv({ path: "./.env.***" });

export const {
  PORT,
  NODE_ENV,
  LOG_LEVEL,
  LOG_DIR,
  DATABASE_URL,
  RATE_LIMIT,
  RATE_LIMIT_WINDOW,
  SENSITIVE_SERVER_DATA_AUTHORISATION_TOKEN,
} = createEnv({
  server: {
    PORT: z
      .string()
      .trim()
      .transform((PORT) => parseInt(PORT)),
    NODE_ENV: z
      .enum(["production", "development", "test"])
      .optional()
      .default("development"),
    LOG_LEVEL: z
      .enum(["error", "info", "warn", "debug", "http", "verbose", "silly"])
      .optional()
      .default("info"),
    LOG_DIR: z.string().optional().default("logs"),
    RATE_LIMIT: z
      .string()
      .optional()
      .default("100")
      .transform((l) => parseInt(l)),
    RATE_LIMIT_WINDOW: z
      .string()
      .optional()
      .default("600000")
      .transform((w) => parseInt(w)),
    DATABASE_URL: z.string().url(),
    SENSITIVE_SERVER_DATA_AUTHORISATION_TOKEN: z.string().min(10),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  emptyStringAsUndefined: true,

  // Called when the schema validation fails.
  onValidationError: (issues: readonly ZodIssue[]) => {
    console.error("❌ Invalid environment variables:", issues);
    throw new Error("Invalid environment variables");
  },
});
