<!--
 * @Author: dyb-dev
 * @Date: 2024-09-19 10:38:39
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-11 16:41:32
 * @FilePath: /uniapp-mp-wx-template/src/pages/home.vue
 * @Description: 首页
-->

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app"

import { navigateToTarget } from "@/utils"

/** LIFECYCLE: 页面数据初始化完成 */
onLoad(query => {

    console.log("首页入参:", query)

})

// EVENT: 点击跳转测试页面按钮
const onJumpTestPageButton = () => {

    // 测试跳转二级页面
    navigateToTarget({
        path: "/pages/test",
        query: {
            test: "test"
        }
    })

}

// EVENT: 点击跳转Webview页面按钮
const onJumpWebviewPageButton = () => {

    // 测试跳转 h5 页面
    navigateToTarget({
        webUrl: "https://www.baidu.com"
    })

}
</script>

<template>
    <Layout>
        <view class="home">
            <view class="home__logo-box">
                <image style="display: block; width: 110rpx; height: 110rpx" src="/static/image/uniapp.ico" mode="scaleToFill" />

                <nut-animate type="ripple" :loop="true"> <nut-icon name="heart-fill" custom-color="#fa2c19" /> </nut-animate>

                <image style="display: block; width: 130rpx; height: 130rpx" src="/static/image/mp_wx.svg" mode="scaleToFill" />
            </view>

            <nut-animate type="jump" :loop="true"> Hello World！ </nut-animate>

            <view class="home__button-box">
                <nut-button type="success" @tap="onJumpTestPageButton">跳转测试页面</nut-button>
                <nut-button type="success" @tap="onJumpWebviewPageButton">跳转webview页面</nut-button>
            </view>
        </view>
    </Layout>
</template>

<style lang="scss" scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;

    &__logo-box {
        display: flex;
        gap: 0 40rpx;
        align-items: center;
        justify-content: center;
        margin: 100rpx 0;
    }

    &__button-box {
        display: flex;
        gap: 0 20px;
        margin: 200rpx 0 0;
    }
}
</style>
