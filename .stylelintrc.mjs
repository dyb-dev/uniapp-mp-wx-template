/*
 * @FileDesc: stylelint 配置 注意：每次配置的更改，建议重启一下编辑器，否则可能不会生效
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
