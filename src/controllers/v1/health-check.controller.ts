import {Context} from "hono";

export const healthCheckServer = (c: Context) => {
  c.status(200);
  return c.json({ status: "Server running." });
};
