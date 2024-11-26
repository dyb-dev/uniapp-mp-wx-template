/*
 * @Author: dyb-dev
 * @Date: 2024-10-01 22:46:34
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-26 15:51:20
 * @FilePath: /uniapp-mp-wx-template/src/components/index.ts
 * @Description: 组件模块
 */

/** 导出选择器组件相关工具函数 */
export * from "./picker"
/** 导出弹窗组件相关工具函数 */
export * from "./popup"
/** 导出对话框组件相关工具函数 */
export * from "./dialog"
/** 导出用户信息组件相关工具函数 */
export * from "./userInfo"
/** 导出提供组件选项相关工具函数 */
export * from "./provideComponentOptions"
/** 导出列表组件 */
export * from "./List.vue"

/**
 * FUN: 设置全局组件
 *
 * @author dyb-dev
 * @date 01/10/2024/  22:50:29
 */
const setupComponent = () => {

    // 设置`z-paging`的全局默认props
    // @ts-ignore
    uni.$zp = {
        config: {
            // 当前页码为 1
            "default-page-no": 1,
            // 每一页数据大小为 10
            "default-page-size": 10,
            // 是否开启底部安全区域适配
            "safe-area-inset-bottom": true,
            // 开启底部安全区域适配后，是否使用placeholder形式实现
            "use-safe-area-placeholder": true,
            // 是否开启固定定位
            fixed: false,
            // 是否开启下拉刷新时手机短振动
            "refresher-vibrate": true,
            // 是否开启下拉刷新回弹动画
            "refresher-end-bounce-enabled": false,
            // 是否首次加载时显示加载中状态
            "show-loading-more-when-reload": true,
            // 加载更多时 loading-icon 的类型
            "loading-more-loading-icon-type": "circle",
            // 当分页未满一屏时，是否自动加载更多
            "inside-more": true,
            // 当分页未满一屏时，自动加载时，不会显示【点击加载更多】
            "loading-more-default-as-loading": true,
            // 空数据图片是否垂直居中
            "empty-view-center": false,
            // 加载失败时是否显示重新加载按钮
            "show-empty-view-reload-when-error": true,
            // 下拉刷新加载中时是否自动隐藏空数据图
            "auto-hide-empty-view-when-pull": false,
            // 是否自动显示点击返回顶部按钮
            "auto-show-back-to-top": true,
            // 是否显示滚动条
            "show-scrollbar": false,
            // 返回顶部按钮图片
            "back-to-top-img": "/static/image/List/back-top.png",
            // 返回顶部按钮样式
            "back-to-top-style": {
                background: "#29d446",
                width: "25rpx",
                height: "31rpx",
                borderRadius: "50%",
                padding: "27rpx 31rpx",
                boxShadow: "0 2px 8px rgba(0, 0, 0, .12)"
            }
        }
    }

}

export { setupComponent }
