/*
 * @Author: dyb-dev
 * @Date: 2024-10-17 16:16:56
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 16:19:41
 * @FilePath: /uniapp-mp-wx-template/src/apis/interceptors/index.ts
 * @Description: api拦截器模块
 */

import { un } from "@uni-helper/uni-network"

/**
 * FUN: 设置接口拦截器
 *
 * @author dyb-dev
 * @date 17/10/2024/  16:17:31
 */
const setupApiInterceptor = () => {

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

export { setupApiInterceptor }
