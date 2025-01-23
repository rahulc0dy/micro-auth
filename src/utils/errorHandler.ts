import {Context} from "hono";
import logger from "./logger.ts";

const errorHandler = (err: Error, c: Context) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    method: c.req.method,
    url: c.req.url,
  });

  return c.json(
    { message: "Internal Server Error", error: err.message },
    500,
  );
};

export default errorHandler;
