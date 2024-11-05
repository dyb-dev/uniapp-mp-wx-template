<!--
 * @Author: dyb-dev
 * @Date: 2024-09-19 10:39:24
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-05 00:30:46
 * @FilePath: /uniapp-mp-wx-template/src/pages/my.vue
 * @Description: 我的页面
 */
-->

<script setup lang="ts">
import { useAuthAvatarNicknameDialog } from "@/components"
import { useUserInfoStore } from "@/stores"

/** HOOKS: 用户信息 store */
const { userInfoStoreState } = useUserInfoStore()

// HOOKS: 授权头像昵称对话框
const { showAuthAvatarNicknameDialog } = useAuthAvatarNicknameDialog()
</script>

<template>
    <Layout>
        <view class="my">
            <nut-avatar size="large">
                <image v-if="userInfoStoreState.avatarUrl" :src="userInfoStoreState.avatarUrl" mode="aspectFit" />
                <nut-icon v-else name="my" size="40rpx" />
            </nut-avatar>

            <view>{{ userInfoStoreState.nickName }}</view>

            <nut-button type="primary" @click="showAuthAvatarNicknameDialog">授权头像昵称</nut-button>
        </view>

        <template #extra-content>
            <AuthAvatarNicknameDialog />
        </template>
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
