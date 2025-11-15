<!--
 * @FileDesc: 单元格组件
 -->

<script setup lang="ts">
export interface ICellProps {
/**
 * 图标路径
 *
 * @default undefined
 */
    icon?: string
/**
 * 图标类名前缀
 *
 * @default 'nut-icon'
 */
    iconClassPrefix?: string
/**
 * 图标字体类名
 *
 * @default 'nutui-iconfont'
 */
    iconFontClassName?: string
/**
 * 图标颜色
 *
 * @default '#323F48'
 */
    iconColor?: string
/**
 * 图标大小
 *
 * @default '45rpx'
 */
    iconSize?: string

/**
 * 标题文本
 *
 * @default undefined
 */
    title: string
/**
 * 标题颜色
 *
 * @default '#323F48'
 */
    titleColor?: string
/**
 * 标题字体大小
 *
 * @default '24rpx'
 */
    titleSize?: string

/**
 * 右侧图标名称
 *
 * @default 'rect-right'
 */
    rightIcon?: string
/**
 * 右侧图标类名前缀
 *
 * @default 'nut-icon'
 */
    rightIconClassPrefix?: string
/**
 * 右侧图标字体类名
 *
 * @default 'nutui-iconfont'
 */
    rightIconFontClassName?: string
/**
 * 右侧图标颜色
 *
 * @default '#A0A3AF'
 */
    rightIconColor?: string
/**
 * 右侧图标大小
 *
 * @default '10rpx'
 */
    rightIconSize?: string

/**
 * 背景颜色
 *
 * @default '#ffffff'
 */
    background?: string
/**
 * 是否使用底部线条
 *
 * @default false
 */
    bottomLine?: boolean
/**
 * 底部线条颜色
 *
 * @default '#e5e5e5'
 */
    bottomLineColor?: string
/**
 * 圆角大小
 *
 * @default '16rpx'
 */
    borderRadius?: string
}

// DATA: 定义 props & 给定默认值
const props = withDefaults(defineProps<ICellProps>(), {
    iconClassPrefix: "nut-icon",
    iconFontClassName: "nutui-iconfont",
    iconColor: "#323F48",
    titleColor: "#323F48",
    iconSize: "45rpx",
    titleSize: "24rpx",
    rightIcon: "rect-right",
    rightIconClassPrefix: "nut-icon",
    rightIconFontClassName: "nutui-iconfont",
    rightIconColor: "#A0A3AF",
    rightIconSize: "24rpx",
    background: "#ffffff",
    bottomLine: false,
    bottomLineColor: "#e5e5e5",
    borderRadius: "16rpx"
})
</script>

<script lang="ts">
export default {
    options: {
        // 虚拟化组件节点，使组件外部样式能够直接作用到组件内部的第一层节点
        // eslint-disable-next-line padded-blocks
        virtualHost: true,
        // 允许父组件样式穿透到子组件
        // eslint-disable-next-line padded-blocks
        styleIsolation: "shared"
    }
}
</script>

<template>
    <view
        class="cell"
        hover-class="cell--hover"
        :hover-start-time="0"
        :style="{
            background: props.background,
            borderBottom: props.bottomLine ? `1rpx solid ${props.bottomLineColor}` : 'none',
            borderRadius: props.borderRadius
        }"
    >
        <slot name="icon">
            <nut-icon
                v-if="props.icon"
                :name="props.icon"
                :class-prefix="props.iconClassPrefix"
                :font-class-name="props.iconFontClassName"
                :custom-color="props.iconColor"
                :size="props.iconSize"
            />
        </slot>

        <view class="cell__title" :style="{ color: props.titleColor, fontSize: props.titleSize }">
            {{ props.title }}
        </view>

        <slot name="right-icon">
            <nut-icon
                v-if="props.rightIcon"
                :name="props.rightIcon"
                :class-prefix="props.rightIconClassPrefix"
                :font-class-name="props.rightIconFontClassName"
                :custom-color="props.rightIconColor"
                :size="props.rightIconSize"
            />
        </slot>
    </view>
</template>
<style lang="scss" scoped>
.cell {
    display: flex;
    gap: 0 16rpx;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 23rpx 32rpx;
    transition: background 0.2s;

    &--hover {
        background: #ececec !important;
    }

    &__title {
        flex: 1;
        font-weight: 500;
        @include text-ellipsis-mixin;
    }
}
</style>
