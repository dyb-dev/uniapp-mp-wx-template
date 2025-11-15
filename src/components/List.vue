<!--
 * @FileDesc: 列表组件
 -->

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app"
import { computed, getCurrentInstance, ref, watch } from "vue"

import { useListPagination } from "@/hooks"
import { debounce } from "@/utils"

import type { IPaginationFetchDataFnParam, TPaginationDataItem, TPaginationFetchDataFnReturn } from "@/hooks"
import type { ScrollViewOnScrollEvent } from "@uni-helper/uni-app-types"

export interface IListProps {
/**
 * 是否启用数据为空时元素占位
 *
 * @default true
 */
    empty?: boolean
/**
 * 数据为空时的图片
 *
 * @default '/static/images/List/empty.png'
 */
    emptyImage?: string
/**
 * 数据为空时的图片尺寸, 为数组时顺序为： [宽, 高]
 *
 * @default ['345rpx', '344rpx']
 */
    emptyImageSize?: string | [string, string]
/**
 * 数据为空时的文本描述
 *
 * @default '暂无数据'
 */
    emptyText?: string
/**
 * 数据为空时的文本颜色
 *
 * @default '#808089'
 */
    emptyTextColor?: string

/**
 * 是否启用滚动条
 *
 * @default false
 */
    scrollbar?: boolean
/**
 * 是否启用下拉刷新功能
 *
 * @default true
 */
    refresh?: boolean
/**
 * 下拉刷新背景颜色
 *
 * @default 'transparent'
 */
    refreshBackground?: string
/**
 * 是否自动加载数据
 *
 * @default true
 */
    autoLoad?: boolean
/**
 * 滚动条与底部距离小于 offset 时触发 fetchDataFn 函数
 *
 * @default 300
 */
    offset?: string | number
/**
 * 加载过程中的提示文案
 *
 * @default '加载中...'
 */
    loadingText?: string
/**
 * 加载失败后的提示文案
 *
 * @default '加载失败，点击重试'
 */
    errorText?: string
/**
 * 加载完成后的提示文案
 *
 * @default '没有更多了'
 */
    finishedText?: string
/**
 * 底部提示文案颜色
 *
 * @default '#808089'
 */
    bottomTextColor?: string
/**
 * 是否点击 苹果(状态栏) 按钮(标题) 返回顶部
 *
 * @default true
 */
    clickStatusBarBackTop?: boolean

/**
 * 是否启用 back-top 按钮
 *
 * @default true
 */
    backTop?: boolean
/**
 * back-top 按钮背景颜色
 *
 * @default '#29d446'
 */
    backTopBackground?: string
/**
 * 距离页面右侧的距离
 *
 * @default '25rpx'
 */
    backTopRight?: string
/**
 * 距离页面底部的距离
 *
 * @default '100rpx'
 */
    backTopBottom?: string
/**
 * 滚动高度达到此参数值时才显示组件
 *
 * @default 200
 */
    backTopOffset?: number
/**
 * 返回顶部时是否启用过渡动画
 *
 * @default true
 */
    backTopTransition?: boolean
/**
 * 每页数据大小
 *
 * @default 10
 */
    pageSize?: number
/**
 * 请求数据的方法
 *
 * @param param 请求参数
 * @returns 数据返回值
 */
    fetchDataFn: (param: IPaginationFetchDataFnParam) => TPaginationFetchDataFnReturn<TPaginationDataItem>
}

// DATA: 定义 props & 给定默认值
const props = withDefaults(defineProps<IListProps>(), {
    /** 启用数据为空时的占位 */
    empty: true,
    /** 数据为空时的默认图片 */
    emptyImage: "/static/image/List/empty.png",
    // 数据为空时的图片尺寸
    emptyImageSize: () => ["345rpx", "344rpx"],
    /** 数据为空时的文本描述 */
    emptyText: "暂无数据",
    /** 数据为空时的文本颜色 */
    emptyTextColor: "#808089",

    /** 是否启用滚动条 */
    scrollbar: false,
    /** 是否启用下拉刷新功能 */
    refresh: true,
    /** 下拉刷新背景颜色 */
    refreshBackground: "transparent",
    /** 是否自动加载数据 */
    autoLoad: true,
    /** 滚动距离触发加载的默认值 */
    offset: 300,
    /** 加载中的提示文案 */
    loadingText: "加载中...",
    /** 加载失败的提示文案 */
    errorText: "加载失败，点击重试",
    /** 加载完成的提示文案 */
    finishedText: "没有更多了",
    /** 底部提示文案颜色 */
    bottomTextColor: "#808089",
    /** 是否点击 苹果(状态栏) 按钮(标题) 返回顶部 */
    clickStatusBarBackTop: true,

    /** 启用 back-top 按钮 */
    backTop: true,
    /** back-top 按钮背景颜色 */
    backTopBackground: "#29d446",
    /** 距离右侧的距离 */
    backTopRight: "25rpx",
    /** 距离底部的距离 */
    backTopBottom: "100rpx",
    /** 滚动到此高度时显示 back-top */
    backTopOffset: 200,
    /** 返回顶部时是否启用过渡动画 */
    backTopTransition: true,
    /** 每页数据大小 */
    pageSize: 10
})

