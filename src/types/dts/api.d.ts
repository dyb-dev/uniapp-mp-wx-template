/*
 * @FileDesc: api 类型声明补充文件
 */

import type { EApiResultCode } from "@/types"

declare global {
    /** 通用 API 请求结果 */
    interface IApiResult<T = unknown> {
        /** 是否成功 */
        success: boolean
        /** 业务码 */
        code: EApiResultCode
        /** 消息 */
        message: string
        /** 数据 */
        data: T
        /** 请求 ID */
        requestId: string
    }

    /** 测试请求配置 */
    interface ITestRequestConfig<T = unknown> {
        /** 是否启用测试模式 */
        test: boolean
        /** 测试模式下请求延迟时间 单位: 毫秒 */
        testDelay?: number
        /** 测试模式下请求结果 */
        testResult: TModifyProperties<IApiResult<T>, "data" | "requestId">
    }
}
