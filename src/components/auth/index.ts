/*
 * @FileDesc: 用户信息组件相关工具函数
 */

/** 导出授权头像按钮组件类型 */
export type * from "./AuthAvatarButton.vue"
/** 导出授权头像昵称对话框类型 */
export type * from "./AuthAvatarNicknameDialog.vue"
/** 导出授权手机号按钮组件类型 */
export type * from "./AuthPhoneNumberButton.vue"
/** 导出昵称输入框组件类型 */
export type * from "./NickNameInput.vue"

import { providerComponentOptions } from "@/components"

import type {
    IAuthAvatarNicknameDialogOptions,
    TAuthAvatarNicknameDialogUnmountParam,
    TAuthAvatarNicknameDialogCustomKey
} from "./AuthAvatarNicknameDialog.vue"

/** 显示授权头像昵称对话框的结果 */
export type TShowAuthAvatarNicknameDialogResult = TAuthAvatarNicknameDialogUnmountParam

/**
 * 使用授权头像昵称对话框
 *
 * @author dyb-dev
 * @date 29/10/2024/  22:10:25
 * @param {TAuthAvatarNicknameDialogCustomKey} [customKey='__AUTH_AVATAR_NICKNAME_DIALOG__'] - 授权头像昵称对话框唯一标识key 默认: `__AUTH_AVATAR_NICKNAME_DIALOG__`
 * @returns {*} {TUseAuthAvatarNicknameDialog} - 授权头像昵称对话框相关函数
 */
export const useAuthAvatarNicknameDialog = (customKey: string = "") => {

    const _customKey: TAuthAvatarNicknameDialogCustomKey = `__AUTH_AVATAR_NICKNAME_DIALOG__${customKey}`
    const _options = providerComponentOptions<TAuthAvatarNicknameDialogCustomKey, IAuthAvatarNicknameDialogOptions>(_customKey)

    /**
     * 显示授权头像昵称对话框
     *
     * @author dyb-dev
     * @date 30/10/2024/  23:00:06
     * @returns {*}  {Promise<TShowAuthAvatarNicknameDialogResult>} - 显示授权头像昵称对话框的结果
     */
    const showAuthAvatarNicknameDialog = (): Promise<TShowAuthAvatarNicknameDialogResult> => {

        return new Promise(resolve => {

            _options.value = {
                show: true,
                unmount: (...args: TShowAuthAvatarNicknameDialogResult) => resolve(args)
            }

        })

    }
    return {
        showAuthAvatarNicknameDialog
    }

}
