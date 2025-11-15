/*
 * @FileDesc: 小程序相关工具函数
 */

import pagesJson from "@/pages.json"

/** CONST: 设备信息 */
let accountInfo: UniApp.AccountInfo

/**
 * FUN: 获取账号信息
 *
 * @author dyb-dev
 * @date 09/10/2024/  22:23:47
 * @param {boolean} [isForceRefresh=false] 是否强制刷新
 * @returns {*} 账号信息
 */
export const getAccountInfo = (isForceRefresh: boolean = false): UniApp.AccountInfo => {

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
 * - 开发版: develop
 * - 体验版: trial
 * - 正式版: release
 *
 * @author dyb-dev
 * @date 01/11/2024/  20:34:23
 * @returns {*} {string} 小程序环境版本
 */
export const getEnvVersion = () => getAccountInfo()?.miniProgram.envVersion

/**
 * FUN: 获取小程序线上版本
 * - 线上小程序版本号（仅在正式版小程序上支持）
 *
 * @author dyb-dev
 * @date 09/10/2024/  22:23:41
 * @returns {*}  {string} 小程序线上版本
 */
export const getOnlineVersion = (): string => getAccountInfo()?.miniProgram.version

/** LET: 胶囊按钮区域 */
let capsuleBoundingClientRect: UniApp.GetMenuButtonBoundingClientRectRes | null = null

/**
 * FUN: 获取胶囊按钮区域
 *
 * @author dyb-dev
 * @date 02/12/2024/  20:21:12
 * @param {boolean} [isForceRefresh=false] 是否强制刷新
 * @returns {*}  {(UniApp.GetMenuButtonBoundingClientRectRes | null)} 胶囊按钮区域
 */
export const getCapsuleBoundingClientRect = (isForceRefresh = false): UniApp.GetMenuButtonBoundingClientRectRes | null => {

    // @ts-ignore 是否开启 自定义导航栏
    const _isCustomNavigationBar = pagesJson?.globalStyle?.navigationStyle === "custom"

    // 如果没有开启自定义导航栏, 进行警告提示
    !_isCustomNavigationBar && console.warn("getCapsuleBoundingClientRect() 未开启自定义导航栏, 不需要获取菜单按钮区域")

    // 如果已经获取过系统信息，且不是强制刷新，则直接返回
    if (capsuleBoundingClientRect && !isForceRefresh) {

        return capsuleBoundingClientRect

    }

    try {

        capsuleBoundingClientRect = uni.getMenuButtonBoundingClientRect()

    }
    catch (error) {

        console.error("getCapsuleBoundingClientRect()", error)

    }

    return capsuleBoundingClientRect

}
