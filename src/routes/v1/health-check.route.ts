import { Hono } from "hono";
import { healthCheckServer, performanceCheckServer } from "../../controllers/v1/health-check.controller.ts";

const healthCheckRoutes = new Hono();

healthCheckRoutes.get("/server", healthCheckServer);
healthCheckRoutes.get("/performance", performanceCheckServer);

export default healthCheckRoutes;
