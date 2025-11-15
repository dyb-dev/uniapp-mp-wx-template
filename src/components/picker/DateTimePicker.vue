<!--
 * @FileDesc: 日期时间选择器组件
 -->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
import { inject, ref, watch } from "vue"

import { deepClone } from "@/utils"

import type { TPickerBaseActionType, TPickerBaseSelectedResult } from "./type"
import type { DatePickerColumnType, DatePickerType, DatePickerBaseEvent, PickerOption } from "nutui-uniapp"
import type { Ref } from "vue"

/** 日期选择器选择结果 */
export type TDateTimePickerSelectedResult = DatePickerBaseEvent & TPickerBaseSelectedResult

/** 日期选择器组件 函数式调用时组件卸载回调参数 基础类型 */
export type TDateTimePickerUnmountParam = [TDateTimePickerSelectedResult]

/** 日期选择器组件 函数式调用时基础结果类型 */
export type TShowDateTimePickerResult = TDateTimePickerUnmountParam

/** TYPE: 函数式调用时的唯一标识key */
export type TDateTimePickerCustomKey = `__DATE_TIME_PICKER__${string}`

export interface IDateTimePickerOptions {
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
    unmount: (...ares: TDateTimePickerUnmountParam) => void
    /**
     * 当前选中项对应的值
     *
     * @default 当前日期时间
     */
    pickerValue?: Date
    /**
     * 日期时间类型
     * - year-month - 年月
     * - month-day - 月日
     * - hour-minute - 时分
     * - date - 年月日
     * - time - 时分秒
     * - datehour - 年月日时
     * - datetime - 年月日时分
     *
     * @default 'datetime'
     */
    type?: DatePickerType
    /**
     * 分钟步进值
     *
     * @default 1
     */
    minuteStep?: number
    /**
     * 可选的最小时间，精确到日
     *
     * @default 十年前
     */
    minDate?: Date
    /**
     * 可选的最大时间，精确到日
     *
     * @default 十年后
     */
    maxDate?: Date
    /**
     * 顶部栏标题
     *
     * @default ''
     */
    title?: string
    /**
     * 确认按钮文字，设置为空字符串可以隐藏按钮
     *
     * @default 确认
     */
    confirmButtonText?: string
    /**
     * 取消按钮文字，设置为空字符串可以隐藏按钮
     *
     * @default 取消
     */
    cancelButtonText?: string
    /**
     * 是否显示中文
     *
     * @default true
     */
    showChinese?: boolean
    /**
     * 可见的选项个数
     *
     * @default 6
     */
    visibleOptionNum?: number
    /**
     * 选项高度，支持 px, vw, vh, rem 单位，默认 px
     *
     * @default 44
     */
    optionHeight?: number | string
    /**
     * 快速滑动时惯性滚动的时长，单位 ms
     *
     * @default 1000
     */
    swipeDuration?: number | string
    /**
     * 选项过滤函数
     *
     * @param type 选项类型
     * @param options 当前可选项
     * @returns {PickerOption[]} 返回过滤后的选项
     */
    filter?: (type: DatePickerColumnType, options: PickerOption[]) => PickerOption[]
    /**
     * 选项格式化函数
     *
     * @param type 选项类型
     * @param option 当前选项
     * @returns {PickerOption} 返回格式化后的选项
     */
    formatter?: (type: DatePickerColumnType, option: PickerOption) => PickerOption
    /**
     * 关闭前的回调函数，返回 false 可阻止关闭，支持返回 Promise
     *
     * @param selectedResult 选择结果
     * @returns {boolean | Promise<boolean>} 返回 false 可阻止关闭
     */
    beforeClose?: (selectedResult: TDateTimePickerSelectedResult) => boolean | Promise<boolean>
}

/** TYPE: 选择器Props(全部可选) */
type TDateTimePickerProps = Partial<IDateTimePickerOptions>

const props = withDefaults(defineProps<TDateTimePickerProps>(), {
    show: false,
    customKey: "",
    pickerValue: () => new Date(),
    /** 日期时间类型 */
    type: "datetime",
    /** 分钟步进值 */
    minuteStep: 1,
    minDate: () => {

        const _date = new Date()
        // 设置为十年前
        _date.setFullYear(_date.getFullYear() - 10)
        return _date

    },
    maxDate: () => {

        const _date = new Date()
        // 设置为十年后
        _date.setFullYear(_date.getFullYear() + 10)
        return _date

    },
    /** 是否显示中文 */
    showChinese: true,
    /** 可见的选项个数 */
    visibleOptionNum: 6,
    /** 选项高度 */
    optionHeight: 44,
    /** 快速滑动时惯性滚动的时长 */
    swipeDuration: 1000
})

