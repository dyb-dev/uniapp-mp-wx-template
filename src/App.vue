<!--
 * @Author: dyb-dev
 * @Date: 2024-10-05 20:10:11
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-11 18:10:09
 * @FilePath: /uniapp-mp-wx-template/src/App.vue
 * @Description: 程序全局组件
-->

<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"

import { useUserInfoStore } from "@/stores"
import { navigateToLogin, navigateToPage } from "@/utils"

import type { INavigateToPageOptions } from "@/utils"

/** HOOKS: 用户信息商店 */
const { userInfoStoreState, login } = useUserInfoStore()

/** 小程序启动时的查询参数 */
interface ILaunchQuery {
    /** `VITE_USE_LAUNCH_PAGE`为`true`时有效 目标页面路径 默认: 首页 */
    targetPath?: NavigateToOptions["url"]
    /** 其他相关参数 */
    [key: string]: any
}

/** LIFECYCLE: 小程序首次进入 */
onLaunch(async options => {

    console.log("项目信息:", __PROJECT_INFO__)
    console.log("小程序首次进入:", options)

    await login()

    const { VITE_USE_LAUNCH_PAGE, VITE_LOGIN_PATH, VITE_HOME_PATH, VITE_LAUNCH_PATH } = import.meta.env

    // 如果使用了启动页，则需要手动跳转到目标页面
    if (VITE_USE_LAUNCH_PAGE === "true") {

        // 获取小程序启动时的查询参数
        const _query = <ILaunchQuery>options?.query || {}

        const { targetPath = VITE_HOME_PATH, ...otherQuery } = _query

        // 如果 targetPath 为启动页路径，则修改为首页路径
        const _targetPath = `/${targetPath === VITE_LAUNCH_PATH ? VITE_HOME_PATH : targetPath}` as NavigateToOptions["url"]

        // 跳转参数
        const _options: INavigateToPageOptions = {
            path: _targetPath,
            query: otherQuery,
            method: "reLaunch",
            findBackDelta: false
        }

        // 如果未登录，则跳转到登录页，登录成功后再在重定向到目标页
        if (!userInfoStoreState.isLogin) {

            navigateToLogin({
                ..._options,
                redirectPath: _options.path,
                path: `/${VITE_LOGIN_PATH}` as NavigateToOptions["url"]
            })

            return

        }

        navigateToPage(_options)

    }

})

/** LIFECYCLE: 小程序切入前台 */
onShow(options => {

    console.log("小程序切入前台:", options)

})

/** LIFECYCLE: 小程序切入后台 */
onHide(() => {

    console.log("小程序切入后台")

})
</script>

<style lang="scss">
@import "nutui-uniapp/styles/index";
@import "./styles/index";
</style>
