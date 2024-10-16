<!--
 * @Author: dyb-dev
 * @Date: 2024-09-19 10:39:24
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-11 17:20:44
 * @FilePath: /uniapp-mp-wx-template/src/pages/my.vue
 * @Description: 我的页面
 */
-->

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app"
import { useToast } from "nutui-uniapp/composables"
import { ref } from "vue"

import { useUserInfoStore } from "@/stores"

const toast = useToast()

/** HOOKS: 用户信息 store */
const { userInfoStoreState, uploadUserInfo } = useUserInfoStore()

/** REF: 头像地址 */
const avatarUrl = ref("")

/** REF: 昵称 */
const nickName = ref("")

/** LIFECYCLE: 页面切入前台 */
onShow(() => {

    avatarUrl.value = userInfoStoreState.avatarUrl
    nickName.value = userInfoStoreState.nickName

})

// EVENT: 保存按钮
const onSaveButton = async() => {

    if (!avatarUrl.value) {

        uni.showToast({
            title: "请上传头像",
            icon: "none"
        })
        return

    }

    if (!nickName.value) {

        uni.showToast({
            title: "请输入昵称",
            icon: "none"
        })
        return

    }

    uni.showLoading({ title: "正在保存...", mask: true })

    // 保存用户信息
    const _result = await uploadUserInfo({
        avatarUrl: avatarUrl.value,
        nickName: nickName.value
    })

    console.log("onSaveButton() _result:", _result)

    uni.hideLoading()

    if (_result.errno || !_result.data) {

        uni.showToast({
            title: "保存失败,请稍后再试",
            icon: "none"
        })
        return

    }

    toast.success("保存成功")

}
</script>

<template>
    <Layout>
        <view class="my">
            <nut-avatar size="large">
                <image v-if="avatarUrl" :src="avatarUrl" mode="aspectFit" />
                <nut-icon v-else name="my" size="40rpx" />
                <ChooseAvatar v-model="avatarUrl" :upload-to-server="false" />
            </nut-avatar>

            <NickName v-model="nickName" />

            <nut-button type="primary" @tap="onSaveButton">保存信息</nut-button>
        </view>
    </Layout>
</template>

<style lang="scss" scoped>
.my {
    display: flex;
    flex-direction: column;
    gap: 40px 0;
    align-items: center;
    box-sizing: border-box;
    height: 100%;
    padding-top: 100rpx;
}
</style>
