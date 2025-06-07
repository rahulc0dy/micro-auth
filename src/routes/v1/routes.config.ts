import { Hono } from "hono";

import githubOauthRouter from "./github-oauth.route.ts";
import healthCheckRouter from "./health-check.route.ts";
import loginRouter from "./login.route.ts";
import registrationRouter from "./registration.route.ts";

export const registerV1Routes = (app: Hono) => {
  // Add the base prefix '/v1' to all routes
  const v1Routes = new Hono();

  v1Routes.route("/health-check", healthCheckRouter);
  v1Routes.route("/register", registrationRouter);
  v1Routes.route("/login", loginRouter);
  v1Routes.route("/oauth/github", githubOauthRouter);

  app.route("/api/v1", v1Routes);
};
