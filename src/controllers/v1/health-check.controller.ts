import type { Context } from "hono";
import { ApiResponse } from "../../utils/ApiResponse.ts";

export const healthCheckServer = (c: Context) => {
  return c.json(
    new ApiResponse({ message: "Server OK!", data: {}, success: true }),
    { status: 200 }
  );
};
