/*
 * @FileDesc: 使用分享
 */

import { useUserInfoStoreWithOut } from "@/stores"
import { setUrlQueryValue } from "@/utils"

/** 分享配置 */
interface IShareConfig extends Page.CustomShareContent {
    /**
     * 转发路径，必须是以 / 开头的完整路径。默认值：当前页面 path
     */
    path?: NavigateToOptions["url"]
    /**
     * 邀请用户ID
     */
    inviteUserId?: string
    /**
     * 来源
     */
    source?: string
}

/** CONST: 默认分享配置 */
const DEFAULT_SHARE_CONFIG: IShareConfig = {
    title: "祝您前程似锦，未来可期！",
    imageUrl: "/static/image/share.jpg"
}

// HOOKS: 使用用户信息Store
const { userInfoStoreState } = useUserInfoStoreWithOut()

/**
 * HOOKS: 使用分享
 *
 * @author dyb-dev
 * @date 30/10/2024/  12:29:17
 * @param {IShareConfig} [shareConfig] 分享配置
 * @returns {*}  {Page.CustomShareContent} 分享配置
 */
export const useShare = (shareConfig?: IShareConfig): Page.CustomShareContent => {

    /** 当前分享配置 */
    const _shareConfig = { ...DEFAULT_SHARE_CONFIG, ...shareConfig }

    let _path = _shareConfig.path || "/" + __PROJECT_INFO__.env.VITE_HOME_PATH

    /** 邀请用户ID */
    const _inviteUserId = _shareConfig.inviteUserId ?? userInfoStoreState.userId
    if (_inviteUserId) {

        _path = setUrlQueryValue(_path, "inviteUserId", _inviteUserId)
        delete _shareConfig.inviteUserId

    }

    // 来源
    const _source = _shareConfig.source ?? "share"
    if (_source) {

        _path = setUrlQueryValue(_path, "source", _source)
        delete _shareConfig.source

    }

    _shareConfig.path = _path as NavigateToOptions["url"]

    return _shareConfig

}
