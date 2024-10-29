/*
 * @Author: dyb-dev
 * @Date: 2024-10-30 00:21:51
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-30 00:21:56
 * @FilePath: /uniapp-mp-wx-template/src/components/dialog/index.ts
 * @Description: 对话框相关工具函数
 */

import { providerComponentOptions } from "@/components"

import type { IDialogOptions, TDialogClosedParam, TDialogCustomKey } from "./Dialog.vue"
import type { TFilteredDefaultOptions } from "@/components"

/** 显示对话框的选项 */
type TShowDialogOptions = TFilteredDefaultOptions<IDialogOptions>

/** 显示对话框的结果 */
type TShowDialogResult = TDialogClosedParam

/**
 * 使用对话框
 *
 * @author dyb-dev
 * @date 29/10/2024/  22:10:25
 * @param {TDialogCustomKey} [customKey='__DIALOG__'] - 对话框唯一标识key 默认: `__DIALOG__`
 * @returns {*} {TUseDialog} - 对话框相关函数
 */
const useDialog = (customKey: string = "") => {

    const _customKey: TDialogCustomKey = `__DIALOG__${customKey}`
    const _options = providerComponentOptions<TDialogCustomKey, IDialogOptions>(_customKey)

    /**
     * 显示对话框
     *
     * @author dyb-dev
     * @date 29/10/2024/  22:05:36
     * @param {TShowDialogOptions} options - 对话框选项
     * @returns {*}  {Promise<TShowDialogResult>} - 显示对话框的结果
     */
    const showDialog = (options: TShowDialogOptions): Promise<TShowDialogResult> => {

        return new Promise(resolve => {

            _options.value = {
                ...options,
                show: true,
                closed: (...args: TShowDialogResult) => resolve(args)
            }

        })

    }
    return {
        showDialog
    }

}

export type { TShowDialogOptions, TShowDialogResult }

export { useDialog }
