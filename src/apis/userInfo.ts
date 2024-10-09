/*
 * @Author: dyb-dev
 * @Date: 2024-10-09 15:23:42
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-09 21:02:26
 * @FilePath: /uniapp-mp-wx-template/src/apis/userInfo.ts
 * @Description: 用户信息相关接口
 */

import un from "@uni-helper/uni-network"

import type { UnData, UnResponse } from "@uni-helper/uni-network"

import { ENABLE_API_TEST_DATA } from "."

/** 登录的参数 */
interface ILoginApiParams {
    /**
     * 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 [code2Session](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html)，使用 code 换取 openid、unionid、session_key 等信息
     */
    code: string
}

/** 登录的结果数据 */
interface ILoginApiResultData {
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
 * @date 09/10/2024/  16:33:23
 * @param {ILoginApiParams} params 参数
 * @returns {*} 登录的结果数据
 */
const loginApi = async(params: ILoginApiParams): Promise<UnResponse<ILoginApiResultData, ILoginApiParams>> => {

    let _result: UnResponse<ILoginApiResultData, ILoginApiParams>

    // 测试数据
    if (ENABLE_API_TEST_DATA) {

        _result = {
            // errno: 1,
            // errMsg: "登录失败",
            data: {
                userId: "userId",
                unionId: "unionId",
                openId: "openId",
                nickName: "xxx",
                avatarUrl:
                    "https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png",
                phoneNumber: "111111111"
            }
        }

        return _result

    }

    // TODO: 接口地址修改
    _result = await un.post<ILoginApiResultData, ILoginApiParams>("", params)

    return _result

}

/** 获取手机号的参数 */
interface IGetPhoneNumberApiParams {
    /** 授权手机号code */
    code: string
}

/** 获取手机号的结果数据 */
interface IGetPhoneNumberApiResultData {
    /** 手机号 */
    phoneNumber: string
}

/**
 * FUN: 获取手机号
 *
 * @author dyb-dev
 * @date 08/10/2024/  21:47:44
 * @param {IGetPhoneNumberApiParams} params 参数
 * @returns {*} 获取手机号的结果数据
 */
const getPhoneNumberApi = async(
    params: IGetPhoneNumberApiParams
): Promise<UnResponse<IGetPhoneNumberApiResultData, IGetPhoneNumberApiParams>> => {

    let _result: UnResponse<IGetPhoneNumberApiResultData, IGetPhoneNumberApiParams>
    // 测试数据
    if (ENABLE_API_TEST_DATA) {

        _result = {
            // errno: 1,
            // errMsg: "登录失败",
            data: {
                phoneNumber: "111111111"
            }
        }

        return _result

    }

    // TODO: 接口地址修改
    _result = await un.post<IGetPhoneNumberApiResultData, IGetPhoneNumberApiParams>("", params)
    return _result

}

/** 上传头像的参数 */
interface IUploadAvatarApiParams {
    /** 头像url */
    avatarUrl: string
}

/**
 * FUN: 上传头像
 *
 * @author dyb-dev
 * @date 08/10/2024/  21:47:44
 * @param {IUploadAvatarApiParams} params 参数
 * @returns {*} 上传头像的结果数据
 */
const uploadAvatarApi = async(params: IUploadAvatarApiParams): Promise<UnResponse<UnData, IUploadAvatarApiParams>> => {

    let _result: UnResponse<UnData, IUploadAvatarApiParams>
    // 测试数据
    if (ENABLE_API_TEST_DATA) {

        _result = {
            // errno: 1,
            // errMsg: "登录失败",
            data: {}
        }

        return _result

    }

    // TODO: 接口地址修改
    _result = await un.post<UnData, IUploadAvatarApiParams>("", params)
    return _result

}

/** 上传用户信息的参数 */
interface IUploadUserInfoApiParams {
    /** 头像url */
    avatarUrl: string
    /** 昵称 */
    nickName: string
}

/**
 * FUN: 上传用户信息
 *
 * @author dyb-dev
 * @date 08/10/2024/  21:47:44
 * @param {IUploadUserInfoApiParams} params 参数
 * @returns {*} 上传用户信息的结果数据
 */
const uploadUserInfoApi = async(params: IUploadUserInfoApiParams): Promise<UnResponse<UnData, IUploadUserInfoApiParams>> => {

    let _result: UnResponse<UnData, IUploadUserInfoApiParams>
    // 测试数据
    if (ENABLE_API_TEST_DATA) {

        _result = {
            // errno: 1,
            // errMsg: "登录失败",
            data: {}
        }

        return _result

    }

    // TODO: 接口地址修改
    _result = await un.post<UnData, IUploadUserInfoApiParams>("", params)
    return _result

}

export type {
    IGetPhoneNumberApiParams,
    IGetPhoneNumberApiResultData,
    IUploadAvatarApiParams,
    IUploadUserInfoApiParams,
    ILoginApiParams,
    ILoginApiResultData
}

export { getPhoneNumberApi, uploadAvatarApi, uploadUserInfoApi, loginApi }
