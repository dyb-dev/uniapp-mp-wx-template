/*
 * @Author: dyb-dev
 * @Date: 2024-10-17 16:21:11
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 22:09:54
 * @FilePath: /uniapp-mp-wx-template/src/types/dts/api.d.ts
 * @Description: api 类型声明补充文件
 */

import type { UnResponse } from "@uni-helper/uni-network"

declare module "@uni-helper/uni-network" {
    interface UnResponse {
        /** 请求是否成功 */
        success: boolean
        /** 结果描述信息 */
        message: string
    }
}

declare global {
    /** 测试请求配置 */
    interface ITestRequestConfig<T extends Record<string, any> = Record<string, any>> {
        /** 是否启用测试模式 */
        test: boolean
        /** 测试模式下请求延迟时间 单位: 毫秒 */
        testDelay?: number
        /** 测试模式下请求结果 */
        testResult: TModifyProperties<Pick<UnResponse<T>, "success" | "message" | "data">, "data">
    }
}
