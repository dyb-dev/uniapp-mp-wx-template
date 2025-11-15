/*
 * @FileDesc: 用户信息相关接口
 */

import { sendRequest } from "../request"

import type { UnResponse } from "@uni-helper/uni-network"

/** 登录的参数 */
export interface ILoginApiParams {
    /**
     * 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 [code2Session](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html)，使用 code 换取 openid、unionid、session_key 等信息
     */
    code: string
}

/** 登录的结果数据 */
export interface ILoginApiResultData {
    /** 用户在我们系统中的加密用户代码 */
    userId: string
    /** 由微信生成的用户在开放平台的唯一标识符 */
    unionId: string
    /** 由微信生成的用户在本小程序唯一标识 */
    openId: string
    /** 昵称 */
    nickName: string
    /** 头像 */
    avatarUrl: string
    /** 绑定手机号 */
    phoneNumber: string
}

/**
 * FUN: 登录
 *
 * @author dyb-dev
 * @date 21/02/2025/  22:49:58
 * @param {ILoginApiParams} params 参数
 * @param {TModifyProperties<ITestRequestConfig<ILoginApiResultData>, "test">} [testRequestConfig] 测试请求配置
 * @returns {*}  {Promise<UnResponse<ILoginApiResultData>>} 结果数据
 */
export const loginApi = async(
    params: ILoginApiParams,
    testRequestConfig?: TModifyProperties<ITestRequestConfig<ILoginApiResultData>, "test">
): Promise<UnResponse<ILoginApiResultData>> => {

    return sendRequest({
        url: "",
        params,
        testRequestConfig
    })

}

/** 获取手机号的参数 */
export interface IGetPhoneNumberApiParams {
    /** 授权手机号code */
    code: string
}

/** 获取手机号的结果数据 */
export interface IGetPhoneNumberApiResultData {
    /** 手机号 */
    phoneNumber: string
}

/**
 * FUN: 获取手机号
 *
 * @author dyb-dev
 * @date 21/02/2025/  22:54:45
 * @param {IGetPhoneNumberApiParams} params 参数
 * @param {TModifyProperties<ITestRequestConfig<IGetPhoneNumberApiResultData>, "test">} [testRequestConfig] 测试请求配置
 * @returns {*}  {Promise<UnResponse<IGetPhoneNumberApiResultData>>} 结果数据
 */
export const getPhoneNumberApi = async(
    params: IGetPhoneNumberApiParams,
    testRequestConfig?: TModifyProperties<ITestRequestConfig<IGetPhoneNumberApiResultData>, "test">
): Promise<UnResponse<IGetPhoneNumberApiResultData>> => {

    return sendRequest({
        url: "",
        params,
        testRequestConfig
    })

}

/** 上传头像的参数 */
export interface IUploadAvatarApiParams {
    /** 头像url */
    avatarUrl: string
}

/**
 * FUN: 上传头像
 *
 * @author dyb-dev
 * @date 21/02/2025/  23:03:54
 * @param {IUploadAvatarApiParams} params 参数
 * @param {TModifyProperties<ITestRequestConfig, "test">} [testRequestConfig] 测试请求配置
 * @returns {*}  {Promise<UnResponse>} 上传头像结果
 */
export const uploadAvatarApi = async(
    params: IUploadAvatarApiParams,
    testRequestConfig?: TModifyProperties<ITestRequestConfig, "test">
): Promise<UnResponse> => {

    return sendRequest({
        url: "",
        params,
        testRequestConfig
    })

}

/** 上传用户信息的参数 */
export interface IUploadUserInfoApiParams {
    /** 头像url */
    avatarUrl: string
    /** 昵称 */
    nickName: string
}

/**
 * FUN: 上传用户信息
 *
 * @author dyb-dev
 * @date 21/02/2025/  23:05:52
 * @param {IUploadUserInfoApiParams} params 参数
 * @param {TModifyProperties<ITestRequestConfig, "test">} [testRequestConfig] 测试请求配置
 * @returns {*}  {Promise<UnResponse>} 上传用户信息结果
 */
export const uploadUserInfoApi = async(
    params: IUploadUserInfoApiParams,
    testRequestConfig?: TModifyProperties<ITestRequestConfig, "test">
): Promise<UnResponse> => {

    return sendRequest({
        url: "",
        params,
        testRequestConfig
    })

}
