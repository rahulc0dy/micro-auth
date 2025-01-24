import { Hono } from "hono";
import healthCheckRoutes from "./health-check.route.ts";
import registrationRoutes from "./registration.route.ts";

export const registerV1Routes = (app: Hono) => {
  // Add base prefix '/v1' to all routes
  const v1Routes = new Hono();

  v1Routes.route("/health-check", healthCheckRoutes);
  v1Routes.route("/register", registrationRoutes);

  app.route("/api/v1", v1Routes);
};
