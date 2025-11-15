/*
 * @FileDesc: unocss 配置
 */

import { presetUni } from "@uni-helper/unocss-preset-uni"
import { defineConfig } from "unocss"

export default defineConfig({
    // 内容
    content: {
        // 管道
        pipeline: {
            // 包含文件
            include: [
                // 默认支持文件
                /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
                // 支持 js/ts 文件
                /\.([jt]s)($|\?)/
            ]
        }
    },
    // 预设
    presets: [
        presetUni({
            // 是否启用属性化语法
            attributify: false
        })
    ],
    // 快捷方式
    shortcuts: {
        "flex-center": "flex justify-center items-center",
        "flex-x-center": "flex justify-center",
        "flex-y-center": "flex items-center"
    }
})
