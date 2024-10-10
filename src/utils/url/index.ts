/*
 * @Author: dyb-dev
 * @Date: 2024-10-05 21:14:00
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-10 12:08:58
 * @FilePath: /uniapp-mp-wx-template/src/utils/url/index.ts
 * @Description: url相关工具函数
 */

import queryString from "query-string"

/**
 * FUN: 获取基础 URL（去除查询参数）
 *
 * @author dyb-dev
 * @date 10/10/2024/  11:36:50
 * @param {string} url - 完整的 URL 字符串
 * @returns {*}  {string} - 去除查询参数后的基础 URL
 */
const getBaseUrl = (url: string): string => queryString.parseUrl(url).url

/**
 * FUN: 获取 url 的 参数对象
 *
 * @author dyb-dev
 * @date 14/07/2023/  15:16:25
 * @param {string} url 需要解析的 URL
 * @returns {queryString.ParsedQuery<string>} query对象
 */
const getUrlParams = (url: string): queryString.ParsedQuery<string> => queryString.parseUrl(url).query

/**
 * FUN: 根据 key 从 URL 中获取单个参数值
 *
 * @author dyb-dev
 * @date 14/07/2023/  15:28:49
 * @param {string} key query 的 key
 * @param {string} [url] 需要解析的 URL
 * @returns {string} query 的 value
 */
const getUrlParamValue = (key: string, url: string): string => (getUrlParams(url)[key] as string) || ""

/**
 * FUN: 设置或更新 URL 中的指定参数，并返回更新后的 URL 字符串
 *
 * @author dyb-dev
 * @date 14/07/2023/  16:06:14
 * @param {string} key 需要 设置或更新 参数 的 key
 * @param {string} value 需要 设置或更新 参数 的 value
 * @param {string} [url] 需要解析的 URL
 * @param {queryString.StringifyOptions} [options] stringifyUrl 的 options
 * @returns {string} 设置或更新后的 url
 */
const setUrlParam = (key: string, value: string, url: string, options?: queryString.StringifyOptions): string => {

    const _query = getUrlParams(url)

    _query[key] = value

    return queryString.stringifyUrl({ url: url, query: _query }, options)

}

/**
 * FUN: 合并 URL 的查询参数，并返回更新后的 URL 字符串
 *
 * @author dyb-dev
 * @date 14/07/2023/  16:10:39
 * @param {queryString.ParsedQuery<string>} obj 需要合并到 URL 中的查询参数对象
 * @param {string} [url] 完整的 URL 字符串
 * @param {queryString.StringifyOptions} [options] stringifyUrl 的 options
 * @returns {string} 更新后的 URL 字符串
 */
const mergeUrlParams = (obj: queryString.ParsedQuery<string>, url: string, options?: queryString.StringifyOptions): string => {

    const _query = getUrlParams(url)

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
const isAbsoluteUrl = (str: string): boolean => /(?:(([\w-]+:)\/\/))[^\\/]+/.test(str)

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
const convertToAbsoluteUrl = (
    relativeUrl: string,
    options?: { pathname?: string; baseUrl?: string; version?: string }
): string => {

    if (!relativeUrl || isAbsoluteUrl(relativeUrl)) {

        return relativeUrl

    }

    const { pkg } = __PROJECT_INFO__

    const { pathname = "", baseUrl = "", version = pkg.version } = options || {}

    const _sanitizedBaseUrl = trimUrlSlashes(baseUrl, { trimEnd: true })
    const _sanitizedPathname = trimUrlSlashes(pathname, { trimStart: true, trimEnd: true })
    const _sanitizedRelativeUrl = trimUrlSlashes(relativeUrl, { trimStart: true })

    const _tempList = []
    _sanitizedBaseUrl && _tempList.push(_sanitizedBaseUrl)
    _sanitizedPathname && _tempList.push(_sanitizedPathname)
    _sanitizedRelativeUrl && _tempList.push(_sanitizedRelativeUrl)

    const _tempUlr = _tempList.join("/")
    return setUrlParam("version", version, _tempUlr, {})

}

/**
 * FUN: 根据选项移除 URL 的首尾斜杠
 *
 * @author dyb-dev
 * @date 23/07/2024/  20:28:05
 * @param {string} url - 需要处理的 URL
 * @param {object} [options={}] - 配置项
 * @param {boolean} [options.trimStart=false] - 是否移除开头的斜杠
 * @param {boolean} [options.trimEnd=false] - 是否移除结尾的斜杠
 * @returns {string} - 处理后的url
 */
const trimUrlSlashes = (url: string, options: { trimStart?: boolean; trimEnd?: boolean } = {}): string => {

    const { trimStart = false, trimEnd = false } = options

    let _url = url
    if (trimStart) {

        _url = _url.replace(/^\//, "")

    }
    if (trimEnd) {

        _url = _url.replace(/\/$/, "")

    }
    return _url

}

export {
    trimUrlSlashes,
    getBaseUrl,
    getUrlParams,
    getUrlParamValue,
    setUrlParam,
    mergeUrlParams,
    isAbsoluteUrl,
    convertToAbsoluteUrl
}
