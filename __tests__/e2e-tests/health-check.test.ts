import { describe, expect, spyOn, test } from "bun:test";

import app from "../../src/app.ts";
import { db } from "../../src/database";
import {
  SECURE_API_KEY,
  SENSITIVE_SERVER_DATA_AUTHORIZATION_TOKEN,
} from "../../src/env.ts";
import { ApiError } from "../../src/utils/api-error.ts";

const urlPrefix = "/api/v1";

describe("Health Check Endpoints", () => {
  test("GET /health-check/server should return server status", async () => {
    const res = await app.request(`${urlPrefix}/health-check/server`, {
      headers: {
        "x-secure-api-key": SECURE_API_KEY,
      },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toMatchObject({
      message: "Server OK!",
      data: {},
      success: true,
    });
  });

  test("GET /health-check/database should return database status", async () => {
    const res = await app.request(`${urlPrefix}/health-check/database`, {
      headers: {
        "x-secure-api-key": SECURE_API_KEY,
      },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toMatchObject({
      message: "Database OK!",
      data: {},
      success: true,
    });
  });

  test("GET /health-check/database should handle db error gracefully", async () => {
    spyOn(db, "execute").mockRejectedValueOnce(
      new ApiError("Database connection failed.")
    );

    const res = await app.request(`${urlPrefix}/health-check/database`, {
      headers: {
        "x-secure-api-key": SECURE_API_KEY,
      },
    });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/database connection failed|internal/i);
  });

  test("GET /health-check/server-info should return info if header is valid", async () => {
    const res = await app.request(`${urlPrefix}/health-check/server-info`, {
      headers: {
        "x-sensitive-data-authorisation-token":
          SENSITIVE_SERVER_DATA_AUTHORIZATION_TOKEN,
        "x-secure-api-key": SECURE_API_KEY,
      },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBe("Server info retrieved");
    expect(json.data).toHaveProperty("dbInfo");
    expect(json.data).toHaveProperty("runtimeVersion");
    expect(json.success).toBe(true);
  });

  test("GET /health-check/server-info should return 401 if header missing", async () => {
    const res = await app.request(`${urlPrefix}/health-check/server-info`, {
      headers: {
        "x-secure-api-key": SECURE_API_KEY,
      },
    });
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/unauthorized|invalid|missing/i);
  });

  test("GET /health-check/server-info should return 401 if header is invalid", async () => {
    const res = await app.request(`${urlPrefix}/health-check/server-info`, {
      headers: {
        "x-sensitive-data-authorisation-token": "invalid-key",
        "x-secure-api-key": SECURE_API_KEY,
      },
    });
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.message).toMatch(/unauthorized|invalid/i);
  });
});
