/*
 * @FileDesc: 列表分页器
 */

import { usePagination } from "./usePagination"

import type { IUsePaginationOptions, IUsePaginationReturn, TPaginationDataItem } from "./usePagination"

/** 列表分页配置，继承自 IUsePaginationOptions */
export interface IUseListPaginationOptions<T extends TPaginationDataItem>
    extends Omit<IUsePaginationOptions<T>, "usePreviousDataOnFail"> {}

/** 列表分页返回结果，继承自 IUsePaginationReturn */
export interface IUseListPaginationReturn<T extends TPaginationDataItem>
    extends Omit<IUsePaginationReturn<T>, "refresh" | "prev"> {
    /** 清空所有数据并刷新首页 */
    clearRefresh: () => Promise<void>
    /** 清空所有数据并初始化分页器 */
    clearInitialize: () => Promise<void>
}

/**
 * HOOKS: 列表分页器
 *
 * @author dyb-dev
 * @date 05/09/2024/  14:19:07
 * @template T 列表分页数据类型
 * @param {IUseListPaginationOptions<T>} options 列表分页配置
 * @returns {*}  {IUseListPaginationReturn<T>} 列表分页返回结果
 */
export const useListPagination = <T extends TPaginationDataItem>(
    options: IUseListPaginationOptions<T>
): IUseListPaginationReturn<T> => {

    // 调用 usePagination 并传入参数
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { refresh, prev, ..._pagination } = usePagination(options)

    /**
     * 清空重置分页数据和状态
     *
     * @author dyb-dev
     * @date 16/11/2024/  00:53:21
     */
    const _clear = () => {

        _pagination.currentTotalDataMap.value.clear()
        _pagination.totalSize.value = 0
        _pagination.initialized.value = false

    }

    /**
     * 清空所有数据并初始化分页器
     *
     * @author dyb-dev
     * @date 16/11/2024/  00:53:54
     */
    const clearInitialize = async() => {

        try {

            _clear()
            await _pagination.load(1)

        }
        catch (error) {

            throw `clearInitialize() ${error}`

        }

    }

    /**
     * 清空所有数据并刷新首页
     *
     * @author dyb-dev
     * @date 06/09/2024/  22:24:56
     */
    const clearRefresh = async() => {

        try {

            _clear()
            await refresh(1)

        }
        catch (error) {

            throw `clearRefresh() ${error}`

        }

    }

    /**
     * 列表分页的下一页逻辑
     *
     * @author dyb
     * @date 05/09/2024/  13:16:57
     */
    const next = async() => {

        try {

            const { initialized, currentLoadStatus, currentPage, finished } = _pagination

            if (!initialized.value) {

                console.warn("next() 初始化未完成取消执行下一页，开始执行初始化操作")
                await clearInitialize()
                return

            }
            if (finished.value) {

                console.warn(`next() 已经加载完所有数据，无法执行下一页 currentPage: ${currentPage.value}`)
                return

            }
            if (currentLoadStatus.value === "loading") {

                console.warn(
                    `next() 当前页码数据正在加载中，取消执行下一页 currentPage: ${currentPage.value} currentLoadStatus: ${currentLoadStatus.value}`
                )
                return

            }
            if (currentLoadStatus.value === "fail") {

                console.warn(
                    `next() 当前页码数据加载失败，取消执行下一页，开始重新加载当前页数据  currentPage: ${currentPage.value} currentLoadStatus: ${currentLoadStatus.value}`
                )

                // 加载失败，重新加载当前页码数据
                await _pagination.load()
                return

            }
            await _pagination.next()

        }
        catch (error) {

            throw `next() ${error}`

        }

    }

    return {
        ..._pagination,
        clearInitialize,
        clearRefresh,
        next
    }

}
