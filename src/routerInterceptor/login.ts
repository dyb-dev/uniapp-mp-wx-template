/*
 * @FileDesc: 登录拦截器模块
 */

import { useUserInfoStoreWithOut } from "@/stores"
import { getPageConfig, navigateToLogin } from "@/utils"

import type { TRouterPreInterceptor } from "."

/** CONST: 用户信息Store */
const { userInfoStoreState } = useUserInfoStoreWithOut()

/**
 * FUN: 设置登录前置拦截器
 *
 * @author dyb-dev
 * @date 02/10/2024/  14:54:31
 * @param {string} url - 路由路径
 * @returns {*} 是否继续执行
 */
export const setupLoginPreInterceptor: TRouterPreInterceptor = ({ path, query }) => {

    // 如果是没有登录且需要登录的页面，跳转到登录页
    if (!userInfoStoreState.isLogin && getPageConfig(path)?.needLogin) {

        navigateToLogin({
            redirectPath: path as NavigateToOptions["url"],
            query,
            findBackDelta: false
        })
        return false

    }

    return true

}
