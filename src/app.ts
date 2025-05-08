import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { timing } from "hono/timing";
import { rateLimiter } from "hono-rate-limiter";

import { NODE_ENV, RATE_LIMIT, RATE_LIMIT_WINDOW } from "./env.ts";
import { headerAuthMiddleware } from "./middlewares/header-verification.middleware.ts";
import { reqLogMiddleware } from "./middlewares/request-logger.middleware.ts";
import documentationRouter from "./routes/v1/documentation.route.ts";
import { registerV1Routes } from "./routes/v1/routes.config.ts";
import errorHandler from "./utils/error-handler.ts";
import { keyGenerator } from "./utils/key-generator.ts";

/**
 * Represents an instance of the Hono application.
 * The `app` variable is used to define and manage routes,
 * middleware, and other functionalities within the application.
 *
 * Commonly used in creating web servers or APIs, `app`
 * serves as the central entry point for defining request handlers
 * and applying middleware.
 */
const app = new Hono();

app.use(timing());

app.route("/docs", documentationRouter);
app.get("/ui", swaggerUI({ url: "/docs/openapi-json" }));

// Header verification middleware must be added before rate limiting middleware
app.use(headerAuthMiddleware);

// Rate limiting middleware is only added in production mode
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

// Request logging middleware must be added after rate limiting middleware
app.use(reqLogMiddleware);

registerV1Routes(app);

app.onError(errorHandler);

export default app;
