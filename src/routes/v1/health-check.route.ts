import { Hono } from "hono";

import {
  databaseHealthCheckController,
  serverHealthCheckController,
  serverInfoController,
} from "../../controllers/v1/health-check.controller.ts";
import { checkAuthorisationHeaders } from "../../middlewares/sensitive-authorization.middleware.ts";

const healthCheckRouter = new Hono();

healthCheckRouter.get("/server", serverHealthCheckController);
healthCheckRouter.get("/database", databaseHealthCheckController);
healthCheckRouter.get(
  "/server-info",
  checkAuthorisationHeaders,
  serverInfoController
);

export default healthCheckRouter;
