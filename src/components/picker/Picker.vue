<!--
 * @FileDesc: 自定义选择器组件
 -->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
import { inject, ref, watch } from "vue"

import { deepClone } from "@/utils"

import type { TPickerBaseActionType, TPickerBaseSelectedResult, TPickerBaseUnmountParam } from "./type"
import type { PickerBaseEvent, PickerFieldNames, PickerOption } from "nutui-uniapp"
import type { Ref } from "vue"

/** TYPE: 函数式调用时的唯一标识key */
export type TPickerCustomKey = `__PICKER__${string}`

/** 请求 Picker 数据函数的参数 */
export type TPickerFetchDataFnParam = {
/** 搜索关键词 */
    keyword: string
/** 原始数据 */
    originColumns: TPickerData
}

/** Picker 数据 */
export type TPickerData = PickerOption | Record<string, any>[]

/** 请求 Picker 数据函数的返回值 */
export type TPickerFetchDataFnReturn = Promise<TPickerData | void>

/** 组件选项 */
export interface IPickerOptions {
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
    unmount: (...ares: TPickerBaseUnmountParam) => void
    /**
     * 当前选中项对应的值
     *
     * @default []
     */
    pickerValue?: (string | number)[]
    /**
     * 对象数组，配置每一列显示的数据
     *
     * @default []
     */
    columns?: TPickerData
    /**
     * 自定义 columns 结构中的字段
     *
     * @default { text: 'text', values: 'values', children: 'children' }
     */
    columnsFieldNames?: PickerFieldNames
    /**
     * 是否显示搜索组件，使用搜索功能还需要传入 `fetchDataFn` 函数
     *
     * @default false
     */
    showSearch?: boolean
    /**
     * 是否每次显示都重新加载数据，当有2个以上用到该组件时必须要为 true 需要传入 `fetchDataFn` 函数
     *
     * @default true
     */
    showLoadData?: boolean
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
     * 获取 Picker 数据的函数，如果 `columns` 不存在时会在弹窗打开时调用该函数获取数据，优先以 `columns` 为准
     *
     * @returns {TPickerFetchDataFnReturn} 返回 Picker 数据
     */
    fetchDataFn?: (param: TPickerFetchDataFnParam) => TPickerFetchDataFnReturn
    /**
     * 关闭前的回调函数，返回 false 可阻止关闭，支持返回 Promise
     *
     * @param selectedResult 选择结果
     * @returns {boolean | Promise<boolean>} 返回 false 可阻止关闭
     */
    beforeClose?: (selectedResult: TPickerBaseSelectedResult) => boolean | Promise<boolean>
}

/** TYPE: 选择器Props(全部可选) */
type TPickerProps = Partial<IPickerOptions>

