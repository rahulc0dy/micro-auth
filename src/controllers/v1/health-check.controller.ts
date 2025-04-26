import type { Context } from "hono";
import { ApiResponse } from "../../utils/ApiResponse.ts";
import { db } from "../../database";
import { sql } from "drizzle-orm";
import { ApiError } from "../../utils/ApiError.ts";
import logger from "../../utils/logger.ts";

export const serverHealthCheckController = (c: Context) => {
  return c.json(new ApiResponse({ message: "Server OK!", data: {} }), {
    status: 200,
  });
};

export const databaseHealthCheckController = async (c: Context) => {
  const dbHealth = await db.execute(sql`SELECT version();`);

  if (!dbHealth) {
    logger.error("Database connection failed.");
    throw new ApiError("Database connection failed.");
  }

  return c.json(new ApiResponse({ message: "Database OK!", data: {} }));
};

export const serverInfoController = async (c: Context) => {
  const dbInfo = await db.execute(sql`SELECT version();`);

  const serverInfo = {
    dbInfo: dbInfo.rows[0].version,
    runtimeVersion: process.version,
    runtime: process.isBun ? "Bun" : process.release.name,
    debugPort: process.debugPort,
    features: process.features,
    platform: process.platform,
    architecture: process.arch,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
  };

  return c.json(
    new ApiResponse({
      message: "Server info retrieved",
      data: serverInfo,
    })
  );
};
