<!--
 * @FileDesc: 基础弹窗组件
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
     * 是否显示
     *
     * @default false
     */
    show: boolean
    /**
     * 函数式调用时有效 组件唯一标识key
     *
     * @default ''
     */
    customKey?: string
    /**
     * 函数式调用时有效 卸载组件回调
     *
     * @param ares 卸载回调参数
     */
    unmount: (...ares: TPopupUnmountParam) => void
    /**
     * 弹窗背景图片路径
     */
    bgImgPath: string
    /**
     * 弹窗背景图片宽度
     *
     * @default 0rpx
     */
    bgImgWidth: string
    /**
     * 弹窗背景图片高度
     *
     * @default 0rpx
     */
    bgImgHeight: string
    /**
     * 是否显示自定义按钮
     *
     * @default false
     */
    showCustomButton?: boolean
    /**
     * 自定义按钮宽度
     *
     * @default 270rpx
     */
    customButtonWidth?: string
    /**
     * 自定义按钮高度
     *
     * @default 80rpx
     */
    customButtonHeight?: string
    /**
     * 自定义按钮距离顶部距离
     *
     * @default 0rpx
     */
    customButtonTop?: string
    /**
     * 自定义按钮距离左边距离
     *
     * @default 50%
     */
    customButtonLeft?: string
    /**
     * 自定义按钮以自身宽度为基准的水平方向偏移量
     *
     * @default -50%
     */
    customButtonTranslateXOffset?: string
    /**
     * 自定义按钮以自身高度为基准的垂直方向偏移量
     *
     * @default 0%
     */
    customButtonTranslateYOffset?: string
    /**
     * 是否显示关闭按钮
     *
     * @default true
     */
    showCloseButton?: boolean
    /**
     * 弹窗关闭回调关闭
     *
     * @param actionType 动作类型
     */
    beforeClose?: (actionType: TPopupActionType) => boolean | Promise<boolean>
}

/** TYPE: 弹窗Props(全部可选) */
type TPopupProps = Partial<IPopupOptions>

const props = withDefaults(defineProps<TPopupProps>(), {
    show: false,
    customKey: "",
    bgImgWidth: "0rpx",
    bgImgHeight: "0rpx",
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
    // 当组件式调用显示时，让最新状态下的 props 覆盖 options
    if (value) {

        options.value = deepClone<TPopupProps>(props)

    }

    // 将 show 的值赋值给 _show
    options.value.show = value

})

/** CONST: 接收选项的key */
const KEY: TPopupCustomKey = `__POPUP__${options.value.customKey || ""}`

/** REF: 函数式调用时注入的弹窗选项 */
const injectOptions: Ref<TPopupProps> = inject(KEY, options)

/** WATCH: 监听 函数式调用时注入的弹窗选项 的变化 */
watch(injectOptions, value => {
    // 如果使用的是组件式调用，则中断执行，避免修改options造成死循环
    if (!value.unmount) {

        return

    }

    options.value = {
        ...props,
        ...deepClone<TPopupProps>(value)
    }

})

/** CONST: 是否正在执行 beforeClose */
let isBeforeClose = false

/** REF: 动作类型 */
const actionType = ref<TPopupActionType>("click-close-button")

/**
 * FUN: 关闭弹窗
 *
 * @param _actionType 动作类型
 * @returns {boolean} 是否关闭成功
 */
const close = async (_actionType: TPopupActionType): Promise<boolean> => {

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
const onClosed = () => {

    options.value.unmount?.(actionType.value)
    emits(actionType.value)

}

/** COMPUTED: 自定义图片样式 */
const customImgStyles = computed(() => {

    return {
        width: options.value.bgImgWidth,
        height: options.value.bgImgHeight
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
        v-model:visible="options.show"
        :custom-style="{ background: 'transparent' }"
        :overlay-style="{ background: 'rgba(0, 0, 0, 0.3)' }"
        :close-on-click-overlay="false"
    >
        <nut-transition :show="options.show" name="zoom" @after-leave="onClosed">
            <view class="popup__main">
                <image class="popup__main__content" :style="customImgStyles" :src="options.bgImgPath" mode="scaleToFill" />

                <view
                    v-if="options.showCustomButton"
                    :style="customButtonStyles"
                    class="popup__main__custom-button"
                    @click="close('click-custom-button')"
                />

                <image
                    v-if="options.showCloseButton"
                    class="popup__main__close"
                    src="/static/image/popup/Popup/close.png"
                    mode="scaleToFill"
                    @click="close('click-close-button')"
                />
            </view>
        </nut-transition>
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
