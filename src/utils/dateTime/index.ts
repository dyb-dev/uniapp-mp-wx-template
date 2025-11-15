/*
 * @FileDesc: 日期时间相关工具函数
 */

/**
 * FUN: 延迟函数
 *
 * @author dyb-dev
 * @date 19/02/2025/  15:55:58
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {*}  {Promise<void>} - 返回一个 Promise 对象
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
