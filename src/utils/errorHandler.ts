import type { Context } from "hono";
import logger from "./logger.ts";
import { APP_ENV } from "../env.ts";
import { STATUS } from "../constants/statusCodes.ts";
import { z } from "zod";
import { ApiResponse } from "./ApiResponse.ts";
import { ApiError } from "./ApiError.ts";

const errorHandler = (err: unknown, c: Context) => {
  const isProd = APP_ENV === "production";
  const { method, url } = { method: c.req.method, url: c.req.url };

  // 1) Zod validation errors
  if (err instanceof z.ZodError) {
    logger.error({
      level: "error",
      message: "Validation failed",
      details: err.flatten(),
      method,
      url,
    });

    const formatted = err.errors.map((e) => ({
      field: e.path.join(".") || undefined,
      message: e.message,
    }));

    return c.json(
      new ApiResponse({
        success: false,
        message: "Validation error",
        errors: formatted,
      }),
      STATUS.CLIENT_ERROR.BAD_REQUEST
    );
  }

  // 2) Our standardized API errors
  if (err instanceof ApiError) {
    logger.error({
      level: "error",
      message: err.message,
      details: err.errors,
      stack: isProd ? undefined : err.stack,
      method,
      url,
    });

    return c.json(
      new ApiResponse({
        success: false,
        message: err.message,
        errors: err.errors,
      }),
      err.statusCode
    );
  }

  // 3) Other runtime Errors
  if (err instanceof Error) {
    logger.error({
      level: "error",
      message: err.message,
      stack: isProd ? undefined : err.stack,
      method,
      url,
    });

    // In prod: hide details; in dev: echo the message
    const message = isProd ? "Internal Server Error" : err.message;
    const errors = isProd
      ? [{ message: "An unexpected error occurred" }]
      : [{ message: err.message }];

    return c.json(
      new ApiResponse({
        success: false,
        message,
        errors,
      }),
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR
    );
  }

  // 4) Non-Error throwables
  logger.error({
    level: "error",
    message: "Unknown error type thrown",
    details: err,
    method,
    url,
  });

  return c.json(
    new ApiResponse({
      success: false,
      message: "Internal Server Error",
      errors: [{ message: "Unknown error occurred" }],
    }),
    STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR
  );
};

export default errorHandler;
