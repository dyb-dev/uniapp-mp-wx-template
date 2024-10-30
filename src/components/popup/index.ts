/*
 * @Author: dyb-dev
 * @Date: 2024-10-30 00:21:51
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-30 20:30:59
 * @FilePath: /uniapp-mp-wx-template/src/components/popup/index.ts
 * @Description: 弹窗相关工具函数
 */

import { providerComponentOptions } from "@/components"

import type { IPopupOptions, TPopupUnmountParam, TPopupCustomKey } from "./Popup.vue"
import type { TFilteredDefaultOptions } from "@/components"

/** 显示弹窗的选项 */
type TShowPopupOptions = TFilteredDefaultOptions<IPopupOptions>

/** 显示弹窗的结果 */
type TShowPopupResult = TPopupUnmountParam

/**
 * 使用弹窗
 *
 * @author dyb-dev
 * @date 29/10/2024/  22:10:25
 * @param {TPopupCustomKey} [customKey='__POPUP__'] - 弹窗唯一标识key 默认: `__POPUP__`
 * @returns {*} {TUsePopup} - 弹窗相关函数
 */
const usePopup = (customKey: string = "") => {

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

export type { TShowPopupOptions, TShowPopupResult }

export { usePopup }