// EVENT: 定义 emits
const emits = defineEmits<{
    (event: "scroll", e: ScrollViewOnScrollEvent): void
}>()

// HOOKS: 使用列表分页器
const listPagination = useListPagination<TPaginationDataItem>({
    pageSize: props.pageSize,
    fetchDataFn: param => props.fetchDataFn(param)
})

/** 列表分页器返回值 */
const { currentLoadStatus, currentTotalData, currentTotalSize, totalSize, finished, refreshing, next, clearRefresh } =
    listPagination

/** CONST: 当前实例 */
const instance = getCurrentInstance()

/** CONST: selectorQuery 对象 */
const selectorQuery = uni.createSelectorQuery().in(instance?.proxy)

/** CONST: scroll-view 类名 */
const scrollViewClassName = "list__scroll-view"

/** CONST: scroll-view 内容 类名 */
const scrollViewContentClassName = "list__scroll-view__content"

/** CONST: scroll-view 元素 */
const scrollViewElement = selectorQuery.select(`.${scrollViewClassName}`)

/** CONST: scroll-view 内容 */
const scrollViewContentElement = selectorQuery.select(`.${scrollViewContentClassName}`)

/** CONST: scroll-view 高度 */
let scrollViewHeight: number

// FUN: 获取元素高度
const getElementHeight = (element: UniApp.NodesRef): Promise<number> => {

    return new Promise(resolve => {

        element
            .boundingClientRect(rect => {
                // @ts-ignore
                resolve(rect.height)

            })
            .exec()

    })

}

/** CONST: 底部提示框高度 */
const bottomBoxHeight = "90rpx"

/** FUN: 自动加载数据 */
const autoLoad = async() => {
    // 如果不自动加载数据，直接返回
    if (!props.autoLoad) {

        return

    }

    // 解决: scroll-view 高度和内容还没有渲染出来，因此需要等待下一帧，暂时使用 setTimeout
    setTimeout(async() => {
        // scrollView 高度为空时，获取 scrollView 高度
        if (!scrollViewHeight) {

            scrollViewHeight = await getElementHeight(scrollViewElement)

        }

        // 记录 scroll-view 主体高度
        const _scrollViewContentHeight = await getElementHeight(scrollViewContentElement)

        // 如果 scroll-view 主体高度小于或等于 scroll-view 高度，执行 next()
        _scrollViewContentHeight - parseInt(bottomBoxHeight) <= scrollViewHeight && next()

    }, 0)

}

// LIFECYCLE: 初次挂载完成后
onLoad(() => {

    autoLoad()

})

/** WATCH: 监听数据变化 */
watch(currentTotalSize, () => {
    // 加载数据成功时值才会变动且当前的数据总量大于 0 时
    currentTotalSize.value > 0 && autoLoad()

})

/** COMPUTED: 是否显示空元素占位 */
const showEmpty = computed(() => props.empty && finished.value && totalSize.value <= 0)

/** COMPUTED: 是否显示空元素占位图片样式 */
const emptyImageStyle = computed(() => {
    // 默认图片尺寸
    let size = ["0rpx", "0rpx"]
    if (Array.isArray(props.emptyImageSize) && props.emptyImageSize.length === 2) {

        size = props.emptyImageSize

    }
    else if (typeof props.emptyImageSize === "string") {

        size = [props.emptyImageSize, props.emptyImageSize]

    }
    return {
        width: size[0],
        height: size[1]
    }

})

/** COMPUTED: 底部提示图标 */
const bottomIcon = computed(() => {
    // 如果正在刷新
    if (refreshing.value) {

        return ""

    }

    // 根据当前加载状态返回对应图标
    switch (currentLoadStatus.value) {

    case "loading":
        return "loading1"
    case "fail":
        return "refresh2"
    default:
        return ""

    }

})

/** COMPUTED: 底部提示文案 */
const bottomText = computed(() => {
    // 如果正在刷新
    if (refreshing.value) {

        return ""

    }

    // 如果所有数据已经加载完成 && 总数据量大于 0
    if (finished.value && totalSize.value > 0) {

        return props.finishedText

    }

    // 根据当前加载状态返回对应文案
    switch (currentLoadStatus.value) {

    case "loading":
        return props.loadingText
    case "fail":
        return props.errorText
    default:
        return ""

    }

})

