/*
 * @Author: dyb-dev
 * @Date: 2024-10-08 20:34:09
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-10 00:03:57
 * @FilePath: /uniapp-mp-wx-template/src/apis/index.ts
 * @Description: 接口模块
 */

/** 导出本次活动相关接口 */
export * from "./activity"
/** 导出用户信息相关接口 */
export * from "./userInfo"

import { un } from "@uni-helper/uni-network"

import { isDevEnv, isEnableDebug } from "@/utils"

/** STATIC: 是否启用 `api` 测试数据 如果在开发工具或手机开启调试下仍不需要使用测试数据，只需将 `true` 改为 `false` 即可 */
const ENABLE_API_TEST_DATA = isDevEnv() && isEnableDebug() && true

/**
 * FUN: 设置接口配置
 *
 * @author dyb-dev
 * @date 08/10/2024/  20:47:43
 */
const setupApi = () => {

    const { VITE_SERVER_URL, VITE_API_BASE_URL } = __PROJECT_INFO__.env

    // 设置请求基础路径
    un.defaults.baseUrl = VITE_SERVER_URL + VITE_API_BASE_URL

}

export { setupApi, ENABLE_API_TEST_DATA }
