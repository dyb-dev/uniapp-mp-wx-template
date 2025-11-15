<!--
 * @FileDesc: 授权头像昵称对话框
 -->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"
import { inject, ref, watch } from "vue"

import { useUserInfoStore } from "@/stores"
import { deepClone } from "@/utils"

import type { IAuthErrorOptions } from "@/types"

import type { Ref } from "vue"

/** TYPE: 授权头像昵称对话框动作类型 */
export type TAuthAvatarNicknameDialogActionType = "click-cancel-button" | "click-confirm-button"

/** TYPE: 卸载组件回调参数 */
export type TAuthAvatarNicknameDialogUnmountParam = [TAuthAvatarNicknameDialogActionType]

/** TYPE: 函数式调用时的唯一标识key */
export type TAuthAvatarNicknameDialogCustomKey = `__AUTH_AVATAR_NICKNAME_DIALOG__${string}`

/** 组件选项 */
export interface IAuthAvatarNicknameDialogOptions {
    /**
     * 是否显示
     *
     * @default false
     */
    show: boolean
    /**
     * 函数式调用时有效 组件唯一标识key
     *
     * @default ''
     */
    customKey?: string
    /**
     * 函数式调用时有效 卸载组件回调
     *
     * @param ares 卸载回调参数
     */
    unmount: (...ares: TAuthAvatarNicknameDialogUnmountParam) => void
}

/** TYPE: 弹窗Props(全部可选) */
type TAuthAvatarNicknameDialogProps = Partial<IAuthAvatarNicknameDialogOptions>

const props = withDefaults(defineProps<TAuthAvatarNicknameDialogProps>(), {
    show: false,
    customKey: ""
})

// EVENT: 定义 emits
const emits = defineEmits<{
    /** 当前索引 */
    (event: "update:show"): void
    /** 按钮点击 */
    (event: TAuthAvatarNicknameDialogActionType): void
}>()

/** REF: 双向绑定 */
const { show } = useVModels(props, emits)

/** REF: 选项 */
const options = ref<TAuthAvatarNicknameDialogProps>(deepClone<TAuthAvatarNicknameDialogProps>(props))

/** WATCH: 监听 show 的变化 */
watch(show, value => {
    // 当组件式调用显示时，让最新状态下的 props 覆盖 options
    if (value) {

        options.value = deepClone<TAuthAvatarNicknameDialogProps>(props)

    }
    // 将 show 的值赋值给 _show
    options.value.show = value

})

/** CONST: 接收选项的key */
const KEY: TAuthAvatarNicknameDialogCustomKey = `__AUTH_AVATAR_NICKNAME_DIALOG__${options.value.customKey || ""}`

/** REF: 函数式调用时注入的弹窗选项 */
const injectOptions: Ref<TAuthAvatarNicknameDialogProps> = inject(KEY, options)

/** WATCH: 监听 函数式调用时注入的弹窗选项 的变化 */
watch(injectOptions, value => {
    // 如果使用的是组件式调用，则中断执行，避免修改options造成死循环
    if (!value.unmount) {

        return

    }

    options.value = {
        ...props,
        ...deepClone<TAuthAvatarNicknameDialogProps>(value)
    }

})

/** HOOKS: 用户信息 store */
const { userInfoStoreState, uploadUserInfo } = useUserInfoStore()

/** REF: 头像地址 */
const avatarUrl = ref("")

/** REF: 昵称 */
const nickName = ref("")

/** WATCH: 监听 options.value.show 的变化 */
watch(
    () => options.value.show,
    value => {
        // 每当对话框显示时，将用户信息赋值给对话框
        if (value) {

            avatarUrl.value = userInfoStoreState.avatarUrl
            nickName.value = userInfoStoreState.nickName

        }

    }
)

/** REF: 动作类型 */
const actionType = ref<TAuthAvatarNicknameDialogActionType>("click-cancel-button")

/**
 * FUN: 关闭弹窗
 *
 * @param _actionType 动作类型
 * @returns {boolean} 是否关闭成功
 */
