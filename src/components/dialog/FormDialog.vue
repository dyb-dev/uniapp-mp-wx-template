<!--
 * @FileDesc: 表单对话框基础组件
 -->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
import { inject, reactive, ref, watch } from "vue"

import { deepClone } from "@/utils"

import type { IFormControlProps, TDialogActionType } from "@/components"
import type { NutAnimationName } from "nutui-uniapp"
import type { Ref } from "vue"

/** TYPE: 表单对话框动作类型 与 `TFormDialogActionType` 保持一致，这里单独定义主要是解决编辑器上会报错的问题 */
export type TFormDialogActionType = "click-cancel-button" | "click-confirm-button"

export interface IFormDialogResult<T extends Record<string, any>> {
/** 动作类型 */
    actionType: TFormDialogActionType
/** 表单数据 */
    formData: T
}

/** TYPE: 卸载组件回调参数 */
export type TFormDialogUnmountParam<T extends Record<string, any>> = [IFormDialogResult<T>]

/** TYPE: 函数式调用时的唯一标识key */
export type TFormDialogCustomKey = `__FORM_DIALOG__${string}`

/** TYPE: 表单对话框控件 */
export interface IFormDialogControl<T extends Record<string, any>> extends Omit<IFormControlProps, "modelValue" | "onClick"> {
    /** 控件值的绑定key */
    modelKey: keyof T
    /** 控件的当前值 */
    modelValue: T[keyof T]
    /** 控件的默认值 */
    defaultValue: T[keyof T]
    /** 选择器值的绑定key */
    pickerModelKey?: keyof T
    /** 选择器的当前值 */
    pickerModelValue?: T[keyof T]
    /** 选择器的默认值 */
    pickerDefaultValue?: T[keyof T]
    /** 检查值是否合法的函数 */
    validate?: (value: T[keyof T]) => boolean
    /**
     * 点击事件
     *
     * @param formData 表单数据
     */
    onClick?: (formData: T) => void
}

/** 组件选项 */
export interface IFormDialogOptions<T extends Record<string, any>> {
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
     * @param ares 关闭回调参数
     */
    unmount: (...ares: TFormDialogUnmountParam<T>) => void
    /** 控件列表 */
    controls: IFormDialogControl<T>[]
    /**
     * 提交时是否需要验证
     *
     * @default true
     */
    validateOnSubmit?: boolean
    /**
     * 提交后是否重置表单数据
     *
     * @default true
     */
    resetOnSubmit?: boolean
    /**
     * 对话框标题
     *
     * @default ''
     */
    title?: string
    /**
     * 是否显示取消按钮
     *
     * @default true
     */
    showCancelButton?: boolean
    /**
     * 是否显示确认按钮
     *
     * @default true
     */
    showConfirmButton?: boolean
    /**
     * 取消按钮文本
     *
     * @default '取消'
     */
    cancelButtonText?: string
    /**
     * 取消按钮文本颜色
     *
     * @default '#323233'
     */
    cancelButtonTextColor?: string
    /**
     * 确认按钮文本
     *
     * @default '提交'
     */
    confirmButtonText?: string
    /**
     * 确认按钮文本颜色
     *
     * @default '#1989fa'
     */
    confirmButtonTextColor?: string
    /**
     * 对话框宽度
     *
     * @default '640rpx'
     */
    width?: string
    /**
     * 动画名，参照 `nut-transition` 组件的 `name` 属性
     *
     * @param actionType 动作类型
     */
    transition?: NutAnimationName
    /**
     * 自定义字段验证函数
     *
     * @param control 控件配置
     * @returns {boolean} 验证结果，true 表示通过，false 表示未通过
     */
    validate?: (control: IFormDialogControl<T>) => boolean
    /**
     * 表单对话框关闭前回调
     *
     * @param actionType 动作类型
     * @returns {boolean | Promise<boolean>} 是否关闭对话框 true 表示关闭，false 表示不关闭
     */
    beforeClose?: (actionType: IFormDialogResult<T>) => boolean | Promise<boolean>
}

/** TYPE: 表单对话框Props(全部可选) */
type TFormDialogProps = Partial<IFormDialogOptions<Record<string, any>>>

