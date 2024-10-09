/*
 * @Author: dyb-dev
 * @Date: 2024-10-05 20:10:08
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-08 20:49:01
 * @FilePath: /uniapp-mp-wx-template/src/main.ts
 * @Description: 程序入口文件
 */

import { createSSRApp } from "vue"

import App from "@/App.vue"
import { setupComponent } from "@/components"
import { setupInterceptor } from "@/interceptors"
import { store } from "@/stores"

import { setupApi } from "./apis"

export function createApp() {

    const app = createSSRApp(App)
    // 使用商店
    app.use(store)
    // 初始化接口配置
    setupApi()
    // 初始化组件配置
    setupComponent()
    // 初始化拦截器配置
    setupInterceptor()

    return {
        app
    }

}
