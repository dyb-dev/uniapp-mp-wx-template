/*
 * @Author: dyb-dev
 * @Date: 2024-10-06 23:08:44
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-10 12:17:07
 * @FilePath: /uniapp-mp-wx-template/src/utils/device/index.ts
 * @Description: 设备相关工具函数
 */

/** STATIC: 设备信息 */
let systemInfo: UniApp.GetSystemInfoResult

/**
 * FUN: 获取系统信息
 *
 * @author dyb-dev
 * @date 06/10/2024/  23:13:50
 * @param {boolean} [isForceRefresh=false] 是否强制刷新
 * @returns {*} {UniApp.GetSystemInfoResult} 系统信息
 */
const getSystemInfo = (isForceRefresh = false) => {

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
const isDevTool = (): boolean => getSystemInfo()?.platform === "devtools"

/**
 * FUN: 是否启用调试
 *
 * @author dyb-dev
 * @date 09/10/2024/  22:02:43
 * @returns {*}  {boolean} 是否启用调试
 */
const isEnableDebug = (): boolean => isDevTool() ? true : getSystemInfo()?.enableDebug ?? false

export { getSystemInfo, isDevTool, isEnableDebug }
