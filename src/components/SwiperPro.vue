<!--
 * @FileDesc: 轮播图组件
 -->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
import { ref } from "vue"

// 轮播图项接口
export interface ISwiperProItem {
/** 图片路径 */
    imgPath: string
}

/** 组件属性接口 */
export interface ISwiperProProps {
/**
 * 当前轮播索引
 *
 * @default 0
 */
    modelValue?: number
/**
 * 轮播图列表
 *
 * @default []
 */
    list: ISwiperProItem[]
/**
 * 轮播图宽度
 *
 * @default '100%'
 */
    width?: string
/**
 * 轮播图高度
 *
 * @default '0rpx'
 */
    height: string
/**
 * 自动播放间隔 (ms) 为 0 时停止自动播放
 *
 * @default 2000
 */
    autoPlay?: number | string
/**
 * 是否显示切换按钮
 *
 * @default false
 */
    showToggleButton?: boolean
/**
 * 切换按钮颜色
 *
 * @default '#ffffff'
 */
    toggleButtonColor?: string
/**
 * 切换按钮icon颜色
 *
 * @default '#A68001'
 */
    toggleButtonIconColor?: string
/**
 * 是否显示指示器
 *
 * @default true
 */
    showIndicator?: boolean
/**
 * 指示器间隔
 *
 * @default '16rpx'
 */
    indicatorGap?: string
/**
 * 指示器项默认背景颜色
 *
 * @default '#d8d8d8'
 */
    indicatorDefaultColor?: string
/**
 * 指示器项选中背景颜色
 *
 * @default '#323f48'
 */
    indicatorActiveColor?: string
/**
 * 指示器项默认大小
 *
 * @default '12rpx'
 */
    indicatorSize?: string
/**
 * 指示器项选中宽度
 *
 * @default '45rpx'
 */
    indicatorActiveWidth?: string
/**
 * 指示器位置
 *
 * @default 'outside'
 */
    indicatorPosition?: "inside" | "outside"
}

const props = withDefaults(defineProps<ISwiperProProps>(), {
    modelValue: 0,
    list: () => [],
    width: "100%",
    height: "0rpx",
    autoPlay: 2000,
    showToggleButton: false,
    toggleButtonColor: "#ffffff",
    toggleButtonIconColor: "#A68001",
    showIndicator: true,
    indicatorGap: "16rpx",
    indicatorDefaultColor: "#d8d8d8",
    indicatorActiveColor: "#323f48",
    indicatorSize: "12rpx",
    indicatorActiveWidth: "45rpx",
    indicatorPosition: "inside"
})

// 定义 emits
const emits = defineEmits<{
    /** 当前索引更新事件 */
    (event: "update:modelValue", value: number): void
    /** 点击轮播图事件 */
    (event: "click-swiper-image", item: ISwiperProItem): void
}>()

// 双向绑定 modelValue
const { modelValue } = useVModels(props, emits)

// 点击轮播图事件
const onClickSwiperImage = (item: ISwiperProItem) => {

    emits("click-swiper-image", item)

}

// EVENT: 轮播图切换事件
const onChangeSwiper = (index: number) => {

    modelValue.value = index

}

/** REF: 轮播组件实例 */
const swiper = ref()

// EVENT: 点击左切换按钮事件
const onClickToggleLeft = () => {

    swiper.value?.prev()

}

// EVENT: 点击右切换按钮事件
const onClickToggleRight = () => {

    swiper.value?.next()

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
    <view class="swiper-pro" :style="{ width: props.width }">
        <nut-swiper
            ref="swiper"
            class="swiper-pro__main"
            :style="{ height: props.height }"
            :init-page="0"
            :auto-play="props.autoPlay"
            @change="onChangeSwiper"
        >
            <nut-swiper-item class="swiper-pro__main__swiper-item" v-for="(item, index) in props.list" :key="index">
                <image
                    class="swiper-pro__main__swiper-item__img"
                    :src="item.imgPath"
                    mode="scaleToFill"
                    alt=""
                    @tap="onClickSwiperImage(item)"
                />
            </nut-swiper-item>
        </nut-swiper>

        <view
            v-if="props.showIndicator"
            class="swiper-pro__pagination"
            :class="{
                'swiper-pro__pagination--inside': props.indicatorPosition === 'inside',
                'swiper-pro__pagination--outside': props.indicatorPosition === 'outside'
            }"
            :style="{
                gap: `0 ${props.indicatorGap}`
            }"
        >
            <view
                class="swiper-pro__pagination__item"
                v-for="(_, index) in props.list"
                :key="index"
                :class="{
                    'swiper-pro__pagination__item--active': index === modelValue
                }"
                :style="{
                    width: index === modelValue ? props.indicatorActiveWidth : props.indicatorSize,
                    height: props.indicatorSize,
                    backgroundColor: index === modelValue ? props.indicatorActiveColor : props.indicatorDefaultColor
                }"
            />
        </view>

        <template v-if="props.showToggleButton">
            <nut-button
                type="primary"
                :custom-color="props.toggleButtonColor"
                class="swiper-pro__button swiper-pro__button--left"
                @tap="onClickToggleLeft"
            >
                <nut-icon
                    name="rect-left"
                    :custom-color="props.toggleButtonIconColor"
                    size="25rpx"
                    :custom-style="{ display: 'block' }"
                />
            </nut-button>

            <nut-button
                type="primary"
                :custom-color="props.toggleButtonColor"
                class="swiper-pro__button swiper-pro__button--right"
                @tap="onClickToggleRight"
            >
                <nut-icon
                    name="rect-right"
                    :custom-color="props.toggleButtonIconColor"
                    size="25rpx"
                    :custom-style="{ display: 'block' }"
                />
            </nut-button>
        </template>
    </view>
</template>

<style lang="scss" scoped>
.swiper-pro {
    position: relative;

    &__main {
        width: 100%;

        &__swiper-item {
            &__img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }

    &__pagination {
        display: flex;
        align-items: center;
        width: fit-content;

        &--inside {
            position: absolute;
            bottom: 32rpx;
            left: 50%;
            transform: translateX(-50%);
        }

        &--outside {
            position: relative;
            margin: 30rpx auto 0;
        }

        &__item {
            border-radius: 50%;
            transition: all 0.3s;

            &--active {
                border-radius: 17% / 50%;
            }
        }
    }

    &__button {
        position: absolute;
        top: 50%;
        width: 66rpx;
        height: 66rpx;
        padding: 0;
        border: none;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        transform: translateY(-50%);

        &--left {
            left: 0;
        }

        &--right {
            right: 0;
        }
    }
}
</style>
