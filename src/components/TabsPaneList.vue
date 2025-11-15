<!--
 * @FileDesc: 选项卡面板列表组件
 -->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
import { computed, ref } from "vue"

import List from "@/components/List.vue"

import type { IPaginationFetchDataFnParam, TPaginationDataItem, TPaginationFetchDataFnReturn } from "@/hooks"

// 选项卡面板项接口
export interface ITabPane {
/** 选项卡标题 */
    title: string
/** 选项卡面板列表请求数据函数 */
    fetchData: (pagination: IPaginationFetchDataFnParam) => TPaginationFetchDataFnReturn<TPaginationDataItem>
}

/** 组件属性接口 */
export interface ITabsPaneListProps {
    /**
     * 当前选项卡索引
     *
     * @default 0
     */
    modelValue: number
    /**
     * 选项卡 字体大小
     *
     * @default 'normal'
     */
    tabSize?: "large" | "normal" | "small"
    /**
     * 选项卡 是否显示数量后缀
     *
     * @default false
     */
    tabQuantitySuffix?: boolean
    /**
     * 选项卡 默认字体颜色
     *
     * @default '#ababb5'
     */
    tabColor?: string
    /**
     * 选项卡 选中字体颜色
     *
     * @default '#ffffff'
     */
    tabActiveColor?: string
    /**
     * 选项卡 选中时是否显示下划线
     *
     * @default 'false'
     */
    tabActiveLine?: boolean
    /**
     * 选项卡背景色
     *
     * @default 'transparent'
     */
    tabBackground?: string
    /**
     * 选项卡面板背景色
     *
     * @default '#ffffff'
     */
    tabPaneBackground?: string
    /**
     * 选项卡面板高度
     *
     * @default '0rpx'
     */
    tabPaneHeight: string
    /**
     * 选项卡面板是否启用圆角
     *
     * @default 'true'
     */
    tabPaneRadius?: boolean
    /**
     * 选项卡面板横向内边距
     *
     * @default '30rpx'
     */
    tabPaneHorizontalPadding?: string
    /**
     * 选项卡面板列表
     *
     * @default []
     */
    tabPaneList: ITabPane[]
    /**
     * 返回顶部按钮背景色
     *
     * @default '#323f48'
     */
    backTopBackground?: string
}

const props = withDefaults(defineProps<ITabsPaneListProps>(), {
    /** 当前选项卡索引 */
    modelValue: 0,
    /** 选项卡 字体大小 */
    tabSize: "normal",
    /** 选项卡 是否显示数量后缀 */
    tabQuantitySuffix: false,
    /** 选项卡 默认字体颜色 */
    tabColor: "#ababb5",
    /** 选项卡 选中字体颜色 */
    tabActiveColor: "#ffffff",
    /** 选项卡 选中时是否显示下划线 */
    tabActiveLine: false,
    /** 选项卡背景色 */
    tabBackground: "transparent",
    /** 选项卡面板背景色 */
    tabPaneBackground: "#ffffff",
    /** 选项卡面板高度 */
    tabPaneHeight: "0rpx",
    /** 选项卡面板是否启用圆角 */
    tabPaneRadius: true,
    /** 选项卡面板横向内边距 */
    tabPaneHorizontalPadding: "30rpx",
    // 选项卡面板列表
    tabPaneList: () => []
})

// 定义 emits
const emits = defineEmits<{
    /** 当前索引更新事件 */
    (event: "update:modelValue", value: number): void
}>()

// 双向绑定 modelValue
const { modelValue } = useVModels(props, emits)

/** REF: 列表实例数组 */
const list = ref<InstanceType<typeof List>[] | InstanceType<typeof List>>()

/** COMPUTED: 当前列表实例 */
const currentListInstance = computed(() => Array.isArray(list.value) ? list.value[modelValue.value] : list.value)

/** COMPUTED: 选项卡标题 */
const getTabTitle = computed(() => {

    return (item: ITabPane, tabIndex: number) => {

        return props.tabQuantitySuffix
            ? `${item.title}(${list.value ? (list.value[tabIndex as keyof typeof list.value] as InstanceType<typeof List>).listPagination.totalSize.value : 0})`
            : item.title

    }

})

/** COMPUTED: 选项卡面板样式 */
const tabPaneStyle = computed(() => {

    return {
        height: props.tabPaneHeight,
        borderRadius: props.tabPaneRadius ? "25rpx 25rpx 0 0" : "0"
    }

})

// 暴露给父组件的属性
defineExpose({
    currentListInstance
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
    <nut-tabs
        class="tabs-pane-list"
        v-model="modelValue"
        :size="props.tabSize"
        :background="props.tabBackground"
        :type="props.tabActiveLine ? 'line' : 'card'"
    >
        <nut-tab-pane
            class="tabs-pane-list__pane"
            :style="tabPaneStyle"
            v-for="(tabItem, tabIndex) in props.tabPaneList"
            :key="tabIndex"
            :title="getTabTitle(tabItem, tabIndex)"
        >
            <List
                ref="list"
                class="tabs-pane-list__pane__list"
                :fetch-data-fn="tabItem.fetchData"
                :back-top-background="props.backTopBackground"
            >
                <template #default="{ list: _list, total }">
                    <slot name="default" :list="_list" :total="total"></slot>
                </template>
            </List>
        </nut-tab-pane>
    </nut-tabs>
</template>

<style lang="scss" scoped>
.tabs-pane-list {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    &:deep(.nut-tabs__titles-item) {
        color: v-bind("props.tabColor") !important;
    }

    &:deep(.nut-tabs-active) {
        color: v-bind("props.tabActiveColor") !important;

        .nut-tabs__titles-item__line {
            width: 48rpx !important;
            height: 5rpx !important;
            background: v-bind("props.tabActiveColor") !important;
            border-radius: 12rpx !important;
        }
    }

    &__pane {
        position: relative;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        width: 100%;
        padding: 0;
        overflow: hidden;
        background: v-bind("props.tabPaneBackground");

        &__list {
            flex: 1;
            padding: 0 v-bind("props.tabPaneHorizontalPadding");
        }
    }
}
</style>
