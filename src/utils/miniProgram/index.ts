/*
 * @Author: dyb-dev
 * @Date: 2024-10-09 22:19:06
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-09 22:26:56
 * @FilePath: /uniapp-mp-wx-template/src/utils/miniProgram/index.ts
 * @Description: 小程序相关工具函数
 */

/** STATIC: 设备信息 */
let accountInfo: UniApp.AccountInfo

/**
 * FUN: 获取账号信息
 *
 * @author dyb-dev
 * @date 09/10/2024/  22:23:47
 * @param {boolean} [isForceRefresh=false] 是否强制刷新
 * @returns {*} 账号信息
 */
const getAccountInfo = (isForceRefresh: boolean = false): UniApp.AccountInfo => {

    // 如果已经获取过系统信息，且不是强制刷新，则直接返回
    if (accountInfo && !isForceRefresh) {

        return accountInfo

    }

    try {

        accountInfo = uni.getAccountInfoSync()

    }
    catch (error) {

        console.error("getAccountInfo()", error)

    }

    return accountInfo

}

/**
 * FUN: 获取小程序环境版本
 * - develop: 开发版 trial: 体验版 release: 正式版
 *
 * @author dyb-dev
 * @date 09/10/2024/  22:23:35
 * @returns {*}  {string} 小程序环境版本
 */
const getEnvVersion = (): string => getAccountInfo()?.miniProgram.envVersion

/**
 * FUN: 获取小程序线上版本
 * - 线上小程序版本号（仅在正式版小程序上支持）
 *
 * @author dyb-dev
 * @date 09/10/2024/  22:23:41
 * @returns {*}  {string} 小程序线上版本
 */
const getOnlineVersion = (): string => getAccountInfo()?.miniProgram.version

export { getAccountInfo, getEnvVersion, getOnlineVersion }
