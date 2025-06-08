import { createEnv } from "@t3-oss/env-core";
import { configDotenv } from "dotenv";
import { z, type ZodIssue } from "zod";

configDotenv({ path: "./.env" });
configDotenv({ path: "./.env.test", override: true });
configDotenv({ path: "./.env.development", override: true });
configDotenv({ path: "./.env.production", override: true });

export const {
  PORT,
  NODE_ENV,
  LOG_LEVEL,
  LOG_DIR,
  DATABASE_URL,
  RATE_LIMIT,
  RATE_LIMIT_WINDOW,
  SENSITIVE_SERVER_DATA_AUTHORIZATION_TOKEN,
  SECURE_API_KEY,
  GITHUB_CLIENT_ID,
  GITHUB_CALLBACK_URL,
  GITHUB_CLIENT_SECRET,
  COOKIE_SECRET,
} = createEnv({
  server: {
    PORT: z
      .string()
      .trim()
      .transform((PORT) => parseInt(PORT)),
    NODE_ENV: z
      .enum(["production", "development", "test"])
      .optional()
      .default("development")
      .readonly(),
    LOG_LEVEL: z
      .enum(["error", "info", "warn", "debug", "http", "verbose", "silly"])
      .optional()
      .default("info")
      .readonly(),
    LOG_DIR: z.string().optional().default("logs").readonly(),
    RATE_LIMIT: z
      .string()
      .optional()
      .default("100")
      .transform((l) => parseInt(l))
      .readonly(),
    RATE_LIMIT_WINDOW: z
      .string()
      .optional()
      .default("600000")
      .transform((w) => parseInt(w))
      .readonly(),
    DATABASE_URL: z.string().url().readonly(),
    SENSITIVE_SERVER_DATA_AUTHORIZATION_TOKEN: z
      .string()
      .min(10, "Token too weak. Please use stronger token for security.")
      .readonly(),
    SECURE_API_KEY: z
      .string()
      .uuid("Invalid API key. Not a UUID!")
      .nonempty()
      .readonly(),
    GITHUB_CLIENT_ID: z.string().nonempty().readonly(),
    GITHUB_CLIENT_SECRET: z.string().nonempty().readonly(),
    GITHUB_CALLBACK_URL: z.string().url().nonempty().readonly(),
    COOKIE_SECRET: z.string().nonempty().min(10).readonly(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  emptyStringAsUndefined: true,

  // Called when the schema validation fails.
  onValidationError: (issues: readonly ZodIssue[]) => {
    console.error(
      "⟬ ENV ERROR ⟭ Invalid environment variables:\n",
      issues
        .map((issue) => `↳ ${issue.path}: ${issue.message.toString()}`)
        .join("\n")
    );
    process.exit(1);
    // throw new Error("Invalid environment variables");
  },
});
