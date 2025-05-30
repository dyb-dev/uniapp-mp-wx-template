<!--
 * @Author: dyb-dev
 * @Date: 2024-10-05 14:00:48
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-14 17:04:33
 * @FilePath: /uniapp-mp-wx-template/src/components/layout/TabBar.vue
 * @Description: 底部导航栏
-->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
import { computed } from "vue"

import pagesJson from "@/pages.json"
import { navigateToPage, isImagePath } from "@/utils"

/** TabBar 列表项 */
export interface TTabBarItem {
/**
 * 页面路径
 */
    pagePath: SwitchTabOptions["url"]
/**
 * tab 文本
 */
    text: string
/**
 * 未选中时的icon，可传图标名字或图片路径
 */
    icon: string
/**
 * 选中时的icon，可传图标名字或图片路径
 */
    selectedIcon: string
/**
 * 自定义 icon 字体基础类名
 * 如果 `icon` 和 `selectedIcon` 为icon名时，有效
 *
 * @default 'nut-icon'
 */
    classPrefix?: string
/**
 * 自定义 icon 类名前缀，用于使用自定义图标
 * 如果 `icon` 和 `selectedIcon` 为icon名时，有效
 *
 * @default 'nutui-iconfont'
 */
    fontClassName?: string
/**
 * 是否显示右上角圆点
 * 如果为 `true` 时，则 `dotValue` 会无效
 *
 * @default false
 */
    showDot?: boolean
/**
 * tabBar 右上角点的值
 * 如果 > 0 则显示数字，当 `showDot` 为false时有效
 *
 * @default 0
 */
    dotValue?: number
}

export interface ITabBarProps {
    /**
     * 当前选中的 tab 索引
     *
     * @default 0
     */
    modelValue: number
    /**
     * TabBar 高度
     * 如未传入，则会根据 `pages.json` 相关配置来设置
     * 优先级为：`props.height` > `tabBar.height`
     *
     * @default 104rpx
     */
    height?: string
    /**
     * TabBar 背景，支持普通颜色或渐变颜色或背景图片
     * 如未传入，则会根据 `pages.json` 相关配置来设置
     * 优先级为：`props.background` > `tabBar.backgroundColor`
     *
     * @default #fff
     */
    background?: string
    /**
     * Tab 上文字和图标的默认颜色
     * 如未传入，则会根据 `pages.json` 相关配置来设置
     * 优先级为：`props.color` > `tabBar.color`
     *
     * @default #7d7e80
     */
    color?: string
    /**
     * Tab 上文字和图标的选中时颜色
     * 如未传入，则会根据 `pages.json` 相关配置来设置
     * 优先级为：`props.selectedColor` > `tabBar.selectedColor`
     *
     * @default #1989fa
     */
    selectedColor?: string
    /**
     * TabBar 上边框颜色
     * 如未传入，则会根据 `pages.json` 相关配置来设置
     * 优先级为：`props.borderTopColor` > `tabBar.borderStyle`
     *
     * @default #eee
     */
    borderTopColor?: string
    /**
     * 文字大小
     * 如未传入，则会根据 `pages.json` 相关配置来设置
     * 优先级为：`props.fontSize` > `tabBar.fontSize`
     *
     * @default 20rpx
     */
    fontSize?: string
    /**
     * icon 或者 图片 大小，如果传入图片路径，则会设置图片宽高相等
     * 如未传入，则会根据 `pages.json` 相关配置来设置
     * 优先级为：`props.iconSize` > `tabBar.iconWidth`
     *
     * @default 40rpx
     */
    iconSize?: string
    /**
     * icon 和文字的间距
     * 如未传入，则会根据 `pages.json` 相关配置来设置
     * 优先级为：`props.spacing` > `tabBar.spacing`
     *
     * @default 0rpx
     */
    spacing?: string
    /**
     * tabBar 右上角点背景颜色
     * 如未传入，则会根据 `pages.json` 相关配置来设置
     * 优先级为：`props.dotColor` > `tabBar.redDotColor`
     *
     * @default linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)
     */
    dotColor?: string
    /**
     * tabBar 右上角点的值为数字时，最大值
     *
     * @default 99
     */
    dotMaxValue?: number
    /**
     * 是否在 tabBar 位置生成一个等高的占位元素
     *
     * @default true
     */
    placeholder?: boolean
    /**
     * 是否固定在底部
     *
     * @default true
     */
    fixed?: boolean
    /**
     * TabBar 列表项
     *
     * @default []
     */
    list: TTabBarItem[]
}

const props = withDefaults(defineProps<ITabBarProps>(), {
    modelValue: 0,
    dotMaxValue: 99,
    placeholder: true,
    fixed: true,
    list: () => []
})

// EVENT: 定义 emits
const emits = defineEmits<{
    /** 当前索引 */
    (event: "update:modelValue"): void
    /** 点击 tab-bar-item */
    (event: "click-tab-bar-item", item: TTabBarItem, index: number): void
}>()