const close = async(_actionType: TAuthAvatarNicknameDialogActionType) => {
    // 点击确认按钮
    if (_actionType === "click-confirm-button") {

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

        // 如果头像地址或者昵称发生变化时，上传用户信息
        if (avatarUrl.value !== userInfoStoreState.avatarUrl || nickName.value !== userInfoStoreState.nickName) {

            uni.showLoading({ title: "加载中...", mask: true })

            // 保存用户信息
            const _result = await uploadUserInfo({
                avatarUrl: avatarUrl.value,
                nickName: nickName.value
            })

            uni.hideLoading()

            if (!_result.success || !userInfoStoreState.avatarUrl || !userInfoStoreState.nickName) {

                uni.showToast({
                    title: _result.message || "上传失败,请稍后再试",
                    icon: "none"
                })
                return

            }

        }

    }

    actionType.value = _actionType

    options.value.show = false
    show.value = false

}

/** EVENT: 关闭完成回调 */
const closed = () => {

    options.value.unmount?.(actionType.value)
    emits(actionType.value)

}

// EVENT: 监听授权失败
const onAuthFail = (options: IAuthErrorOptions) => {

    uni.showToast({ title: options.message, icon: "error" })

}
</script>

<script lang="ts">
export default {
    options: {
        // 虚拟化组件节点，使组件外部样式能够直接作用到组件内部的第一层节点
        // eslint-disable-next-line padded-blocks
        virtualHost: true,
        // eslint-disable-next-line padded-blocks
        // 允许父组件样式穿透到子组件
        styleIsolation: "shared"
    }
}
</script>

<template>
    <nut-popup
        class="auth-avatar-nickname-dialog"
        :custom-style="{ background: 'transparent' }"
        :overlay-style="{ background: 'rgba(0, 0, 0, 0.3)' }"
        v-model:visible="options.show"
        :close-on-click-overlay="false"
        position="bottom"
        @closed="closed"
    >
        <view class="auth-avatar-nickname-dialog__main">
            <view class="auth-avatar-nickname-dialog__main__title">申请获取您的头像，昵称</view>

            <view class="auth-avatar-nickname-dialog__main__row">
                <view>头像</view>

                <view class="auth-avatar-nickname-dialog__main__row__button">
                    <image
                        v-if="avatarUrl"
                        class="auth-avatar-nickname-dialog__main__row__button__image"
                        :src="avatarUrl"
                        mode="aspectFit"
                    />

                    <nut-icon v-else name="my2" size="40rpx" custom-color="#908f8f" />

                    <AuthAvatarButton v-model="avatarUrl" :upload-to-server="false" @fail="onAuthFail" />
                </view>

                <nut-icon name="rect-right" size="30rpx" custom-color="#908f8f" />
            </view>

            <view class="auth-avatar-nickname-dialog__main__row">
                <view>昵称</view>

                <NickNameInput style="flex: 1" v-model="nickName" text-align="right" @fail="onAuthFail" />

                <nut-icon name="rect-right" size="30rpx" custom-color="#908f8f" />
            </view>

            <view style="display: flex">
                <button type="default" style="width: 40%" @click="close('click-cancel-button')">取消</button>

                <button type="primary" style="width: 40%" @click="close('click-confirm-button')">确认</button>
            </view>
        </view>
    </nut-popup>
</template>

<style lang="scss" scoped>
.auth-avatar-nickname-dialog {
    &__main {
        box-sizing: border-box;
        width: 100%;
        padding: 0 40rpx 150rpx;
        background-color: $uni-bg-color;
        border-radius: 5% 5% 0 0;

        &__title {
            width: 100%;
            height: 100rpx;
            padding: 30rpx 0;
            color: $uni-text-color;
            font-weight: bold;
            font-size: 36rpx;
        }

        &__row {
            display: flex;
            gap: 0 10rpx;
            align-items: center;
            box-sizing: border-box;
            width: 100%;
            height: 100rpx;
            margin-bottom: 40rpx;
            padding-left: 30rpx;
            color: $uni-text-color;
            border-bottom: 1rpx solid $uni-text-color-grey;

            &__button {
                position: relative;
                display: flex;
                flex: 1;
                align-items: center;
                justify-content: flex-end;

                &__image {
                    width: 80rpx;
                    height: 80rpx;
                    border-radius: 50%;
                }
            }
        }
    }
}
</style>
