import {Context} from "hono";

export const healthCheckServer = (c: Context) => {
  c.status(200);
  return c.json({ status: "Server running." });
};

export const healthDetails = (c: Context) => {
  return c.json({ status: "ok", details: "All systems operational" });
};
