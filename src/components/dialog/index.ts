/*
 * @FileDesc: 对话框组件相关工具函数
 */

/** 导出对话框类型 */
export type * from "./Dialog.vue"
/** 导出表单对话框类型 */
export type * from "./FormDialog.vue"

import { providerComponentOptions } from "@/components"

import type { IDialogOptions, TDialogCustomKey, TDialogUnmountParam } from "./Dialog.vue"
import type { IFormDialogOptions, TFormDialogCustomKey, TFormDialogUnmountParam } from "./FormDialog.vue"
import type { TFilteredDefaultOptions } from "@/components"

/** 显示对话框的选项 */
export type TShowDialogOptions = TFilteredDefaultOptions<IDialogOptions>

/** 显示对话框的结果 */
export type TShowDialogResult = TDialogUnmountParam

/**
 * 使用对话框
 *
 * @author dyb-dev
 * @date 29/10/2024/  22:10:25
 * @param {TDialogCustomKey} [customKey='__DIALOG__'] - 对话框唯一标识key 默认: `__DIALOG__`
 * @returns {*} {TUseDialog} - 对话框相关函数
 */
export const useDialog = (customKey: string = "") => {

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
                unmount: (...args: TShowDialogResult) => resolve(args)
            }

        })

    }
    return {
        showDialog
    }

}

/** 显示表单对话框的选项 */
export type TShowFormDialogOptions<T extends Record<string, any>> = TFilteredDefaultOptions<IFormDialogOptions<T>>

/** 显示表单对话框的结果 */
export type TShowFormDialogResult<T extends Record<string, any>> = TFormDialogUnmountParam<T>

/**
 * 使用表单对话框
 *
 * @author dyb-dev
 * @date 29/10/2024/  22:10:25
 * @param {TFormDialogCustomKey} [customKey='__FORM_DIALOG__'] - 表单对话框唯一标识key 默认: `__FORM_DIALOG__`
 * @returns {*} {TUseFormDialog} - 表单对话框相关函数
 */
export const useFormDialog = (customKey: string = "") => {

    const _customKey: TFormDialogCustomKey = `__FORM_DIALOG__${customKey}`
    const _options = providerComponentOptions<TFormDialogCustomKey, IFormDialogOptions<Record<string, any>>>(_customKey)

    /**
     * 显示表单对话框
     *
     * @author dyb-dev
     * @date 29/10/2024/  22:05:36
     * @param {TShowFormDialogOptions} options - 表单对话框选项
     * @returns {*}  {Promise<TShowFormDialogResult<T>>} - 显示表单对话框的结果
     */
    const showFormDialog = <T extends Record<string, any>>(
        options: TShowFormDialogOptions<T>
    ): Promise<TShowFormDialogResult<T>> => {

        return new Promise(resolve => {

            _options.value = {
                ...options,
                show: true,
                unmount: (...args: TShowFormDialogResult<T>) => resolve(args)
            } as IFormDialogOptions<Record<string, any>>

        })

    }
    return {
        showFormDialog
    }

}
