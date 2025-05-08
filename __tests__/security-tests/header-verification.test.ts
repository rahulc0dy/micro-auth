import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { headerAuthMiddleware } from "../../src/middlewares/header-verification.middleware.ts";
import { SECURE_API_KEY } from "../../src/env.ts";

// Helper to create a simple app using the middleware
function createApp() {
  const app = new Hono();
  app.use(headerAuthMiddleware);
  app.get("/", (c) => c.json({ success: true }));
  return app;
}

describe("headerAuthMiddleware", () => {
  test("allows request when header is present and valid", async () => {
    const app = createApp();
    const res = await app.request("/", {
      headers: { "x-secure-api-key": SECURE_API_KEY },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  test("rejects request when header is missing", async () => {
    const app = createApp();
    const res = await app.request("/");
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/unauthorized|invalid|missing/i);
  });

  test("rejects request when header is invalid", async () => {
    const app = createApp();
    const res = await app.request("/", {
      headers: { "x-secure-api-key": "wrong-key" },
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/unauthorized|invalid/i);
  });
});
