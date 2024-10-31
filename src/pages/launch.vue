<!--
 * @Author: dyb-dev
 * @Date: 2024-10-11 16:41:06
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-31 22:54:19
 * @FilePath: /uniapp-mp-wx-template/src/pages/launch.vue
 * @Description: 小程序启动页
-->

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app"

import { useUserInfoStore } from "@/stores"
import { getBaseUrl, getUrlQuery, navigateToLogin, navigateToPage } from "@/utils"

import type { INavigateToPageOptions } from "@/utils"

/** 小程序启动时的查询参数 */
interface ILaunchQuery {
    /** `VITE_USE_LAUNCH_PAGE`为`true`时有效 目标页面路径 默认: 首页 */
    targetPath?: NavigateToOptions["url"]
    /** 其他相关参数 */
    [key: string]: any
}

/** HOOKS: 用户信息商店 */
const { userInfoStoreState, login } = useUserInfoStore()

/** LIFECYCLE: 页面数据初始化完成 */
onLoad(async query => {

    console.log("启动页入参:", query)

    const { VITE_LOGIN_PATH, VITE_HOME_PATH, VITE_LAUNCH_PATH } = import.meta.env

    // 获取小程序显示时的查询参数
    const { targetPath = VITE_HOME_PATH, ...otherQuery } = <ILaunchQuery>query || {}

    // 解码目标路径
    let _targetPath = decodeURIComponent(targetPath)

    // 如果目标路径不是以`/`开头，则添加`/`
    _targetPath = _targetPath.startsWith("/") ? _targetPath : `/${_targetPath}`

    // 获取目标路径的基础路径
    let _targetBasePath = getBaseUrl(_targetPath)

    // 如果 targetPath 为启动页路径，则修改为首页路径
    _targetBasePath = _targetBasePath === `/${VITE_LAUNCH_PATH}` ? `/${VITE_HOME_PATH}` : _targetBasePath

    // 跳转选项
    const _options: INavigateToPageOptions = {
        path: _targetBasePath as NavigateToOptions["url"],
        query: {
            ...otherQuery,
            ...getUrlQuery(_targetPath)
        },
        method: "reLaunch",
        findBackDelta: false
    }

    await login()

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

})
</script>

<template>
    <view class="launch">
        <nut-icon name="loading1" custom-color="var(--loading-color)" :size="20" />
        <view class="launch__loading-text">正在启动...</view>
    </view>
</template>

<style lang="scss" scoped>
.launch {
    --loading-color: #c8c9cc;

    display: flex;
    flex-direction: column;
    gap: 20rpx;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;

    &__loading-text {
        color: var(--loading-color);
        font-size: 26rpx;
    }
}
</style>
