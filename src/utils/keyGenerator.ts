import type { Context } from "hono";
import { getConnInfo } from "hono/bun";

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
