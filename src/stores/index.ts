/*
 * @Author: dyb-dev
 * @Date: 2024-10-05 21:26:18
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-08 11:29:54
 * @FilePath: /uniapp-mp-wx-template/src/stores/index.ts
 * @Description: store模块
 */

export * from "./useActivityStore"
export * from "./useTabBarStore"
export * from "./useUserInfoStore"

import { createPinia } from "pinia"
import { createPersistedState } from "pinia-plugin-persistedstate"

/** store 实例 */
const store = createPinia()

// 使用全局持久化状态插件
store.use(
    createPersistedState({
        // 设置全局存储键名 默认: store名称
        key: id => `__persisted__${id}`,
        // 设置全局存储方式 默认: localStorage
        storage: {
            getItem: uni.getStorageSync,
            setItem: uni.setStorageSync
        }
    })
)

export { store }
