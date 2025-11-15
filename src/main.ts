/*
 * @FileDesc: 程序入口文件
 */

import { createSSRApp } from "vue"

import { setupApi } from "@/apis"
import App from "@/App.vue"
import { setupRouterInterceptor } from "@/routerInterceptor"
import { store } from "@/stores"

import "virtual:uno.css"

export function createApp () {

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
