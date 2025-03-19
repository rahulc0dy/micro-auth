import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./src/env.ts";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/schemas/users.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
