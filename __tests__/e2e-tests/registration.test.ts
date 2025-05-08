import { describe, expect, test } from "bun:test";

import app from "../../src/app.ts";
import { SECURE_API_KEY } from "../../src/env.ts";

const urlPrefix = "/api/v1";

const registrationRequest = (
  body: URLSearchParams,
  url = "/api/v1/register/email-pass"
) => {
  return app.request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "x-secure-api-key": SECURE_API_KEY,
    },
    body: body.toString(),
  });
};

describe("Registration", () => {
  test("POST /register/email-pass with valid data", async () => {
    const formData = new URLSearchParams({
      name: `test ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: "test@example",
    });
    const res = await registrationRequest(formData);
    const jsonResponse = await res.json();
    expect(res.status).toBe(201);
    expect(jsonResponse.success).toBe(true);
  });

  test("POST /register/email-pass with missing fields", async () => {
    const formData = new URLSearchParams({
      name: "test name",
      password: "test@example",
    });
    const res = await registrationRequest(formData);
    const jsonResponse = await res.json();
    expect(res.status).toBe(400); // Bad Request
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe("Validation error");
    expect(jsonResponse.errors).toBeDefined();
    expect(jsonResponse.errors[0]).toEqual({
      field: "email",
      message: "Required",
    });
  });

  test("POST /register/email-pass with invalid email", async () => {
    const formData = new URLSearchParams({
      name: "test name",
      email: "invalid-email",
      password: "test@example",
    });
    const res = await registrationRequest(formData);
    const jsonResponse = await res.json();
    expect(res.status).toBe(400); // Bad Request
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe("Validation error");
    expect(jsonResponse.errors).toBeDefined();
    expect(jsonResponse.errors[0]).toEqual({
      field: "email",
      message: "Invalid email address",
    });
  });

  test("POST /register/email-pass with empty payload", async () => {
    const formData = new URLSearchParams({});
    const res = await registrationRequest(formData);
    const jsonResponse = await res.json();
    expect(res.status).toBe(400); // Bad Request
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe("Validation error");
  });
});
