import { serve } from "@hono/node-server";
import app from "./app.ts";
import { PORT } from "./env.ts";

console.log(`Server is running on http://localhost:${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
});
