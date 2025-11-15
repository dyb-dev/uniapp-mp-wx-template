<!--
 * @FileDesc: 页面布局容器
 -->

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app"
import { computed, useSlots, ref } from "vue"

import NavBar from "@/components/layout/NavBar.vue"
import TabBar from "@/components/layout/TabBar.vue"
import pagesJson from "@/pages.json"
import { useTabBarStore } from "@/stores"

import type { INavBarProps, TNavBarLeftIconType } from "@/components/layout/NavBar.vue"
import type { ITabBarProps, TTabBarItem } from "@/components/layout/TabBar.vue"

export interface ILayoutProps {
/**
 * 是否显示自定义导航栏
 * 设置为 `true` 时，还需要 `pages.json` 设置 globalStyle.navigationStyle 为 custom
 *
 * @default true
 */
    showCustomNavBar?: boolean
/**
 * 是否启用页面滑动
 *
 * @default true
 */
    scroll?: boolean
/**
 * 是否隐藏滚动条
 *
 * @default true
 */
    hideScrollBar?: boolean
/**
 * 页面主内容背景，不包含 `顶部导航栏` 和 `底部导航栏`，支持普通颜色或渐变颜色或背景图片
 *
 * @default #F7F8F9
 */
    background?: string
/**
 * 顶部导航栏配置，默认值请参考 `NavBar` 组件
 */
    navBarProps?: INavBarProps
/**
 * 底部导航栏配置，默认值请参考 `TabBar` 组件
 */
    tabBarProps?: Omit<ITabBarProps, "modelValue" | "list">
}

const props = withDefaults(defineProps<ILayoutProps>(), {
    showCustomNavBar: true,
    scroll: true,
    hideScrollBar: true,
    background: "#F7F8F9"
})

// EVENT: 定义 emits
const emits = defineEmits<{
    /** 点击`导航栏`左边icon */
    (event: "click-nav-bar-left-icon", clickNavBarLeftIconType: TNavBarLeftIconType): void
    /** 点击`导航栏`标题 */
    (event: "click-nav-bar-title"): void
    /** 点击`tab-bar-item` */
    (event: "click-tab-bar-item", item: TTabBarItem, index: number): void
}>()

/** CONST: 是否允许显示自定义顶部导航栏 */
const isAllowCustomNavBar =
// @ts-ignore
    pagesJson.globalStyle?.navigationStyle === "custom"

!isAllowCustomNavBar &&
    console.warn("您当前使用默认导航栏,如果需要自定义导航栏,请将 pages.json 中的 globalStyle.navigationStyle 设置为 custom")

/** COMPUTED: 是否显示自定义顶部导航栏 */
const showCustomNavBar = computed(() => isAllowCustomNavBar && props.showCustomNavBar)

/** CONST: 是否允许自定义底部导航栏 */
// @ts-ignore
const isAllowCustomTabBar = pagesJson?.tabBar?.custom

!isAllowCustomTabBar && console.warn("您当前使用默认tab-bar,如果需要自定义tab-bar,请将 pages.json 中的 tabBar.custom 设置为 true")

/** HOOKS: tabBar商店状态 */
const { tabBarStoreState, getCurrentTabBarItem, updateCurrentTabBarIndex } = useTabBarStore()

/** CONST: 是否显示自定义底部导航栏 */
const showCustomTabBar = isAllowCustomTabBar && getCurrentTabBarItem()

/** LIFECYCLE: 组件显示 */
onShow(() => {
    // 显示自定义底部导航栏时，更新当前 TabBar 索引
    if (showCustomTabBar) {

        updateCurrentTabBarIndex()

    }

})

/** CONST: 主题变量 */
const themeVars = {
    // 组件主题色
    primaryColor: "#29d446",
    // 标签组件主题色
    tagPrimaryBackgroundColor: "#29d446"
}

/** HOOKS: 获取传入插槽 */
const slots = useSlots()

/** CONST: 导航栏左侧插槽名称 */
const navBarLeftSlotName = "nav-bar-left"
/** CONST: 导航栏标题插槽名称 */
const navBarTitleSlotName = "nav-bar-title"

/** CONST: 导航栏组件左侧插槽名称 */
const navBarComponentLeftSlotName = (slots[navBarLeftSlotName] ? "left" : "") as string
/** CONST: 导航栏组件标题插槽名称 */
const navBarComponentTitleSlotName = (slots[navBarTitleSlotName] ? "title" : "") as string

/** REF: NavBar 实例 */
const navBarInstance = ref<InstanceType<typeof NavBar>>()

/** REF: TabBar 实例 */
const tabBarInstance = ref<InstanceType<typeof TabBar>>()

/**
 * FUN: 获取导航栏和底部导航栏的高度表达式
 *
 * @returns {string} 高度表达式
 */
const getNavTabHeightExpression = () =>
    `calc(${navBarInstance.value?.heightExpression || "0rpx"} + ${tabBarInstance.value?.heightExpression || "0rpx"})`

/** 将当前显示的左侧icon的类型暴露给父组件 */
defineExpose({
    navBarInstance,
    tabBarInstance,
    getNavTabHeightExpression
})
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
    <nut-config-provider class="layout" :theme-vars="themeVars">
        <NavBar
            v-if="showCustomNavBar"
            ref="navBarInstance"
            v-bind:="props.navBarProps"
            @click-left-icon="clickLeftIconType => emits('click-nav-bar-left-icon', clickLeftIconType)"
            @click-title="emits('click-nav-bar-title')"
        >
            <template #[navBarComponentLeftSlotName]>
                <slot :name="navBarLeftSlotName" :left-icon-type="navBarInstance?.leftIconType"></slot>
            </template>

            <template #[navBarComponentTitleSlotName]>
                <slot :name="navBarTitleSlotName"></slot>
            </template>
        </NavBar>

        <view
            class="layout__main"
            :class="{
                'layout__main--scroll': props.scroll,
                'layout__main--hide-scroll-bar': props.hideScrollBar
            }"
            :style="{ background: props.background }"
        >
            <slot name="default"></slot>
        </view>

        <TabBar
            v-if="showCustomTabBar"
            ref="tabBarInstance"
            v-bind:="props.tabBarProps"
            v-model="tabBarStoreState.currentIndex"
            :list="tabBarStoreState.list"
            @click-tab-bar-item="(item, index) => emits('click-tab-bar-item', item, index)"
        />

        <!-- 用于插入额外内容 -->
        <slot name="extra-content"></slot>
    </nut-config-provider>
</template>

<style lang="scss" scoped>
.layout {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    &__main {
        position: relative;
        flex: 1;
        box-sizing: border-box;
        width: 100%;

        &--scroll {
            @include open-scroll-mixin;
        }

        &--hide-scroll-bar {
            @include hide-scroll-bar-mixin;
        }
    }
}
</style>
