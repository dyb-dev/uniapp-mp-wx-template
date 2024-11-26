<!--
 * @Author: dyb-dev
 * @Date: 2024-11-26 15:51:31
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-26 15:51:47
 * @FilePath: /uniapp-mp-wx-template/src/components/dialog/Dialog.vue
 * @Description: 对话框基础组件
-->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
import { inject, ref, watch } from "vue"

import { deepClone } from "@/utils"

import type { Ref } from "vue"

/** TYPE: 对话框动作类型 */
export type TDialogActionType = "click-left-button" | "click-right-button"

/** TYPE: 卸载组件回调参数 */
export type TDialogUnmountParam = [TDialogActionType]

/** TYPE: 函数式调用时的唯一标识key */
export type TDialogCustomKey = `__DIALOG__${string}`

/** 组件选项 */
export interface IDialogOptions {
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
     * @param ares 关闭回调参数
     */
    unmount: (...ares: TDialogUnmountParam) => void
    /**
     * @description 对话框标题
     * @default ''
     */
    title?: string
    /**
     * @description 对话框内容 支持\n 换行
     * @default ''
     */
    content: string
    /**
     * @description 是否显示对话框底部左侧按钮
     * @default true
     */
    showLeftButton?: boolean
    /**
     * @description 底部左侧按钮文本
     * @default '取消'
     */
    leftButtonText?: string
    /**
     * @description 底部左侧按钮文本颜色
     * @default '#323233'
     */
    leftButtonTextColor?: string
    /**
     * @description 底部右侧按钮文本
     * @default '确定'
     */
    rightButtonText?: string
    /**
     * @description 底部右侧按钮文本颜色
     * @default '#007AFF'
     */
    rightButtonTextColor?: string
    /**
     * @description 对话框关闭前回调
     * @param actionType 动作类型
     */
    beforeClose?: (actionType: TDialogActionType) => boolean | Promise<boolean>
}

/** TYPE: 对话框Props(全部可选) */
type TDialogProps = Partial<IDialogOptions>

const props = withDefaults(defineProps<TDialogProps>(), {
    show: false,
    customKey: "",
    showLeftButton: true,
    leftButtonText: "取消",
    leftButtonTextColor: "#323233",
    rightButtonText: "确定",
    rightButtonTextColor: "#1989fa"
})

// EVENT: 定义 emits
const emits = defineEmits<{
    /** 当前索引 */
    (event: "update:show"): void
    /** 按钮点击 */
    (event: TDialogActionType): void
}>()

/** REF: 双向绑定 */
const { show } = useVModels(props, emits)

/** REF: 选项 */
const options = ref<TDialogProps>(deepClone<TDialogProps>(props))

/** WATCH: 监听 show 的变化 */
watch(show, value => {
    // 将 show 的值赋值给 _show
    options.value.show = value

})

/** STATIC: 接收选项的key */
const KEY: TDialogCustomKey = `__DIALOG__${options.value.customKey || ""}`

/** REF: 函数式调用时注入的弹窗选项 */
const injectOptions: Ref<TDialogProps> = inject(KEY, options)

/** WATCH: 监听 函数式调用时注入的弹窗选项 的变化 */
watch(injectOptions, value => {

    options.value = {
        ...options.value,
        ...deepClone<TDialogProps>(value)
    }

})

/** REF: 动作类型 */
const actionType = ref<TDialogActionType>("click-left-button")

/** REF: 按钮加载状态类型 */
const loadingType = ref<TDialogActionType | "">("")

/**
 * FUN: 关闭弹窗
 *
 * @param _actionType 动作类型
 * @returns {boolean} 是否关闭成功
 */
const close = async(_actionType: TDialogActionType): Promise<boolean> => {
    // 如果正在加载中
    if (loadingType.value) {

        console.warn("beforeClose() 正在执行")
        return false

    }

    // 如果存在 beforeClose 回调函数
    if (options.value.beforeClose && typeof options.value.beforeClose === "function") {

        loadingType.value = _actionType

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
            // 经测试发现在连续点击的情况下，会出现 close 执行多次的情况，放在_closed中也不管用，暂时利用 setTimeout 解决
            setTimeout(() => {

                loadingType.value = ""

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
        class="dialog"
        v-model:visible="options.show"
        :custom-style="{ background: 'transparent' }"
        :overlay-style="{ background: 'rgba(0, 0, 0, 0.3)' }"
        :close-on-click-overlay="false"
        @closed="onClosed"
    >
        <nut-transition :show="options.show" name="zoom">
            <view class="dialog__main">
                <view v-if="options.title" class="dialog__main__title">
                    {{ options.title }}
                </view>

                <slot name="default">
                    <view
                        class="dialog__main__message"
                        :class="{
                            'dialog__main__message--title': options.title
                        }"
                    >
                        {{ options.content }}
                    </view>
                </slot>

                <view class="dialog__main__footer">
                    <view
                        v-if="options.showLeftButton"
                        class="dialog__main__footer__button dialog__main__footer__button--left"
                        @tap="close('click-left-button')"
                    >
                        <nut-icon
                            v-if="loadingType === 'click-left-button'"
                            name="loading1"
                            size="30rpx"
                            :custom-color="options.leftButtonTextColor"
                        />

                        <text v-else :style="{ color: options.leftButtonTextColor }">{{ options.leftButtonText }}</text>
                    </view>

                    <view
                        class="dialog__main__footer__button dialog__main__footer__button--right"
                        @tap="close('click-right-button')"
                    >
                        <nut-icon
                            v-if="loadingType === 'click-right-button'"
                            name="loading1"
                            size="30rpx"
                            :custom-color="options.rightButtonTextColor"
                        />

                        <text v-else :style="{ color: options.rightButtonTextColor }">{{ options.rightButtonText }}</text>
                    </view>
                </view>
            </view>
        </nut-transition>
    </nut-popup>
</template>

<style lang="scss" scoped>
.dialog {
    &__main {
        width: 640rpx;
        overflow: hidden;
        background: #ffffff;
        border-radius: 32rpx;

        &__title {
            width: 100%;
            padding-top: 52rpx;
            color: #323233;
            font-weight: 600;
            font-size: 32rpx;
            text-align: center;
        }

        &__message {
            box-sizing: border-box;
            width: 100%;
            padding: 52rpx 48rpx;
            color: #323233;
            font-size: 28rpx;
            /* 保留所有空格和换行符，同时允许文本换行以适应容器宽度 */
            white-space: pre-wrap;
            text-align: center;
            /* 在单词超出容器宽度时进行换行，即使这个单词没有自然的断点（例如一个很长的单词或 URL）。 */
            word-wrap: break-word;

            &--title {
                padding-top: 16rpx;
                color: #646566;
            }
        }

        &__footer {
            display: flex;
            width: 100%;
            border-top: 2rpx solid #ebedf0;
            user-select: none;

            &__button {
                display: flex;
                flex: 1;
                align-items: center;
                justify-content: center;
                height: 96rpx;
                font-size: 32rpx;

                &:active {
                    background-color: #f0f0f0;
                }
            }

            &__button--left {
                border-right: 2rpx solid #ebedf0;
            }
        }
    }
}
</style>
