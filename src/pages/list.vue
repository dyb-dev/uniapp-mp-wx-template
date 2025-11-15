<!--
 * @FileDesc: 列表示例页面
 -->
<script setup lang="ts">
import { delay } from "@/utils"

import type { IPaginationFetchDataFnParam, TPaginationDataItem, TPaginationFetchDataFnReturn } from "@/hooks"

/** CONST: 数据总量 */
const total = 30

// FUN: 请求数据函数
const fetchData = async({
    currentPageSize,
    currentPage
}: IPaginationFetchDataFnParam): TPaginationFetchDataFnReturn<TPaginationDataItem> => {

    // 模拟请求
    await delay(500)

    // 模拟加载失败
    if (Math.random() < 0.1) {

        return

    }

    return {
        currentPageData: generateDataList(currentPage, currentPageSize),
        totalSize: total
    }

}

/**
 * FUN: 生成模拟数据列表
 *
 * @param {number} pageNo - 当前的页码
 * @param {number} pageSize - 每页的数据条数
 * @returns {string[]} 生成的模拟数据列表
 */
const generateDataList = (pageNo: number, pageSize: number): string[] => {

    const _list: string[] = []

    // 计算当前页的起始索引
    const start = (pageNo - 1) * pageSize
    const end = Math.min(start + pageSize, total)

    // 生成数据
    for (let i = start; i < end; i++) {

        _list.push(`Item ${i + 1}`)

    }

    return _list

}
</script>

<template>
    <Layout>
        <List :fetch-data-fn="fetchData" :page-size="2">
            <template #default="{ list }">
                <view
                    v-for="(item, index) in list"
                    :key="index"
                    style="width: 100%; height: 100rpx"
                    :style="{ background: index % 2 === 0 ? '#29d446' : '#ffffff' }"
                >
                    {{ item }}
                </view>
            </template>
        </List>
    </Layout>
</template>
