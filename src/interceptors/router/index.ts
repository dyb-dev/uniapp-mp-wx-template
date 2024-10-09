/*
 * @Author: dyb-dev
 * @Date: 2024-10-02 15:09:54
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-08 12:23:31
 * @FilePath: /uniapp-mp-wx-template/src/interceptors/router/index.ts
 * @Description: 路由拦截器模块
 */

import queryString from "query-string"

import { setupLoginPreInterceptor } from "./login"

/**
 * 路由Invoke参数
 */
interface IRouterInvokeParams {
    /** url 调用除了`uni.navigateBack`方法时才有此参数 */
    url?: string
    /** 返回层级 调用`uni.navigateBack`方法时才有此参数 */
    delta?: number
}

/**
 * 路由前置拦截器参数
 */
interface IRouterPreInterceptorParams {
    /** 目标路径 */
    path: string
    /** 目标路由参数 */
    query: Record<string, any>
    /** 返回层级 */
    delta: number
}

/** 路由前置拦截器函数 */
type TRouterPreInterceptor = (params: IRouterPreInterceptorParams) => boolean

/**
 * FUN: 设置路由拦截器
 *
 * @author dyb-dev
 * @date 02/10/2024/  15:03:56
 */
const setupRouterInterceptor = () => {

    const _options: UniNamespace.InterceptorOptions = {
        // 前置拦截器
        invoke({ url = "", delta = 0 }: IRouterInvokeParams) {

            /** url解析结果 */
            const _parseResult = queryString.parseUrl(url)
            /** 路由前置拦截器参数 */
            const _params: IRouterPreInterceptorParams = {
                path: _parseResult.url,
                query: _parseResult.query,
                delta
            }

            /** 是否继续执行 */
            let isNext = true

            isNext = setupLoginPreInterceptor(_params)

            return isNext

        }
        // 后置拦截器(一般用不到)
        // returnValue() {

        // }
    }

    uni.addInterceptor("navigateTo", _options)
    uni.addInterceptor("redirectTo", _options)
    uni.addInterceptor("reLaunch", _options)
    uni.addInterceptor("switchTab", _options)
    uni.addInterceptor("navigateBack", _options)

}

export { setupRouterInterceptor }

export type { IRouterPreInterceptorParams, TRouterPreInterceptor }
