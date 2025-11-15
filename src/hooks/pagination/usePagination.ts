/*
 * @FileDesc: 分页器
 */

import { useOffsetPagination } from "@vueuse/core"
import { ref, computed } from "vue"

import type { UseOffsetPaginationReturn } from "@vueuse/core"
import type { ComputedRef, Ref } from "vue"

/** 分页数据项 */
export type TPaginationDataItem = string | number | Record<string, any> | any

/** 分页数据映射 */
export type TPaginationDataMap<T> = Map<number, T[]>

/** 分页请求数据函数参数 */
export interface IPaginationFetchDataFnParam {
    /** 当前页码 */
    currentPage: number
    /** 当前页码大小 */
    currentPageSize: number
    /** 总页数 */
    pageCount: number
    /** 是否为第一页 */
    isFirstPage: boolean
    /** 是否为最后一页 */
    isLastPage: boolean
}

/** 分页请求数据函数返回结果类型 */
export interface IPaginationFetchDataFnResult<T extends TPaginationDataItem> {
    /** 当前页码的数据 */
    currentPageData: T[]
    /** 数据总大小 */
    totalSize: number
}

/** 分页请求数据函数返回类型 */
export type TPaginationFetchDataFnReturn<T extends TPaginationDataItem> = Promise<IPaginationFetchDataFnResult<T> | void>

/** 分页配置 */
export interface IUsePaginationOptions<T extends TPaginationDataItem> {
    /**
     * 页码
     *
     * @default 1
     */
    page?: number
    /**
     * 每页显示的项目数
     *
     * @default 10
     */
    pageSize?: number
    /**
     * 是否在加载失败时使用之前加载的数据
     *
     * @default false
     */
    usePreviousDataOnFail?: boolean
    /**
     * 请求数据的函数
     *
     * @param param 请求参数
     * @returns 返回 当前页的数据列表 和 数据总数
     */
    fetchDataFn: (param: IPaginationFetchDataFnParam) => TPaginationFetchDataFnReturn<T>
}

/** 分页加载状态 */
export type TPaginationLoadStatus = "loading" | "success" | "fail"
/** 分页刷新参数 */
export type TPaginationRefreshParam = number | `${number}`

/** 分页返回结果 */
export interface IUsePaginationReturn<T extends TPaginationDataItem> extends UseOffsetPaginationReturn {
    /** 当前加载状态 */
    currentLoadStatus: Ref<TPaginationLoadStatus>
    /** 是否初始化成功 */
    initialized: Ref<boolean>
    /** 是否正在刷新 */
    refreshing: Ref<boolean>
    /** 当前页的数据（计算属性） */
    currentPageData: ComputedRef<T[]>
    /** 当前已加载的总数据（计算属性） */
    currentTotalData: ComputedRef<T[]>
    /** 当前已加载的总数据量（计算属性） */
    currentTotalSize: ComputedRef<number>
    /** 是否所有数据已加载完成（计算属性） */
    finished: ComputedRef<boolean>
    /** 数据总数量 */
    totalSize: Ref<number>
    /** 当前所有页的数据映射 */
    currentTotalDataMap: Ref<TPaginationDataMap<T>>
    /**
     * 加载指定页码数据
     *
     * @param page 目标页码 默认: 当前页码
     */
    load: (page?: TPaginationRefreshParam) => Promise<void>
    /**
     * 刷新单页数据
     *
     * @param page 目标页码 默认: 当前页码
     */
    refresh: (page?: TPaginationRefreshParam) => Promise<void>
    /** 上一页 */
    prev: () => Promise<void>
    /** 下一页 */
    next: () => Promise<void>
}

/**
 * HOOKS: 分页器
 *
 * @author dyb
 * @date 04/09/2024/  18:05:57
 * @export
 * @template T 分页数据类型
 * @param {IUsePaginationOptions<T>} options 分页配置
 * @returns {*}  {IUsePaginationReturn<T>} 分页返回结果
 */
