import { Hono } from "hono";
import { registerV1Routes } from "./routes/v1/routes.config.ts";
import { reqLogMiddleware } from "./middlewares/requestLog.middleware.ts";
import errorHandler from "./utils/errorHandler.ts";
import { rateLimiter } from "hono-rate-limiter";
import { RATE_LIMIT, RATE_LIMIT_WINDOW } from "./env.ts";
import { keyGenerator } from "./utils/keyGenerator.ts";

const app = new Hono();

app.use(
  rateLimiter({
    windowMs: RATE_LIMIT_WINDOW,
    limit: RATE_LIMIT,
    standardHeaders: "draft-6",
    keyGenerator: (c) => keyGenerator(c),
  })
);

app.use(reqLogMiddleware);

registerV1Routes(app);

app.onError(errorHandler);

export default app;
