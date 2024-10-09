/*
 * @Author: dyb-dev
 * @Date: 2024-10-05 20:49:51
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-08 11:25:43
 * @FilePath: /uniapp-mp-wx-template/src/utils/pages/navigate.ts
 * @Description: 页面跳转相关工具函数
 */

import queryString from "query-string"

import pagesJson from "@/pages.json"
import { getUrlQuery, replaceUrlParamByObj, getCurrentPagePath } from "@/utils"

import type { TabBarItem } from "@uni-helper/vite-plugin-uni-pages"

/** 导航方法的基础选项 */
interface INavigateBaseOptions {
    /**
     * 跳转的路径
     */
    path: string
    /**
     * 需要传递的参数
     */
    query?: Record<string, string>
    /**
     * 是否对参数进行 encodeURIComponent 编码，默认: false
     */
    enCode?: boolean
    /**
     * 打开成功的回调函数
     *
     * @param result
     * @returns
     */
    success?: (result: any) => void
    /**
     * 打开失败的回调函数
     *
     * @param result
     * @returns
     */
    fail?: (result: any) => void
    /**
     * 调用成功、失败都会执行的回调函数
     *
     * @param result
     * @returns
     */
    complete?: (result: any) => void
}

/** 导航第三方小程序的选项 */
interface INavigateToMiniProgramOptions extends INavigateBaseOptions {
    /**
     * 小程序 AppID
     */
    appId: string
    /**
     * 跳转的小程序版本，develop（开发版），trial（体验版），release（正式版） 默认: trial
     */
    envVersion?: "develop" | "trial" | "release"
}

/**
 * FUN: 导航到第三方小程序
 *
 * @author dyb-dev
 * @date 06/10/2024/  20:14:17
 * @export
 * @param {INavigateToMiniProgramOptions} options 导航第三方小程序的选项
 */
const navigateToMiniProgram = (options: INavigateToMiniProgramOptions) => {

    const { appId, path = "", query = {}, envVersion = "trial", enCode = false, success, fail, complete } = options

    if (!appId) {

        console.error("navigateToMiniProgram() 缺少跳转第三方小程序的 AppID")
        return

    }

    // 将参数拼接到 path 中，如果 enCode 为 true 则对参数值进行 encodeURIComponent 编码
    const _path = replaceUrlParamByObj(query, path, { encode: enCode })

    uni.navigateToMiniProgram({
        appId,
        path: _path,
        extraData: getUrlQuery(_path),
        envVersion,
        success: (result: UniApp.NavigateToSuccessOptions) => {

            success?.(result)

        },
        fail: (result: any) => {

            fail?.(result)

        },
        complete: (result: any) => {

            complete?.(result)

        }
    })

}

/**
 * FUN: 获取目标页面返回的层级
 *
 * @param {string} [targetPagePath=""] 目标页面路径
 * @returns {number} 返回的层级
 */
const getPageBackDelta = (targetPagePath = "") => {

    try {

        // 没有目标页面 或者 没有获取页面栈的方法
        if (!targetPagePath || !getCurrentPages) {

            throw "没有目标页面 或者 没有获取页面栈的方法"

        }

        // 当前的页面栈
        const _currentPages = getCurrentPages()
        // 当前没有页面栈
        if (_currentPages.length <= 0) {

            throw "当前没有页面栈"

        }

        // 再返回的索引上 +1 因为返回的页面层级最少为1 为0代表不返回
        const _pageIndex = _currentPages.findIndex(item => targetPagePath === item.route) + 1
        // 如果没有找到直接 返回
        if (_pageIndex === 0) {

            return 0

        }

        // 返回的层级 = 当前页面长度 - 目标页面所在页面栈中的索引
        return _currentPages.length - _pageIndex

    }
    catch (error) {

        console.error("getPageBackDelta()", error)
        return 0

    }

}

/**
 * FUN: 获取导航页面的函数
 *
 * @author dyb-dev
 * @date 06/10/2024/  20:51:27
 * @export
 * @param {TNavigateToPageMethod} navigateToPageMethod 导航页面的方法
 * @returns {*} 导航页面的函数
 */
const getNavigateToPageFn = (navigateToPageMethod: TNavigateToPageMethod) => {

    let _navigateToPageFn = null

    switch (navigateToPageMethod) {

    case "navigateTo":
        _navigateToPageFn = uni.navigateTo
        break
    case "redirectTo":
        _navigateToPageFn = uni.redirectTo
        break
    case "reLaunch":
        _navigateToPageFn = uni.reLaunch
        break
    case "switchTab":
        _navigateToPageFn = uni.switchTab
        break
    default:
        _navigateToPageFn = uni.navigateTo
        break

    }

    return _navigateToPageFn

}