export const usePagination = <T extends TPaginationDataItem>(options: IUsePaginationOptions<T>): IUsePaginationReturn<T> => {

    const { page = 1, pageSize = 10, usePreviousDataOnFail = false, fetchDataFn } = options

    /** REF: 是否初始化成功 */
    const initialized = ref<boolean>(false)
    /** REF: 是否正在刷新数据 */
    const refreshing = ref<boolean>(false)
    /** REF: 数据总数 */
    const totalSize = ref<number>(0)
    /** REF: 加载状态 */
    const currentLoadStatus = ref<TPaginationLoadStatus>("success")
    /** REF: 当前所有页的数据映射 */
    const currentTotalDataMap: Ref<TPaginationDataMap<T>> = ref(new Map())

    /** COMPUTED: 当前页的数据 */
    const currentPageData = computed<T[]>(() => currentTotalDataMap.value.get(currentPage.value) || [])

    /** COMPUTED: 当前所有页的数据 */
    const currentTotalData = computed<T[]>(() => Array.from(currentTotalDataMap.value.values()).flat())

    /** COMPUTED: 当前已加载的总数据量 */
    const currentTotalSize = computed<number>(() => currentTotalData.value.length)

    /** COMPUTED: 是否已加载完成 */
    const finished = computed<boolean>(() => initialized.value && currentTotalSize.value === totalSize.value)

    // 初始化分页器
    const {
        currentPage,
        currentPageSize,
        pageCount,
        isFirstPage,
        isLastPage,
        prev: offsetPaginationPrev,
        next: offsetPaginationNext
    } = useOffsetPagination({
        total: totalSize,
        page,
        pageSize
    })

    /**
     * 检查页码是否有效
     *
     * @param {TPaginationRefreshParam} page 目标页码
     * @returns {*}  {boolean} 是否有效
     */
    const _isPageValid = (page: TPaginationRefreshParam): boolean => {

        // 强制设置数字类型
        page = Number(page)
        if (isNaN(page)) {

            console.error(`_isPageValid() page不是数字 page: ${page}`)
            return false

        }

        if (page < 1 || page > pageCount.value) {

            console.error(`_isPageValid() page超出范围 page: ${page} pageCount: ${pageCount.value}`)
            return false

        }
        return true

    }

    /**
     * 加载指定页码数据
     *
     * @author dyb-dev
     * @date 06/09/2024/  21:42:48
     * @param {TPaginationRefreshParam} [page] 目标页码 默认: 当前页码
     */
    const load = async(page: TPaginationRefreshParam = currentPage.value) => {

        // 页码无效时
        if (!_isPageValid(page)) {

            throw `load() 页码无效 page: ${page}`

        }

        currentPage.value = <number>page

        // 取消数据的响应性
        // 解决：同时加载第一页和第二页的数据，当前页码为第二页，第二页的数据先返回，第一页的数据后返回，这个时候 currentTotalDataMap.value.set 由于 currentPage 数据的响应性，会将第一页的请求结果数据覆盖第二页的数据，造成数据错乱
        const _param: IPaginationFetchDataFnParam = {
            currentPage: currentPage.value,
            currentPageSize: currentPageSize.value,
            pageCount: pageCount.value,
            isFirstPage: isFirstPage.value,
            isLastPage: isLastPage.value
        }

        try {

            currentLoadStatus.value = "loading"

            const _result = await fetchDataFn(_param)

            // 当异步同时加载不同页码的数据时，只对当前页码的数据进行处理
            // 解决：同时加载第一页和第二页的数据，当前页码为第二页，第二页的数据先返回，第一页的数据后返回，`currentLoadStatus` 状态可能会设置错误
            if (currentPage.value !== _param.currentPage) {

                console.warn(
                    `load() 当前页码已变更取消数据更新操作 加载前页码: ${_param.currentPage} 加载后页码: ${currentPage.value}`
                )
                return

            }

            /** 当前页码的数据 */
            const _currentPageData = _result?.currentPageData
            /** 数据总大小 */
            const _totalSize = Number(_result?.totalSize)

            if (!Array.isArray(_currentPageData)) {

                throw `fetchDataFn() 返回的数据不是数组 currentPageData: ${_currentPageData}`

            }

            if (isNaN(_totalSize)) {

                throw `fetchDataFn() 返回的数据总数不是数字 _totalSize: ${_totalSize}`

            }

            /** 当前页码的数据长度 */
            const _currentPageDataLength = _currentPageData.length

            if (_totalSize < _currentPageDataLength) {

                throw `fetchDataFn() 数据总数小于当前页数据长度 totalSize: ${_totalSize} _currentPageDataLength: ${_currentPageDataLength}`

            }

            if (_currentPageDataLength <= 0 && _totalSize > 0) {

                throw `fetchDataFn() 当前数据为空,但总数据不为空 totalSize: ${_totalSize} _currentPageDataLength: ${_currentPageDataLength}`

            }

            // 更新数据
            currentTotalDataMap.value.set(_param.currentPage, _currentPageData)
            totalSize.value = _totalSize

            // 设置初始化完成状态
            initialized.value = true
            currentLoadStatus.value = "success"

        }
        catch (error) {

            // 不需要使用之前加载的数据时
            if (!usePreviousDataOnFail) {

                // 更新数据
                currentTotalDataMap.value.set(_param.currentPage, [])

            }
            currentLoadStatus.value = "fail"

            throw `load() currentPage: ${_param.currentPage} ${error}`

        }

    }

    /**
     * 刷新数据
     *
     * @author dyb-dev
     * @date 06/09/2024/  22:11:55
     * @param {TPaginationRefreshParam} [page=currentPage.value] 目标页码 默认: 当前页码
     */
    const refresh = async(page: TPaginationRefreshParam = currentPage.value) => {

        try {

            // 正在刷新数据时
            if (refreshing.value) {

                console.warn("refresh() =>> 正在刷新数据 refreshing: ", refreshing.value)
                return

            }
            refreshing.value = true
            await load(page)

        }
        catch (error) {

            throw `refresh() ${error}`

        }
        finally {

            refreshing.value = false

        }

    }

    /**
     * 上一页/下一页
     *
     * @author dyb-dev
     * @date 06/09/2024/  20:46:51
     * @param {()=> void} method 上一页/下一页
     */
    const _change = async(method: () => void) => {

        try {

            // 未初始化成功
            if (!initialized.value) {

                throw `初始化未完成 initialized: ${initialized.value}`

            }
            method()

            await load()

        }
        catch (error) {

            throw `_change() ${error}`

        }

    }

    /**
     * 上一页
     *
     * @author dyb
     * @date 05/09/2024/  00:58:19
     */
    const prev = async() => {

        try {

            await _change(offsetPaginationPrev)

        }
        catch (error) {

            throw `prev() ${error}`

        }

    }

    /**
     * 下一页
     *
     * @author dyb
     * @date 05/09/2024/  00:58:09
     */
    const next = async() => {

        try {

            await _change(offsetPaginationNext)

        }
        catch (error) {

            throw `next() ${error}`

        }

    }

    return {
        initialized,
        refreshing,
        finished,

        isFirstPage,
        isLastPage,
        currentLoadStatus,
        currentPage,
        currentPageSize,
        currentPageData,
        currentTotalSize,
        currentTotalData,
        currentTotalDataMap,
        pageCount,
        totalSize,

        load,
        refresh,
        prev,
        next
    }

}
