/*
 * @Author: dyb-dev
 * @Date: 2024-10-05 13:57:47
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-09 15:22:49
 * @FilePath: /uniapp-mp-wx-template/pages.config.ts
 * @Description: 页面配置文件
 */

import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages"

import { VITE_ENV } from "./vite.config"

/** STATIC: 获取.env文件的环境变量 */
const { VITE_PAGE_DIR, VITE_HOME_PATH, VITE_LOGIN_PATH, VITE_SUB_PACKAGE_DIR } = VITE_ENV

export default defineUniPages({
    // 全局配置
    globalStyle: {
        // 默认使用自定义导航栏
        navigationStyle: "custom",
        // 默认设置状态栏前景颜色为`black`，解决状态栏不可见的问题
        navigationBarTextStyle: "black",
        // 默认设置导航栏背景颜色为白色 解决在 `webview` 中不支持自定义导航栏的问题，因此设置保持与自定义导航栏一致的背景颜色
        navigationBarBackgroundColor: "#ffffff",
        // 默认页面(page元素)为白色背景，解决系统暗黑主题下页面背景与导航栏背景不一致的问题
        backgroundColor: "#ffffff",
        // 默认禁用页面滑动，解决ios与安卓默认行为不一致的问题
        disableScroll: true
    },
    // 首页路径
    entryPagePath: VITE_HOME_PATH,
    // 页面配置
    pages: [
        {
            path: VITE_LOGIN_PATH,
            style: {
                navigationBarTitleText: "登录"
            }
        },
        {
            path: VITE_HOME_PATH,
            style: {
                navigationBarTitleText: "首页"
            }
        },
        {
            path: `${VITE_PAGE_DIR}/list`,
            style: {
                navigationBarTitleText: "列表"
            }
        },
        {
            path: `${VITE_PAGE_DIR}/my`,
            style: {
                navigationBarTitleText: "我的"
            },
            // 标识该页面是需要先登录
            needLogin: true
        },
        {
            path: `${VITE_PAGE_DIR}/test`,
            style: {
                navigationBarTitleText: "测试",
                // 允许滑动
                disableScroll: false,
                // 开启下拉刷新
                enablePullDownRefresh: true
            },
            // 标识该页面是需要先登录
            needLogin: true
        }
    ],
    // wx开发工具页面测试配置
    condition: {
        current: 0,
        list: [
            {
                name: "首页",
                path: VITE_HOME_PATH,
                query: "test=首页"
            },
            {
                name: "我的",
                path: `${VITE_PAGE_DIR}/my`
            },
            {
                name: "测试",
                path: `${VITE_PAGE_DIR}/test`
            }
        ]
    },
    // TabBar页面配置
    tabBar: {
        // 默认使用自定义TabBar
        custom: true,
        // 默认颜色
        color: "#7d7e80",
        // 选中颜色
        selectedColor: "#29d446",
        // tabBar 项列表
        list: [
            {
                pagePath: VITE_HOME_PATH,
                text: "首页",
                iconfont: {
                    text: "home",
                    selectedText: "home"
                }
            },
            {
                pagePath: `${VITE_PAGE_DIR}/list`,
                text: "列表",
                iconfont: {
                    text: "dongdong",
                    selectedText: "dongdong"
                }
            },
            {
                pagePath: `${VITE_PAGE_DIR}/my`,
                text: "我的",
                iconfont: {
                    text: "my",
                    selectedText: "my"
                }
            }
        ]
    },

    // 分包配置
    subPackages: [
        {
            root: `${VITE_SUB_PACKAGE_DIR}/webview`,
            pages: [
                {
                    path: `${VITE_SUB_PACKAGE_DIR}/webview/${VITE_PAGE_DIR}/webview`
                }
            ]
        }
    ],
    // 分包预加载配置
    preloadRule: {
        [VITE_HOME_PATH]: {
            packages: [`${VITE_SUB_PACKAGE_DIR}/webview`]
        }
    },

    // 自动导入配置
    easycom: {
        custom: {
            // 自动导入z-paging组件
            "^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)": "z-paging/components/z-paging$1/z-paging$1.vue"
        }
    }
})
