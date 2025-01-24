import app from "./app.ts";
import { PORT } from "./env.ts";

Deno.serve({ port: PORT }, app.fetch);
