<!--
 * @Author: dyb-dev
 * @Date: 2024-10-05 14:00:48
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 16:43:29
 * @FilePath: /uniapp-mp-wx-template/src/components/userInfo/ChooseAvatar.vue
 * @Description: 选择头像组件
-->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"

import { useUserInfoStore } from "@/stores"

import { EAuthErrorCode } from "@/types"
import type { IAuthErrorOptions } from "@/types"

import type { ButtonOnChooseavatarEvent } from "@uni-helper/uni-app-types"

export interface IChooseAvatarProps {
/**
 * @description 当前选择的头像地址
 * @default ''
 */
    modelValue?: string
/**
 * @description 是否上传到服务器
 * @default true
 */
    uploadToServer?: boolean
}

const props = withDefaults(defineProps<IChooseAvatarProps>(), {
    modelValue: "",
    uploadToServer: true
})

const emits = defineEmits<{
    /** 当前选择的头像地址 */
    (event: "update:modelValue"): void
    /**
     * 授权成功
     */
    (event: "success", avatarUrl: string): void
    /**
     * 授权失败
     */
    (event: "fail", options: IAuthErrorOptions): void
}>()

/** REF: 双向绑定 */
const { modelValue } = useVModels(props, emits)

/** HOOKS: 用户信息 store */
const { userInfoStoreState, uploadAvatar } = useUserInfoStore()

// EVENT: 选择头像回调
async function onChooseAvatar(event: ButtonOnChooseavatarEvent) {

    const {
        detail: { avatarUrl }
    } = event

    console.log("onChooseAvatar() avatarUrl:", avatarUrl)

    if (!avatarUrl) {

        emits("fail", {
            code: EAuthErrorCode.DENIED,
            message: "请选择您的头像"
        })
        return

    }

    if (!userInfoStoreState.isLogin) {

        emits("fail", {
            code: EAuthErrorCode.NOT_LOGGED_IN,
            message: "您还未登录,请先登录"
        })
        return

    }

    // 如果需要上传到服务器
    if (props.uploadToServer) {

        uni.showLoading({ title: "加载中...", mask: true })

        // 上传头像
        const _result = await uploadAvatar({
            avatarUrl
        })

        console.log("onChooseAvatar() _result:", _result)

        uni.hideLoading()

        if (!_result.success || !userInfoStoreState.avatarUrl) {

            emits("fail", {
                code: EAuthErrorCode.API_FAILED,
                message: "授权头像失败,请稍后再试"
            })
            return

        }

    }

    modelValue.value = avatarUrl

    emits("success", avatarUrl)

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
    <button class="choose-avatar" open-type="chooseAvatar" @chooseavatar.stop="onChooseAvatar"></button>
</template>

<style lang="scss" scoped>
.choose-avatar {
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
