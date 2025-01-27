import { Hono } from "hono";
import { healthCheckServer, performCheckServer } from "../../controllers/v1/health-check.controller.ts";

const healthCheckRoutes = new Hono();

healthCheckRoutes.get("/server", healthCheckServer);
healthCheckRoutes.get("/performance", performCheckServer);

export default healthCheckRoutes;
