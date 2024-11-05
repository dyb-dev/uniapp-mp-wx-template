<!--
 * @Author: dyb-dev
 * @Date: 2024-10-30 00:21:51
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-05 16:05:48
 * @FilePath: /uniapp-mp-wx-template/src/components/popup/Popup.vue
 * @Description: 基础弹窗组件
-->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
import { computed, inject, ref, watch } from "vue"

import { deepClone } from "@/utils"

import type { Ref } from "vue"

/** TYPE: 弹窗动作类型 */
export type TPopupActionType = "click-custom-button" | "click-close-button"

/** TYPE: 卸载组件回调参数 */
export type TPopupUnmountParam = [TPopupActionType]

/** TYPE: 函数式调用时的唯一标识key */
export type TPopupCustomKey = `__POPUP__${string}`

/** 组件选项 */
export interface IPopupOptions {
    /**
     * @description 是否显示
     * @default false
     */
    show: boolean
    /**
     * @description 函数式调用时有效 组件唯一标识key
     * @default ''
     */
    customKey?: string
    /**
     * @description 函数式调用时有效 卸载组件回调
     * @param ares 卸载回调参数
     */
    unmount: (...ares: TPopupUnmountParam) => void
    /**
     * @description 自定义图片路径
     */
    customImgPath: string
    /**
     * @description 自定义图片宽度
     * @default 0rpx
     */
    customImgWidth: string
    /**
     * @description 自定义图片高度
     * @default 0rpx
     */
    customImgHeight: string
    /**
     * @description 是否显示自定义按钮
     * @default false
     */
    showCustomButton?: boolean
    /**
     * @description 自定义按钮宽度
     * @default 270rpx
     */
    customButtonWidth?: string
    /**
     * @description 自定义按钮高度
     * @default 80rpx
     */
    customButtonHeight?: string
    /**
     * @description 自定义按钮距离顶部距离
     * @default 0rpx
     */
    customButtonTop?: string
    /**
     * @description 自定义按钮距离左边距离
     * @default 50%
     */
    customButtonLeft?: string
    /**
     * @description 自定义按钮以自身宽度为基准的水平方向偏移量
     * @default -50%
     */
    customButtonTranslateXOffset?: string
    /**
     * @description 自定义按钮以自身高度为基准的垂直方向偏移量
     * @default 0%
     */
    customButtonTranslateYOffset?: string
    /**
     * @description 是否显示关闭按钮
     * @default true
     */
    showCloseButton?: boolean
    /**
     * @description 弹窗关闭回调关闭
     * @param actionType 动作类型
     */
    beforeClose?: (actionType: TPopupActionType) => boolean | Promise<boolean>
}

/** TYPE: 弹窗Props(全部可选) */
type TPopupProps = Partial<IPopupOptions>

const props = withDefaults(defineProps<TPopupProps>(), {
    show: false,
    customKey: "",
    customImgWidth: "0rpx",
    customImgHeight: "0rpx",
    showCustomButton: false,
    customButtonWidth: "270rpx",
    customButtonHeight: "80rpx",
    customButtonTop: "0rpx",
    customButtonLeft: "50%",
    customButtonTranslateXOffset: "-50%",
    customButtonTranslateYOffset: "0%",
    showCloseButton: true
})

// EVENT: 定义 emits
const emits = defineEmits<{
    /** 当前索引 */
    (event: "update:show"): void
    /** 按钮点击 */
    (event: TPopupActionType): void
}>()

/** REF: 双向绑定 */
const { show } = useVModels(props, emits)

/** REF: 选项 */
const options = ref<TPopupProps>(deepClone<TPopupProps>(props))

/** WATCH: 监听 show 的变化 */
watch(show, value => {
    // 将 show 的值赋值给 _show
    options.value.show = value

})

/** STATIC: 接收选项的key */
const KEY: TPopupCustomKey = `__POPUP__${options.value.customKey || ""}`

/** REF: 函数式调用时注入的弹窗选项 */
const injectOptions: Ref<TPopupProps> = inject(KEY, options)

/** WATCH: 监听 函数式调用时注入的弹窗选项 的变化 */
watch(injectOptions, value => {

    options.value = {
        ...options.value,
        ...deepClone<TPopupProps>(value)
    }

})

/** STATIC: 是否正在执行 beforeClose */
let isBeforeClose = false

/** REF: 动作类型 */
const actionType = ref<TPopupActionType>("click-close-button")

/**
 * FUN: 关闭弹窗
 *
 * @param _actionType 动作类型
 * @returns {boolean} 是否关闭成功
 */
const close = async(_actionType: TPopupActionType): Promise<boolean> => {

    if (isBeforeClose) {

        console.warn("beforeClose() 正在执行")
        return false

    }

    // 如果存在 beforeClose 回调函数
    if (options.value.beforeClose && typeof options.value.beforeClose === "function") {

        isBeforeClose = true

        try {

            const _isClose = await options.value.beforeClose(_actionType)

            if (!_isClose) {

                return false

            }

        }
        catch (error) {

            console.error("close() =>> beforeClose() =>>", error)

        }
        finally {
            // 经测试发现在连续点击的情况下，会出现 close 执行多次的情况，放在closed中也不管用，暂时利用 setTimeout 解决
            setTimeout(() => {

                isBeforeClose = false

            }, 500)

        }

    }

    actionType.value = _actionType

    options.value.show = false
    show.value = false

    return true

}

/** EVENT: 关闭完成回调 */
const closed = () => {

    options.value.unmount?.(actionType.value)
    emits(actionType.value)

}

/** COMPUTED: 自定义图片样式 */
const customImgStyles = computed(() => {

    return {
        width: options.value.customImgWidth,
        height: options.value.customImgHeight
    }

})

/** COMPUTED: 自定义按钮样式 */
const customButtonStyles = computed(() => {

    return {
        width: options.value.customButtonWidth,
        height: options.value.customButtonHeight,
        top: options.value.customButtonTop,
        left: options.value.customButtonLeft,
        transform: `translate(${options.value.customButtonTranslateXOffset}, ${options.value.customButtonTranslateYOffset})`
    }

})
</script>

<script lang="ts">
export default {
    options: {
        // 虚拟化组件节点，使组件外部样式能够直接作用到组件内部的第一层节点
        // eslint-disable-next-line padded-blocks
        virtualHost: true,
        // eslint-disable-next-line padded-blocks
        // 允许父组件样式穿透到子组件
        styleIsolation: "shared"
    }
}
</script>

<template>
    <nut-popup
        class="popup"
        :custom-style="{ background: 'transparent' }"
        v-model:visible="options.show"
        :close-on-click-overlay="false"
        @closed="closed"
    >
        <view class="popup__main">
            <image class="popup__main__content" :style="customImgStyles" :src="options.customImgPath" mode="scaleToFill" />

            <view
                v-if="options.showCustomButton"
                :style="customButtonStyles"
                class="popup__main__custom-button"
                @click="close('click-custom-button')"
            />

            <image
                v-if="options.showCloseButton"
                class="popup__main__close"
                src="/static/image/Popup/close.png"
                mode="scaleToFill"
                @click="close('click-close-button')"
            />
        </view>
    </nut-popup>
</template>

<style lang="scss" scoped>
.popup {
    &__main {
        position: relative;

        &__content {
            display: block;
            margin: 0 auto 46rpx;
        }

        &__custom-button {
            position: absolute;
        }

        &__close {
            display: block;
            width: 60rpx;
            height: 60rpx;
            margin: 0 auto;
        }
    }
}
</style>
