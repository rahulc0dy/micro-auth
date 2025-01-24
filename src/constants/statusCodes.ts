import { ContentfulStatusCode } from "hono/utils/http-status";

export const STATUS: Record<string, Record<string, ContentfulStatusCode>> = {
  SUCCESS: {
    // Request succeeded
    OK: 200,

    // Resource created
    CREATED: 201,

    // Request accepted for processing
    ACCEPTED: 202,

    // Information from another source
    NON_AUTHORITATIVE_INFORMATION: 203,

    // Partial content (used in range requests)
    PARTIAL_CONTENT: 206,
  },
  REDIRECTION: {
    // Multiple options available
    MULTIPLE_CHOICES: 300,

    // Resource moved permanently
    MOVED_PERMANENTLY: 301,

    // Resource temporarily located elsewhere
    FOUND: 302,

    // See another resource (e.g., for POST/GET)
    SEE_OTHER: 303,

    // Temporary redirect to another resource
    TEMPORARY_REDIRECT: 307,

    // Permanent redirect
    PERMANENT_REDIRECT: 308,
  },

  CLIENT_ERROR: {
    // Bad request
    BAD_REQUEST: 400,

    // Authentication required
    UNAUTHORIZED: 401,

    // Reserved for future use
    PAYMENT_REQUIRED: 402,

    // Access denied
    FORBIDDEN: 403,

    // Resource not found
    NOT_FOUND: 404,

    // HTTP method not allowed
    METHOD_NOT_ALLOWED: 405,

    // Content not acceptable
    NOT_ACCEPTABLE: 406,

    // Proxy authentication required
    PROXY_AUTHENTICATION_REQUIRED: 407,

    // Client did not produce a request in time
    REQUEST_TIMEOUT: 408,

    // Conflict in request (e.g., duplicate data)
    CONFLICT: 409,

    // Resource no longer available
    GONE: 410,

    // Content-Length header required
    LENGTH_REQUIRED: 411,

    // Precondition failed
    PRECONDITION_FAILED: 412,

    // Request entity too large
    PAYLOAD_TOO_LARGE: 413,

    // URI too long
    URI_TOO_LONG: 414,

    // Media type not supported
    UNSUPPORTED_MEDIA_TYPE: 415,

    // Requested range not satisfiable
    RANGE_NOT_SATISFIABLE: 416,

    // Expect header cannot be met
    EXPECTATION_FAILED: 417,

    // Easter egg status code
    IM_A_TEAPOT: 418,

    // Semantic errors in the request
    UNPROCESSABLE_ENTITY: 422,

    // Rate limit exceeded
    TOO_MANY_REQUESTS: 429,
  },
  SERVER_ERROR: {
    // Generic server error
    INTERNAL_SERVER_ERROR: 500,

    // Server does not support functionality
    NOT_IMPLEMENTED: 501,

    // Invalid response from upstream server
    BAD_GATEWAY: 502,

    // Server is down or overloaded
    SERVICE_UNAVAILABLE: 503,

    // Upstream server timed out
    GATEWAY_TIMEOUT: 504,

    // HTTP version not supported
    HTTP_VERSION_NOT_SUPPORTED: 505,
  },
};
