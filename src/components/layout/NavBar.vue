<!--
 * @Author: dyb-dev
 * @Date: 2024-09-20 21:09:38
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-09 13:32:56
 * @FilePath: /uniapp-mp-wx-template/src/components/layout/NavBar.vue
 * @Description: 顶部导航栏
-->

<script setup lang="ts">
import { getImageInfo } from "@uni-helper/uni-promises"
import { computed, ref, watch } from "vue"

import pagesJson from "@/pages.json"
import { useTabBarStore } from "@/stores"
import { getCurrentPageConfig, navigateBack, navigateToPage, isImagePath } from "@/utils"

/** TYPE: 导航栏左侧默认显示icon的类型 */
export type TNavBarLeftIconType = "back" | "home" | ""

export interface INavBarProps {
/**
 * @description 导航栏背景，支持普通颜色或渐变颜色或背景图片
 * @description 如未传入，则会根据 `pages.json` 相关配置来设置
 * @description 优先级为：`props.background` > `style.navigationBarBackgroundColor` > `globalStyle.navigationBarBackgroundColor`
 * @default #fff
 */
    background?: string
/**
 * @description 左侧icon 和 标题的颜色
 * @description 如未传入，则会根据 `pages.json` 相关配置来设置
 * @description 优先级为：`props.color` > `style.navigationBarTextStyle` > `globalStyle.navigationBarTextStyle`
 * @default #000
 */
    color?: string
/**
 * @description 左侧 返回 icon，可传图标名字或图片路径
 * @default rect-left
 */
    backIcon?: string
/**
 * @description 左侧 返回 icon 的大小
 * @description 传入`icon`时，对应icon的大小，默认: 35rpx
 * @description 传入`图片路径`时，对应图片的宽度大小，图片高度会根据图片比例自适应，默认: 图片原始宽度
 */
    backIconSize?: string
/**
 * @description 左侧 返回 icon 字体类名
 * @default nutui-iconfont
 */
    backIconFontClassName?: string
/**
 * @description 左侧 返回 icon 前缀
 * @default nut-icon
 */
    backIconClassPrefix?: string
/**
 * @description 左侧 首页 icon，可传图标名字或图片路径
 * @default home
 */
    homeIcon?: string
/**
 * @description 左侧 首页 icon 的大小
 * @description 传入`icon`时，对应icon的大小，默认: 35rpx
 * @description 传入`图片路径`时，对应图片的宽度大小，图片高度会根据图片比例自适应，默认: 图片原始宽度
 */
    homeIconSize?: string
/**
 * @description 左侧 首页 icon 字体类名
 * @default nutui-iconfont
 */
    homeIconFontClassName?: string
/**
 * @description 左侧 首页 icon 前缀
 * @default nut-icon
 */
    homeIconClassPrefix?: string
/**
 * @description 标题，可传文本或图片链接
 * @description 如未传入，则会根据 `pages.json` 相关配置来设置
 * @description 优先级为：`props.title` > `style.navigationBarTitleText` > `globalStyle.navigationBarTitleText`
 * @default ''
 */
    title?: string
/**
 * @description 标题的大小
 * @description 传入`文本`时，对应标题的字体大小，默认: 32rpx
 * @description 传入`图片路径`时，对应图片的宽度大小，图片高度会根据图片比例自适应，默认: 图片原始宽度
 */
    titleSize?: string
/**
 * @description 是否显示左侧内容
 * @default true
 */
    showLeft?: boolean
/**
 * @description 是否固定在顶部
 * @default false
 */
    fixed?: boolean
/**
 * @description 是否在导航栏位置生成一个等高的占位元素
 * @default false
 */
    showPlaceholder?: boolean
/**
 * @description 是否显示底部边框
 * @default true
 */
    showBottomBorder?: boolean
/**
 * @description 导航栏 下边框颜色
 * @default #eee
 */
    borderBottomColor?: string
/**
 * @description 点击左侧 icon 前的回调函数，返回布尔值决定是否继续执行跳转逻辑
 * @param leftIconType 当前显示的左侧icon的类型: 'back' | 'home' | ''
 */
    beforeLeftIconClick?: (leftIconType: TNavBarLeftIconType) => Promise<boolean> | boolean
/**
 * @description 点击 标题 前时的回调函数
 */
    beforeTitleClick?: () => void
}

