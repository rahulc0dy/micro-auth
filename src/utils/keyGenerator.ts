import type { Context } from "hono";
import { getConnInfo } from "hono/bun";

/**
 * A function that generates a unique key based on the request's IP address and User-Agent.
 * The IP address is determined by checking the "X-Forwarded-For" header and falling back to the
 * connection's remote address if the header is not available.
 * The User-Agent is extracted from the request headers, converted to lowercase, and trimmed.
 *
 * @param {Context} c - The context object containing information about the current request.
 * @returns {string} A string that combines the client's IP address and User-Agent in the format `ip-useragent`.
 */
export const keyGenerator = (c: Context): string => {
  const forwardedFor = c.req.header("X-Forwarded-For");
  const ip = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : getConnInfo(c).remote.address;
  const userAgent = (c.req.header("User-Agent") || "unknown")
    .toLowerCase()
    .trim();

  return `${ip}-${userAgent}`;
};
