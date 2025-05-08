import type { ContentfulStatusCode } from "hono/utils/http-status";

import { STATUS } from "../constants/status-codes.ts";

interface ApiErrorParams {
  message: string;
  statusCode: ContentfulStatusCode;
  errors: ApiErrorDetail[];
  options?: { cause?: unknown };
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export class ApiError extends Error {
  public readonly statusCode: ContentfulStatusCode;
  public readonly errors: ApiErrorDetail[];

  // Overload A: object form
  constructor(params: ApiErrorParams);
  // Overload B: primitive parameters form
  constructor(
    message: string,
    statusCode?: ContentfulStatusCode,
    errors?: ApiErrorDetail[],
    options?: { cause?: unknown }
  );

  constructor(
    arg1: string | ApiErrorParams,
    statusCode?: ContentfulStatusCode,
    errors?: ApiErrorDetail[],
    options?: { cause?: unknown }
  ) {
    // Determine which signature was intended
    if (typeof arg1 === "string") {
      // B: (message, statusCode, errors, options)
      super(arg1, options);
      this.statusCode = statusCode ?? STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR;
      this.errors = errors && errors.length ? errors : [{ message: arg1 }];
    } else {
      // A: ({ message, statusCode, errors, options })
      super(arg1.message, arg1.options);
      this.statusCode =
        arg1.statusCode ?? STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR;
      this.errors =
        arg1.errors && arg1.errors.length
          ? arg1.errors
          : [{ message: arg1.message }];
    }
    this.name = "ApiError"; // ensure instanceof and toString identify it
  }
}
