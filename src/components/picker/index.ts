/*
 * @FileDesc: 选择器组件模块
 */

/** 导出选择器组件公共类型 */
export type * from "./type"
/** 导出自定义选择器类型 */
export type * from "./Picker.vue"
/** 导出日期时间选择器类型 */
export type * from "./DateTimePicker.vue"

import { providerComponentOptions } from "@/components"

import type { IDateTimePickerOptions, TDateTimePickerCustomKey, TShowDateTimePickerResult } from "./DateTimePicker.vue"
import type { IPickerOptions, TPickerCustomKey } from "./Picker.vue"
import type { TShowPickerBaseResult } from "./type"
import type { TFilteredDefaultOptions } from "@/components"

/** 显示选择器的选项 */
export type TShowPickerOptions = TFilteredDefaultOptions<IPickerOptions>

/**
 * 使用选择器
 *
 * @author dyb-dev
 * @date 04/11/2024/  21:12:53
 * @param {string} [customKey=""] - 弹窗唯一标识key 默认: `__PICKER__`
 * @returns {*} {TUsePicker} - 选择器相关函数
 */
export const usePicker = (customKey: string = "") => {

    const _customKey: TPickerCustomKey = `__PICKER__${customKey}`
    const _options = providerComponentOptions<TPickerCustomKey, IPickerOptions>(_customKey)

    /**
     * 显示选择器
     *
     * @author dyb-dev
     * @date 04/11/2024/  21:13:25
     * @param {TShowPickerOptions} options - 选择器选项
     * @returns {*}  {Promise<TShowPickerBaseResult>} - 显示选择器的结果
     */
    const showPicker = (options: TShowPickerOptions): Promise<TShowPickerBaseResult> => {

        return new Promise(resolve => {

            _options.value = {
                ...options,
                show: true,
                unmount: (...args: TShowPickerBaseResult) => resolve(args)
            }

        })

    }
    return {
        showPicker
    }

}

/** 显示日期时间选择器的选项 */
export type TShowDateTimePickerOptions = TFilteredDefaultOptions<IDateTimePickerOptions>

/**
 * 使用日期时间选择器
 *
 * @author dyb-dev
 * @date 04/11/2024/  21:12:53
 * @param {string} [customKey=""] - 弹窗唯一标识key 默认: `__DATE_TIME_PICKER__`
 * @returns {*} {TUseDateTimePicker} - 日期时间选择器相关函数
 */
export const useDateTimePicker = (customKey: string = "") => {

    const _customKey: TDateTimePickerCustomKey = `__DATE_TIME_PICKER__${customKey}`
    const _options = providerComponentOptions<TDateTimePickerCustomKey, IDateTimePickerOptions>(_customKey)

    /**
     * 显示日期时间选择器
     *
     * @author dyb-dev
     * @date 04/11/2024/  21:13:25
     * @param {TShowDateTimePickerOptions} options - 日期时间选择器选项
     * @returns {*}  {Promise<TShowDateTimePickerBaseResult>} - 显示日期时间选择器的结果
     */
    const showDateTimePicker = (options?: TShowDateTimePickerOptions): Promise<TShowDateTimePickerResult> => {

        return new Promise(resolve => {

            _options.value = {
                ...options,
                show: true,
                unmount: (...args: TShowDateTimePickerResult) => resolve(args)
            }

        })

    }
    return {
        showDateTimePicker
    }

}
