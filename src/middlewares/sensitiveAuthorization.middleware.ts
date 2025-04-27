import type { Context, Next } from "hono";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { SENSITIVE_SERVER_DATA_AUTHORIZATION_TOKEN } from "../env.ts";

export const checkAuthorisationHeaders = async (c: Context, next: Next) => {
  // Check the header, e.g., 'x-sensitive-data-authorization-token' or 'x-sensitive-data-authorization-token'
  const apiKey = c.req.header("x-sensitive-data-authorisation-token");

  if (!apiKey || apiKey !== SENSITIVE_SERVER_DATA_AUTHORIZATION_TOKEN) {
    // Respond with 401 Unauthorized
    return c.json(
      new ApiResponse({
        success: false,
        message:
          "Unauthorized access to sensitive data. Please provide a valid key.",
        errors: [{ message: "Invalid or missing authorisation key" }],
      }),
      401
    );
  }
  // Header is valid, continue
  await next();
};
