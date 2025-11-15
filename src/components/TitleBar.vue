<!--
 * @FileDesc: 标题栏组件
 -->

<script setup lang="ts">
export interface ITitleProps {
/** 竖线颜色 */
    lineColor?: string
/** 竖线高度 */
    lineHeight?: number
/** 文字大小 */
    fontSize?: number
/** 文字颜色 */
    textColor?: string
/** 文字粗细 */
    fontWeight?: string
/** 文字描述 */
    desc: string
/** 是否显示竖线 */
    showLine?: boolean
/** 是否显示查看更多按钮 */
    showViewMore?: boolean
}

// DATA: 定义 props & 给定默认值
const props = withDefaults(defineProps<ITitleProps>(), {
    lineColor: "#29d446",
    lineHeight: 30,
    fontSize: 34,
    textColor: "#000000",
    fontWeight: "500",
    desc: "",
    showLine: true,
    showViewMore: false
})

// EVENT: 定义 emits
const emits = defineEmits<{
    (event: "view-more"): void
}>()

/** EVENT: 点击查看更多按钮 */
const onClickViewMoreButton = () => {

    emits("view-more")

}
</script>

<script lang="ts">
export default {
    options: {
        // 虚拟化组件节点，使组件外部样式能够直接作用到组件内部的第一层节点
        // eslint-disable-next-line padded-blocks
        virtualHost: true,
        // 允许父组件样式穿透到子组件
        styleIsolation: "shared"
    }
}
</script>

<template>
    <view class="title-bar">
        <view
            v-if="props.showLine"
            class="title-bar__line"
            :style="{
                backgroundColor: props.lineColor,
                height: `${props.lineHeight}rpx`
            }"
        />

        <view
            class="title-bar__desc"
            :style="{
                fontSize: `${props.fontSize}rpx`,
                color: props.textColor,
                fontWeight: props.fontWeight
            }"
        >
            {{ props.desc }}
        </view>

        <view v-if="props.showViewMore" class="title-bar__right" @tap="onClickViewMoreButton">查看更多</view>
    </view>
</template>

<style lang="scss" scoped>
.title-bar {
    display: flex;
    gap: 15rpx;
    align-items: center;
    width: 100%;
    overflow: hidden;
    color: $uni-text-color;

    &__line {
        width: 7rpx;
        border-radius: 20rpx;
    }
    &__desc {
        flex: 1;
        @include text-ellipsis-mixin;
    }
    &__right {
        color: #29d446;
        font-size: 28rpx;
    }
}
</style>
