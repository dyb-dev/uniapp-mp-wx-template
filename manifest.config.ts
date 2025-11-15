/*
 * @FileDesc: 应用配置
 */

import { defineManifestConfig } from "@uni-helper/vite-plugin-uni-manifest"

import pkg from "./package.json"
import { VITE_ENV } from "./vite.config"

/** CONST: 获取.env文件的环境变量 */
const { VITE_MP_WX_APPID } = VITE_ENV

export default defineManifestConfig({
    // 应用标题
    name: pkg.name,
    // 应用的唯一标识符
    appid: "",
    // 应用的描述
    description: pkg.description,
    // 应用版本名称
    versionName: pkg.version,
    // 应用版本号，主要用于应用的内部版本控制
    versionCode: "100",
    // 是否自动转换 px 单位 默认: true
    transformPx: false,
    // uni 统计配置项
    uniStatistics: {
        // 是否启用统计 默认: true
        enable: false
    },

    /* 小程序特有相关 */
    "mp-weixin": {
        // 微信小程序的应用 ID
        appid: VITE_MP_WX_APPID,
        // 是否使用自定义组件
        usingComponents: true,
        // 是否开启小程序按需注入特性
        lazyCodeLoading: "requiredComponents",
        // 合并组件虚拟节点外层属性（目前仅支持 style、class 属性）
        mergeVirtualHostAttributes: true,
        // 微信小程序的优化配置
        optimization: {
            // 是否开启分包优化
            subPackages: true
        },
        // 微信小程序的相关设置
        setting: {
            // 是否启用 URL 校验
            urlCheck: false,
            // 是否ES6 转 ES5
            es6: true,
            // 上传代码时样式是否自动补全
            postcss: true,
            // 上传代码时是否自动压缩
            minified: true,
            // 预览及真机调试时包体积上限是否调整为4M，默认: true
            bigPackageSizeSupport: true
        }
    }
})
