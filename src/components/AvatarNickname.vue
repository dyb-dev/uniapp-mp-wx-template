<!--
 * @FileDesc: 头像昵称组件
 -->

<script setup lang="ts">
/**
 * 头像和昵称组件的 Props 接口
 */
export interface IAvatarNicknameProps {
/**
 * 头像图片路径
 */
    avatar: string
/**
 * 昵称
 */
    nickname: string
/**
 * 布局方式
 * - 'horizontal' | 'vertical'
 *
 * @default 'vertical'
 */
    layout?: "horizontal" | "vertical"
/**
 * 头像和昵称的间隔
 *
 * @default '16rpx'
 */
    gap?: string
/**
 * 头像图片大小
 *
 * @default '163rpx'
 */
    avatarSize?: string
/**
 * 字体大小
 *
 * @default '32rpx'
 */
    fontSize?: string
/**
 * 字体颜色
 *
 * @default '#000000'
 */
    fontColor?: string
/**
 * 字体加粗
 *
 * @default '500'
 */
    fontWeight?: string
/**
 * 文字对齐方式
 *
 * @default 'center'
 */
    textAlign?: string
}

// DATA: 定义 props & 给定默认值
const props = withDefaults(defineProps<IAvatarNicknameProps>(), {
    layout: "vertical",
    gap: "16rpx",
    avatarSize: "163rpx",
    fontSize: "32rpx",
    fontColor: "#000000",
    fontWeight: "500",
    textAlign: "center"
})
</script>

<script lang="ts">
export default {
    options: {
        // 虚拟化组件节点，使组件外部样式能够直接作用到组件内部的第一层节点
        virtualHost: true,
        // 允许父组件样式穿透到子组件
        styleIsolation: "shared"
    }
}
</script>

<template>
    <view
        class="avatar-nickname"
        :class="`avatar-nickname--${props.layout}`"
        :style="{
            gap: props.layout === 'vertical' ? `${props.gap} 0` : `0 ${props.gap}`
        }"
    >
        <image
            class="avatar-nickname__avatar"
            :src="props.avatar"
            mode="scaleToFill"
            :style="{ width: props.avatarSize, height: props.avatarSize }"
        />
        <view
            class="avatar-nickname__nickname"
            :style="{
                color: props.fontColor,
                fontSize: props.fontSize,
                fontWeight: props.fontWeight,
                textAlign: props.textAlign
            }"
        >
            {{ props.nickname }}
        </view>
    </view>
</template>

<style lang="scss" scoped>
.avatar-nickname {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;

    &--vertical {
        flex-direction: column;
    }

    &--horizontal {
        flex-direction: row;
    }

    &__avatar {
        display: block;
        flex-shrink: 0;
        border-radius: 50%;
    }

    &__nickname {
        flex: 1;
        width: 100%;
        @include text-ellipsis-mixin;
    }
}
</style>
