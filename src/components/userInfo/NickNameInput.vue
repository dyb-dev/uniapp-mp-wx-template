<!--
 * @Author: dyb-dev
 * @Date: 2024-10-05 14:00:48
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-02 01:54:46
 * @FilePath: /uniapp-mp-wx-template/src/components/userInfo/NickNameInput.vue
 * @Description: 昵称输入框组件
-->

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app"
import { useVModels } from "@vueuse/core"
import { computed, ref } from "vue"

import { EAuthErrorCode } from "@/types"
import type { IAuthErrorOptions } from "@/types"

export interface INickNameInputProps {
/**
 * @description 当前输入的昵称
 * @default ''
 */
    modelValue?: string
/**
 * @description 输入框的 placeholder
 * @default '点击输入昵称'
 */
    placeholder?: string
/**
 * @description 输入框的宽度
 * @default '100%'
 */
    width?: string
/**
 * @description 输入框的高度
 * @default '100%'
 */
    height?: string
/**
 * @description 字体颜色
 * @default '#323233'
 */
    color?: string
/**
 * @description 文本对齐方式
 * @default 'center'
 */
    textAlign?: "left" | "center" | "right"
/**
 * @description 输入框的背景
 * @default '#ffffff'
 */
    background?: string
}

const props = withDefaults(defineProps<INickNameInputProps>(), {
    modelValue: "",
    placeholder: "点击输入昵称",
    width: "100%",
    height: "100%",
    color: "#323233",
    textAlign: "center",
    background: "#ffffff"
})

const emits = defineEmits<{
    /** 当前输入的昵称 */
    (event: "update:modelValue"): void
    /**
     * 昵称改变
     */
    (event: "change", nickName: string): void
    /**
     * 授权失败
     */
    (event: "fail", options: IAuthErrorOptions): void
}>()

/** REF: 双向绑定 */
const { modelValue } = useVModels(props, emits)

/** COMPUTED: 样式 */
const style = computed(() => ({
    width: props.width,
    height: props.height,
    color: props.color,
    textAlign: props.textAlign,
    background: props.background
}))

/** REF: 是否禁用 */
const disabled = ref(false)

// LIFECYCLE: 页面加载完成
onLoad(() => {
    // 获取隐私协议设置
    wx.getPrivacySetting({
        success: res => {
            // 当需要隐私协议授权时，先禁用输入框
            disabled.value = res.needAuthorization

        },
        fail: () => {

            emits("fail", {
                code: EAuthErrorCode.API_FAILED,
                message: "获取隐私协议授权状态失败"
            })

        }
    })

})

// EVENT: 请求隐私协议授权
const requirePrivacyAuthorize = () => {
    // 当输入框被禁用，即代表需要请求隐私协议授权
    if (disabled.value) {
        // 请求隐私协议授权
        wx.requirePrivacyAuthorize({
            // 同意隐私协议
            success: () => {
                // 取消禁用输入框
                disabled.value = false

            },
            // 拒绝隐私协议
            fail: () => {

                emits("fail", {
                    code: EAuthErrorCode.DENIED,
                    message: "用户拒绝了隐私协议"
                })

            }
        })

    }

}

// EVENT: 监听昵称改变
const onChangeNickName = (event: any) => {

    const {
        detail: { value = "" }
    } = event

    modelValue.value = value
    emits("change", value)

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
    <input
        type="nickname"
        :style="style"
        :value="modelValue"
        :placeholder="props.placeholder"
        :disabled="disabled"
        @touchstart="requirePrivacyAuthorize"
        @input="onChangeNickName"
        @blur="onChangeNickName"
        @focus="onChangeNickName"
    />
</template>
