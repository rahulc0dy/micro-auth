import { Hono } from "hono";
import {registerV1Routes} from "./routes/v1/routes.config.ts";

const app = new Hono();

registerV1Routes(app)

export default app;
