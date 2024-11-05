/*
 * @Author: dyb-dev
 * @Date: 2024-11-04 20:02:48
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-04 20:06:35
 * @FilePath: /uniapp-mp-wx-template/src/components/picker/type.ts
 * @Description: 选择器组件公共类型
 */

import type { PickerBaseEvent } from "nutui-uniapp"

/** 选择器组件 基础动作类型 */
type TPickerBaseActionType = "click-cancel-button" | "click-confirm-button"

/** 选择器组件 基础选择结果类型 */
type TPickerBaseSelectedResult = PickerBaseEvent & {
    /** 动作类型 */
    actionType: TPickerBaseActionType
}

/** 选择器组件 函数式调用时组件卸载回调参数 基础类型 */
type TPickerBaseUnmountParam = [TPickerBaseSelectedResult]

/** 选择器组件 函数式调用时基础结果类型 */
type TShowPickerBaseResult = TPickerBaseUnmountParam

export type { TPickerBaseActionType, TPickerBaseSelectedResult, TPickerBaseUnmountParam, TShowPickerBaseResult }
