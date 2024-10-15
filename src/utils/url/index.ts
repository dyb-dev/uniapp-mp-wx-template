/*
 * @Author: dyb-dev
 * @Date: 2024-10-05 21:14:00
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-15 23:37:22
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
 * FUN: 获取 url 的 查询参数对象
 *
 * @author dyb-dev
 * @date 14/07/2023/  15:16:25
 * @param {string} url 需要解析的 URL
 * @returns {queryString.ParsedQuery<string>} query对象
 */
const getUrlQuery = (url: string): queryString.ParsedQuery<string> => queryString.parseUrl(url).query

/**
 * FUN: 根据 key 从 url 的 查询参数对象 中获取单个参数值
 *
 * @author dyb-dev
 * @date 14/07/2023/  15:28:49
 * @param {string} [url] 需要解析的 URL
 * @param {string} key query 的 key
 * @returns {string} query 的 value
 */
const getUrlQueryValue = (url: string, key: string): string => (getUrlQuery(url)[key] as string) || ""

/**
 * FUN: 设置或更新 从 url 的 查询参数对象 中的指定参数，并返回更新后的 URL 字符串
 *
 * @author dyb-dev
 * @date 14/07/2023/  16:06:14
 * @param {string} [url] 需要解析的 URL
 * @param {string} key 需要 设置或更新 参数 的 key
 * @param {string} value 需要 设置或更新 参数 的 value
 * @param {queryString.StringifyOptions} [options] stringifyUrl 的 options
 * @returns {string} 设置或更新后的 url
 */
const setUrlQueryValue = (url: string, key: string, value: string, options?: queryString.StringifyOptions): string => {

    const _query = getUrlQuery(url)

    _query[key] = value

    return queryString.stringifyUrl({ url: url, query: _query }, options)

}

/**
 * FUN: 合并 URL 的查询参数，并返回更新后的 URL 字符串
 *
 * @author dyb-dev
 * @date 14/07/2023/  16:10:39
 * @param {string} [url] 完整的 URL 字符串
 * @param {queryString.ParsedQuery<string>} obj 需要合并到 URL 中的查询参数对象
 * @param {queryString.StringifyOptions} [options] stringifyUrl 的 options
 * @returns {string} 更新后的 URL 字符串
 */
const mergeUrlQuery = (url: string, obj: queryString.ParsedQuery<string>, options?: queryString.StringifyOptions): string => {

    const _query = getUrlQuery(url)

    Object.assign(_query, obj)

    return queryString.stringifyUrl({ url: url, query: _query }, options)

}

/**
 * FUN: 判断路径是否为绝对路径
 * - 匹配以 `协议` | `域名` | `端口号` 开头的路径
 *
 * @author dyb-dev
 * @date 15/10/2024/  22:26:21
 * @param {string} path - 路径
 * @returns {*}  {boolean} - 是否为绝对路径
 */
const isAbsoluteUrl = (path: string): boolean => /^(https?:\/\/|:\/\/|[a-zA-Z0-9.-]+:\d+|:\d+)/.test(path)

/** 相对路径转换为绝对路径的选项 */
interface IToAbsoluteUrlOptions {
    /** 相对 URL 路径 */
    relativePath: string
    /**
     * 网址的协议、域名、端口号组成的字符串 默认: `__PROJECT_INFO__.env.VITE_SERVER_URL`
     */
    urlOrigin?: string
    /** 基础路径 默认: '' */
    basePath?: string
    /** 版本号 默认: `__PROJECT_INFO__.version` */
    version?: string
}

/**
 * FUN: 将相对 Url 路径转换为绝对 Url 路径
 *
 * @author dyb-dev
 * @date 15/10/2024/  11:43:52
 * @param {IToAbsoluteUrlOptions} options - 选项
 * @returns {*}  {string} - 绝对路径
 */
const toAbsoluteUrl = (options: IToAbsoluteUrlOptions): string => {

    const {
        env: { VITE_SERVER_URL }
    } = __PROJECT_INFO__

    const { relativePath, urlOrigin = VITE_SERVER_URL, basePath = "", version = __PROJECT_INFO__.version } = options

    if (!relativePath || typeof relativePath !== "string" || isAbsoluteUrl(relativePath)) {

        console.error("toAbsoluteUrl() relativePath:", relativePath)
        return relativePath

    }

    const _urlOrigin = trimUrlSlashes(urlOrigin, { trimEnd: true })
    const _basePath = trimUrlSlashes(basePath, { trimStart: true, trimEnd: true })
    const _relativePath = trimUrlSlashes(relativePath, { trimStart: true })

    const _tempList = []
    _urlOrigin && _tempList.push(_urlOrigin)
    _basePath && _tempList.push(_basePath)
    _relativePath && _tempList.push(_relativePath)

    return setUrlQueryValue(_tempList.join("/"), "version", version, {})

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
    getUrlQuery,
    getUrlQueryValue,
    setUrlQueryValue,
    mergeUrlQuery,
    isAbsoluteUrl,
    toAbsoluteUrl
}
