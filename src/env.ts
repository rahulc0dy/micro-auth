import { createEnv } from "@t3-oss/env-core";
import { z, ZodError } from "zod";
import { configDotenv } from "dotenv";

configDotenv({ path: "./.env" });

export const { PORT, NODE_ENV } = createEnv({
  server: {
    PORT: z.string().trim().transform((PORT) => parseInt(PORT)),
    NODE_ENV: z.enum(["production", "development", "test"]).optional().default(
      "development",
    ),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
  // Called when the schema validation fails.
  onValidationError: (error: ZodError) => {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: (variable: string) => {
    throw new Error(
      `❌ Attempted to access server-side environment variable ${variable} on the client`,
    );
  },
  // Tell the library when we're in a server context.
  isServer: typeof window === "undefined",
});
