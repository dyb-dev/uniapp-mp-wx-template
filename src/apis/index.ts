/*
 * @Author: dyb-dev
 * @Date: 2024-10-08 20:34:09
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-01 20:49:41
 * @FilePath: /uniapp-mp-wx-template/src/apis/index.ts
 * @Description: 接口模块
 */

/** 导出本次活动相关接口 */
export * from "./activity"
/** 导出用户信息相关接口 */
export * from "./userInfo"

import { un } from "@uni-helper/uni-network"

import { getCurrentServerUrl, isDevEnv } from "@/utils"

import { setupApiInterceptor } from "./interceptors"

/** CONST: 是否启用 `api` 测试数据 如果在开发环境下仍不需要使用测试数据，只需将 `true` 改为 `false` 即可 */
const ENABLE_API_TEST_DATA = isDevEnv() && true

/**
 * FUN: 设置接口配置
 *
 * @author dyb-dev
 * @date 08/10/2024/  20:47:43
 */
const setupApi = () => {

    const { VITE_API_BASE_URL } = __PROJECT_INFO__.env

    // 设置请求基础路径
    un.defaults.baseUrl = getCurrentServerUrl() + VITE_API_BASE_URL

    // 设置接口拦截器
    setupApiInterceptor()

}

export { ENABLE_API_TEST_DATA, setupApi }
