<!--
 * @Author: dyb-dev
 * @Date: 2024-10-11 16:41:06
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-11 16:41:12
 * @FilePath: /uniapp-mp-wx-template/src/pages/launch.vue
 * @Description: 小程序启动页
-->

<template>
    <view class="launch">
        <nut-icon name="loading1" custom-color="var(--loading-color)" :size="20" />
        <view class="launch__loading-text">正在启动...</view>
    </view>
</template>

<style lang="scss" scoped>
.launch {
    --loading-color: #c8c9cc;

    display: flex;
    flex-direction: column;
    gap: 20rpx;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;

    &__loading-text {
        color: var(--loading-color);
        font-size: 26rpx;
    }
}
</style>
