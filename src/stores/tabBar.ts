/*
 * @FileDesc: TabBar状态管理
 */

import { defineStore } from "pinia"
import { reactive } from "vue"

import pagesJson from "@/pages.json"
import { getCurrentPagePath } from "@/utils"

import type { TTabBarItem } from "@/components/layout/TabBar.vue"
import type { TabBarItem } from "@uni-helper/vite-plugin-uni-pages"

import { store } from "."

/** Store 状态类型 */
type TTabBarStoreState = {
    /** 当前TabBar索引 */
    currentIndex: number
    /** TabBar 列表 */
    list: TTabBarItem[]
}

/** Store 实例 */
export const useTabBarStore = defineStore("TabBarStore", () => {

    /** Store State */
    const tabBarStoreState = reactive<TTabBarStoreState>({
        currentIndex: 0,
        list:
            // @ts-ignore
            pagesJson?.tabBar?.list.map((item: TabBarItem) => {

                return {
                    ...item,
                    // 优先级: 图标 > 图片路径
                    // @ts-ignore
                    icon: item?.iconfont?.text || item?.iconPath || "",
                    // @ts-ignore
                    selectedIcon: item?.iconfont?.selectedText || item?.selectedIconPath || "",
                    classPrefix: "nut-icon",
                    fontClassName: "nutui-iconfont",
                    showDot: false,
                    dotValue: 0
                } as TTabBarItem

            }) || []
    })

    /**
     * FUN: 获取指定 TabBarItem
     *
     * @author dyb-dev
     * @date 25/09/2024/  17:41:06
     * @param {string} pagePath 页面路径
     * @returns {*} TabBarItem配置
     */
    const getTabBarItem = (pagePath: string) => tabBarStoreState.list.find(item => item.pagePath === pagePath)

    /**
     * FUN: 获取当前 TabBarItem
     *
     * @author dyb-dev
     * @date 25/09/2024/  17:41:55
     * @returns {*} 当前TabBarItem配置
     */
    const getCurrentTabBarItem = () => getTabBarItem(getCurrentPagePath())

    /**
     * FUN: 获取 TabBar 索引
     *
     * @author dyb-dev
     * @date 09/10/2024/  12:29:36
     * @param {string} pagePath 页面路径
     * @returns {*} TabBar 索引
     */
    const getTabBarIndex = (pagePath: string) => tabBarStoreState.list.findIndex(item => item.pagePath === pagePath)

    /**
     * FUN: 获取当前 TabBar 索引
     *
     * @author dyb-dev
     * @date 25/09/2024/  17:42:12
     * @returns {*} 当前 TabBar 索引
     */
    const getCurrentTabBarIndex = () => getTabBarIndex(getCurrentPagePath())

    /**
     * FUN: 更新当前 TabBar 索引
     *
     * @author dyb-dev
     * @date 09/10/2024/  12:34:31
     */
    const updateCurrentTabBarIndex = () => {

        /** 获取当前TabBar索引 */
        const _currentTabBarIndex = getCurrentTabBarIndex()
        // 只有在当前TabBar索引大于等于0时才会设置
        if (_currentTabBarIndex >= 0) {

            tabBarStoreState.currentIndex = _currentTabBarIndex

        }

    }

    return {
        tabBarStoreState,
        getTabBarItem,
        getCurrentTabBarItem,
        getTabBarIndex,
        getCurrentTabBarIndex,
        updateCurrentTabBarIndex
    }

})

/**
 * 使用状态管理
 *  - 在没有Vue组件上下文的情况下使用
 *
 * @author dyb-dev
 * @date 15/09/2024/  23:53:35
 * @returns store实例
 */
export const useTabBarStoreWithOut = () => {

    return useTabBarStore(store)

}
