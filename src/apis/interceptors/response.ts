/*
 * @FileDesc: 响应拦截器模块
 */

import { un } from "@uni-helper/uni-network"

import { EApiResultCode } from "@/types"

import type { UnResponse } from "@uni-helper/uni-network"

/**
 * FUN: 设置响应拦截器
 *
 * @author dyb-dev
 * @date 21/02/2025/  21:55:38
 */
export const setupResponseInterceptor = () => {

    // 设置响应拦截器
    un.interceptors.response.use(
        // 2xx 范围内的状态码都会触发该函数
        response => {

            const isFail = response.errMsg?.includes("request:fail") ?? true

            if (isFail) {

                response.data = {
                    success: false,
                    code: EApiResultCode.INTERNAL_SERVER_ERROR,
                    message: "网络错误或无响应"
                }

            }

            return response

        },
        // 超出 2xx 范围的状态码都会触发该函数
        error => {

            const errorResponse: TModifyProperties<UnResponse<IApiResult>, "data", "required"> = error.response ?? { data: {} }

            if (!Number.isSafeInteger(errorResponse.data.code)) {

                errorResponse.data = {
                    success: false,
                    code: errorResponse.status || EApiResultCode.INTERNAL_SERVER_ERROR,
                    message: errorResponse.statusText || "网络错误或无响应"
                } as IApiResult

            }

            return Promise.reject(errorResponse)

        },
        { synchronous: true }
    )

}
