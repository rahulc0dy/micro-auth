import { Hono } from "hono";
import { healthCheckServer } from "../../controllers/v1/health-check.controller.ts";

const healthCheckRoutes = new Hono();

healthCheckRoutes.get("/server", healthCheckServer);

export default healthCheckRoutes;
