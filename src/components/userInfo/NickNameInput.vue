<!--
 * @Author: dyb-dev
 * @Date: 2024-10-05 14:00:48
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-31 01:45:45
 * @FilePath: /uniapp-mp-wx-template/src/components/userInfo/NickNameInput.vue
 * @Description: 昵称输入框组件
-->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
import { computed } from "vue"

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
        @input="onChangeNickName"
        @blur="onChangeNickName"
        @focus="onChangeNickName"
    />
</template>
