/*
 * @Author: dyb-dev
 * @Date: 2024-10-02 14:51:37
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-09 15:20:11
 * @FilePath: /uniapp-mp-wx-template/src/interceptors/router/login.ts
 * @Description: 登录拦截器模块
 */

import { useUserInfoStoreWithOut } from "@/stores"
import { getPageConfig, navigateToPage } from "@/utils"

import type { TRouterPreInterceptor } from "."

/** STATIC: 用户信息Store */
const { userInfoStoreState } = useUserInfoStoreWithOut()

/**
 * FUN: 设置登录前置拦截器
 *
 * @author dyb-dev
 * @date 02/10/2024/  14:54:31
 * @param {string} url - 路由路径
 * @returns {*} 是否继续执行
 */
const setupLoginPreInterceptor: TRouterPreInterceptor = ({ path, query }) => {

    // 如果是没有登录且需要登录的页面，跳转到登录页
    if (!userInfoStoreState.isLogin && getPageConfig(path)?.needLogin) {

        navigateToPage({
            path: `/${__PROJECT_INFO__.env.VITE_LOGIN_PATH}` as NavigateToOptions["url"],
            method: "navigateTo",
            findBackDelta: false,
            query: {
                redirectPath: path,
                ...query
            }
        })
        return false

    }

    return true

}

export { setupLoginPreInterceptor }
