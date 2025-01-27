import { Context } from "hono";
import { STATUS } from "../../constants/statusCodes.ts";
import { SYS_INFO_KEY } from "../../env.ts";

export const healthCheckServer = (c: Context) => {
  c.status(STATUS.SUCCESS.OK);
  return c.json({ status: "Server running." });
};

export const performanceCheckServer = (c: Context) => {
  const { sysInfoKey } = c.req.query();
  if (!sysInfoKey || sysInfoKey !== SYS_INFO_KEY) {
    return c.json(
      { success: false, error: "Unauthorised Request" },
      STATUS.CLIENT_ERROR.UNAUTHORIZED,
    );
  }

  const systemInfo = {
    timestamp: new Date().toISOString(),
    memoryUsage: Deno.memoryUsage(),
    memoryInfo: Deno.systemMemoryInfo(),
    uptime: Deno.osUptime(),
    osRelease: Deno.osRelease(),
    version: Deno.build,
    deno: Deno.version,
    networkInterfaces: Deno.networkInterfaces(),
    avgLoad: {
      "1m": Deno.loadavg()[0],
      "5m": Deno.loadavg()[1],
      "15m": Deno.loadavg()[2],
    },
  };

  c.status(STATUS.SUCCESS.OK);
  return c.json({ ...systemInfo });
};
