/*
 * @Author: dyb-dev
 * @Date: 2025-02-21 21:54:48
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 21:55:25
 * @FilePath: /uniapp-mp-wx-template/src/apis/interceptors/response.ts
 * @Description: 响应拦截器模块
 */

import { un } from "@uni-helper/uni-network"

/**
 * FUN: 设置响应拦截器
 *
 * @author dyb-dev
 * @date 21/02/2025/  21:55:38
 */
const setupResponseInterceptor = () => {

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

export { setupResponseInterceptor }
