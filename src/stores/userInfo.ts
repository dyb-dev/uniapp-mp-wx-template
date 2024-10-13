/*
 * @Author: dyb-dev
 * @Date: 2024-10-06 14:42:41
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-13 21:24:53
 * @FilePath: /uniapp-mp-wx-template/src/stores/userInfo.ts
 * @Description: 用户信息状态管理
 */

import { defineStore } from "pinia"
import { reactive } from "vue"

import { getPhoneNumberApi, loginApi, uploadAvatarApi, uploadUserInfoApi } from "@/apis"

import type { IGetPhoneNumberApiParams, IUploadAvatarApiParams, IUploadUserInfoApiParams } from "@/apis"

import { store } from "."

/** Store 状态类型 */
interface IUserInfoStoreState {
    /**
     * 是否登录成功
     */
    isLogin: boolean
    /**
     * 用户在我们系统中的加密用户代码
     */
    userId: string
    /**
     * 由微信生成的用户在开放平台的唯一标识符
     */
    unionId: string
    /**
     * 由微信生成的用户在本小程序唯一标识
     */
    openId: string
    /**
     * 用户的微信昵称
     */
    nickName: string
    /**
     * 用户的微信头像
     */
    avatarUrl: string
    /**
     * 用户的微信绑定手机号(不带区号的手机号)
     */
    phoneNumber: string
}

/** Store 实例 */
const useUserInfoStore = defineStore("UserInfoStore", () => {

    /** Store 状态 */
    const userInfoStoreState = reactive<IUserInfoStoreState>({
        isLogin: false,

        userId: "",
        unionId: "",
        openId: "",

        nickName: "",
        avatarUrl: "",
        phoneNumber: ""
    })

    /**
     * FUN: 微信登录
     *
     * @author dyb-dev
     * @date 09/10/2024/  17:02:42
     * @returns {*} 微信登录结果
     */
    const wxLogin = (): Promise<WechatMiniprogram.LoginSuccessCallbackResult | WechatMiniprogram.RequestFailCallbackErr> => {

        return new Promise(resolve => {

            wx.login({
                success: res => resolve(res),
                fail: err => resolve(err)
            })

        })

    }

    /**
     * FUN: 登录
     *
     * @author dyb-dev
     * @date 09/10/2024/  17:02:57
     */
    const login = async() => {

        try {

            uni.showLoading({ title: "正在登录...", mask: true })

            const _wxLoginResult = await wxLogin()

            // @ts-ignore
            const _code = _wxLoginResult?.code || ""

            // 如果没有code
            if (!_code) {

                throw _wxLoginResult.errMsg

            }

            const _loginApiResult = await loginApi({ code: _code })

            console.log("login() _loginApiResult:", _loginApiResult)

            uni.hideLoading()

            // 如果登录失败
            if (_loginApiResult.errno || !_loginApiResult.data) {

                throw _loginApiResult.errMsg

            }

            const {
                data: { userId = "", unionId = "", openId = "", nickName = "", avatarUrl = "", phoneNumber = "" }
            } = _loginApiResult

            userInfoStoreState.userId = userId
            userInfoStoreState.unionId = unionId
            userInfoStoreState.openId = openId
            userInfoStoreState.nickName = nickName
            userInfoStoreState.avatarUrl = avatarUrl
            userInfoStoreState.phoneNumber = phoneNumber

            userInfoStoreState.isLogin = true

        }
        catch (error) {

            uni.hideLoading()
            console.error("login()", error)

        }

    }

    /**
     * FUN: 获取手机号
     *
     * @author dyb-dev
     * @date 09/10/2024/  20:22:11
     * @param {IGetPhoneNumberApiParams} params 参数
     * @returns {*} 获取手机号结果
     */
    const getPhoneNumber = async(params: IGetPhoneNumberApiParams) => {

        const _result = await getPhoneNumberApi(params)

        // 如果获取成功
        if (!_result.errno && _result.data?.phoneNumber) {

            userInfoStoreState.phoneNumber = _result.data.phoneNumber

        }

        return _result

    }

    /**
     * FUN: 上传头像
     *
     * @author dyb-dev
     * @date 09/10/2024/  20:33:52
     * @param {IUploadAvatarApiParams} params 参数
     * @returns {*} 上传头像结果
     */
    const uploadAvatar = async(params: IUploadAvatarApiParams) => {

        const _result = await uploadAvatarApi(params)

        // 如果上传头像成功
        if (!_result.errno) {

            userInfoStoreState.avatarUrl = params.avatarUrl

        }

        return _result

    }

    /**
     * FUN: 上传用户信息
     *
     * @author dyb-dev
     * @date 09/10/2024/  20:39:29
     * @param {IUploadUserInfoApiParams} params 参数
     * @returns {*} 上传用户信息结果
     */
    const uploadUserInfo = async(params: IUploadUserInfoApiParams) => {

        const _result = await uploadUserInfoApi(params)

        // 如果上传用户信息成功
        if (!_result.errno) {

            userInfoStoreState.avatarUrl = params.avatarUrl
            userInfoStoreState.nickName = params.nickName

        }

        return _result

    }

    return { userInfoStoreState, login, getPhoneNumber, uploadAvatar, uploadUserInfo }

})

/**
 * FUN: 使用状态管理
 *  - 在没有Vue组件上下文的情况下使用
 *
 * @author dyb-dev
 * @date 15/09/2024/  23:53:35
 * @returns store实例
 */
const useUserInfoStoreWithOut = () => {

    return useUserInfoStore(store)

}

export { useUserInfoStore, useUserInfoStoreWithOut }