const props = withDefaults(defineProps<TFormDialogProps>(), {
    show: false,
    customKey: "",
    showCancelButton: true,
    cancelButtonText: "取消",
    showConfirmButton: true,
    cancelButtonTextColor: "#323233",
    confirmButtonText: "提交",
    confirmButtonTextColor: "#1989fa",
    width: "640rpx",
    validateOnSubmit: true,
    resetOnSubmit: true,
    transition: "fade-up"
})

// EVENT: 定义 emits
const emits = defineEmits<{
    /** 当前索引 */
    (event: "update:show"): void
    /** 按钮点击 */
    (event: TFormDialogActionType, formDialogResult: IFormDialogResult<Record<string, any>>): void
    /** 关闭动画结束事件 */
    (event: "closed", formDialogResult: IFormDialogResult<Record<string, any>>): void
}>()

/** REF: 双向绑定 */
const { show } = useVModels(props, emits)

/** REF: 选项 */
const options = ref<TFormDialogProps>({
    ...deepClone<TFormDialogProps>(props),
    controls: props.controls
})

/** WATCH: 监听 show 的变化 */
watch(show, value => {
    // 当组件式调用显示时，让最新状态下的 props 覆盖 options
    if (value) {

        options.value = {
            ...deepClone<TFormDialogProps>(props),
            controls: props.controls
        }

    }
    options.value.show = value

})

/** CONST: 接收选项的key */
const KEY: TFormDialogCustomKey = `__FORM_DIALOG__${options.value.customKey || ""}`

/** REF: 函数式调用时注入的弹窗选项 */
const injectOptions: Ref<TFormDialogProps> = inject(KEY, options)

/** WATCH: 监听 函数式调用时注入的弹窗选项 的变化 */
watch(injectOptions, value => {
    // 如果使用的是组件式调用，则中断执行，避免修改options造成死循环
    if (!value.unmount) {

        return

    }

    options.value = {
        ...props,
        ...deepClone<TFormDialogProps>(value),
        controls: value.controls
    }

})

/** REACTIVE: 表单对话框结果 */
const formDialogResult: IFormDialogResult<Record<string, any>> = reactive({
    actionType: "click-cancel-button",
    formData: {}
})

/** EVENT: 打开对话框回调 */
const onOpen = () => {

    if (!options.value.controls) {

        console.error("onOpen() controls is required")
        return

    }

    // 重置表单数据为空对象
    formDialogResult.formData = {}
    // 将当前值赋值给表单数据
    options.value.controls.forEach(control => {

        formDialogResult.formData[control.modelKey] = control.modelValue

        // 如果存在选择器值的绑定key和绑定值，则将选择器的值赋值给表单数据
        if (control?.pickerModelKey && control?.pickerModelValue !== void 0) {

            formDialogResult.formData[control.pickerModelKey] = control.pickerModelValue

        }
        else if (!control.pickerModelKey && control.pickerModelValue === void 0) {
            // console.log('不做任何处理');
        }
        else {

            console.error("onOpen() 请检查 controls 中的 pickerModelKey 和 pickerModelValue 是否已经配置")

        }

    })

}

// EVENT: 点击控件
const onClickFormControl = (control: IFormDialogControl<Record<string, any>>) => {
    // 调用控件的点击事件
    if (typeof control.onClick === "function") {

        control.onClick(formDialogResult.formData)

    }

}

// FUN: 判断是否为空
const isEmpty = (value: any): boolean => {
    // null, undefined, 0, '', false
    if (!value) {

        return true

    }
    if (Array.isArray(value)) {
        // 空数组
        return value.length === 0

    }
    if (typeof value === "object") {
        // 空对象
        return Object.keys(value).length === 0

    }
    return false

}

