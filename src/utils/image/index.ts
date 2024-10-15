/*
 * @Author: dyb-dev
 * @Date: 2024-10-06 15:04:04
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-15 23:06:22
 * @FilePath: /uniapp-mp-wx-template/src/utils/image/index.ts
 * @Description: 图片相关工具函数
 */

/** STATIC: 常见的图片扩展名 */
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"]

/**
 * FUN: 是否为有效的图片路径
 * - 支持网络在线地址、绝对路径、相对路径或根目录文件，并忽略查询参数
 *
 * @author dyb-dev
 * @date 23/09/2024/  11:31:25
 * @param {string} str 图片路径
 * @returns {*} {boolean} 是否为图片路径
 */
const isImagePath = (str: string): boolean => {

    // 动态生成正则表达式来匹配图片扩展名
    const _pattern = new RegExp(`^(https?:\\/\\/|\\/|[^\\s]*\\/)?[^\\s]+\\.(${IMAGE_EXTENSIONS.join("|")})(\\?.*)?$`, "i")

    // 首先验证是否符合路径规则
    if (!_pattern.test(str)) {

        return false

    }

    // 提取文件扩展名并验证是否为图片扩展名
    const _extension = str.split(".").pop()?.split("?")[0].toLowerCase() || ""

    // 检查提取到的扩展名是否在 IMAGE_EXTENSIONS 中
    return IMAGE_EXTENSIONS.includes(_extension)

}

export { isImagePath }
