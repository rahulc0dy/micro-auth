import { describe, expect, test } from "bun:test";
import { ApiResponse } from "../../src/utils/ApiResponse.ts";

describe("ApiResponse Unit Tests", () => {
  test("should default success to true and require data", () => {
    const response = new ApiResponse({
      data: { user: "John Doe" },
      message: "User data retrieved successfully.",
    });

    expect(response.success).toBe(true);
    expect(response.data).toEqual({ user: "John Doe" });
    expect(response.errors).toBeUndefined();
  });

  test("should allow explicit success true and require data", () => {
    const response = new ApiResponse({
      success: true,
      data: { user: "Jane Doe" },
      message: "Data returned successfully.",
    });

    expect(response.success).toBe(true);
    expect(response.data).toEqual({ user: "Jane Doe" });
    expect(response.errors).toBeUndefined();
  });

  test("should require errors when success is false", () => {
    const response = new ApiResponse({
      success: false,
      errors: { code: 404, detail: "User not found." },
      message: "User lookup failed.",
    });

    expect(response.success).toBe(false);
    expect(response.errors).toEqual({ code: 404, detail: "User not found." });
    expect(response.data).toBeUndefined();
  });

  test("should default to message 'Success.' when a message is not provided for a successful response", () => {
    const response = new ApiResponse({
      data: { id: 1 },
    });

    expect(response.success).toBe(true);
    expect(response.message).toBe("Success.");
  });

  test("should default to message 'An error occurred.' when a message is not provided for a failed response", () => {
    const response = new ApiResponse({
      success: false,
      errors: { error: "Unexpected error" },
    });

    expect(response.success).toBe(false);
    expect(response.message).toBe("An error occurred.");
  });
});
