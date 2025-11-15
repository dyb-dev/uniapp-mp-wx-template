/*
 * @FileDesc: 封装请求模块
 */

import un from "@uni-helper/uni-network"

import { delay, isDevEnv } from "@/utils"

import { ERequestLogType, requestLog } from "./log"

import type { UnResponse } from "@uni-helper/uni-network"

/** LET: 全局测试请求配置 */
let _globalTestRequestConfig: Omit<ITestRequestConfig, "testResult"> = {
    test: isDevEnv() && true,
    testDelay: 500
}

/**
 * FUN: 设置全局测试请求配置
 *
 * @author dyb-dev
 * @date 21/02/2025/  19:50:27
 * @param {Omit<ITestRequestConfig, "testResult">} config 测试请求配置
 */
export const setGlobalTestRequestConfig = (config: Omit<ITestRequestConfig, "testResult">) => {

    _globalTestRequestConfig = config

}

/** LET: 全局请求id，用于进行日志输出 */
let _globalRequestId = 0

/** 发送请求选项 */
export interface ISendRequestOptions<T extends Record<string, any>, P extends Record<string, any> = Record<string, any>> {
    /** 请求地址 */
    url: string
    /** 请求参数 */
    params?: P
    /** 发送 http 请求函数 默认 axios.post 方法 */
    requestFn?: (url: string, params?: P) => Promise<UnResponse<T>>
    /** 测试请求配置 */
    testRequestConfig?: TModifyProperties<ITestRequestConfig<T>, "test">
}

/**
 * FUN: 发送请求
 *
 * @author dyb-dev
 * @date 21/02/2025/  14:18:09
 * @template T
 * @template P
 * @param {ISendRequestOptions<T, P>} options 选项
 * @returns {*}  {Promise<UnResponse<T>>} 请求结果
 */
export const sendRequest = async <T extends Record<string, any>, P extends Record<string, any> = Record<string, any>>(
    options: ISendRequestOptions<T, P>
): Promise<UnResponse<T>> => {

    _globalRequestId++
    // 当前请求id
    const _currentRequestId = _globalRequestId

    const { url, params = {}, requestFn = un.post<T>, testRequestConfig } = options

    // 是否使用测试模式
    if (testRequestConfig?.test ?? _globalTestRequestConfig.test) {

        // 输出测试请求参数日志
        requestLog({
            type: ERequestLogType.TEST_REQUEST_PARAMS,
            url,
            requestId: _currentRequestId,
            data: params
        })

        // 测试请求配置
        // eslint-disable-next-line prefer-const
        let { testResult, testDelay = _globalTestRequestConfig.testDelay ?? 0 } = testRequestConfig ?? {}

        // 如果测试数据未提供，则返回测试失败
        if (!testResult) {

            testResult = {
                success: false,
                message: "测试数据未提供"
            }

            // 输出测试请求结果日志
            requestLog({
                type: ERequestLogType.TEST_REQUEST_RESULT_FAIL,
                url,
                requestId: _currentRequestId,
                data: testResult
            })

            return testResult

        }

        // 模拟请求延迟
        await delay(testDelay)

        // 确定日志类型
        const _requestLogType = testResult.success
            ? ERequestLogType.TEST_REQUEST_RESULT_SUCCESS
            : ERequestLogType.TEST_REQUEST_RESULT_FAIL

        // 输出测试请求结果日志
        requestLog({
            type: _requestLogType,
            url,
            requestId: _currentRequestId,
            data: testResult
        })

        return testResult

    }

    try {

        // 输出真实请求参数日志
        requestLog({
            type: ERequestLogType.REQUEST_PARAMS,
            url,
            requestId: _currentRequestId,
            data: params
        })

        // 发送请求
        const _result = await requestFn(url, params)

        // 确定日志类型
        const _requestLogType = _result.success ? ERequestLogType.REQUEST_RESULT_SUCCESS : ERequestLogType.REQUEST_RESULT_FAIL

        requestLog({
            type: _requestLogType,
            url,
            requestId: _currentRequestId,
            data: _result
        })

        return _result

    }
    catch (error) {

        const _result = {
            success: false,
            message: "请求失败"
        }

        requestLog({
            type: ERequestLogType.REQUEST_RESULT_FAIL,
            url,
            requestId: _currentRequestId,
            data: _result
        })

        return _result

    }

}
