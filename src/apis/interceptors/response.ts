/*
 * @FileDesc: 响应拦截器模块
 */

import { un } from "@uni-helper/uni-network"

/**
 * FUN: 设置响应拦截器
 *
 * @author dyb-dev
 * @date 21/02/2025/  21:55:38
 */
export const setupResponseInterceptor = () => {

    // 设置响应拦截器
    un.interceptors.response.use(
        response => {

            response.success = response.errMsg?.includes("request:fail") ? false : true
            response.message = response.errMsg || (response.success ? "请求成功" : "请求失败")
            return response

        },
        undefined,
        { synchronous: true }
    )

}
