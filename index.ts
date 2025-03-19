import { PORT } from "./src/env.ts";
import app from "./src/app.ts";

console.log("Server is running on port: " + PORT);
Bun.serve({ port: PORT, fetch: app.fetch });