// FUN: 表单验证函数
const validateForm = (): boolean => {
    // 检查是否存在输入框列表
    if (!options.value.controls || !formDialogResult.formData) {

        console.error("validateForm() formDialogResult.controls & formDialogResult.formData is required")
        return false

    }

    return options.value.controls.every(control => {
        // 获取当前字段的值
        const _value = formDialogResult.formData[control.modelKey]
        // 获取当前选择器值的绑定key
        const _pickerModelKey = control?.pickerModelKey
        // 获取当前字段是否必填 默认为true
        const _required = control?.required ?? true

        // 必填时，但值为空时，提示错误
        if (_required && isEmpty(_value)) {

            uni.showToast({
                title: control.placeholder,
                icon: "none"
            })
            return false

        }

        // 有值且选择器值的绑定key存在，但值为空时，提示错误
        if (_value && _pickerModelKey && !formDialogResult.formData[_pickerModelKey]) {

            uni.showToast({
                title: "当前选择的数据错误，请重新选择",
                icon: "none"
            })
            return false

        }

        // 调用验证函数（如果存在）
        if (_value && typeof control.validate === "function" && !control.validate(_value)) {

            return false

        }

        // 调用字段验证函数（如果存在）
        if (typeof options.value.validate === "function") {

            return options.value.validate(control)

        }

        return true

    })

}

// EVENT: 关闭前回调
const onBeforeClose = async(actionType: TDialogActionType) => {
    // 更新动作类型
    formDialogResult.actionType = actionType

    // 检查是否存在输入框列表
    if (!options.value.controls) {

        console.error("onBeforeClose() controls is required")
        return false

    }

    // 将当前值赋值给表单数据
    options.value.controls.forEach(control => {

        control.modelValue = formDialogResult.formData[control.modelKey]

        // 如果存在选择器值的绑定key和绑定值，则将选择器的值赋值给表单数据
        if (control?.pickerModelKey && control?.pickerModelValue !== void 0) {

            control.pickerModelValue = formDialogResult.formData[control.pickerModelKey]

        }
        else if (!control.pickerModelKey && control.pickerModelValue === void 0) {
            // console.log('不做任何处理');
        }
        else {

            console.error("onBeforeClose() 请检查 controls 中的 pickerModelKey 和 pickerModelValue 是否已经配置")

        }

    })

    // 检查是否需要验证
    if (actionType === "click-confirm-button" && options.value.validateOnSubmit && !validateForm()) {

        return false

    }

    if (typeof options.value.beforeClose === "function") {

        try {

            const _isClose = await options.value.beforeClose(formDialogResult)
            if (!_isClose) {

                return false

            }

        }
        catch (error) {

            console.error("onBeforeClose() beforeClose()", error)
            return false

        }

    }
    return true

}

/** EVENT: 关闭完成回调 */
const onClosed = () => {
    // 如果需要清空表单数据
    if (formDialogResult.actionType === "click-confirm-button" && options.value.resetOnSubmit) {

        options.value.controls?.forEach(control => {

            control.modelValue = control.defaultValue

            // 如果存在选择器值和默认值都存在时，重置选择器的值为最初的默认值
            if (control?.pickerModelValue !== void 0 && control?.pickerDefaultValue !== void 0) {

                control.pickerModelValue = control.pickerDefaultValue

            }
            else if (control?.pickerModelValue === void 0 && control?.pickerDefaultValue === void 0) {
                // console.log('不做任何处理');
            }
            else {

                console.error("onClosed() 请检查 controls 中的 pickerModelValue 和 pickerDefaultValue 是否已经配置")

            }

        })

    }

    options.value.unmount?.(formDialogResult)
    emits(formDialogResult.actionType, formDialogResult)
    emits("closed", formDialogResult)

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
    <Dialog
        class="form-dialog"
        v-model:show="options.show"
        :title="options.title"
        :show-cancel-button="options.showCancelButton"
        :show-confirm-button="options.showConfirmButton"
        :cancel-button-text="options.cancelButtonText"
        :cancel-button-text-color="options.cancelButtonTextColor"
        :confirm-button-text="options.confirmButtonText"
        :confirm-button-text-color="options.confirmButtonTextColor"
        :width="options.width"
        :transition="options.transition"
        :before-close="onBeforeClose"
        @open="onOpen"
        @closed="onClosed"
    >
        <view class="form-dialog__main">
            <FormControl
                class="form-dialog__main__form-control"
                v-for="(control, index) in options.controls"
                :key="index"
                v-bind="control"
                v-model="formDialogResult.formData![control.modelKey]"
                :on-click="() => onClickFormControl(control)"
            />
        </view>
    </Dialog>
</template>

<style lang="scss" scoped>
.form-dialog {
    &__main {
        box-sizing: border-box;
        width: 100%;
        padding: 50rpx 38rpx 70rpx;

        &__form-control {
            margin-bottom: 23rpx;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>
