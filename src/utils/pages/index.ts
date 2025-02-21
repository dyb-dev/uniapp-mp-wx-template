/*
 * @Author: dyb-dev
 * @Date: 2024-10-05 20:49:07
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-10 11:29:40
 * @FilePath: /uniapp-mp-wx-template/src/utils/pages/index.ts
 * @Description: 页面相关工具函数
 */

/** 导出页面跳转相关工具函数 */
export * from "./navigate"

import queryString from "query-string"

import pagesJson from "@/pages.json"

import { trimUrlSlashes } from "../url"

import type { PageMetaDatum } from "@uni-helper/vite-plugin-uni-pages"

/**
 * FUN: 获取当前页面实例
 * - 确保在页面 onLoad 之后调用
 * - 不要在 App.onLaunch 或者 App.onShow 的时候调用 getCurrentPages()，此时 page 还没有生成
 *
 * @author dyb-dev
 * @date 05/10/2024/  20:54:47
 * @export
 * @returns {*} 当前页面实例
 */
const getCurrentPageInstance = () => {

    const _pages = getCurrentPages() as WechatMiniprogram.Page.Instance<
        WechatMiniprogram.IAnyObject,
        WechatMiniprogram.IAnyObject
    >[]
    return _pages[_pages.length - 1]

}

/**
 * FUN: 获取当前页面的路径
 * - 确保在页面 onLoad 之后调用
 * - 不要在 App.onLaunch 或者 App.onShow 的时候调用 getCurrentPages()，此时 page 还没有生成
 * - H5 平台不支持这种方式获取
 *
 * @author dyb-dev
 * @date 05/10/2024/  21:09:23
 * @returns {*} 当前页面路径
 */
const getCurrentPagePath = () => getCurrentPageInstance().route

/**
 * FUN: 获取当前页面的完整路径
 * - 确保在页面 onLoad 之后调用
 * - 不要在 App.onLaunch 或者 App.onShow 的时候调用 getCurrentPages()，此时 page 还没有生成
 * - H5 平台不支持这种方式获取
 *
 * @author dyb-dev
 * @date 05/10/2024/  21:11:26
 * @returns {*} 当前页面完整路径
 */
const getCurrentPageFullPath = () => `${getCurrentPagePath()}?${getCurrentPageSearch()}`

/**
 * FUN: 获取当前页面的 query 参数
 * - 确保在页面 onLoad 之后调用
 * - 不要在 App.onLaunch 或者 App.onShow 的时候调用 getCurrentPages()，此时 page 还没有生成
 * - H5 平台不支持这种方式获取
 *
 * @author dyb-dev
 * @date 05/10/2024/  21:03:56
 * @returns {*} 当前页面的 query 参数
 */
const getCurrentPageQuery = () => getCurrentPageInstance()?.options || {}

/**
 * FUN: 获取当前页面的 search 参数
 * - 确保在页面 onLoad 之后调用
 * - 不要在 App.onLaunch 或者 App.onShow 的时候调用 getCurrentPages()，此时 page 还没有生成
 * - H5 平台不支持这种方式获取
 *
 * @author dyb-dev
 * @date 05/10/2024/  21:07:28
 * @returns {*} 当前页面 search 参数
 */
const getCurrentPageSearch = () => queryString.stringify(getCurrentPageQuery(), { encode: false })

const { VITE_SUB_PACKAGE_DIR, VITE_PAGE_DIR } = __PROJECT_INFO__.env

/** CONST: 分包页面路径正则表达式 */
const SUB_PACKAGE_PAGE_PATH_REGEX = new RegExp(`^(${VITE_SUB_PACKAGE_DIR}(?:\\/[^\\/]+)*)\\/((${VITE_PAGE_DIR}\\/.*))`)

/**
 * FUN: 获取页面配置
 * - `pagePath`示例: "pages/home" 或 "subPackages/webview/pages/webview"
 *
 * @author dyb-dev
 * @date 06/10/2024/  15:00:21
 * @param {string} pagePath 页面路径
 * @returns {*} 页面配置
 */
const getPageConfig = (pagePath: string): PageMetaDatum | void => {

    // 如果路径开头携带斜杠，则去除开头的斜杠
    pagePath = trimUrlSlashes(pagePath, { trimStart: true })

    // 匹配分包页面并提取结果
    const _result = pagePath.match(SUB_PACKAGE_PAGE_PATH_REGEX)

    // 如果匹配分包页面结果为空，则尝试匹配主包页面
    if (!_result) {

        return pagesJson?.pages.find((item: PageMetaDatum) => item.path === pagePath)

    }

    /** 分包根路径 */
    const _subPackagesRootPath = _result[1] || ""
    /** 分包页面路径 */
    const _subPackagesPagePath = _result[2] || ""

    /** 分包配置 */
    const _subPackageConfig = pagesJson?.subPackages.find(item => item.root === _subPackagesRootPath)

    return _subPackageConfig?.pages.find((item: PageMetaDatum) => item.path === _subPackagesPagePath)

}

/**
 * FUN: 获取当前页面配置
 *
 * @author dyb-dev
 * @date 06/10/2024/  15:01:07
 * @returns {*} 当前页面配置
 */
const getCurrentPageConfig = (): PageMetaDatum | void => getPageConfig(getCurrentPagePath())

export {
    getCurrentPageInstance,
    getCurrentPagePath,
    getCurrentPageFullPath,
    getCurrentPageQuery,
    getCurrentPageSearch,
    getPageConfig,
    getCurrentPageConfig
}
