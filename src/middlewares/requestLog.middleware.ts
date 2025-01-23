import {Context} from "hono";
import logger from "../utils/logger.ts";

export const reqLogMiddleware = async (
  c: Context,
  next: () => Promise<void>,
) => {
  const start = performance.now();
  try {
    await next();
  } catch (error) {
    logger.error({
      error: error.message,
      stack: error.stack,
      method: c.req.method,
      url: c.req.url,
    });
    throw error;
  }

  const duration = (performance.now() - start).toFixed(2);
  const method = c.req.method;
  const url = c.req.url;
  const status = c.res.status;

  const logObject = {
    method,
    url,
    status,
    responseTime: `${duration}ms`,
  };

  logger.info(logObject);
};