/** 导航本小程序页面的方法 */
type TNavigateToPageMethod = "redirectTo" | "navigateTo" | "reLaunch" | "switchTab"

/** 导航第三方小程序的选项 */
interface INavigateToPageOptions extends INavigateBaseOptions {
    /**
     * 跳转的路径
     */
    path: NavigateToOptions["url"]
    /**
     * 跳转的方法 默认: navigateTo
     */
    method?: TNavigateToPageMethod
    /**
     * 是否查找返回的层级 默认: true
     */
    findBackDelta?: boolean
}

/**
 * FUN: 导航到页面
 *
 * @author dyb-dev
 * @date 06/10/2024/  20:53:27
 * @export
 * @param {INavigateToPageOptions} options 导航到页面的选项
 */
const navigateToPage = (options: INavigateToPageOptions) => {

    const { path, query = {}, findBackDelta = true, enCode = false, success, fail, complete } = options

    let { method = "navigateTo" } = options

    if (!path) {

        console.error("navigateToPage() 缺失页面路径 path:", path)
        return

    }

    // 将参数拼接到 path 中，如果 enCode 为 true 则对参数值进行 encodeURIComponent 编码
    const _path = replaceUrlParamByObj(query, path, { encode: enCode })

    // 目标页面路径
    let _targetPagePath = queryString.parseUrl(_path).url

    // 如果第一个字符是 / 需要删掉
    if (_targetPagePath.startsWith("/")) {

        _targetPagePath = _targetPagePath.slice(1)

    }

    try {

        if (_targetPagePath === getCurrentPagePath()) {

            console.warn("navigateToPage() 目标页面等于当前页面不做跳转")
            fail?.({ success: false, errorCode: 1 })
            return

        }

    }
    catch (error) {

        console.error("navigateToPage() 获取当前页面路径失败", error)

    }

    // 需要查找返回层级且导航方法为 redirectTo、navigateTo 则允许页面返回
    if (findBackDelta && ["redirectTo", "navigateTo"].includes(method)) {

        // 获取当前页面路由栈 如果存在目标页面 计算需要返回的层级
        const _navigateBackDelta = getPageBackDelta(_targetPagePath)

        if (_navigateBackDelta) {

            uni.navigateBack({ delta: _navigateBackDelta })
            success?.({ success: true, isBackPage: true })
            return

        }

    }
    else {

        console.warn(`navigateToPage() 目标页面存在于页面栈中可以返回,但是跳转页面方法不允许页面返回, 传入的跳转方法${method}`)

    }

    /** STATIC: tabBar页面路径列表 */
    // @ts-ignore
    const tabBarPagePathList = pagesJson?.tabBar?.list?.map((item: TabBarItem) => item.pagePath) || []

    // 如果跳转的页面是 tabBar 页面, 跳转方法只能是 switchTab
    if (method !== "switchTab" && tabBarPagePathList.includes(_targetPagePath)) {

        console.warn("navigateToPage() 目标页面为 tabBar 页面, 跳转方法改为 switchTab")
        method = "switchTab"

    }

    // 进行最终的页面跳转
    getNavigateToPageFn(method)({
        url: _path,
        success(result: any) {

            success?.(result)

        },
        fail(result: any) {

            console.log("result :>> ", result)
            fail?.(result)

        },
        complete: (result: any) => {

            complete?.(result)

        }
    })

}

/**
 * FUN: 返回上一页
 *
 * @author dyb-dev
 * @date 06/10/2024/  20:43:47
 * @param {number} [delta=1] 返回的层级 默认: 1
 */
const navigateBack = (delta: number = 1) => {

    //获取页面栈的长度
    const _currentPages = getCurrentPages()
    //判断是否刷新了浏览器，刷新了浏览器，页面栈只有当前一个
    if (!_currentPages || _currentPages.length <= 1) {

        return

    }

    uni.navigateBack({ delta })

}

/** 导航第三方小程序的选项 */
interface INavigateToWebViewPageOptions extends TModifyProperties<INavigateToPageOptions, "path"> {
    /** h5网址 */
    webUrl: string
    /** h5网址的query */
    webUrlQuery?: Record<string, string>
    /** 是否对h5网址进行 encode 默认: false */
    webUrlEnCode?: boolean
    /**
     * 是否对参数进行 encodeURIComponent 编码，默认: true
     */
    enCode?: boolean
}

/** STATIC: h5网址的key */
const WEB_URL_KEY = "webUrl"

/**
 * FUN: 导航到WebView页面
 *
 * @author dyb-dev
 * @date 06/10/2024/  21:35:15
 * @export
 * @param {INavigateToWebViewPageOptions} options 导航到WebView页面的选项
 */
