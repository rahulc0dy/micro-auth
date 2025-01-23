/**
 * HTTP status codes organized by category.
 * @constant {Object} STATUS
 * @property {Object} STATUS.SUCCESS - Success status codes.
 * @property {number} STATUS.SUCCESS.OK - Request succeeded (200).
 * @property {number} STATUS.SUCCESS.CREATED - Resource created (201).
 * @property {number} STATUS.SUCCESS.ACCEPTED - Request accepted for processing (202).
 * @property {number} STATUS.SUCCESS.NON_AUTHORITATIVE_INFORMATION - Information from another source (203).
 * @property {number} STATUS.SUCCESS.NO_CONTENT - No content to send for this request (204).
 * @property {number} STATUS.SUCCESS.RESET_CONTENT - Reset the view (e.g., form reset) (205).
 * @property {number} STATUS.SUCCESS.PARTIAL_CONTENT - Partial content (used in range requests) (206).
 *
 * @property {Object} STATUS.REDIRECTION - Redirection status codes.
 * @property {number} STATUS.REDIRECTION.MULTIPLE_CHOICES - Multiple options available (300).
 * @property {number} STATUS.REDIRECTION.MOVED_PERMANENTLY - Resource moved permanently (301).
 * @property {number} STATUS.REDIRECTION.FOUND - Resource temporarily located elsewhere (302).
 * @property {number} STATUS.REDIRECTION.SEE_OTHER - See another resource (303).
 * @property {number} STATUS.REDIRECTION.NOT_MODIFIED - Resource not modified since last request (304).
 * @property {number} STATUS.REDIRECTION.TEMPORARY_REDIRECT - Temporary redirect to another resource (307).
 * @property {number} STATUS.REDIRECTION.PERMANENT_REDIRECT - Permanent redirect (308).
 *
 * @property {Object} STATUS.CLIENT_ERROR - Client error status codes.
 * @property {number} STATUS.CLIENT_ERROR.BAD_REQUEST - Bad request (400).
 * @property {number} STATUS.CLIENT_ERROR.UNAUTHORIZED - Authentication required (401).
 * @property {number} STATUS.CLIENT_ERROR.PAYMENT_REQUIRED - Reserved for future use (402).
 * @property {number} STATUS.CLIENT_ERROR.FORBIDDEN - Access denied (403).
 * @property {number} STATUS.CLIENT_ERROR.NOT_FOUND - Resource not found (404).
 * @property {number} STATUS.CLIENT_ERROR.METHOD_NOT_ALLOWED - HTTP method not allowed (405).
 * @property {number} STATUS.CLIENT_ERROR.NOT_ACCEPTABLE - Content not acceptable (406).
 * @property {number} STATUS.CLIENT_ERROR.PROXY_AUTHENTICATION_REQUIRED - Proxy authentication required (407).
 * @property {number} STATUS.CLIENT_ERROR.REQUEST_TIMEOUT - Client did not produce a request in time (408).
 * @property {number} STATUS.CLIENT_ERROR.CONFLICT - Conflict in request (409).
 * @property {number} STATUS.CLIENT_ERROR.GONE - Resource no longer available (410).
 * @property {number} STATUS.CLIENT_ERROR.LENGTH_REQUIRED - Content-Length header required (411).
 * @property {number} STATUS.CLIENT_ERROR.PRECONDITION_FAILED - Precondition given in request failed (412).
 * @property {number} STATUS.CLIENT_ERROR.PAYLOAD_TOO_LARGE - Request entity too large (413).
 * @property {number} STATUS.CLIENT_ERROR.URI_TOO_LONG - URI too long (414).
 * @property {number} STATUS.CLIENT_ERROR.UNSUPPORTED_MEDIA_TYPE - Media type not supported (415).
 * @property {number} STATUS.CLIENT_ERROR.RANGE_NOT_SATISFIABLE - Requested range not satisfiable (416).
 * @property {number} STATUS.CLIENT_ERROR.EXPECTATION_FAILED - Expect header cannot be met (417).
 * @property {number} STATUS.CLIENT_ERROR.IM_A_TEAPOT - Easter egg status code (418).
 * @property {number} STATUS.CLIENT_ERROR.UNPROCESSABLE_ENTITY - Semantic errors in the request (422).
 * @property {number} STATUS.CLIENT_ERROR.TOO_MANY_REQUESTS - Rate limit exceeded (429).
 *
 * @property {Object} STATUS.SERVER_ERROR - Server error status codes.
 * @property {number} STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR - Generic server error (500).
 * @property {number} STATUS.SERVER_ERROR.NOT_IMPLEMENTED - Server does not support functionality (501).
 * @property {number} STATUS.SERVER_ERROR.BAD_GATEWAY - Invalid response from upstream server (502).
 * @property {number} STATUS.SERVER_ERROR.SERVICE_UNAVAILABLE - Server is down or overloaded (503).
 * @property {number} STATUS.SERVER_ERROR.GATEWAY_TIMEOUT - Upstream server timed out (504).
 * @property {number} STATUS.SERVER_ERROR.HTTP_VERSION_NOT_SUPPORTED - HTTP version not supported (505).
 */
export const STATUS = {
  SUCCESS: {
    // Request succeeded
    OK: 200,

    // Resource created
    CREATED: 201,

    // Request accepted for processing
    ACCEPTED: 202,

    // Information from another source
    NON_AUTHORITATIVE_INFORMATION: 203,

    // No content to send for this request
    NO_CONTENT: 204,

    // Reset the view (e.g., form reset)
    RESET_CONTENT: 205,

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

    // Resource not modified since last request
    NOT_MODIFIED: 304,

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
