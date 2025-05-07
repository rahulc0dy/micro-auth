import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { timing } from "hono/timing";
import { rateLimiter } from "hono-rate-limiter";

import { NODE_ENV, RATE_LIMIT, RATE_LIMIT_WINDOW } from "./env.ts";
import { headerAuthMiddleware } from "./middlewares/header-verification.middleware.ts";
import { reqLogMiddleware } from "./middlewares/request-logger.middleware.ts";
import { registerV1Routes } from "./routes/v1/routes.config.ts";
import errorHandler from "./utils/error-handler.ts";
import { keyGenerator } from "./utils/key-generator.ts";

const app = new Hono();

app.get("/ui", swaggerUI({ url: "/api/v1/health-check" }));

app.use(timing());

app.use(headerAuthMiddleware);

if (NODE_ENV == "production") {
  app.use(
    rateLimiter({
      windowMs: RATE_LIMIT_WINDOW,
      limit: RATE_LIMIT,
      standardHeaders: "draft-6",
      keyGenerator,
    })
  );
}

app.use(reqLogMiddleware);

registerV1Routes(app);

app.onError(errorHandler);

export default app;