const props = withDefaults(defineProps<INavBarProps>(), {
    backIconClassPrefix: "nut-icon",
    backIconFontClassName: "nutui-iconfont",
    homeIconClassPrefix: "nut-icon",
    homeIconFontClassName: "nutui-iconfont",
    backIcon: "rect-left",
    homeIcon: "home",
    showLeft: true,
    fixed: true,
    showPlaceholder: true,
    showBottomBorder: true,
    borderBottomColor: "#eee"
})

// EVENT: 定义 emits
const emits = defineEmits<{
    /** 点击左边icon */
    (event: "click-left-icon", leftIconType: TNavBarLeftIconType): void
    /** 点击标题 */
    (event: "click-title"): void
}>()

/** STATIC: 导航栏高度 */
const HEIGHT = "44px"

/** STATIC: 导航栏上边距 */
const PADDING_TOP = "54px"

/** STATIC: 当前页面样式 */
const CURRENT_PAGE_STYLE = getCurrentPageConfig()?.style

/** STATIC: 是否启用页面下拉刷新 */
const ENABLE_PULL_DOWN_REFRESH =
// @ts-ignore
    CURRENT_PAGE_STYLE?.enablePullDownRefresh ||
    // @ts-ignore
    pagesJson.globalStyle?.enablePullDownRefresh

/** COMPUTED: 导航栏背景 */
const background = computed(() => {

    return (
        props.background ||
        // @ts-ignore
        CURRENT_PAGE_STYLE?.navigationBarBackgroundColor ||
        // @ts-ignore
        pagesJson.globalStyle?.navigationBarBackgroundColor ||
        "#fff"
    )

})

/** COMPUTED: 左侧icon 和 标题的颜色 */
const color = computed(() => {

    return (
        props.color ||
        // @ts-ignore
        CURRENT_PAGE_STYLE?.navigationBarTextStyle ||
        // @ts-ignore
        pagesJson.globalStyle?.navigationBarTextStyle ||
        "#000"
    )

})

/** COMPUTED: 标题 */
const title = computed(() => {

    return (
        props.title ||
        // @ts-ignore
        CURRENT_PAGE_STYLE?.navigationBarTitleText ||
        // @ts-ignore
        pagesJson.globalStyle?.navigationBarTitleText ||
        ""
    )

})

/** REF: 标题图片的宽度 */
const titleImageWidth = ref("0rpx")

/** WATCH: 监听标题是否为图片，如果是图片获取图片宽高 */
watch(
    title,
    newVal => {

        if (isImagePath(newVal)) {

            getImageInfo({
                src: newVal
            }).then(res => {

                titleImageWidth.value = `${res.width}rpx`

            })

        }

    },
    { immediate: true }
)

/** COMPUTED: 标题大小 */
const titleSize = computed(() => {

    const _defaultValue = isImagePath(title.value) ? titleImageWidth.value : "32rpx"

    return props.titleSize || _defaultValue

})

/** HOOKS: tabBar商店状态 */
const { getTabBarItem } = useTabBarStore()

/** COMPUTED: 左侧icon */
const leftIcon = computed(() => {

    const _pages = getCurrentPages()

    // 页面栈大于1时，显示返回icon
    if (_pages.length > 1) {

        return props.backIcon

    }

    // 当前页面路径
    const _currentPagePath = _pages[_pages.length - 1]?.route || ""

    // 当前页面不是首页时且不属于tabBar页面，显示首页icon
    if (
        _currentPagePath !== __PROJECT_INFO__.env.VITE_HOME_PATH &&
        _currentPagePath !== __PROJECT_INFO__.env.VITE_LOGIN_PATH &&
        !getTabBarItem(_currentPagePath)
    ) {

        return props.homeIcon

    }

    return ""

})

/** COMPUTED: 当前显示的左侧icon的类型 */
const leftIconType = computed<TNavBarLeftIconType>(() => {

    if (!leftIcon.value) {

        return ""

    }
    return leftIcon.value === props.backIcon ? "back" : "home"

})

/** REF: 左侧icon图片的宽度 */
const leftIconImageWidth = ref("0rpx")

/** WATCH: 监听左侧icon是否为图片，如果是图片获取图片宽高 */
watch(
    leftIcon,
    newVal => {

        if (isImagePath(newVal)) {

            getImageInfo({
                src: newVal
            }).then(res => {

                leftIconImageWidth.value = `${res.width}rpx`

            })

        }

    },
    { immediate: true }
)

