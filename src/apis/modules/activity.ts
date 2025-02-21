/*
 * @Author: dyb-dev
 * @Date: 2024-10-08 21:22:48
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 22:48:25
 * @FilePath: /uniapp-mp-wx-template/src/apis/modules/activity.ts
 * @Description: 本次活动接口模块
 */

import un from "@uni-helper/uni-network"

import { sendRequest } from "../request"

import type { UnResponse } from "@uni-helper/uni-network"

/** 获取用户信息的结果数据 */
interface IGetUserInfoApiResultData {
    /** 内容 */
    body: string
    /** id */
    id: number
    /** 标题 */
    title: string
    /** 用户唯一标识 */
    userId: number
}

/**
 * FUN: 获取用户信息
 *
 * @author dyb-dev
 * @date 21/02/2025/  22:46:30
 * @param {TModifyProperties<ITestRequestConfig<IGetUserInfoApiResultData>, "test">} [testRequestConfig] 测试请求配置
 * @returns {*}  {Promise<UnResponse<IGetUserInfoApiResultData>>} 结果数据
 */
const getUserInfoApi = async(
    testRequestConfig?: TModifyProperties<ITestRequestConfig<IGetUserInfoApiResultData>, "test">
): Promise<UnResponse<IGetUserInfoApiResultData>> => {

    return sendRequest<IGetUserInfoApiResultData>({
        url: "/1",
        requestFn: un.get,
        testRequestConfig
    })

}

/** 获取id的参数 */
interface IGetIdApiParams {
    /** 用户唯一标识 */
    userId: number
}

/** 获取id的结果数据 */
interface IGetIdApiResultData {
    /** id */
    id: number
}

/**
 * FUN: 获取id
 *
 * @author dyb-dev
 * @date 21/02/2025/  22:48:09
 * @param {IGetIdApiParams} params 参数
 * @param {TModifyProperties<ITestRequestConfig<IGetIdApiResultData>, "test">} [testRequestConfig] 测试请求配置
 * @returns {*}  {Promise<UnResponse<IGetIdApiResultData>>} 结果数据
 */
const getIdApi = async(
    params: IGetIdApiParams,
    testRequestConfig?: TModifyProperties<ITestRequestConfig<IGetIdApiResultData>, "test">
): Promise<UnResponse<IGetIdApiResultData>> => {

    return sendRequest({
        url: "",
        params,
        testRequestConfig
    })

}

export type { IGetUserInfoApiResultData, IGetIdApiParams, IGetIdApiResultData }

export { getUserInfoApi, getIdApi }