// EVENT: 定义 emits
const emits = defineEmits<{
    /** 当前索引 */
    (event: "update:show"): void
    /** 更新选中的值的值 */
    (event: "update:pickerValue"): void
    /** 按钮点击 */
    (event: TPickerBaseActionType, params: TDateTimePickerSelectedResult): void
}>()

/** REF: 双向绑定 */
const { show, pickerValue } = useVModels(props, emits)

/** REF: 选项 */
const options = ref<TDateTimePickerProps>(deepClone<TDateTimePickerProps>(props))

/** WATCH: 监听外部 show 的变化 */
watch(show, value => {
    // 当组件式调用显示时，让最新状态下的 props 覆盖 options
    if (value) {

        options.value = deepClone<TDateTimePickerProps>(props)

    }

    options.value.show = value
    // 更新 options.value.pickerValue，保证默认显示之前选择的选项
    options.value.pickerValue = pickerValue.value

})

/** CONST: 接收选项的key */
const KEY: TDateTimePickerCustomKey = `__DATE_TIME_PICKER__${options.value.customKey || ""}`

/** REF: 函数式调用时注入的弹窗选项 */
const injectOptions: Ref<TDateTimePickerProps> = inject(KEY, options)

/** WATCH: 监听 函数式调用时注入的弹窗选项 的变化 */
watch(injectOptions, value => {
    // 如果使用的是组件式调用，则中断执行，避免修改options造成死循环
    if (!value.unmount) {

        return

    }

    options.value = {
        ...props,
        ...deepClone<TDateTimePickerProps>(value)
    }

})

/** REF: 当前选择结果 */
const selectedResult = ref<TDateTimePickerSelectedResult>({
    date: options.value.pickerValue || new Date(),
    selectedValue: [],
    selectedOptions: [],
    actionType: "click-cancel-button"
})

/**
 * EVENT: 选择器 确认按钮 点击事件
 *
 * @param params 选择的参数
 */
const onClickConfirmButton = (params: DatePickerBaseEvent) => {

    close("click-confirm-button", params)

}

/**
 * EVENT: 选择器 取消按钮 点击事件
 *
 * @param params 选择的参数
 */
const onClickCancelButton = (params: DatePickerBaseEvent) => {

    close("click-cancel-button", params)

}

/**
 * FUN: 关闭弹窗
 *
 * @param actionType 动作类型
 * @returns {boolean} 是否关闭成功
 */

const close = async(actionType: TPickerBaseActionType, result: DatePickerBaseEvent) => {

    selectedResult.value = { ...selectedResult.value, ...result }
    selectedResult.value.actionType = actionType

    // 如果存在 beforeClose 回调函数
    if (typeof options.value.beforeClose === "function") {

        try {

            uni.showLoading({ title: "加载中...", mask: true })

            const _isClose = await options.value.beforeClose(selectedResult.value)

            if (!_isClose) {

                return

            }

        }
        catch (error) {

            console.error("close() =>> beforeClose() =>>", error)
            return

        }
        finally {

            uni.hideLoading()

        }

    }

    // 点击确认按钮, 则将选择的值赋值给 pickerValue
    if (actionType === "click-confirm-button") {

        pickerValue.value = selectedResult.value.date

    }

    options.value.show = false
    show.value = false

}

/** EVENT: 关闭完成回调 */
const onClosed = () => {

    options.value.unmount?.(selectedResult.value)
    emits(selectedResult.value.actionType, selectedResult.value)

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
        v-model:visible="options.show"
        :round="true"
        :close-on-click-overlay="false"
        :safe-area-inset-bottom="true"
        :overlay-style="{ background: 'rgba(0, 0, 0, 0.3)' }"
        position="bottom"
        @closed="onClosed"
    >
        <nut-date-picker
            v-model="options.pickerValue"
            :type="options.type"
            :show-toolbar="true"
            :title="options.title"
            :ok-text="options.confirmButtonText"
            :cancel-text="options.cancelButtonText"
            :is-show-chinese="options.showChinese"
            :minute-step="options.minuteStep"
            :min-date="options.minDate"
            :max-date="options.maxDate"
            :formatter="options.formatter"
            :filter="options.filter"
            :swipe-duration="options.swipeDuration"
            :visible-option-num="options.visibleOptionNum"
            :option-height="options.optionHeight"
            @cancel="onClickCancelButton"
            @confirm="onClickConfirmButton"
        />
    </nut-popup>
</template>
