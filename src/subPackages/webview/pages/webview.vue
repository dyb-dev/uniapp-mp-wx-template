<!--
 * @FileDesc: webview 公用页面
 -->

<script setup lang="ts">
import { onLoad, onShareAppMessage } from "@dcloudio/uni-app"
import { ref } from "vue"

import { getCurrentPagePath, mergeUrlQuery, WEB_URL_KEY } from "@/utils"

import type { WebViewOnMessageEvent } from "@uni-helper/uni-app-types"

/** REF: webView 的url */
const webUrl = ref<string>("")

/** CONST: 当前页面路径 开头带 `/` */
let currentPagePath: string

/** LIFECYCLE: 页面数据初始化完成 */
onLoad(query => {

    if (!query) {

        console.error("onLoad() query 为空")
        return

    }

    console.log("onLoad() query:", query)

    // 从页面进入的参数中获取 h5网址url
    const _webUrl = decodeURIComponent(query[WEB_URL_KEY] || "")
    if (!_webUrl) {

        console.error("onLoad() H5网址url为空 _webUrl:", _webUrl)
        return

    }

    console.log("onLoad() _webUrl:", _webUrl)

    webUrl.value = _webUrl

    // 当前页面路径
    currentPagePath = "/" + getCurrentPagePath()

})

/** webView message 数据 */
interface IWebViewMessageData {
    /** 分享标题 默认: 当前应用名称 */
    shareTitle?: string
    /** 分享图片 默认: 使用默认截图 */
    shareImageUrl?: string
    /** 分享页面路径 默认: 当前小程序 WebView 页面路径 */
    sharePath?: string
    /** 分享页面路径参数 */
    sharePathQuery?: Record<string, any>
    /** 分享页面路径是否需要编码 默认: true */
    sharePathEnCode?: boolean

    /** 有关 h5网址 的url 的参数只有在 `sharePath` 为当前小程序 WebView 页面路径时才有效 */

    /** h5网址 的url 默认: 当前小程序 WebView 组件实际加载的h5 URL */
    shareWebUrl?: string
    /** h5网址 的url参数 */
    shareWebUrlQuery?: Record<string, any>
    /** h5网址 的url是否需要编码 默认: false */
    shareWebUrlEnCode?: boolean
}

/** REF: 最新的 message 数据 */
const latestMessageData = ref<IWebViewMessageData>({})

// EVENT: 监听 webView message
const onWebViewMessage = (event: WebViewOnMessageEvent) => {

    const {
        detail: { data }
    } = event
    console.log("onWebViewMessage() data:", data)

    // 保存最新的 message 数据
    latestMessageData.value = data[data.length - 1]

}

/** LIFECYCLE: 监听页面分享 */
onShareAppMessage((options: Page.ShareAppMessageOption): Page.CustomShareContent => {

    console.log("onShareAppMessage() options:", options)

    // H5 post message 传递的最新数据
    const {
        shareTitle,
        shareImageUrl,
        sharePathQuery = {},
        sharePathEnCode = true,
        shareWebUrl = options.webViewUrl || webUrl.value,
        shareWebUrlQuery = {},
        shareWebUrlEnCode = false
    } = latestMessageData.value

    let { sharePath = currentPagePath } = latestMessageData.value

    // 如果分享的页面路径和当前页面路径一致
    if (sharePath === currentPagePath) {

        // 设置 h5网址url 参数
        const _shareWebUrl = mergeUrlQuery(shareWebUrl, shareWebUrlQuery, {
            encode: shareWebUrlEnCode
        })

        // 设置分享页面路径参数
        sharePath = mergeUrlQuery(
            sharePath,
            { ...sharePathQuery, [WEB_URL_KEY]: _shareWebUrl },
            {
                encode: sharePathEnCode
            }
        )

    }
    else {

        sharePath = mergeUrlQuery(sharePath, sharePathQuery, {
            encode: sharePathEnCode
        })

    }

    console.log("onShareAppMessage() sharePath:", sharePath)

    return {
        title: shareTitle,
        imageUrl: shareImageUrl,
        path: sharePath
    }

})
</script>

<template>
    <web-view :src="webUrl" @message="onWebViewMessage" />
</template>
