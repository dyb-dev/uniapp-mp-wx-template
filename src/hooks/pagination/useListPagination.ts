/*
 * @Author: dyb-dev
 * @Date: 2024-11-16 02:11:23
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-16 02:11:46
 * @FilePath: /uniapp-mp-wx-template/src/hooks/pagination/useListPagination.ts
 * @Description: 列表分页器
 */

import { usePagination } from "./usePagination"

import type { IUsePaginationOptions, IUsePaginationReturn, TPaginationDataItem } from "./usePagination"

/** 列表分页配置，继承自 IUsePaginationOptions */
interface IUseListPaginationOptions<T extends TPaginationDataItem>
    extends Omit<IUsePaginationOptions<T>, "usePreviousDataOnFail"> {}

/** 列表分页返回结果，继承自 IUsePaginationReturn */
interface IUseListPaginationReturn<T extends TPaginationDataItem> extends Omit<IUsePaginationReturn<T>, "refresh" | "prev"> {
    /** 清空所有数据并刷新首页 */
    clearRefresh: () => Promise<void>
    /** 初始化分页器 */
    initialize: () => Promise<void>
}

/**
 * 列表分页器
 *
 * @author dyb-dev
 * @date 05/09/2024/  14:19:07
 * @template T 列表分页数据类型
 * @param {IUseListPaginationOptions<T>} options 列表分页配置
 * @returns {*}  {IUseListPaginationReturn<T>} 列表分页返回结果
 */
const useListPagination = <T extends TPaginationDataItem>(options: IUseListPaginationOptions<T>): IUseListPaginationReturn<T> => {

    // 调用 usePagination 并传入参数
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refresh, prev, ..._pagination } = usePagination(options)

    /**
     * 重置分页状态
     *
     * @author dyb-dev
     * @date 16/11/2024/  00:53:21
     */
    const _reset = () => {

        _pagination.currentTotalDataMap.value.clear()
        _pagination.totalSize.value = 0
        _pagination.initialized.value = false

    }

    /**
     * 初始化分页器
     *
     * @author dyb-dev
     * @date 16/11/2024/  00:53:54
     */
    const initialize = async() => {

        _reset()
        await _pagination.load(1)

    }

    /**
     * 清空所有数据并刷新首页
     *
     * @author dyb-dev
     * @date 06/09/2024/  22:24:56
     */
    const clearRefresh = async() => {

        _reset()
        await refresh(1)

    }

    /**
     * 列表分页的下一页逻辑
     *
     * @author dyb
     * @date 05/09/2024/  13:16:57
     */
    const next = async() => {

        try {

            const { initialized, currentLoadStatus, currentPage } = _pagination

            if (!initialized.value) {

                console.warn("next() =>>", `初始化未完成 initialized: ${initialized.value} 将优先执行初始化`)
                await initialize()
                return

            }
            if (currentLoadStatus.value === "loading") {

                throw `当前页码数据加载中，取消继续加载下一页的数据 currentPage: ${currentPage.value} currentLoadStatus: ${currentLoadStatus.value}`

            }
            if (currentLoadStatus.value === "fail") {

                console.error(
                    "next() =>>",
                    `当前页码数据加载失败，取消继续加载下一页的数据，重新加载当前页数据  currentPage: ${currentPage.value} currentLoadStatus: ${currentLoadStatus.value}`
                )

                // 加载失败，重新加载当前页码数据
                await _pagination.load()
                return

            }
            await _pagination.next()

        }
        catch (error) {

            console.error("next() =>>", error)

        }

    }

    return {
        ..._pagination,
        initialize,
        clearRefresh,
        next
    }

}

export type { IUseListPaginationOptions, IUseListPaginationReturn }

export { useListPagination }