const navigateToWebViewPage = (options: INavigateToWebViewPageOptions) => {

    const {
        path = `/${__PROJECT_INFO__.env.VITE_SUB_PACKAGE_DIR}/webview/pages/webview` as NavigateToOptions["url"],
        query = {},
        webUrl,
        webUrlQuery = {},
        webUrlEnCode = false,
        enCode = true
    } = options

    if (!path) {

        console.error("navigateToWebViewPage() 缺失WebView页面路径 path:", path)
        return

    }

    if (!webUrl) {

        console.error("navigateToWebViewPage() 缺失h5网址url webUrl:", webUrl)
        return

    }

    // 将参数拼接到 webUrl 中，如果 webUrlEnCode 为 true 则对参数值进行 encodeURIComponent 编码
    const _webUrl = replaceUrlParamByObj(webUrlQuery, webUrl, { encode: webUrlEnCode })

    navigateToPage({
        ...options,
        path,
        query: {
            ...query,
            [WEB_URL_KEY]: _webUrl
        },
        enCode
    })

}

/** 导航到目标的类型 */
enum ENavigateToTargetType {
    /** 跳转第三方小程序 */
    MINI_PROGRAM = 1,
    /** 跳转本小程序页面 */
    PAGE,
    /** 跳转WEB_VIEW页面 */
    WEB_VIEW_PAGE
}

/** STATIC: 导航到目标的配置列表 */
const NAVIGATE_TO_TARGET_CONFIG_LIST = [
    {
        type: ENavigateToTargetType.PAGE,
        desc: "跳转本小程序页面",
        fn: navigateToPage
    },
    { type: ENavigateToTargetType.WEB_VIEW_PAGE, desc: "跳转WEB_VIEW页面", fn: navigateToWebViewPage },
    {
        type: ENavigateToTargetType.MINI_PROGRAM,
        desc: "跳转第三方小程序",
        fn: navigateToMiniProgram
    }
]

/** 导航到目标函数的基础选项 */
interface INavigateToTargetBaseOptions {
    /**
     * 跳转的类型 如果不传递则会根据参数推断具体类型
     */
    type?: ENavigateToTargetType
}

/** 导航到目标函数类型签名 */
interface INavigateToTargetFn {
    (options: INavigateToTargetBaseOptions & INavigateToPageOptions): void
    (options: INavigateToTargetBaseOptions & INavigateToWebViewPageOptions): void
    (options: INavigateToTargetBaseOptions & INavigateToMiniProgramOptions): void
}

/** 导航到目标函数的选项 */
type TNavigateToTargetOptions = INavigateToTargetBaseOptions &
    (INavigateToPageOptions | INavigateToMiniProgramOptions | INavigateToWebViewPageOptions)

/**
 * FUN: 导航到目标页面
 *
 * @author dyb-dev
 * @date 06/10/2024/  22:18:30
 * @param {TNavigateToTargetOptions} options 导航的选项
 */
const navigateToTarget: INavigateToTargetFn = (options: TNavigateToTargetOptions) => {

    const { type, ...lastOptions } = options

    /** STATIC: 导航目标类型 */
    let _type = type

    // 如果没有传入type 则根据参数判断
    if (!_type) {

        // @ts-ignore
        if (lastOptions?.appId) {

            _type = ENavigateToTargetType.MINI_PROGRAM

        }
        // @ts-ignore
        else if (lastOptions?.webUrl) {

            _type = ENavigateToTargetType.WEB_VIEW_PAGE

        }
        else {

            _type = ENavigateToTargetType.PAGE

        }

    }

    // 导航配置
    const _navigateToTargetConfig = NAVIGATE_TO_TARGET_CONFIG_LIST.find(item => String(_type) === String(item.type))

    if (!_navigateToTargetConfig) {

        console.error(`navigate() 找不到type相关类型的方法 _type:${_type}`)
        return

    }
    if (!_navigateToTargetConfig.fn) {

        console.error("navigate 无法找到对应的跳转方法 _navigateConfig:", _navigateToTargetConfig)
        return

    }

    // @ts-ignore
    _navigateToTargetConfig.fn(lastOptions)

}

export type {
    INavigateToTargetBaseOptions,
    INavigateToTargetFn,
    TNavigateToTargetOptions,
    INavigateBaseOptions,
    INavigateToMiniProgramOptions,
    TNavigateToPageMethod,
    INavigateToPageOptions,
    INavigateToWebViewPageOptions
}

export {
    ENavigateToTargetType,
    NAVIGATE_TO_TARGET_CONFIG_LIST,
    navigateToTarget,
    navigateBack,
    navigateToMiniProgram,
    getPageBackDelta,
    getNavigateToPageFn,
    navigateToPage,
    WEB_URL_KEY,
    navigateToWebViewPage
}
