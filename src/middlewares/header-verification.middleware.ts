import type { Context, Next } from "hono";

import { STATUS } from "../constants/status-codes.ts";
import { SECURE_API_KEY } from "../env.ts";
import { ApiResponse } from "../utils/api-response.ts";

export const headerAuthMiddleware = async (c: Context, next: Next) => {
  const secureKey = SECURE_API_KEY;

  const headerToken = c.req.header("x-sensitive-data-authorization-token");
  if (!headerToken || headerToken !== secureKey) {
    return c.json(
      new ApiResponse({
        success: false,
        message:
          "Unauthorized access to sensitive data. Please provide a valid key.",
        errors: [{ message: "Invalid or missing authorisation key" }],
      }),
      STATUS.CLIENT_ERROR.BAD_REQUEST
    );
  }

  await next();
};
