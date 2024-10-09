/*
 * @Author: dyb-dev
 * @Date: 2024-10-09 22:15:17
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-09 22:15:19
 * @FilePath: /uniapp-mp-wx-template/src/utils/env/index.ts
 * @Description: 环境相关工具函数
 */

/**
 * FUN: 是否为开发环境
 *
 * @author dyb-dev
 * @date 09/10/2024/  17:34:47
 * @returns {*}  {boolean} 是否为开发环境
 */
const isDevEnv = (): boolean => __PROJECT_INFO__.env.VITE_USER_NODE_ENV === "development"

export { isDevEnv }
