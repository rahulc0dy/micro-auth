import type { Context } from "hono";
import { ApiResponse } from "../../utils/ApiResponse.ts";
import { db } from "../../database";
import { sql } from "drizzle-orm";
import { ApiError } from "../../utils/ApiError.ts";

export const serverHealthCheckController = (c: Context) => {
  return c.json(new ApiResponse({ message: "Server OK!", data: {} }), {
    status: 200,
  });
};

export const databaseHealthCheckController = async (c: Context) => {
  const dbHealth = await db.execute(sql`SELECT version();`);

  if (!dbHealth) {
    throw new ApiError("Database connection failed.");
  }

  return c.json(new ApiResponse({ message: "Database OK!", data: {} }));
};
