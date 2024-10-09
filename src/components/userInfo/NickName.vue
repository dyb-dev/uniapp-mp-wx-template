<!--
 * @Author: dyb-dev
 * @Date: 2024-10-05 14:00:48
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-08 15:58:26
 * @FilePath: /uniapp-mp-wx-template/src/components/userInfo/NickName.vue
 * @Description: 昵称输入框组件
-->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
import { computed } from "vue"

export interface INickNameProps {
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
 * @description 输入框的 placeholder 样式
 */
    placeholderStyle?: string
/**
 * @description 输入框的宽度
 * @default 400
 */
    width?: number
/**
 * @description 输入框的高度
 * @default 60
 */
    height?: number
/**
 * @description 字体大小
 * @default 28
 */
    fontSize?: number
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
/**
 * @description 边框颜色
 * @default '#ebedf0'
 */
    borderColor?: string
/**
 * @description 边框圆角大小
 * @default 32
 */
    borderRadius?: number
}

const props = withDefaults(defineProps<INickNameProps>(), {
    modelValue: "",
    placeholder: "点击输入昵称",
    width: 400,
    height: 60,
    fontSize: 28,
    color: "#323233",
    textAlign: "center",
    background: "#ffffff",
    borderColor: "#ebedf0",
    borderRadius: 32
})

const emits = defineEmits<{
    /** 当前输入的昵称 */
    (event: "update:modelValue"): void
    /**
     * 昵称改变
     */
    (event: "change", nickName: string): void
}>()

/** REF: 双向绑定 */
const { modelValue } = useVModels(props, emits)

/** COMPUTED: 样式 */
const style = computed(() => ({
    width: `${props.width}rpx`,
    height: `${props.height}rpx`,
    color: props.color,
    fontSize: `${props.fontSize}rpx`,
    textAlign: props.textAlign,
    background: props.background,
    border: `1px solid ${props.borderColor}`,
    borderRadius: `${props.borderRadius}rpx`
}))

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
        :placeholder-style="props.placeholderStyle"
        @input="onChangeNickName"
        @blur="onChangeNickName"
        @focus="onChangeNickName"
    />
</template>
