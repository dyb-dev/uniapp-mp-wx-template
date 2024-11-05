/*
 * @Author: dyb-dev
 * @Date: 2024-11-04 19:51:37
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-04 21:14:01
 * @FilePath: /uniapp-mp-wx-template/src/components/picker/index.ts
 * @Description: 选择器组件模块
 */

/** 导出选择器组件公共类型 */
export * from "./type"

import { providerComponentOptions } from "@/components"

import type { IPickerOptions, TPickerCustomKey } from "./Picker.vue"
import type { TShowPickerBaseResult } from "./type"
import type { TFilteredDefaultOptions } from "@/components"

/** 显示选择器的选项 */
type TShowPickerOptions = TFilteredDefaultOptions<IPickerOptions>

/**
 * 使用选择器
 *
 * @author dyb-dev
 * @date 04/11/2024/  21:12:53
 * @param {string} [customKey=""] - 弹窗唯一标识key 默认: `__Picker__`
 * @returns {*} {TUsePicker} - 选择器相关函数
 */
const usePicker = (customKey: string = "") => {

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

export type { TShowPickerOptions, TShowPickerBaseResult }

export { usePicker }
