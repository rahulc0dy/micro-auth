import { Hono } from "hono";
import { registerV1Routes } from "./routes/v1/routes.config.ts";
import { logger } from "hono/logger";
import errorHandler from "./utils/errorHandler.ts";
import { reqLogMiddleware } from "./middlewares/requestLog.middleware.ts";
import chalk from "chalk";
import { APP_ENV } from "./env.ts";

const app = new Hono();

APP_ENV === "production"
  ? app.use(reqLogMiddleware)
  : app.use(logger((message) => {
    console.log(
      `${chalk.gray(`[${new Date().toISOString()}]`)} ${
        chalk.bgMagentaBright.blackBright.bold.italic(" REQ LOG ")
      } ${chalk.cyanBright("server")} ${message}`,
    );
  }));

// Api version 1 routing.
registerV1Routes(app);

// Universal error handler.
app.onError(errorHandler);

export default app;
