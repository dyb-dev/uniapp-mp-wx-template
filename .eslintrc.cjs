/*
 * @FileDesc: eslint 配置 注意：每次配置的更改，建议重启一下编辑器，否则可能不会生效
 */

module.exports = {
    extends: ["@dyb-dev/eslint-config/vue"],
    overrides: [
        // #region CODE: unocss 配置
        {
            files: ["**/*.vue", "**/*.jsx", "**/*.tsx"],
            extends: ["@unocss"]
        }
        // #endregion
    ]
}
