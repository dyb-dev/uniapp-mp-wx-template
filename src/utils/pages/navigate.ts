/*
 * @FileDesc: 页面跳转相关工具函数
 */

import pagesJson from "@/pages.json"
import { getUrlQuery, mergeUrlQuery, getCurrentPagePath, trimUrlSlashes, getBaseUrl } from "@/utils"

import type { TabBarItem } from "@uni-helper/vite-plugin-uni-pages"

/** 导航方法的基础选项 */
export interface INavigateBaseOptions {
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
export interface INavigateToMiniProgramOptions extends TModifyProperties<INavigateBaseOptions, "path"> {
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
export const navigateToMiniProgram = (options: INavigateToMiniProgramOptions) => {

    const { appId, envVersion = "trial", enCode = false, success, fail, complete } = options

    if (!appId) {

        console.error("navigateToMiniProgram() 缺少跳转第三方小程序的 AppID")
        return

    }

    let { path = "", query = {} } = options

    // 如果有 path 则拼接参数
    if (path) {

        // 将参数拼接到 path 中，如果 enCode 为 true 则对参数值进行 encodeURIComponent 编码
        path = mergeUrlQuery(path, query, { encode: enCode })
        // 如果 path 不是以 / 开头 则添加 /
        path = path.startsWith("/") ? path : `/${path}`
        // 获取需要传递给目标小程序的参数，目标小程序可在 App.vue 的 onLaunch或onShow 中获取到
        query = (getUrlQuery(path) || {}) as Record<string, string>
        // 获取目标页面路径
        path = getBaseUrl(path) || ""

    }

    uni.navigateToMiniProgram({
        appId,
        path: path,
        extraData: query,
        envVersion,
        success: (result: UniApp.NavigateToSuccessOptions) => success?.(result),
        fail: (result: any) => fail?.(result),
        complete: (result: any) => complete?.(result)
    })

}

/**
 * FUN: 获取目标页面返回的层级
 *
 * @param {string} [targetPagePath=""] 目标页面路径
 * @returns {number} 返回的层级
 */
export const getPageBackDelta = (targetPagePath = "") => {

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
export const getNavigateToPageFn = (navigateToPageMethod: TNavigateToPageMethod) => {

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
export type TNavigateToPageMethod = "redirectTo" | "navigateTo" | "reLaunch" | "switchTab"

/** 导航本小程序页面的选项 */
export interface INavigateToPageOptions extends INavigateBaseOptions {
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
export const navigateToPage = (options: INavigateToPageOptions) => {

    const { path, query = {}, findBackDelta = true, enCode = false, success, fail, complete } = options

    let { method = "navigateTo" } = options

    if (!path) {

        console.error("navigateToPage() 缺失页面路径 path:", path)
        return

    }

    // 将参数拼接到 path 中，如果 enCode 为 true 则对参数值进行 encodeURIComponent 编码
    let _path = mergeUrlQuery(path, query, { encode: enCode })

    // 如果 path 不是以 / 开头 则添加 /
    _path = _path.startsWith("/") ? _path : `/${_path}`

    // 目标页面路径 去除开头斜杠
    const _targetPagePath = trimUrlSlashes(getBaseUrl(_path), {
        trimStart: true
    })

    try {

        if (_targetPagePath === getCurrentPagePath()) {

            console.warn("navigateToPage() 目标页面等于当前页面不做跳转")
            fail?.({ errMsg: "目标页面等于当前页面不做跳转" })
            return

        }

    }
    catch (error) {

        console.warn("navigateToPage() 获取当前页面路径失败,请检查是否在非页面生命周期内调用")

    }

    // 需要查找返回层级且导航方法为 redirectTo、navigateTo 则允许页面返回
    if (findBackDelta && ["redirectTo", "navigateTo"].includes(method)) {

        // 获取当前页面路由栈 如果存在目标页面 计算需要返回的层级
        const _navigateBackDelta = getPageBackDelta(_targetPagePath)

        if (_navigateBackDelta) {

            uni.navigateBack({ delta: _navigateBackDelta })
            success?.({ errMsg: "页面执行返回操作", isBackPage: true })
            return

        }

    }
    else {

        console.warn(`navigateToPage() 目标页面存在于页面栈中可以返回,但是跳转页面方法不允许页面返回, 传入的跳转方法${method}`)

    }

    /** CONST: tabBar列表 */
    // @ts-ignore
    const _tabBarList = pagesJson?.tabBar?.list || []

    // 如果跳转的页面是 tabBar 页面, 跳转方法只能是 switchTab
    if (method !== "switchTab" && _tabBarList.find((item: TabBarItem) => item.pagePath === _targetPagePath)) {

        console.warn("navigateToPage() 目标页面为 tabBar 页面, 跳转方法改为 switchTab")
        method = "switchTab"

    }

    // 进行最终的页面跳转
    getNavigateToPageFn(method)({
        url: _path,
        success: (result: any) => success?.(result),
        fail: (result: any) => fail?.(result),
        complete: (result: any) => complete?.(result)
    })

}

/**
 * FUN: 返回上一页
 *
 * @author dyb-dev
 * @date 06/10/2024/  20:43:47
 * @param {number} [delta=1] 返回的层级 默认: 1
 */
export const navigateBack = (delta: number = 1) => {

    //获取页面栈的长度
    const _currentPages = getCurrentPages()
    if (!_currentPages || _currentPages.length <= 1) {

        console.error("navigateBack() 页面栈长度小于等于1,无法返回")
        return

    }

    uni.navigateBack({ delta })

}

/** 导航WebView页面的选项 */
export interface INavigateToWebViewOptions extends TModifyProperties<INavigateToPageOptions, "path"> {
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

/** CONST: h5网址的key */
export const WEB_URL_KEY = "webUrl"

/**
 * FUN: 导航到WebView页面
 *
 * @author dyb-dev
 * @date 06/10/2024/  21:35:15
 * @export
 * @param {INavigateToWebViewOptions} options 导航到WebView页面的选项
 */
export const navigateToWebView = (options: INavigateToWebViewOptions) => {

    const { VITE_SUB_PACKAGE_DIR } = __PROJECT_INFO__.env

    const {
        path = `/${VITE_SUB_PACKAGE_DIR}/webview/pages/webview` as NavigateToOptions["url"],
        query = {},
        webUrl,
        webUrlQuery = {},
        webUrlEnCode = false,
        enCode = true
    } = options

    if (!path) {

        console.error("navigateToWebView() 缺失WebView页面路径 path:", path)
        return

    }

    if (!webUrl) {

        console.error("navigateToWebView() 缺失h5网址url webUrl:", webUrl)
        return

    }

    // 将参数拼接到 webUrl 中，如果 webUrlEnCode 为 true 则对参数值进行 encodeURIComponent 编码
    const _webUrl = mergeUrlQuery(webUrl, webUrlQuery, { encode: webUrlEnCode })

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

/** 导航登录页的选项 */
export interface INavigateToLoginOptions extends TModifyProperties<INavigateToPageOptions, "path"> {
    /** 登录成功后重定向页面路径 默认: 当前页 > 首页 */
    redirectPath?: NavigateToOptions["url"]
}

/**
 * FUN: 导航到登录页
 *
 * @author dyb-dev
 * @date 11/10/2024/  16:24:57
 * @param {INavigateToLoginOptions} [options] 导航到登录页的选项
 */
export const navigateToLogin = (options?: INavigateToLoginOptions) => {

    const { VITE_LOGIN_PATH, VITE_HOME_PATH } = __PROJECT_INFO__.env
    const {
        path = `/${VITE_LOGIN_PATH}` as NavigateToOptions["url"],
        redirectPath = `/${getCurrentPagePath() || VITE_HOME_PATH}`,
        query = {}
    } = options || {}

    navigateToPage({
        ...options,
        path,
        query: {
            ...query,
            redirectPath
        }
    })

}

/** 导航到目标的类型 */
export const enum ENavigateToTargetType {
    /** 跳转第三方小程序 */
    MINI_PROGRAM = 1,
    /** 跳转本小程序页面 */
    PAGE,
    /** 跳转WEB_VIEW页面 */
    WEB_VIEW,
    /** 跳转登录页 */
    LOGIN
}

/** CONST: 导航到目标的配置列表 */
export const NAVIGATE_TO_TARGET_CONFIG_LIST = [
    {
        type: ENavigateToTargetType.PAGE,
        desc: "跳转本小程序页面",
        fn: navigateToPage
    },
    { type: ENavigateToTargetType.WEB_VIEW, desc: "跳转WEB_VIEW页面", fn: navigateToWebView },
    { type: ENavigateToTargetType.LOGIN, desc: "跳转登录页", fn: navigateToLogin },
    {
        type: ENavigateToTargetType.MINI_PROGRAM,
        desc: "跳转第三方小程序",
        fn: navigateToMiniProgram
    }
]

/** 导航到目标函数的基础选项 */
export interface INavigateToTargetBaseOptions {
    /**
     * 跳转的类型 如果不传递则会根据参数推断具体类型
     */
    type?: ENavigateToTargetType
}

/** 导航到目标函数类型签名 */
export interface INavigateToTargetFn {
    (options: INavigateToTargetBaseOptions & INavigateToMiniProgramOptions): void
    (options: INavigateToTargetBaseOptions & INavigateToWebViewOptions): void
    (options: INavigateToTargetBaseOptions & INavigateToLoginOptions): void
    (options: INavigateToTargetBaseOptions & INavigateToPageOptions): void
}

/** 导航到目标函数的选项 */
export type TNavigateToTargetOptions = INavigateToTargetBaseOptions &
    (INavigateToMiniProgramOptions | INavigateToWebViewOptions | INavigateToLoginOptions | INavigateToPageOptions)

/**
 * FUN: 导航到目标页面
 *
 * @author dyb-dev
 * @date 06/10/2024/  22:18:30
 * @param {TNavigateToTargetOptions} options 导航的选项
 */
export const navigateToTarget: INavigateToTargetFn = (options: TNavigateToTargetOptions) => {

    const { type, ...lastOptions } = options

    /** 导航目标类型 */
    let _type = type

    // 如果没有传入type 则根据参数判断
    if (!_type) {

        // @ts-ignore
        if (lastOptions?.appId) {

            _type = ENavigateToTargetType.MINI_PROGRAM

        }
        // @ts-ignore
        else if (lastOptions?.webUrl) {

            _type = ENavigateToTargetType.WEB_VIEW

        }
        else {

            // 如果没有传入path 则无法推断跳转类型
            if (!lastOptions.path) {

                console.error("navigateToTarget() 自动推断跳转类型失败,缺失path参数")
                return

            }

            // 获取页面路径并去除开头斜杠
            const _path = trimUrlSlashes(getBaseUrl(lastOptions.path), {
                trimStart: true
            })

            _type = _path === __PROJECT_INFO__.env.VITE_LOGIN_PATH ? ENavigateToTargetType.LOGIN : ENavigateToTargetType.PAGE

        }

    }

    // 导航配置
    const _navigateToTargetConfig = NAVIGATE_TO_TARGET_CONFIG_LIST.find(item => Number(item.type) === Number(_type))

    if (!_navigateToTargetConfig) {

        console.error(`navigateToTarget() 找不到type相关类型的跳转配置 _type:${_type}`)
        return

    }
    if (!_navigateToTargetConfig.fn) {

        console.error("navigateToTarget 跳转配置没有对应的跳转方法 _navigateToTargetConfig:", _navigateToTargetConfig)
        return

    }

    // @ts-ignore
    _navigateToTargetConfig.fn(lastOptions)

}
