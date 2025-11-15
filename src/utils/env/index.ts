/*
 * @FileDesc: 环境相关工具函数
 */

import { getEnvVersion } from "@/utils"

/** CONST: 设备信息 */
let systemInfo: UniApp.GetSystemInfoResult

/**
 * FUN: 获取系统信息
 *
 * @author dyb-dev
 * @date 06/10/2024/  23:13:50
 * @param {boolean} [isForceRefresh=false] 是否强制刷新
 * @returns {*} {UniApp.GetSystemInfoResult} 系统信息
 */
export const getSystemInfo = (isForceRefresh = false) => {

    // 如果已经获取过系统信息，且不是强制刷新，则直接返回
    if (systemInfo && !isForceRefresh) {

        return systemInfo

    }

    try {

        systemInfo = uni.getSystemInfoSync()

    }
    catch (error) {

        console.error("getSystemInfo()", error)

    }

    return systemInfo

}

/**
 * FUN: 是否为开发者工具
 *
 * @author dyb-dev
 * @date 06/10/2024/  23:15:36
 * @returns {*}  {boolean} 是否为开发者工具
 */
export const isDevTool = (): boolean => getSystemInfo()?.platform === "devtools"

/**
 * FUN: 是否启用调试
 *
 * @author dyb-dev
 * @date 09/10/2024/  22:02:43
 * @returns {*}  {boolean} 是否启用调试
 */
export const isEnableDebug = (): boolean => isDevTool() ? true : getSystemInfo()?.enableDebug ?? false

/**
 * FUN: 是否为开发环境
 *
 * @author dyb-dev
 * @date 09/10/2024/  17:34:47
 * @returns {*}  {boolean} 是否为开发环境
 */
export const isDevEnv = (): boolean => __PROJECT_INFO__.env.VITE_USER_NODE_ENV === "development"

/**
 * FUN: 获取当前服务器网址
 * - 小程序开发版和体验版 默认: `VITE_DEV_SERVER_URL`
 * - 小程序正式版 默认: `VITE_PROD_SERVER_URL`
 *
 * @author dyb-dev
 * @date 01/11/2024/  20:34:09
 * @returns {*} {string} 当前服务器网址
 */
export const getCurrentServerUrl = (): string => {

    const { VITE_DEV_SERVER_URL, VITE_PROD_SERVER_URL } = __PROJECT_INFO__.env
    return getEnvVersion() === "release" ? VITE_PROD_SERVER_URL : VITE_DEV_SERVER_URL

}
