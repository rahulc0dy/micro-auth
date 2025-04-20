import { Hono } from "hono";
import {
  databaseHealthCheckController,
  serverHealthCheckController,
} from "../../controllers/v1/health-check.controller.ts";

const healthCheckRouter = new Hono();

healthCheckRouter.get("/server", serverHealthCheckController);
healthCheckRouter.get("/database", databaseHealthCheckController);

export default healthCheckRouter;
