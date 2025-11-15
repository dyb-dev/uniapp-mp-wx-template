/*
 * @Author: dyb-dev
 * @Date: 2024-03-20 16:17:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-11-15 13:16:39
 * @FilePath: /uniapp-mp-wx-template/.stylelintrc.mjs
 * @Description: stylelint 配置 注意：每次配置的更改，建议重启一下编辑器，否则可能不会生效
 */

export default {
    extends: ["@dyb-dev/stylelint-config"],
    rules: {
        // 忽略 `rpx` 单位的报错
        "unit-no-unknown": [true, { ignoreUnits: ["rpx"] }],
        // 忽略 `rpx` 单位的报错
        "declaration-property-value-no-unknown": null
    }
}
