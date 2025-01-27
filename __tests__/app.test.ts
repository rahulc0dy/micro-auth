import { describe, test } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import app from "../src/app.ts";
import { SYS_INFO_KEY } from "../src/env.ts";

const urlPrefix = "/api/v1";

describe("App Health", () => {
  test("Should return server status.", async () => {
    const res = await app.request(`${urlPrefix}/health-check/server`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "Server running." });
  });

  test("Should return system info.", async () => {
    const res = await app.request(
      `${urlPrefix}/health-check/performance?sysInfoKey=${SYS_INFO_KEY}`,
    );

    expect(res.status).toBe(200);
    const jsonRes = await res.json();
    expect(jsonRes).toHaveProperty("memoryUsage");
    expect(jsonRes).toHaveProperty("memoryInfo");
    expect(jsonRes).toHaveProperty("timestamp");
    expect(jsonRes).toHaveProperty("uptime");
    expect(jsonRes).toHaveProperty("osRelease");
    expect(jsonRes).toHaveProperty("denoVersion");
    expect(jsonRes).toHaveProperty("networkInterfaces");
    expect(jsonRes).toHaveProperty("avgLoad");
  });

  test("Should return unauthorised error.", async () => {
    const res = await app.request(
      `${urlPrefix}/health-check/performance?sysInfoKey=somewrongvalue`,
    );
    const jsonRes = await res.json();

    expect(res.status).toBe(401);

    expect(jsonRes).toEqual({ success: false, error: "Unauthorised Request" });
  });
});
