/*
 * @FileDesc: API 类型模块
 */

/** 通用 API 请求结果业务码 */
export const enum EApiResultCode {
    /** 成功 */
    Success = 0,

    /** CSRF 令牌无效 */
    CsrfTokenInvalid = 1001,
    /** 请求限流 */
    RateLimitExceeded = 1002,
    /** 重放请求已拒绝 */
    ReplayRequestRejected = 1003,

    /** 访问令牌无效 */
    AccessTokenInvalid = 2001,
    /** 刷新令牌无效 */
    RefreshTokenInvalid = 2002,
    /** 权限不足 */
    InsufficientPermissions = 2003,

    /** 参数验证错误 */
    ParameterValidationError = 4001,
    /** 业务逻辑错误 */
    BusinessLogicError = 4002,
    /** 加解密操作错误 */
    CryptoOperationError = 4003,

    /** 服务器内部错误 */
    InternalServerError = 5000,
    /** 数据访问错误 */
    DataAccessError = 5001,
    /** 健康检查失败 */
    HealthCheckFailed = 5002,

    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    EARLYHINTS = 103,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    MULTI_STATUS = 207,
    ALREADY_REPORTED = 208,
    CONTENT_DIFFERENT = 210,
    AMBIGUOUS = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    REQUESTED_RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    I_AM_A_TEAPOT = 418,
    MISDIRECTED = 421,
    UNPROCESSABLE_ENTITY = 422,
    LOCKED = 423,
    FAILED_DEPENDENCY = 424,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    UNRECOVERABLE_ERROR = 456,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505,
    INSUFFICIENT_STORAGE = 507,
    LOOP_DETECTED = 508
}
