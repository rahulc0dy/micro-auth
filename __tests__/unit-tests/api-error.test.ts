import { describe, expect, test } from "bun:test";

import { STATUS } from "../../src/constants/status-codes.ts";
import { ApiError } from "../../src/utils/api-error.ts";

describe("ApiError", () => {
  test("should create an ApiError with object constructor", () => {
    const errorMessage = "Test error message";
    const errorDetails = [{ field: "email", message: "Invalid email format" }];

    const error = new ApiError({
      message: errorMessage,
      statusCode: STATUS.CLIENT_ERROR.BAD_REQUEST,
      errors: errorDetails,
    });

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(errorMessage);
    expect(error.statusCode).toBe(STATUS.CLIENT_ERROR.BAD_REQUEST);
    expect(error.errors).toEqual(errorDetails);
    expect(error.name).toBe("ApiError");
  });

  test("should create an ApiError with primitive parameters", () => {
    const errorMessage = "Test error message";
    const errorDetails = [{ field: "password", message: "Password too short" }];

    const error = new ApiError(
      errorMessage,
      STATUS.CLIENT_ERROR.UNAUTHORIZED,
      errorDetails
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe(errorMessage);
    expect(error.statusCode).toBe(STATUS.CLIENT_ERROR.UNAUTHORIZED);
    expect(error.errors).toEqual(errorDetails);
    expect(error.name).toBe("ApiError");
  });

  test("should use default status code if not provided", () => {
    const error = new ApiError("Error without status code");

    expect(error.statusCode).toBe(STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR);
  });

  test("should use message as default error detail if none provided", () => {
    const errorMessage = "Default error detail";
    const error = new ApiError(errorMessage);

    expect(error.errors).toEqual([{ message: errorMessage }]);
  });

  test("should handle object constructor with default values", () => {
    const errorMessage = "Object constructor defaults";
    const error = new ApiError({
      message: errorMessage,
      errors: [],
      statusCode: STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
    });

    expect(error.statusCode).toBe(STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR);
    expect(error.errors).toEqual([{ message: errorMessage }]);
  });

  test("should handle empty string message", () => {
    const error = new ApiError("");
    expect(error.message).toBe("");
    expect(error.errors).toEqual([{ message: "" }]);
  });

  test("should handle cause in options", () => {
    const cause = new Error("Original error");
    const error = new ApiError("Error with cause", undefined, undefined, {
      cause,
    });

    expect(error.cause).toBe(cause);
  });

  test("should handle cause in object constructor options", () => {
    const cause = new Error("Original error");
    const error = new ApiError({
      message: "Error with cause in object constructor",
      errors: [{ message: "Something went wrong" }],
      options: { cause },
      statusCode: STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
    });

    expect(error.cause).toBe(cause);
  });

  test("should preserve stack trace with cause", () => {
    const cause = new Error("Original error");
    const error = new ApiError("Error with cause", undefined, undefined, {
      cause,
    });

    expect(error.cause).toBe(cause);
    // Check that error stack includes reference to cause
    expect(error.stack).toContain("ApiError: Error with cause");
  });
});
