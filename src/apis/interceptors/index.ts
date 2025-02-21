/*
 * @Author: dyb-dev
 * @Date: 2024-10-17 16:16:56
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 21:55:54
 * @FilePath: /uniapp-mp-wx-template/src/apis/interceptors/index.ts
 * @Description: Api 拦截器模块
 */

import { setupResponseInterceptor } from "./response"

/**
 * FUN: 设置接口拦截器
 *
 * @author dyb-dev
 * @date 17/10/2024/  16:17:31
 */
const setupApiInterceptor = () => {

    setupResponseInterceptor()

}

export { setupApiInterceptor }