/** REF: 双向绑定 */
const { modelValue } = useVModels(props, emits)

/** CONST: tabBar 配置 */
const TAB_BAR_CONFIG = pagesJson?.tabBar || null

/** COMPUTED: tab-bar 高度 */
const height = computed(() => {
    // @ts-ignore
    return props.height || TAB_BAR_CONFIG?.height || "104rpx"

})

/** COMPUTED: tab-bar 高度表达式 */
const heightExpression = computed(() => props.placeholder ? `calc(${height.value} + env(safe-area-inset-bottom))` : "0rpx")

/** COMPUTED: tab-bar 背景 */
const background = computed(() => {
    // @ts-ignore
    return props.background || TAB_BAR_CONFIG?.backgroundColor || "#fff"

})

/** COMPUTED: tab-bar 颜色 */
const color = computed(() => {
    // @ts-ignore
    return props.color || TAB_BAR_CONFIG?.color || "#7d7e80"

})

/** COMPUTED: tab-bar 选中时颜色 */
const selectedColor = computed(() => {
    // @ts-ignore
    return props.selectedColor || TAB_BAR_CONFIG?.selectedColor || "#1989fa"

})

/** COMPUTED: tab-bar 上边框颜色 */
const borderTopColor = computed(() => {
    // @ts-ignore
    return props.borderTopColor || TAB_BAR_CONFIG?.borderStyle || "#eee"

})

/** COMPUTED: tab-bar 字体大小 */
const fontSize = computed(() => {
    // @ts-ignore
    return props.fontSize || TAB_BAR_CONFIG?.fontSize || "20rpx"

})

/** COMPUTED: tab-bar icon 大小 */
const iconSize = computed(() => {
    // @ts-ignore
    return props.iconSize || TAB_BAR_CONFIG?.iconWidth || "40rpx"

})

/** COMPUTED: tab-bar icon 和 文字 的间距 */
const spacing = computed(() => {
    // @ts-ignore
    return props.spacing || TAB_BAR_CONFIG?.spacing || "0rpx"

})

/** COMPUTED: tab-bar 右上角点颜色 */
const dotColor = computed(() => {

    return (
        props.dotColor ||
        // @ts-ignore
        TAB_BAR_CONFIG?.redDotColor ||
        "linear-gradient(135deg, #fa2c19 0%, #fa6419 100%)"
    )

})

// EVENT: 点击 tab-bar 项
async function onClickTabBarItem(item: TTabBarItem, index: number) {
    // 点击当前已选择的 tab-bar 项时
    if (modelValue.value === index) {

        return

    }

    navigateToPage({
        path: ("/" + item.pagePath) as SwitchTabOptions["url"],
        method: "switchTab",
        findBackDelta: false,
        success: () => {

            modelValue.value = index
            emits("click-tab-bar-item", item, index)

        }
    })

}

/** 将当前显示的左侧icon的类型暴露给父组件 */
defineExpose({
    heightExpression
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
        class="tab-bar-placeholder"
        :style="{
            height: heightExpression
        }"
    >
        <view
            class="tab-bar"
            :class="{ 'tab-bar--fixed': props.fixed }"
            :style="{
                height: height,
                background: background,
                borderTop: `1px solid ${borderTopColor}`
            }"
        >
            <view v-for="(item, index) in props.list" :key="index" class="tab-bar__item">
                <nut-badge
                    :dot="item.showDot"
                    :value="item.dotValue"
                    :custom-color="dotColor"
                    :top="item.dotValue ? '5rpx' : '0rpx'"
                    :max="props.dotMaxValue"
                >
                    <view
                        class="tab-bar__item__icon-box"
                        :style="{
                            color: modelValue === index ? selectedColor : color,
                            gap: `${spacing} 0`
                        }"
                        @tap="onClickTabBarItem(item, index)"
                    >
                        <image
                            v-if="isImagePath(modelValue === index ? item.selectedIcon : item.icon)"
                            :src="modelValue === index ? item.selectedIcon : item.icon"
                            style="display: block"
                            :style="{
                                width: iconSize,
                                height: iconSize
                            }"
                            mode="aspectFit"
                        />

                        <nut-icon
                            v-else
                            :width="iconSize"
                            :height="iconSize"
                            :size="iconSize"
                            :class-prefix="item.classPrefix"
                            :font-class-name="item.fontClassName"
                            :name="modelValue === index ? item.selectedIcon : item.icon"
                        />

                        <view :style="{ fontSize: fontSize }">{{ item.text }}</view>
                    </view>
                </nut-badge>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.tab-bar {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: content-box;
    width: 100%;
    padding-bottom: env(safe-area-inset-bottom);
    overflow: hidden;

    &--fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 10;
    }

    &__item {
        position: relative;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        text-decoration: none;

        &__icon-box {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
}
</style>
