import { createEnv } from "@t3-oss/env-core";
import { z, ZodError } from "zod";
import { configDotenv } from "dotenv";

configDotenv({ path: "./.env" });

export const { PORT, APP_ENV, LOG_LEVEL, LOG_DIR, DATABASE_URL } = createEnv({
  server: {
    PORT: z
      .string()
      .trim()
      .transform((PORT) => parseInt(PORT)),
    APP_ENV: z
      .enum(["production", "development", "test"])
      .optional()
      .default("development"),
    LOG_LEVEL: z
      .enum(["error", "info", "warn", "debug", "http", "verbose", "silly"])
      .optional()
      .default("info"),
    LOG_DIR: z.string().optional().default("logs"),
    DATABASE_URL: z.string().url(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  emptyStringAsUndefined: true,

  // Called when the schema validation fails.
  onValidationError: (error: ZodError) => {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: (variable: string) => {
    throw new Error(
      `❌ Attempted to access server-side environment variable ${variable} on the client`
    );
  },
  // Tell the library when we're in a server context.
  isServer: typeof window === "undefined",
});
