import { Hono } from "hono";
import healthCheckRouter from "./health-check.route.ts";
import registrationRouter from "./registration.route.ts";
import loginRouter from "./login.route.ts";

export const registerV1Routes = (app: Hono) => {
  // Add base prefix '/v1' to all routes
  const v1Routes = new Hono();

  v1Routes.route("/health-check", healthCheckRouter);
  v1Routes.route("/register", registrationRouter);
  v1Routes.route("/login", loginRouter);

  app.route("/api/v1", v1Routes);
};
