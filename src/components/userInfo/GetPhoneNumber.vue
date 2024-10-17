<!--
 * @Author: dyb-dev
 * @Date: 2024-10-05 14:00:48
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-09 21:01:59
 * @FilePath: /uniapp-mp-wx-template/src/components/userInfo/GetPhoneNumber.vue
 * @Description: 获取手机号组件
-->

<script setup lang="ts">
import { useUserInfoStore } from "@/stores"

import { EAuthErrorCode } from "@/types"
import type { IAuthErrorOptions } from "@/types"

import type { ButtonOnGetphonenumberEvent } from "@uni-helper/uni-app-types"

const emits = defineEmits<{
/**
 * 授权成功
 */
    (event: "success", phoneNumber: string): void
/**
 * 授权失败
 */
    (event: "fail", options: IAuthErrorOptions): void
}>()

/** HOOKS: 用户信息 store */
const { userInfoStoreState, getPhoneNumber } = useUserInfoStore()

// EVENT: 监听获取手机号回调
const onGetPhoneNumber = async(event: ButtonOnGetphonenumberEvent) => {

    const { detail: phoneInfo } = event

    console.log("onGetPhoneNumber() phoneInfo:", phoneInfo)

    // 如果不存在code，说明用户拒绝授权
    if (!phoneInfo.code) {

        emits("fail", {
            code: EAuthErrorCode.DENIED,
            message: "请允许授权手机号,为您带来更好的体验"
        })
        return

    }

    // 如果用户未登录
    if (!userInfoStoreState.isLogin) {

        emits("fail", {
            code: EAuthErrorCode.NOT_LOGGED_IN,
            message: "您还未登录,请先登录"
        })
        return

    }

    uni.showLoading({ title: "加载中...", mask: true })

    // 获取手机号
    const _result = await getPhoneNumber({
        code: phoneInfo.code
    })

    console.log("onGetPhoneNumber() _result:", _result)

    uni.hideLoading()

    // 如果接口请求失败
    if (!_result.success || !userInfoStoreState.phoneNumber) {

        emits("fail", {
            code: EAuthErrorCode.API_FAILED,
            message: "授权手机号失败,请稍后再试"
        })
        return

    }

    emits("success", userInfoStoreState.phoneNumber)

}
</script>

<script lang="ts">
export default {
    options: {
        // 虚拟化组件节点，使组件外部样式能够直接作用到组件内部的第一层节点
        // eslint-disable-next-line padded-blocks
        virtualHost: true,
        // 允许父组件样式穿透到子组件
        styleIsolation: "shared"
    }
}
</script>

<template>
    <button class="get-phone-number" open-type="getPhoneNumber" @getphonenumber.stop="onGetPhoneNumber"></button>
</template>

<style lang="scss" scoped>
.get-phone-number {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: transparent;
    border-style: none;
    outline: none;

    &::after {
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        content: "";
    }
}
</style>
