/**
//  * HTTP Status Codes categorized by response type
//  * @example
//  * import { STATUS } from './statusCodes';
//  *
//  * console.log(STATUS.SUCCESS.OK); // 200
//  */
import { ContentfulStatusCode } from "hono/utils/http-status";

export const STATUS = {
  CLIENT_ERROR: {
    BAD_REQUEST: 400 as ContentfulStatusCode,
    UNAUTHORIZED: 401 as ContentfulStatusCode,
    PAYMENT_REQUIRED: 402 as ContentfulStatusCode,
    FORBIDDEN: 403 as ContentfulStatusCode,
    NOT_FOUND: 404 as ContentfulStatusCode,
    METHOD_NOT_ALLOWED: 405 as ContentfulStatusCode,
    NOT_ACCEPTABLE: 406 as ContentfulStatusCode,
    PROXY_AUTHENTICATION_REQUIRED: 407 as ContentfulStatusCode,
    REQUEST_TIMEOUT: 408 as ContentfulStatusCode,
    CONFLICT: 409 as ContentfulStatusCode,
    GONE: 410 as ContentfulStatusCode,
    LENGTH_REQUIRED: 411 as ContentfulStatusCode,
    PRECONDITION_FAILED: 412 as ContentfulStatusCode,
    PAYLOAD_TOO_LARGE: 413 as ContentfulStatusCode,
    URI_TOO_LONG: 414 as ContentfulStatusCode,
    UNSUPPORTED_MEDIA_TYPE: 415 as ContentfulStatusCode,
    RANGE_NOT_SATISFIABLE: 416 as ContentfulStatusCode,
    EXPECTATION_FAILED: 417 as ContentfulStatusCode,
    IM_A_TEAPOT: 418 as ContentfulStatusCode,
    UNPROCESSABLE_ENTITY: 422 as ContentfulStatusCode,
    TOO_MANY_REQUESTS: 429 as ContentfulStatusCode,
  },
  REDIRECTION: {
    MULTIPLE_CHOICES: 300 as ContentfulStatusCode,
    MOVED_PERMANENTLY: 301 as ContentfulStatusCode,
    FOUND: 302 as ContentfulStatusCode,
    SEE_OTHER: 303 as ContentfulStatusCode,
    TEMPORARY_REDIRECT: 307 as ContentfulStatusCode,
    PERMANENT_REDIRECT: 308 as ContentfulStatusCode,
  },
  SERVER_ERROR: {
    INTERNAL_SERVER_ERROR: 500 as ContentfulStatusCode,
    NOT_IMPLEMENTED: 501 as ContentfulStatusCode,
    BAD_GATEWAY: 502 as ContentfulStatusCode,
    SERVICE_UNAVAILABLE: 503 as ContentfulStatusCode,
    GATEWAY_TIMEOUT: 504 as ContentfulStatusCode,
    HTTP_VERSION_NOT_SUPPORTED: 505 as ContentfulStatusCode,
  },
  SUCCESS: {
    OK: 200 as ContentfulStatusCode,
    CREATED: 201 as ContentfulStatusCode,
    ACCEPTED: 202 as ContentfulStatusCode,
    NON_AUTHORITATIVE_INFORMATION: 203 as ContentfulStatusCode,
    PARTIAL_CONTENT: 206 as ContentfulStatusCode,
  },
};
