import {Context} from "hono";
import logger from "./logger.ts";
import {APP_ENV} from "../env.ts";
import {STATUS} from "../constants/statusCodes.ts";
import {z} from "zod";

const errorHandler = (err: unknown, c: Context) => {
  const isProduction = APP_ENV === "production";

  if (err instanceof z.ZodError) {
    // Log validation errors
    logger.error({
      level: "error",
      message: err.message,
      details: err.flatten(),
      method: c.req.method,
      url: c.req.url,
    });

    // Return validation error response
    return c.json(
      {
        success: false,
        message: "Failed to validate credentials.",
        errors: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
      STATUS.CLIENT_ERROR.BAD_REQUEST, // Bad Request
    );
  } else if (err instanceof Error) {
    // Log runtime errors
    logger.error({
      level: "error",
      message: err.message,
      stack: isProduction ? undefined : err.stack,
      method: c.req.method,
      url: c.req.url,
    });

    // Return internal server error response
    return c.json(
      {
        message: "Internal Server Error",
        error: isProduction ? "An unexpected error occurred" : err.message,
      },
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
    );
  } else {
    // Log unknown errors
    logger.error({
      level: "error",
      message: "Unknown error occurred",
      details: err,
      method: c.req.method,
      url: c.req.url,
    });

    return c.json(
      {
        message: "Internal Server Error",
        error: isProduction
          ? "An unexpected error occurred"
          : "Unknown error occurred",
      },
      STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
    );
  }
};

export default errorHandler;
