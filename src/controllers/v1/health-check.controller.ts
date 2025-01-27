import { Context } from "hono";
import { STATUS } from "../../constants/statusCodes.ts";
import { SYS_INFO_KEY } from "../../env.ts";

export const healthCheckServer = (c: Context) => {
  c.status(STATUS.SUCCESS.OK);
  return c.json({ status: "Server running." });
};

import { timingSafeEqual } from "crypto";
import { rateLimit } from "../../middleware/rate-limit.ts";
import { logger } from "../../utils/logger.ts";

export const performanceCheckServer = (c: Context) => {
export const performanceCheckServer = [
  rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }), // 100 requests per 15 minutes
  (c: Context) => {
  const { sysInfoKey } = c.req.query();
  // Log access attempts (excluding the key value)
  logger.info(`Performance check accessed from ${c.req.header("x-forwarded-for") || c.req.ip()}`);
  if (!sysInfoKey || !timingSafeEqual(
    new TextEncoder().encode(sysInfoKey),
    new TextEncoder().encode(SYS_INFO_KEY)
  )) {
    logger.warn(`Unauthorized performance check attempt from ${c.req.header("x-forwarded-for") || c.req.ip()}`);
    return c.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: "Invalid or missing system information key",
          details: "Access to system metrics requires valid authentication"
        }
      },
      STATUS.CLIENT_ERROR.UNAUTHORIZED,
    );
  }
}];

  const systemInfo = {
    timestamp: new Date().toISOString(),
    memoryUsage: {
      heapUsedMB: Math.round(Deno.memoryUsage().heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(Deno.memoryUsage().heapTotal / 1024 / 1024),
      rss: Math.round(Deno.memoryUsage().rss / 1024 / 1024),
    },
    uptime: Deno.osUptime(),
    version: Deno.version.deno,
    avgLoad: {
      "1m": Deno.loadavg()[0],
      "5m": Deno.loadavg()[1],
      "15m": Deno.loadavg()[2],
    },
  };

  c.status(STATUS.SUCCESS.OK);
  return c.json({ ...systemInfo });
};
