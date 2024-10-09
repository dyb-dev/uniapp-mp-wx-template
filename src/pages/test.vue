<script setup lang="ts">
import { onPullDownRefresh, onLoad } from "@dcloudio/uni-app"
import { ref } from "vue"

import { getIdApi, getUserInfoApi } from "@/apis"

onLoad(query => {

    console.log("测试页面入参:", query)

})

/** 页面下拉钩子 需要 `pages.json` 开启 enablePullDownRefresh 选项和关闭 disableScroll 选项 */
onPullDownRefresh(() => {

    setTimeout(() => {

        console.log("页面下拉刷新成功")
        uni.stopPullDownRefresh()

    }, 1000)

})

/** REF: userId */
const userId = ref(0)

/** EVENT: 点击获取userId按钮 */
const onClickGetUserInfoButton = async() => {

    const _result = await getUserInfoApi()
    console.log("onClickGetUserInfoButton() _result:", _result)

    // 存在错误码或者不存在data数据
    if (_result.errno || !_result.data) {

        uni.showToast({
            title: _result.errMsg || "获取userId失败",
            icon: "none"
        })
        return

    }
    userId.value = _result.data.userId

}

/** REF: id */
const id = ref(0)

/** EVENT: 点击获取id按钮 */
const onClickGetIdButton = async() => {

    const _result = await getIdApi({
        userId: 123
    })
    console.log("onClickGetIdButton() _result:", _result)

    // 存在错误码或者不存在data数据
    if (_result.errno || !_result.data) {

        uni.showToast({
            title: _result.errMsg || "获取id失败",
            icon: "none"
        })
        return

    }
    id.value = _result.data.id

}
</script>

<template>
    <Layout>
        <view class="test">
            <view>这是一个测试页面，⬇️下拉页面刷新</view>

            <view class="test__box">
                <nut-button type="success" @tap="onClickGetUserInfoButton">获取userId</nut-button>
                <view>userId: {{ userId }}</view>
            </view>

            <view class="test__box">
                <nut-button type="success" @tap="onClickGetIdButton">获取id</nut-button>
                <view>id: {{ id }}</view>
            </view>
        </view>
    </Layout>
</template>

<style lang="scss" scoped>
.test {
    display: flow-root;
    height: 100%;

    &__box {
        display: flex;
        gap: 20px;
        align-items: center;
        width: max-content;
        margin: 40px auto 0;
    }
}
</style>
