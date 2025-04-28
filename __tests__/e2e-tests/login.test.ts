import { beforeAll, describe, expect, test } from "bun:test";
import app from "../../src/app.ts";

const urlPrefix = "/api/v1";

describe("Login", () => {
  // Create a test user that we can use for login tests
  let testEmail: string;
  const testPassword = "test@example";

  beforeAll(async () => {
    // Register a test user that we can use for login tests
    testEmail = `testlogin${Date.now()}@example.com`;
    const registrationFormData = new URLSearchParams({
      name: `Test Login User`,
      email: testEmail,
      password: testPassword,
    });

    const registerResponse = await app.request(
      `${urlPrefix}/register/email-pass`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: registrationFormData.toString(),
      }
    );

    const registerJson = await registerResponse.json();
    expect(registerResponse.status).toBe(201);
    expect(registerJson.success).toBe(true);
  });

  test("POST /login/email-pass with valid credentials", async () => {
    const formData = new URLSearchParams({
      email: testEmail,
      password: testPassword,
    });

    const res = await app.request(`${urlPrefix}/login/email-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const jsonResponse = await res.json();
    expect(res.status).toBe(200);
    expect(jsonResponse.success).toBe(true);
    expect(jsonResponse.message).toBe("Logged in successfully");
    expect(jsonResponse.data.email).toBe(testEmail);
  });

  test("POST /login/email-pass with non-existent email", async () => {
    const formData = new URLSearchParams({
      email: `nonexistent${Date.now()}@example.com`,
      password: "somepassword",
    });

    const res = await app.request(`${urlPrefix}/login/email-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const jsonResponse = await res.json();
    expect(res.status).toBe(400); // Bad Request
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe("User does not exist");
    expect(jsonResponse.errors).toBeDefined();
    expect(jsonResponse.errors[0].message).toBe("Email is not registered");
  });

  test("POST /login/email-pass with incorrect password", async () => {
    const formData = new URLSearchParams({
      email: testEmail,
      password: "wrong_password",
    });

    const res = await app.request(`${urlPrefix}/login/email-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const jsonResponse = await res.json();
    expect(res.status).toBe(400); // Bad Request
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe(
      "Incorrect email or password. Please try again."
    );
    expect(jsonResponse.errors).toBeDefined();
    expect(jsonResponse.errors[0].message).toBe(
      "email or password is incorrect"
    );
  });

  test("POST /login/email-pass with missing email", async () => {
    const formData = new URLSearchParams({
      password: "somepassword",
    });

    const res = await app.request(`${urlPrefix}/login/email-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const jsonResponse = await res.json();
    expect(res.status).toBe(400); // Bad Request
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe("Validation error");
    expect(jsonResponse.errors).toBeDefined();
    expect(
      jsonResponse.errors.some(
        (error: any) =>
          error.field === "email" && error.message.includes("Required")
      )
    ).toBe(true);
  });

  test("POST /login/email-pass with missing password", async () => {
    const formData = new URLSearchParams({
      email: testEmail,
    });

    const res = await app.request(`${urlPrefix}/login/email-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const jsonResponse = await res.json();
    expect(res.status).toBe(400); // Bad Request
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe("Validation error");
    expect(jsonResponse.errors).toBeDefined();
    expect(
      jsonResponse.errors.some(
        (error: any) =>
          error.field === "password" && error.message.includes("Required")
      )
    ).toBe(true);
  });

  test("POST /login/email-pass with invalid email format", async () => {
    const formData = new URLSearchParams({
      email: "invalid-email",
      password: "somepassword",
    });

    const res = await app.request(`${urlPrefix}/login/email-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const jsonResponse = await res.json();
    expect(res.status).toBe(400); // Bad Request
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe("Validation error");
    expect(jsonResponse.errors).toBeDefined();
    expect(
      jsonResponse.errors.some(
        (error: any) =>
          error.field === "email" && error.message.includes("Invalid")
      )
    ).toBe(true);
  });

  test("POST /login/email-pass with empty payload", async () => {
    const formData = new URLSearchParams({});

    const res = await app.request(`${urlPrefix}/login/email-pass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const jsonResponse = await res.json();
    expect(res.status).toBe(400); // Bad Request
    expect(jsonResponse.success).toBe(false);
    expect(jsonResponse.message).toBe("Validation error");
    expect(jsonResponse.errors).toBeDefined();
    expect(
      jsonResponse.errors.some(
        (error: any) =>
          error.field === "email" && error.message.includes("Required")
      )
    ).toBe(true);
    expect(
      jsonResponse.errors.some(
        (error: any) =>
          error.field === "password" && error.message.includes("Required")
      )
    ).toBe(true);
  });
});
