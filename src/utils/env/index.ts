/*
 * @Author: dyb-dev
 * @Date: 2024-10-09 22:15:17
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-01 20:42:26
 * @FilePath: /uniapp-mp-wx-template/src/utils/env/index.ts
 * @Description: 环境相关工具函数
 */

import { getEnvVersion } from "@/utils"

/**
 * FUN: 是否为开发环境
 *
 * @author dyb-dev
 * @date 09/10/2024/  17:34:47
 * @returns {*}  {boolean} 是否为开发环境
 */
const isDevEnv = (): boolean => __PROJECT_INFO__.env.VITE_USER_NODE_ENV === "development"

/**
 * FUN: 获取当前服务器网址
 * - 小程序开发版和体验版 默认: `VITE_DEV_SERVER_URL`
 * - 小程序正式版 默认: `VITE_PROD_SERVER_URL`
 *
 * @author dyb-dev
 * @date 01/11/2024/  20:34:09
 * @returns {*} {string} 当前服务器网址
 */
const getCurrentServerUrl = (): string => {

    const { VITE_DEV_SERVER_URL, VITE_PROD_SERVER_URL } = __PROJECT_INFO__.env
    return getEnvVersion() === "release" ? VITE_PROD_SERVER_URL : VITE_DEV_SERVER_URL

}

export { isDevEnv, getCurrentServerUrl }
