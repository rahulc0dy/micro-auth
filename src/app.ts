import { Hono } from "hono";
import { registerV1Routes } from "./routes/v1/routes.config.ts";
import { reqLogMiddleware } from "./middlewares/requestLog.middleware.ts";
import errorHandler from "./utils/errorHandler.ts";
import { rateLimiter } from "hono-rate-limiter";
import { APP_ENV, RATE_LIMIT, RATE_LIMIT_WINDOW } from "./env.ts";
import { keyGenerator } from "./utils/keyGenerator.ts";

const app = new Hono();

if (APP_ENV == "production")
  app.use(
    rateLimiter({
      windowMs: RATE_LIMIT_WINDOW,
      limit: RATE_LIMIT,
      standardHeaders: "draft-6",
      keyGenerator,
    })
  );

app.use(reqLogMiddleware);

registerV1Routes(app);

app.onError(errorHandler);

export default app;
