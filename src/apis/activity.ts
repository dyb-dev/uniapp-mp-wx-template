/*
 * @Author: dyb-dev
 * @Date: 2024-10-08 21:22:48
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 16:51:24
 * @FilePath: /uniapp-mp-wx-template/src/apis/activity.ts
 * @Description: 本次活动接口模块
 */

import un from "@uni-helper/uni-network"

import type { UnData, UnResponse } from "@uni-helper/uni-network"

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
 * @date 08/10/2024/  21:42:12
 * @returns {*}  {Promise<UnResponse<IGetUserIdData, UnData>>} 用户信息
 */
const getUserInfoApi = async(): Promise<UnResponse<IGetUserInfoApiResultData, UnData>> => {

    try {

        const _result = await un.get<IGetUserInfoApiResultData>("/1")
        return _result

    }
    catch (error) {

        return {
            success: false,
            message: "请求失败"
        } as UnResponse<IGetUserInfoApiResultData, UnData>

    }

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
 * @date 08/10/2024/  21:47:44
 * @param {IGetIdApiParams} params 参数
 * @returns {*}  {Promise<UnResponse<IGetIdApiResultData, IGetIdApiParams>>} 获取id的结果数据
 */
const getIdApi = async(params: IGetIdApiParams): Promise<UnResponse<IGetIdApiResultData, IGetIdApiParams>> => {

    try {

        const _result = await un.post<IGetIdApiResultData, IGetIdApiParams>("", params)
        return _result

    }
    catch (error) {

        return {
            success: false,
            message: "请求失败"
        } as UnResponse<IGetIdApiResultData, IGetIdApiParams>

    }

}

export type { IGetUserInfoApiResultData, IGetIdApiParams, IGetIdApiResultData }

export { getUserInfoApi, getIdApi }
