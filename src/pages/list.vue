<!--
 * @Author: dyb-dev
 * @Date: 2024-10-08 16:28:02
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-08 20:15:11
 * @FilePath: /uniapp-mp-wx-template/src/pages/list.vue
 * @Description: 列表示例页面
-->
<script setup lang="ts">
import { ref } from "vue"

/** STATIC: 是否数据加载失败 */
const isLoadFail = false

/** STATIC: 数据总量 */
const total = 30

/** REF: 数据 */
const list = ref<string[]>([])

// 定义分页参数接口类型
interface IPaginationParams {
    /** 当前页码 */
    pageNo: number
    /** 每页的大小 */
    pageSize: number
}

/**
 * FUN: 请求数据函数
 *
 * @param {object} root0 - 请求参数对象
 * @param {number} root0.pageNo - 当前的页码
 * @param {number} root0.pageSize - 每页的数据条数
 * @returns {Promise<Array<any> | boolean>} 返回数据列表或加载失败的标志
 */
const fetchData = async({ pageNo, pageSize }: IPaginationParams): Promise<Array<any> | boolean> => {

    // 模拟请求
    await delay(500)

    // 模拟加载失败
    if (isLoadFail) {

        return false

    }

    return generateDataList(pageNo, pageSize)

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

/**
 * FUN: 延时指定的毫秒数
 *
 * @param {number} ms - 延迟的时间（毫秒）
 * @returns {Promise<void>} 返回一个 Promise，当延迟时间结束时 `resolve`
 */
const delay = (ms: number): Promise<void> => {

    return new Promise(resolve => {

        setTimeout(() => {

            resolve()

        }, ms)

    })

}
</script>

<template>
    <Layout>
        <z-paging v-model="list" :fetch="fetchData">
            <view
                v-for="(item, index) in list"
                :key="index"
                style="width: 100%; height: 100rpx"
                :style="{ background: index % 2 === 0 ? '#29d446' : '#ffffff' }"
            >
                {{ item }}
            </view>
        </z-paging>
    </Layout>
</template>
