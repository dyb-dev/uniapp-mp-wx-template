/*
 * @FileDesc: 请求日志模块
 */

import { isAbsoluteUrl, isDevEnv, isEnableDebug, trimUrlSlashes } from "@/utils"

/** 请求日志类型枚举 */
export const enum ERequestLogType {
    /** 测试请求参数 */
    TEST_REQUEST_PARAMS,
    /** 测试请求结果, 测试成功 */
    TEST_REQUEST_RESULT_SUCCESS,
    /** 测试请求结果, 测试失败 or 没有测试数据 */
    TEST_REQUEST_RESULT_FAIL,
    /** 真实请求参数 */
    REQUEST_PARAMS,
    /** 真实请求结果, 接口调用成功 */
    REQUEST_RESULT_SUCCESS,
    /** 真实请求结果, 接口调用失败 */
    REQUEST_RESULT_FAIL
}

/** 请求日志配置的类型 */
interface IRequestLogConfig {
    /** 样式字符串 */
    style: string
    /** 描述 */
    description: string
}

/** CONST: 请求日志配置列表 */
const REQUEST_LOG_CONFIG_LIST: Record<ERequestLogType, IRequestLogConfig> = {
    [ERequestLogType.TEST_REQUEST_PARAMS]: {
        style: "color: #fff; background-color: #747474; padding: 5px 10px;",
        description: "测试请求参数"
    },
    [ERequestLogType.TEST_REQUEST_RESULT_SUCCESS]: {
        style: "color: #fff; background-color: #9d9d9d; padding: 5px 10px;",
        description: "测试请求成功"
    },
    [ERequestLogType.TEST_REQUEST_RESULT_FAIL]: {
        style: "color: #fff; background-color: #ff7781; padding: 5px 10px;",
        description: "测试请求失败"
    },
    [ERequestLogType.REQUEST_PARAMS]: {
        style: "color: #fff; background-color: #0078fe; padding: 5px 10px;",
        description: "请求参数"
    },
    [ERequestLogType.REQUEST_RESULT_SUCCESS]: {
        style: "color: #fff; background-color: #2da000; padding: 5px 10px;",
        description: "请求成功"
    },
    [ERequestLogType.REQUEST_RESULT_FAIL]: {
        style: "color: #fff; background-color: #fe003c; padding: 5px 10px;",
        description: "请求失败"
    }
}

/** 输出请求日志选项 */
interface IRequestLogOptions {
    /** 请求日志类型 */
    type: ERequestLogType
    /** 请求地址 */
    url: string
    /** 请求id */
    requestId: number
    /** 请求日志数据 */
    data: Record<string, any>
}

/**
 * FUN: 请求日志
 *
 * @author dyb-dev
 * @date 21/02/2025/  18:32:32
 * @param {IRequestLogOptions} option 请求日志选项
 */
export const requestLog = (option: IRequestLogOptions) => {

    // 如果不是开发环境且不启用调试模式，则不输出请求日志
    if (!isDevEnv() && !isEnableDebug()) {

        return

    }

    let url = option.url

    // 如果不是绝对路径，则拼接基础 API 路径
    if (!isAbsoluteUrl(url)) {

        url = trimUrlSlashes(url)
        url = `${__PROJECT_INFO__.env.VITE_API_BASE_PATH}${url && `/${url}`}`

    }

    // 输出请求日志选项
    const { type, requestId, data } = option
    // 获取请求日志配置
    const { description, style } = REQUEST_LOG_CONFIG_LIST[type]

    console.log(`\n %c${requestId} ${description} :>>`, style, url, "\n", data)

}
