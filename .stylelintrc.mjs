/*
 * @Author: dyb-dev
 * @Date: 2024-03-20 16:17:30
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-10 20:13:41
 * @FilePath: /uniapp-mp-wx-template/.stylelintrc.mjs
 * @Description: stylelint配置文件 注意：每次配置文件的更改，建议重启一下vscode，否则可能不会生效
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
