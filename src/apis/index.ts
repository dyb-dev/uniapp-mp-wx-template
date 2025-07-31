/*
 * @Author: dyb-dev
 * @Date: 2024-10-08 20:34:09
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-07-31 23:12:24
 * @FilePath: /uniapp-mp-wx-template/src/apis/index.ts
 * @Description: 接口模块
 */

/** 导出接口模块 */
export * from "./modules"

import { un } from "@uni-helper/uni-network"

import { getCurrentServerUrl, isDevEnv } from "@/utils"

import { setupApiInterceptor } from "./interceptors"
import { setGlobalTestRequestConfig } from "./request"

/**
 * FUN: 设置接口配置
 *
 * @author dyb-dev
 * @date 08/10/2024/  20:47:43
 */
export const setupApi = () => {

    // 设置请求基础路径
    un.defaults.baseUrl = getCurrentServerUrl() + __PROJECT_INFO__.env.VITE_API_BASE_PATH

    // 设置接口拦截器
    setupApiInterceptor()

    // 设置全局测试请求配置
    setGlobalTestRequestConfig({
        test: isDevEnv() && true,
        testDelay: 500
    })

}
