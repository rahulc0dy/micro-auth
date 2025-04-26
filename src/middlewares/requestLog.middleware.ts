import type { Context } from "hono";
import logger from "../utils/logger.ts";

export const reqLogMiddleware = async (
  c: Context,
  next: () => Promise<void>
) => {
  const start = performance.now();
  await next();

  const duration = (performance.now() - start).toFixed(2);
  const method = c.req.method;
  const url = c.req.url;
  const status = c.res.status;

  if (status >= 400)
    logger.warn(`${method} ${url} - ${status} - ${duration}ms`);
  else logger.info(`${method} ${url} - ${status} - ${duration}ms`);
};
