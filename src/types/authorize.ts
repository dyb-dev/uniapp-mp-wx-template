/*
 * @Author: dyb-dev
 * @Date: 2024-10-08 12:04:14
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-07-31 23:21:14
 * @FilePath: /uniapp-mp-wx-template/src/types/authorize.ts
 * @Description: 授权类型模块
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
