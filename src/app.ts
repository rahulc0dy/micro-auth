import { Hono } from "hono";
import { registerV1Routes } from "./routes/v1/routes.config.ts";
import errorHandler from "./utils/errorHandler.ts";
import { reqLogMiddleware } from "./middlewares/requestLog.middleware.ts";

const app = new Hono();

app.use(reqLogMiddleware);

// Api version 1 routing.
registerV1Routes(app);

// Universal error handler.
app.onError(errorHandler);

export default app;
