/*
 * @FileDesc: 弹窗组件相关工具函数
 */

/** 导出基础弹窗类型 */
export type * from "./Popup.vue"

import { providerComponentOptions } from "@/components"

import type { IPopupOptions, TPopupUnmountParam, TPopupCustomKey } from "./Popup.vue"
import type { TFilteredDefaultOptions } from "@/components"

/** 显示弹窗的选项 */
export type TShowPopupOptions = TFilteredDefaultOptions<IPopupOptions>

/** 显示弹窗的结果 */
export type TShowPopupResult = TPopupUnmountParam

/**
 * 使用弹窗
 *
 * @author dyb-dev
 * @date 29/10/2024/  22:10:25
 * @param {TPopupCustomKey} [customKey='__POPUP__'] - 弹窗唯一标识key 默认: `__POPUP__`
 * @returns {*} {TUsePopup} - 弹窗相关函数
 */
export const usePopup = (customKey: string = "") => {

    const _customKey: TPopupCustomKey = `__POPUP__${customKey}`
    const _options = providerComponentOptions<TPopupCustomKey, IPopupOptions>(_customKey)

    /**
     * 显示弹窗
     *
     * @author dyb-dev
     * @date 29/10/2024/  22:05:36
     * @param {TShowPopupOptions} options - 弹窗选项
     * @returns {*}  {Promise<TShowPopupResult>} - 显示弹窗的结果
     */
    const showPopup = (options: TShowPopupOptions): Promise<TShowPopupResult> => {

        return new Promise(resolve => {

            _options.value = {
                ...options,
                show: true,
                unmount: (...args: TShowPopupResult) => resolve(args)
            }

        })

    }
    return {
        showPopup
    }

}
