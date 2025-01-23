import {Context} from "hono";
import logger from "./logger.ts";
import {APP_ENV} from "../env.ts";
import {STATUS} from "../constants/statusCodes.ts";

const errorHandler = (err: Error, c: Context) => {
  const isProduction = APP_ENV === "production";

  logger.error({
    error: err.message,
    stack: isProduction ? undefined : err.stack,
    method: c.req.method,
    url: c.req.url,
  });

  return c.json(
    {
      message: "Internal Server Error",
      error: isProduction ? "An unexpected error occurred" : err.message,
    },
    STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
  );
};

export default errorHandler;
