import {describe, test} from "jsr:@std/testing/bdd";
import {expect} from "jsr:@std/expect";
import app from "../src/app.ts";

const urlPrefix = "/api/v1";

describe("Registration", () => {
  test("POST /register/email-pass with valid data", async () => {
    const formData = new URLSearchParams({
      name: "test name",
      email: "test@example.com",
      password: "test@example",
    });
    const res = await app.request(`${urlPrefix}/register/email-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });
    const jsonResponse = await res.json();
    expect(res.status).toBe(200);
    expect(jsonResponse.success).toBe(true);
  });

  test("POST /register/email-pass with missing fields", async () => {
    const formData = new URLSearchParams({
      name: "test name",
      password: "test@example",
    });
    const res = await app.request(`${urlPrefix}/register/email-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });
    const jsonResponse = await res.json();
    expect(res.status).toBe(400); // Bad Request
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe("Failed to validate credentials.");
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
    const res = await app.request(`${urlPrefix}/register/email-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });
    const jsonResponse = await res.json();
    expect(res.status).toBe(400); // Bad Request
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe("Failed to validate credentials.");
    expect(jsonResponse.errors).toBeDefined();
    expect(jsonResponse.errors[0]).toEqual({
      "field": "email",
      "message": "Invalid email address",
    });
  });

  test("POST /register/email-pass with empty payload", async () => {
    const formData = new URLSearchParams({});
    const res = await app.request(`${urlPrefix}/register/email-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });
    const jsonResponse = await res.json();
    expect(res.status).toBe(400); // Bad Request
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe("Failed to validate credentials.");
  });
});
