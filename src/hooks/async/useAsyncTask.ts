/*
 * @FileDesc: 使用异步任务执行器
 */

import { ref } from "vue"

import type { Ref } from "vue"

/** 加载状态类型 */
export type TLoadStatus = "loading" | "success" | "fail"

/** 使用异步任务执行器 返回值 */
export interface IUseAsyncTaskReturn {
    /**
     * 加载状态
     *
     * @default 'success'
     */
    loadStatus: Ref<TLoadStatus>
    /** 执行异步任务 */
    run: <T = void>(task: () => T | Promise<T>, errorMessage?: string, successMessage?: string) => Promise<T | void>
}

/**
 * HOOKS: 使用异步任务执行器
 *
 * @author dyb-dev
 * @date 29/06/2025/  17:02:00
 * @returns {*}  {IUseAsyncTaskReturn} 返回值
 */
export const useAsyncTask = (): IUseAsyncTaskReturn => {

    /**
     * REF: 加载状态
     *
     * @default 'success'
     */
    const loadStatus: IUseAsyncTaskReturn["loadStatus"] = ref("success")

    /**
     * FUN: 执行异步任务
     *
     * @author dyb-dev
     * @date 29/06/2025/  17:03:00
     * @param {*} task 异步任务
     * @param {string} [failMessage="加载失败"] 失败提示信息
     * @param {string} [successMessage=""] 成功提示信息
     * @returns {*} 返回任务结果
     */
    const run: IUseAsyncTaskReturn["run"] = async(task, failMessage = "加载失败", successMessage = "") => {

        try {

            loadStatus.value = "loading"

            const _result = await task()

            loadStatus.value = "success"
            successMessage &&
                uni.showToast({
                    icon: "none",
                    title: successMessage,
                    duration: 3000
                })
            return _result

        }
        catch (error) {

            loadStatus.value = "fail"
            const _error = error as Error
            // 显示 tip
            uni.showToast({
                icon: "none",
                title: _error?.message || failMessage,
                duration: 3000
            })

        }

    }

    return {
        loadStatus,
        run
    }

}
