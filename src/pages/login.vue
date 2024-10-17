<!--
 * @Author: dyb-dev
 * @Date: 2024-09-19 10:39:05
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 16:36:39
 * @FilePath: /uniapp-mp-wx-template/src/pages/login.vue
 * @Description: 登录页
 */
-->

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app"
import { ref } from "vue"

import { useUserInfoStore } from "@/stores"
import { isDevEnv, navigateToPage } from "@/utils"

/** 页面入参 */
interface IPageParams {
    /** 重定向页面路径 默认: 首页 */
    redirectPath?: NavigateToOptions["url"]
    /** 其他相关参数 */
    [key: string]: any
}

/** STATIC: 页面入参 */
let pageParams: IPageParams

/** LIFECYCLE: 页面数据初始化完成 */
onLoad(query => {

    pageParams = query as IPageParams

})

/** HOOKS: 用户信息商店 */
const { userInfoStoreState, login } = useUserInfoStore()

/** REF: 手机号 */
const phoneNumber = ref("")

/** REF: 验证码 */
const verifyCode = ref("")

/** REF: 密码 */
const password = ref("")

// EVENT: 点击登录按钮
async function onClickLoginButton() {

    // 校验表单是否通过
    if (!isDevEnv() && !validateForm()) {

        return

    }

    // 登录
    await login()

    // 如果登录失败
    if (!userInfoStoreState.isLogin) {

        return

    }

    const { redirectPath = `/${__PROJECT_INFO__.env.VITE_HOME_PATH}` as NavigateToOptions["url"], ...query } = pageParams

    navigateToPage({
        path: redirectPath,
        /** 默认跳转类型为 `redirectTo`，如果跳转的页面为 TabBar 页面，则会自动改为 `switchTab`方法，注意: 如果为 `switchTab` 方法,则 query 参数将会无效 */
        method: "redirectTo",
        query,
        /** 自动查找返回的层级 */
        findBackDelta: true
    })

}

// FUN: 表单验证
const validateForm = (): boolean => {

    if (!phoneNumber.value) {

        uni.showToast({
            title: "请输入手机号",
            icon: "none"
        })
        return false

    }

    // 手机号格式校验规则
    const _phoneRegex = /^[1][3-9][0-9]{9}$/
    if (!_phoneRegex.test(phoneNumber.value)) {

        uni.showToast({
            title: "请输入有效的手机号",
            icon: "none"
        })
        return false

    }

    if (!verifyCode.value) {

        uni.showToast({
            title: "请输入验证码",
            icon: "none"
        })
        return false

    }

    if (!password.value) {

        uni.showToast({
            title: "请输入密码",
            icon: "none"
        })
        return false

    }

    return true

}
</script>

<template>
    <Layout>
        <view class="login">
            <view class="login__form">
                <nut-input
                    class="login__form__input"
                    v-model="phoneNumber"
                    type="number"
                    placeholder="请输入手机号"
                    clearable
                    :border="false"
                    max-length="11"
                />

                <nut-input
                    class="login__form__input"
                    v-model="verifyCode"
                    type="number"
                    placeholder="请输入验证码"
                    clearable
                    :border="false"
                >
                    <template #right>
                        <nut-button type="primary" size="small">获取验证码</nut-button>
                    </template>
                </nut-input>

                <nut-input
                    class="login__form__input"
                    v-model="password"
                    type="password"
                    placeholder="请输入密码"
                    clearable
                    :border="false"
                />

                <nut-button
                    class="login__form__button"
                    size="normal"
                    type="primary"
                    block
                    @tap="onClickLoginButton"
                >登录</nut-button>
            </view>
        </view>
    </Layout>
</template>

<style lang="scss" scoped>
.login {
    display: flow-root;
    height: 100%;

    &__form {
        width: 600rpx;
        margin: 100rpx auto 0;
        padding: 60rpx 40rpx;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 20rpx;

        &__input {
            margin-bottom: 50rpx;
            background: #f7f8f9;
            border-radius: 15rpx;
        }

        &__button {
            width: 100%;
        }
    }
}
</style>
