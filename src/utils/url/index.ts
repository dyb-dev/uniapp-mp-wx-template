/*
 * @Author: dyb-dev
 * @Date: 2024-10-05 21:14:00
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-07 17:46:12
 * @FilePath: /uniapp-mp-wx-template/src/utils/url/index.ts
 * @Description: url相关工具函数
 */

import queryString from "query-string"

/**
 * FUN: 根据开关移除 url 的斜杠
 *
 * @author dyb-dev
 * @date 23/07/2024/  20:28:05
 * @param {string} url - 需要处理的url
 * @param {object} [options={}] - 配置项
 * @param {boolean} [options.isStart=false] - 是否移除开头的斜杠
 * @param {boolean} [options.isEnd=false] - 是否移除结尾的斜杠
 * @returns {string} - 处理后的url
 */
const removeSlashBySwitch = (url: string, options: { isStart?: boolean; isEnd?: boolean } = {}): string => {

    const { isStart = false, isEnd = false } = options

    let _tempUrl = url
    if (isStart) {

        _tempUrl = _tempUrl.replace(/^\//, "")

    }
    if (isEnd) {

        _tempUrl = _tempUrl.replace(/\/$/, "")

    }
    return _tempUrl

}

/**
 * FUN: 获取 url 的 query
 *
 * @author dyb-dev
 * @date 14/07/2023/  15:16:25
 * @param {string} url 需要解析的 URL
 * @returns {queryString.ParsedQuery<string>} query对象
 */
const getUrlQuery = (url: string): queryString.ParsedQuery<string> => {

    return queryString.parseUrl(url).query

}

/**
 * FUN: 根据 key 获取 url 的 query 的 value
 *
 * @author dyb-dev
 * @date 14/07/2023/  15:28:49
 * @param {string} key query 的 key
 * @param {string} [url] 需要解析的 URL
 * @returns {string} query 的 value
 */
const getUrlParamByKey = (key: string, url: string): string => {

    const _query = getUrlQuery(url)
    return (_query[key] as string) || ""

}

/**
 * FUN: 根据 key 替换/添加 url 的 query 的 value
 *
 * @author dyb-dev
 * @date 14/07/2023/  16:06:14
 * @param {string} key 需要 替换/添加 query 的 key
 * @param {string} value 需要 替换/添加 query 的 value
 * @param {string} [url] 需要解析的 URL
 * @param {queryString.StringifyOptions} [options] stringifyUrl 的 options
 * @returns {string} 替换/添加后的 url
 */
const replaceUrlParam = (key: string, value: string, url: string, options?: queryString.StringifyOptions): string => {

    const _query = getUrlQuery(url)

    _query[key] = value

    return queryString.stringifyUrl({ url: url, query: _query }, options)

}

/**
 * FUN: 根据 obj 替换/添加 url 的 query 的 value
 *
 * @author dyb-dev
 * @date 14/07/2023/  16:10:39
 * @param {queryString.ParsedQuery<string>} obj 需要 替换/添加 query 的 key-value 对象
 * @param {string} [url] 需要解析的 URL
 * @param {queryString.StringifyOptions} [options] stringifyUrl 的 options
 * @returns {string} 替换/添加后的 url
 */
const replaceUrlParamByObj = (
    obj: queryString.ParsedQuery<string>,
    url: string,
    options?: queryString.StringifyOptions
): string => {

    const _query = getUrlQuery(url)

    Object.assign(_query, obj)

    return queryString.stringifyUrl({ url: url, query: _query }, options)

}

/**
 * FUN: 判断是否是绝对路径
 *
 * @author dyb-dev
 * @date 17/04/2023/  09:55:55
 * @param {string} str 需要判断的字符串
 * @returns {boolean} 是否是绝对路径
 */
const isAbsoluteUrl = (str: string): boolean => {

    const pattern = /(?:(([\w-]+:)\/\/))[^\\/]+/
    return pattern.test(str)

}

/**
 * FUN: 将相对路径转换为绝对路径
 * - 如果是绝对路径则直接返回
 * - 如果是相对路径则拼接成绝对路径
 *
 * @author dyb-dev
 * @date 23/07/2024/  20:34:51
 * @param {string} relativeUrl - 相对路径
 * @param {object} [options] - 配置项
 * @param {string} options.pathname - 路径名称
 * @param {string} [options.baseUrl] - 基础URL
 * @param {string} [options.version] - 版本号
 * @returns {string} - 绝对路径
 */
const toAbsoluteUrl = (relativeUrl: string, options?: { pathname: string; baseUrl?: string; version?: string }): string => {

    if (!relativeUrl || isAbsoluteUrl(relativeUrl)) {

        return relativeUrl

    }

    const { pkg } = __PROJECT_INFO__

    const _baseUrl = options?.baseUrl ?? window.location.origin
    const _defaultPathName = ""
    const _pathname = options?.pathname ?? relativeUrl.includes(_defaultPathName) ? "" : _defaultPathName.replace(/\/$/, "")

    const { pathname = _pathname, baseUrl = _baseUrl, version = pkg.version } = options || {}

    const sanitizedBaseUrl = removeSlashBySwitch(baseUrl, { isEnd: true })
    const sanitizedPathname = removeSlashBySwitch(pathname, { isStart: true, isEnd: true })
    const sanitizedRelativeUrl = removeSlashBySwitch(relativeUrl, { isStart: true })

    const _tempList = []
    sanitizedBaseUrl && _tempList.push(sanitizedBaseUrl)
    sanitizedPathname && _tempList.push(sanitizedPathname)
    sanitizedRelativeUrl && _tempList.push(sanitizedRelativeUrl)

    const _tempUlr = _tempList.join("/")
    return replaceUrlParam("version", version, _tempUlr, {})

}

/**
 * FUN: 获取指定URL的子目录
 *
 * @author dyb-dev
 * @date 23/07/2024/  20:32:18
 * @param {string} [url] - 需要解析的 URL
 * @returns {*}  {string}
 */
const getSubdirectoryFromUrl = (url: string): string => {

    if (!isAbsoluteUrl(url)) {

        return ""

    }

    const urlObj = new URL(url)
    const { pathname } = urlObj

    const sanitizedPathname = pathname.startsWith("/") ? pathname.slice(1) : pathname
    const subdirectory = sanitizedPathname.slice(0, sanitizedPathname.lastIndexOf("/"))

    return subdirectory

}

export {
    removeSlashBySwitch,
    getUrlQuery,
    getUrlParamByKey,
    replaceUrlParam,
    replaceUrlParamByObj,
    isAbsoluteUrl,
    toAbsoluteUrl,
    getSubdirectoryFromUrl
}
