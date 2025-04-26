import type { Context, Next } from "hono";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { SENSITIVE_SERVER_DATA_AUTHORISATION_TOKEN } from "../env.ts";

/**
 * Middleware to enforce the presence and validity of an API key in the request headers.
 *
 * This function checks the `x-sensitive-data-authorization-token` header in the incoming request. If the header is
 * either missing or contains an invalid key, the middleware responds with a 401 Unauthorized
 * status and an error message. If the header is valid, the middleware proceeds to the next
 * handler in the chain.
 *
 * @param {Context} c - The context object representing the HTTP request and response.
 * @param {Next} next - A function that passes control to the next middleware or handler.
 * @returns {Promise<void>} A promise that resolves when processing is complete.
 */
export const checkAuthorisationHeaders = async (c: Context, next: Next) => {
  // Check the header, e.g., 'x-sensitive-data-authorization-token' or 'x-sensitive-data-authorization-token'
  const apiKey = c.req.header("x-sensitive-data-authorisation-token");

  if (!apiKey || apiKey !== SENSITIVE_SERVER_DATA_AUTHORISATION_TOKEN) {
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
