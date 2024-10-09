/*
 * @Author: dyb-dev
 * @Date: 2024-10-06 15:04:04
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-06 15:05:27
 * @FilePath: /uniapp-mp-wx-template/src/utils/image/index.ts
 * @Description: 图片相关工具函数
 */

/**
 * FUN: 验证是否为图片路径
 *
 * @author dyb-dev
 * @date 23/09/2024/  11:31:25
 * @param {string} str 图片路径
 * @returns {*} {boolean} 是否为图片路径
 */
const validateImagePath = (str: string): boolean => {

    // 定义常见的图片扩展名
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"]

    // 创建正则表达式来匹配网络在线地址、绝对路径、相对路径或根目录文件，并忽略查询参数
    const pattern = /^(https?:\/\/|\/|[^\s]*\/)?[^\s]+\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i

    // 首先验证是否符合路径规则
    if (!pattern.test(str)) {

        return false

    }

    // 提取文件扩展名并验证是否为图片扩展名
    const extension = str.split(".").pop()?.split("?")[0].toLowerCase() || ""
    return imageExtensions.includes(extension)

}

export { validateImagePath }