const props = withDefaults(defineProps<TPickerProps>(), {
    show: false,
    customKey: "",
    pickerValue: () => [],
    columns: () => [],
    /** 是否显示搜索组件 */
    showSearch: false,
    /** 是否每次显示都重新加载数据 */
    showLoadData: true,
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
    (event: TPickerBaseActionType, params: TPickerBaseSelectedResult): void
}>()

/** REF: 双向绑定 */
const { show, pickerValue } = useVModels(props, emits)

/** REF: 选项 */
const options = ref<TPickerProps>(deepClone<TPickerProps>(props))

/** WATCH: 监听外部 show 的变化 */
watch(show, value => {
    // 当组件式调用显示时，让最新状态下的 props 覆盖 options
    if (value) {

        options.value = deepClone<TPickerProps>(props)

    }

    options.value.show = value
    // 更新 options.value.pickerValue，保证默认显示之前选择的选项
    options.value.pickerValue = pickerValue.value

})

/** CONST: 接收选项的key */
const KEY: TPickerCustomKey = `__PICKER__${options.value.customKey || ""}`

/** REF: 函数式调用时注入的弹窗选项 */
const injectOptions: Ref<TPickerProps> = inject(KEY, options)

/** WATCH: 监听 函数式调用时注入的弹窗选项 的变化 */
watch(injectOptions, value => {
    // 如果使用的是组件式调用，则中断执行，避免修改options造成死循环
    if (!value.unmount) {

        return

    }

    options.value = {
        ...props,
        ...deepClone<TPickerProps>(value)
    }

})

/** REF: 搜索关键字 */
const searchKeyWords = ref("")

/** REF: 原始选择器数据 */
let originColumns: TPickerData = []

/** FUN: 加载选择器数据 并且 设置当前选中的值 */
const loadData = async() => {
    // 如果请求函数存在时，才会加载数据
    if (typeof options.value.fetchDataFn === "function") {

        try {

            uni.showLoading({ title: "加载中...", mask: true })

            // 记录首次展示的源数据
            if (!originColumns.length) {

                originColumns = options.value.columns || []

            }

            const _result = await options.value.fetchDataFn({
                keyword: searchKeyWords.value,
                originColumns
            })

            if (!Array.isArray(_result)) {

                throw `fetchDataFn() 返回值必须是数组 _result: ${_result}`

            }

            if (_result.length <= 0) {

                console.warn(`fetchDataFn() 返回值为空数组 _result: ${_result}`)

            }

            /** 设置当前选择器数据 */
            options.value.columns = _result

        }
        catch (error) {

            console.error("onOpened() =>>", error)
            options.value.columns = []

        }
        finally {

            uni.hideLoading()

        }

    }

}

/** EVENT: 监听弹出层打开 */
const onOpened = () => {
    // 如果 columns 为默认值空数组时，才会初始化加载数据
    if (options.value.columns?.length <= 0) {

        loadData()

    }

}

/** EVENT: 搜索框失焦事件 */
const onBlur = () => {

    loadData()

}

/** REF: 当前选择结果 */
const selectedResult = ref<TPickerBaseSelectedResult>({
    selectedValue: [],
    selectedOptions: [],
    actionType: "click-cancel-button"
})

/**
 * EVENT: 选择器 确认按钮 点击事件
 *
 * @param params 选择的参数
 */
const onClickConfirmButton = (params: PickerBaseEvent) => {

    close("click-confirm-button", params)

}

/**
 * EVENT: 选择器 取消按钮 点击事件
 *
 * @param params 选择的参数
 */
const onClickCancelButton = (params: PickerBaseEvent) => {

    close("click-cancel-button", params)

}

/**
 * FUN: 关闭弹窗
 *
 * @param actionType 动作类型
 * @returns {boolean} 是否关闭成功
 */

const close = async(actionType: TPickerBaseActionType, result: PickerBaseEvent) => {

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

        pickerValue.value = [...selectedResult.value.selectedValue]

    }

    options.value.show = false
    show.value = false

}

/** EVENT: 关闭完成回调 */
const onClosed = () => {

    options.value.unmount?.(selectedResult.value)
    emits(selectedResult.value.actionType, selectedResult.value)
    // 为了实现每次显示都加载数据，因此这里需要清空
    if (options.value.showLoadData) {

        options.value.columns = []

    }

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
        @opened="onOpened"
        @closed="onClosed"
    >
        <nut-picker
            v-model="options.pickerValue"
            :title="options.title"
            :columns="<PickerOption[]>options.columns"
            :visible-option-num="options.visibleOptionNum"
            :field-names="options.columnsFieldNames"
            :ok-text="options.confirmButtonText"
            :cancel-text="options.cancelButtonText"
            :option-height="options.optionHeight"
            :swipe-duration="options.swipeDuration"
            :show-toolbar="true"
            @cancel="onClickCancelButton"
            @confirm="onClickConfirmButton"
        >
            <template #top>
                <nut-searchbar
                    v-if="options.showSearch"
                    v-model="searchKeyWords"
                    :cursor-spacing="50"
                    confirm-type="search"
                    @blur="onBlur"
                >
                    <template #leftin>
                        <nut-icon name="search" />
                    </template>
                </nut-searchbar>
            </template>
        </nut-picker>
    </nut-popup>
</template>
