<!--
 * @FileDesc: 表单控件组件
 -->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
import { computed, type Ref } from "vue"

import type { IUploaderProps } from "./Uploader.vue"
import type { InputType } from "nutui-uniapp"

/** 表单控件类型 */
export type TFormControlType = InputType | "textarea" | "uploader"

export type TFormControlTextAlign = "left" | "center" | "right"

/** 组件属性接口 */
export interface IFormControlProps extends /* @vue-ignore */ Omit<IUploaderProps, "modelValue"> {
/**
 * 表单控件值
 *
 * @default ''
 */
    modelValue?: any
/**
 * 表单控件类型
 *
 * @default 'text'
 */
    type?: TFormControlType
/**
 * 标签
 *
 * @default ''
 */
    label?: string
/**
 * 表单控件占位符
 *
 * @default ''
 */
    placeholder?: string
/**
 * 占位符颜色
 *
 * @default '#d8d8d8'
 */
    placeholderColor?: string
/**
 * 是否必填
 *
 * @default true
 */
    required?: boolean
/**
 * 是否只读
 *
 * @default false
 */
    readonly?: boolean
/**
 * 是否显示红色的星号
 *
 * @default false
 */
    showRedAsterisk?: boolean
/**
 * 最大字符数
 */
    maxlength?: string | number
/**
 * 是否显示底部边框
 *
 * @default false
 */
    borderBottom?: boolean
/**
 * 当类型不为 textarea 时，右侧图标
 *
 * @default ''
 */
    rightIcon?: string
/**
 * 当类型为 textarea 时，是否展示输入字符。须配合 maxlength 使用
 *
 * @default false
 */
    limitShow?: boolean
/**
 * 输入框背景色
 *
 * @default 'transparent'
 */
    inputBackground?: string
/**
 * flex方向
 *
 * @default 'row'
 */
    flexDirection?: "row" | "column"
/**
 * - flexDirection: row 时代表水平间距
 * - flexDirection: column 时代表垂直间距
 *
 * @default '0rpx'
 */
    gap?: string
/**
 * 输入框对齐方式
 *
 * @default 'left'
 */
    textAlign?: TFormControlTextAlign
/**
 * 点击事件
 *
 * @param modelValue 双向绑定的值
 */
    onClick?: (modelValue: Ref<any>) => void
}

const props = withDefaults(defineProps<IFormControlProps>(), {
    modelValue: "",
    type: "text",
    label: "",
    placeholder: "",
    placeholderColor: "#d8d8d8",
    required: true,
    showRedAsterisk: false,
    readonly: false,
    borderBottom: false,
    rightIcon: "",
    limitShow: false,
    inputBackground: "transparent",
    flexDirection: "row",
    gap: "0rpx",
    textAlign: "left"
})

// 定义 emits
const emits = defineEmits<{
    /** 当前索引更新事件 */
    (event: "update:modelValue", value: string): void
}>()

// 双向绑定 modelValue
const { modelValue } = useVModels(props, emits)

/** COMPUTED: 表单控件样式 */
const formControlStyle = computed(() => {

    return {
        flexDirection: props.flexDirection,
        gap: props.flexDirection === "row" ? `0 ${props.gap}` : `${props.gap} 0`,
        borderBottom: props.borderBottom ? "1px solid #d8d8d8" : "none",
        padding: props.borderBottom ? "0 0 30rpx 0" : "0"
    }

})

/** COMPUTED: 表单控件 label 样式 */
const formControlLabelStyle = computed(() => {

    return {
        width: props.flexDirection === "row" ? "30%" : "100%"
    }

})

/** COMPUTED: 表单控件 input-box 样式 */
const formControlInputBoxStyle = computed(() => {

    return {
        background: props.inputBackground
    }

})

/** COMPUTED: placeholder 样式 */
const placeholderStyle = computed(() => {

    return `color: ${props.placeholderColor};`

})

/** EVENT: 点击控件 */
const onClickControl = () => {

    if (typeof props.onClick === "function") {

        props.onClick(modelValue)

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
    <view class="form-control" @tap="onClickControl" :style="formControlStyle">
        <view v-if="props.label" class="form-control__label" :style="formControlLabelStyle">
            <text v-if="props.required && props.showRedAsterisk" class="form-control__label__tag">*</text>

            {{ props.label }}
        </view>

        <view class="form-control__input-box" :style="formControlInputBoxStyle">
            <slot>
                <nut-textarea
                    v-if="props.type === 'textarea'"
                    class="form-control__input-box__input"
                    v-model="modelValue"
                    :placeholder="props.placeholder"
                    :placeholder-style="placeholderStyle"
                    :max-length="props.maxlength"
                    :limit-show="props.limitShow"
                    :readonly="props.readonly"
                    :cursor-spacing="80"
                    :disable-default-padding="true"
                    :show-confirm-bar="true"
                    :text-align="props.textAlign"
                />

                <NickNameInput
                    v-else-if="props.type === 'nickname'"
                    v-model="modelValue"
                    :placeholder="props.placeholder"
                    :text-align="props.textAlign"
                    :placeholder-style="placeholderStyle"
                    background="transparent"
                />

                <Uploader v-else-if="props.type === 'uploader'" v-bind="props" v-model="modelValue" />

                <nut-input
                    v-else
                    class="form-control__input-box__input"
                    v-model="modelValue"
                    :type="props.type"
                    :placeholder="props.placeholder"
                    :placeholder-style="placeholderStyle"
                    :readonly="props.readonly"
                    :max-length="props.maxlength"
                    :border="false"
                    :clearable="true"
                    :cursor-spacing="80"
                    :input-align="props.textAlign"
                >
                    <template v-if="props.rightIcon" #right>
                        <nut-icon :name="props.rightIcon" custom-color="#949494" />
                    </template>
                </nut-input>
            </slot>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.form-control {
    display: flex;
    box-sizing: border-box;
    width: 100%;

    &__label {
        color: #000000;
        font-size: 30rpx;

        &__tag {
            color: #ff4d4f;
        }
    }

    &__input-box {
        flex: 1;

        &__input {
            padding: 0;
            background: transparent;
        }

        :deep(.nut-input__input) {
            font-size: 30rpx !important;
        }

        :deep(.nut-textarea__textarea) {
            padding: 22rpx 10rpx !important;
            font-size: 30rpx !important;
        }

        :deep(.nut-input__right) {
            margin-right: 15rpx;
        }
    }
}
</style>
