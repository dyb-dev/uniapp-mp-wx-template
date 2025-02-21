/*
 * @Author: dyb-dev
 * @Date: 2024-10-05 20:10:08
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 21:43:32
 * @FilePath: /uniapp-mp-wx-template/src/main.ts
 * @Description: 程序入口文件
 */

import { createSSRApp } from "vue"

import App from "@/App.vue"
import { setupRouterInterceptor } from "@/routerInterceptor"
import { store } from "@/stores"

import { setupApi } from "./apis"

export function createApp() {

    const app = createSSRApp(App)
    // 使用商店
    app.use(store)
    // 初始化接口配置
    setupApi()
    // 初始化路由拦截器
    setupRouterInterceptor()

    return {
        app
    }

}
