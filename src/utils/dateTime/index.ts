/*
 * @Author: dyb-dev
 * @Date: 2025-02-21 21:11:50
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 21:12:00
 * @FilePath: /uniapp-mp-wx-template/src/utils/dateTime/index.ts
 * @Description: 日期时间相关工具函数
 */

/**
 * FUN: 延迟函数
 *
 * @author dyb-dev
 * @date 19/02/2025/  15:55:58
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {*}  {Promise<void>} - 返回一个 Promise 对象
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export { delay }
