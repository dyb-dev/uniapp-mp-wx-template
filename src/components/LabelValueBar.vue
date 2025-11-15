<!--
 * @FileDesc: 标签&值栏组件
 -->

<script setup lang="ts">
export interface ILabelValueBarProps {
/**
 * 标签文本
 */
    label: string
/**
 * 值文本
 */
    value: string
/**
 * 字体大小
 *
 * @default "30rpx"
 */
    fontSize?: string
/**
 * 水平间隔
 *
 * @default "10rpx"
 */
    horizontalSpacing?: string

/**
 * 文本对齐方式
 *
 * @default "right"
 */
    textAlign?: "left" | "center" | "right"
/**
 * 是否溢出文本省略为...
 *
 * @default true
 */
    ellipsis?: boolean
/**
 * label 颜色
 *
 * @default "#808089"
 */
    labelColor?: string
/**
 * label的文本粗细
 *
 * @default "normal"
 */
    labelFontWeight?: string
/**
 * label 宽度
 *
 * @default "25%"
 */
    labelWidth?: string
/**
 * value 颜色
 *
 * @default "#28282b"
 */
    valueColor?: string
/**
 * 值的文本粗细
 *
 * @default "500"
 */
    valueFontWeight?: string
}

// DATA: 定义 props & 给定默认值
const props = withDefaults(defineProps<ILabelValueBarProps>(), {
    fontSize: "30rpx",
    horizontalSpacing: "10rpx",
    labelFontWeight: "normal",
    valueFontWeight: "500",
    textAlign: "right",
    ellipsis: true,
    labelColor: "#808089",
    labelWidth: "25%",
    valueColor: "#28282b"
})
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
    <view
        class="label-value-bar"
        :style="{
            fontSize: props.fontSize,
            gap: `0 ${props.horizontalSpacing}`
        }"
    >
        <view
            class="label-value-bar__label"
            :style="{
                color: props.labelColor,
                width: props.labelWidth,
                fontWeight: props.labelFontWeight
            }"
        >
            {{ props.label }}
        </view>

        <view
            class="label-value-bar__value"
            :style="{
                color: props.valueColor,
                fontWeight: props.valueFontWeight,
                textAlign: props.textAlign
            }"
            :class="{ 'label-value-bar__value--ellipsis': props.ellipsis }"
        >
            <slot>{{ props.value }}</slot>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.label-value-bar {
    display: flex;
    box-sizing: border-box;
    width: 100%;

    &__label {
        flex-shrink: 0;
    }

    &__value {
        flex: 1;

        &--ellipsis {
            @include text-ellipsis-mixin;
        }
    }
}
</style>
