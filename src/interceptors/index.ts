/*
 * @Author: dyb-dev
 * @Date: 2024-09-18 17:52:46
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-08 12:23:30
 * @FilePath: /uniapp-mp-wx-template/src/interceptors/index.ts
 * @Description: 拦截器模块
 */

import { setupRouterInterceptor } from "./router"

/**
 * FUN: 设置全局拦截器
 *
 * @author dyb-dev
 * @date 02/10/2024/  15:00:25
 */
const setupInterceptor = () => {

    setupRouterInterceptor()

}

export { setupInterceptor }