/** COMPUTED: back-top 样式 */
const backTopStyle = computed(() => {

    return {
        right: props.backTopRight,
        bottom: props.backTopBottom,
        background: props.backTopBackground
    }

})

/** REF: 是否显示 back-top */
const showBackTop = ref(false)

// EVENT: 滚动事件（防抖处理函数）
const debouncedScroll = debounce((e: ScrollViewOnScrollEvent) => {

    const {
        detail: { scrollTop: _scrollTop }
    } = e

    // 是否显示 back-top
    showBackTop.value = _scrollTop >= props.backTopOffset

}, 100)

// EVENT: 监听滚动事件
const onScroll = (e: ScrollViewOnScrollEvent) => {

    emits("scroll", e)
    debouncedScroll(e)

}

/** REF: 滚动量 */
const scrollTop = ref(1)

// EVENT: 点击 back-top
const onClickBackTop = () => {

    scrollTop.value = 0
    // 踩坑：uni-app 中 scroll-view 的 scrollTop 属性只有在变化时才会触发滚动
    const _delay = setTimeout(() => {
        // 重置滚动量
        scrollTop.value = 1
        clearTimeout(_delay)

    }, 10)

}

// EVENT: 点击底部提示文案
const onClickBottomText = () => {
    // 如果当前加载状态是失败
    currentLoadStatus.value === "fail" && next()

}

/** EXPOSE: 导出列表分页器状态信息 */
defineExpose({
    listPagination
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
    <view class="list">
        <scroll-view
            :class="scrollViewClassName"
            :scroll-y="true"
            :lower-threshold="props.offset"
            :scroll-top="scrollTop"
            :scroll-with-animation="props.backTopTransition"
            :enable-back-to-top="props.clickStatusBarBackTop"
            :refresher-enabled="props.refresh"
            :refresher-background="props.refreshBackground"
            :refresher-triggered="refreshing"
            :bounces="true"
            :show-scrollbar="props.scrollbar"
            :enable-flex="true"
            :enhanced="true"
            :using-sticky="true"
            @scroll="onScroll"
            @scrolltolower="next"
            @refresherrefresh="clearRefresh"
        >
            <view :class="scrollViewContentClassName">
                <!-- 用于存放列表之上的其他内容 -->
                <slot name="top"></slot>

                <view v-if="showEmpty" class="list__scroll-view__content__empty-box">
                    <image
                        class="list__scroll-view__content__empty-box__img"
                        :style="emptyImageStyle"
                        :src="props.emptyImage"
                        mode="scaleToFill"
                    />

                    <view class="list__scroll-view__content__empty-box__text" :style="{ color: props.emptyTextColor }">{{
                        props.emptyText
                    }}</view>
                </view>

                <slot v-else name="default" :list="currentTotalData" :total="totalSize"></slot>

                <view
                    class="list__scroll-view__content__bottom-box"
                    :style="{ height: bottomBoxHeight }"
                    @click="onClickBottomText"
                >
                    <nut-icon v-if="bottomIcon" :name="bottomIcon" :custom-color="props.bottomTextColor" size="30rpx" />

                    <view class="list__scroll-view__content__bottom-box__text" :style="{ color: props.bottomTextColor }">{{
                        bottomText
                    }}</view>
                </view>
            </view>
        </scroll-view>

        <view
            v-if="props.backTop"
            class="list__back-top"
            :class="{ 'list__back-top--activation': showBackTop }"
            :style="backTopStyle"
            @click="onClickBackTop"
        >
            <image class="list__back-top__img" src="/static/image/List/back-top.png" mode="scaleToFill" />
        </view>
    </view>
</template>

<style lang="scss" scoped>
.list {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;

    &__scroll-view {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 100%;

        &__content {
            position: relative;
            display: flow-root;
            box-sizing: border-box;
            width: 100%;

            &__empty-box {
                display: flex;
                flex-direction: column;
                gap: 20rpx 0;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: fit-content;
                padding: 30rpx 0;
                overflow: hidden;

                &__img {
                    display: block;
                }

                &__text {
                    width: 100%;
                    font-size: 27rpx;
                    text-align: center;
                    @include text-ellipsis-mixin;
                }
            }

            &__bottom-box {
                display: flex;
                gap: 0 10rpx;
                align-items: center;
                justify-content: center;
                width: 100%;

                &__text {
                    font-size: 27rpx;
                }
            }
        }
    }

    &__back-top {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 84rpx;
        height: 84rpx;
        overflow: hidden;
        border-radius: 50%;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
        transform: scale(0) translate3d(0, 0, 0);
        transition: transform 0.3s;

        &--activation {
            transform: scale(1) translate3d(0, 0, 0);
        }

        &__img {
            display: block;
            width: 25rpx;
            height: 32rpx;
        }
    }
}
</style>
