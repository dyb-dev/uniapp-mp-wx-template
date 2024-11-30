<!--
 * @Author: dyb-dev
 * @Date: 2024-11-26 15:51:31
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-30 13:15:33
 * @FilePath: /uniapp-mp-wx-template/src/components/dialog/Dialog.vue
 * @Description: 对话框基础组件
-->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import mpHtml from "mp-html/dist/uni-app/components/mp-html/mp-html"
import { inject, ref, watch } from "vue"

import { deepClone } from "@/utils"

import type { Ref } from "vue"

/** TYPE: 对话框动作类型 */
export type TDialogActionType = "click-cancel-button" | "click-confirm-button"

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
     * @description 对话框内容
     * @default ''
     */
    message: string
    /**
     * @description 对话框内容对齐方式
     * @default 'center'
     */
    messageAlign?: "center" | "left" | "right"
    /**
     * @description 是否显示取消按钮
     * @default false
     */
    showCancelButton?: boolean
    /**
     * @description 是否显示确认按钮
     * @default true
     */
    showConfirmButton?: boolean
    /**
     * @description 取消按钮文本
     * @default '取消'
     */
    cancelButtonText?: string
    /**
     * @description 取消按钮文本颜色
     * @default '#323233'
     */
    cancelButtonTextColor?: string
    /**
     * @description 确认按钮文本
     * @default '确定'
     */
    confirmButtonText?: string
    /**
     * @description 确认按钮文本颜色
     * @default '#007AFF'
     */
    confirmButtonTextColor?: string
    /**
     * @description 对话框宽度
     * @default '640rpx'
     */
    width?: string
    /**
     * @description 是否允许 message 内容中渲染 HTML
     * @default false
     */
    allowHtml?: boolean
    /**
     * @description `allowHtml` 开启时，`message` 中链接点击回调
     * @param event 链接属性参数以及链接文本内容
     */
    htmlLinkClick?: (event: Record<string, any>) => void
    /**
     * @description `allowHtml` 开启时，`message` 中图片点击回调
     * @param event 图片属性参数以及图片地址
     */
    htmlImgClick?: (event: Record<string, any>) => void
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
    messageAlign: "center",
    showCancelButton: false,
    showConfirmButton: true,
    cancelButtonText: "取消",
    cancelButtonTextColor: "#323233",
    confirmButtonText: "确定",
    confirmButtonTextColor: "#1989fa",
    allowHtml: false,
    width: "640rpx"
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
const actionType = ref<TDialogActionType>("click-cancel-button")

/** REF: 按钮加载状态类型 */
const loadingType = ref<TDialogActionType | "">("")

/**
 * FUN: 关闭弹窗
 *
 * @param _actionType 动作类型
 * @returns {boolean} 是否关闭成功
 */
const close = async(_actionType: TDialogActionType): Promise<boolean> => {

    if (loadingType.value) {

        console.warn("beforeClose() 正在执行")
        return false

    }

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
            <view class="dialog__main" :style="{ width: options.width }">
                <view v-if="options.title" class="dialog__main__title">
                    {{ options.title }}
                </view>

                <slot name="default">
                    <mp-html
                        v-if="options.allowHtml"
                        :content="options.message"
                        @linktap="options.htmlLinkClick"
                        @imgtap="options.htmlImgClick"
                    />

                    <view
                        v-else
                        class="dialog__main__message"
                        :class="{
                            'dialog__main__message--title': options.title
                        }"
                        :style="{ textAlign: options.messageAlign }"
                    >
                        {{ options.message }}
                    </view>
                </slot>

                <view class="dialog__main__footer">
                    <view
                        v-if="options.showCancelButton"
                        class="dialog__main__footer__button dialog__main__footer__button--cancel"
                        @tap="close('click-cancel-button')"
                    >
                        <nut-icon
                            v-if="loadingType === 'click-cancel-button'"
                            name="loading1"
                            size="30rpx"
                            :custom-color="options.cancelButtonTextColor"
                        />

                        <text v-else :style="{ color: options.cancelButtonTextColor }">
                            {{ options.cancelButtonText }}
                        </text>
                    </view>

                    <view
                        v-if="options.showConfirmButton"
                        class="dialog__main__footer__button dialog__main__footer__button--confirm"
                        @tap="close('click-confirm-button')"
                    >
                        <nut-icon
                            v-if="loadingType === 'click-confirm-button'"
                            name="loading1"
                            size="30rpx"
                            :custom-color="options.confirmButtonTextColor"
                        />

                        <text v-else :style="{ color: options.confirmButtonTextColor }">
                            {{ options.confirmButtonText }}
                        </text>
                    </view>
                </view>
            </view>
        </nut-transition>
    </nut-popup>
</template>

<style lang="scss" scoped>
.dialog {
    &__main {
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

            &__button--cancel {
                border-right: 2rpx solid #ebedf0;
            }
        }
    }
}
</style>
