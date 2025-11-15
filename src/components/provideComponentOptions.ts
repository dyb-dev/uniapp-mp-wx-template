/*
 * @FileDesc: 提供组件选项相关工具函数
 */

import { provide, ref } from "vue"

import type { Ref } from "vue"

/**
 * 默认选项接口
 */
export interface IDefaultOptions {
    /** 是否显示 */
    show: boolean
    /** 组件唯一标识key */
    customKey: string
    /** 卸载组件回调 */
    unmount: (...args: any[]) => void
}

/**
 * 用于过滤掉默认选项的类型工具
 *
 * @template Target - 目标类型
 */
export type TFilteredDefaultOptions<Target> = Omit<Target, TKeys<IDefaultOptions>>

/**
 * 提供组件选项
 *
 * @author dyb-dev
 * @date 29/10/2024/  21:55:37
 * @param {Key} customKey - 组件唯一标识key
 * @returns {*}  {Ref<Options>} - 组件选项
 */
export const providerComponentOptions = <Key extends string = string, Options extends Record<string, any> = Record<string, any>>(
    customKey: Key
): Ref<Options> => {

    const _options = ref({}) as Ref<Options>

    provide(customKey, _options as any)

    return _options

}
