/*
 * @FileDesc: 授权类型模块
 */

/** 授权错误码 */
export const enum EAuthErrorCode {
    /** 拒绝授权 */
    DENIED = 1,
    /** 未登录 */
    NOT_LOGGED_IN,
    /** 接口调用失败 */
    API_FAILED
}

/** 授权错误回调参数 */
export interface IAuthErrorOptions {
    /** 授权错误码 */
    code: EAuthErrorCode
    /** 授权错误信息 */
    message: string
}
