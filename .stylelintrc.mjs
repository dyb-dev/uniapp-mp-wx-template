/*
 * @Author: dyb-dev
 * @Date: 2024-03-20 16:17:30
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-05 20:01:38
 * @FilePath: /uniapp-mp-wx-template/.stylelintrc.mjs
 * @Description: stylelint配置文件 注意：每次配置文件的更改，建议重启一下vscode，否则可能不会生效
 */

export default {
    extends: ["@dyb-dev/stylelint-config"],
    rules: {
        // 忽略 `rpx` 单位的报错
        "unit-no-unknown": [true, { ignoreUnits: ["rpx"] }]
    }
}