/** COMPUTED: 当前显示的左侧icon的大小 */
const leftIconSize = computed(() => {
    // 默认值
    const _defaultValue = isImagePath(leftIcon.value) ? leftIconImageWidth.value : "35rpx"

    // 传入的值
    const _propsValue = leftIconType.value === "back" ? props.backIconSize : props.homeIconSize

    return _propsValue || _defaultValue

})

/** COMPUTED: 当前显示的左侧icon的字体类名 */
const leftIconFontClassName = computed(() => {

    return leftIconType.value === "back" ? props.backIconFontClassName : props.homeIconFontClassName

})

/** COMPUTED: 当前显示的左侧icon的前缀 */
const leftIconClassPrefix = computed(() => {

    return leftIconType.value === "back" ? props.backIconClassPrefix : props.homeIconClassPrefix

})

/** STATIC: 点击事件是否执行中 */
let isProcessingClick = false

/** EVENT: 点击左侧icon */
const onClickLeftIcon = async() => {
    // 如果正在处理点击，直接返回
    if (isProcessingClick) {

        console.warn("onClickLeftIcon() 正在执行中 isProcessingClick: ", isProcessingClick)
        return

    }
    isProcessingClick = true

    if (typeof props.beforeLeftIconClick === "function") {

        const _shouldProceed = await props.beforeLeftIconClick(leftIconType.value)
        if (!_shouldProceed) {

            isProcessingClick = false // 重置为未处理状态
            return

        }

    }

    // 执行跳转逻辑
    if (leftIcon.value === props.backIcon) {

        navigateBack()

    }
    else {

        navigateToPage({
            method: "reLaunch",
            path: ("/" + __PROJECT_INFO__.env.VITE_HOME_PATH) as NavigateToOptions["url"]
        })

    }

    // 抛出左侧 icon 点击的事件回调
    emits("click-left-icon", leftIconType.value)
    isProcessingClick = false

}

/** EVENT: 点击标题 */
const onClickTitle = async() => {
    // 如果正在处理点击，直接返回
    if (isProcessingClick) {

        console.warn("onClickTitle() 正在执行中 isProcessingClick: ", isProcessingClick)
        return

    }
    isProcessingClick = true

    // 判断是否传入了 onTitleClick 函数并执行
    if (typeof props.beforeTitleClick === "function") {

        await props.beforeTitleClick()

    }

    // 抛出标题点击的事件回调
    emits("click-title")
    isProcessingClick = false

}

/** 将当前显示的左侧icon的类型暴露给父组件 */
defineExpose({
    leftIconType
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
    <view
        class="nav-bar-placeholder"
        :style="{
            height: props.showPlaceholder ? `calc(${HEIGHT} + ${PADDING_TOP})` : 'auto'
        }"
    >
        <view
            class="nav-bar"
            :class="{
                'nav-bar--fixed': ENABLE_PULL_DOWN_REFRESH ? false : props.fixed
            }"
            :style="{
                height: HEIGHT,
                paddingTop: PADDING_TOP,
                background: background,
                borderBottom: props.showBottomBorder ? `1px solid ${props.borderBottomColor}` : 'none'
            }"
        >
            <view v-if="props.showLeft" class="nav-bar__left">
                <template v-if="leftIcon">
                    <image
                        v-if="isImagePath(leftIcon)"
                        :src="leftIcon"
                        style="display: block"
                        :style="{
                            width: leftIconSize
                        }"
                        mode="aspectFit"
                        @tap="onClickLeftIcon"
                    />
                    <nut-icon
                        v-else
                        :custom-color="color"
                        :font-class-name="leftIconFontClassName"
                        :class-prefix="leftIconClassPrefix"
                        :size="leftIconSize"
                        :name="leftIcon"
                        @tap="onClickLeftIcon"
                    />
                </template>

                <slot name="left" :left-icon-type="leftIconType"></slot>
            </view>

            <view
                class="nav-bar__title"
                :style="{
                    color: color,
                    fontSize: titleSize
                }"
            >
                <slot name="title">
                    <image
                        v-if="isImagePath(title)"
                        :src="title"
                        style="display: block"
                        :style="{
                            width: titleSize
                        }"
                        mode="aspectFit"
                        @tap="onClickTitle"
                    />

                    <view v-else @tap="onClickTitle">{{ title }}</view>
                </slot>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.nav-bar {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: content-box;
    width: 100%;
    overflow: hidden;

    &--fixed {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
    }

    &__left {
        position: absolute;
        left: 16px;
        display: flex;
        gap: 12px;
        align-items: center;
    }

    &__title {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        margin: 0 auto;
        font-weight: 500;
        text-align: center;
    }
}
</style>
