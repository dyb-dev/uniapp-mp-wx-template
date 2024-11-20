/*
 * @Author: dyb-dev
 * @Date: 2024-10-05 13:56:39
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-20 20:21:08
 * @FilePath: /uniapp-mp-wx-template/vite.config.ts
 * @Description: vite配置文件
 */

import { resolve } from "node:path"

import Uni from "@dcloudio/vite-plugin-uni"
import UniHelperComponents from "@uni-helper/vite-plugin-uni-components"
import UniHelperManifest from "@uni-helper/vite-plugin-uni-manifest"
import UniHelperPages from "@uni-helper/vite-plugin-uni-pages"
import { NutResolver } from "nutui-uniapp"
import { defineConfig, loadEnv } from "vite"

import { generateProjectInfo } from "./vite/utils"

/** STATIC: 项目根目录 */
const projectRootDir = process.cwd()

/** STATIC: 获取.env文件的环境变量 */
export const VITE_ENV = loadEnv(process.env.NODE_ENV as string, projectRootDir) as ImportMetaEnv

/** STATIC: 项目信息 */
const __PROJECT_INFO__ = generateProjectInfo(VITE_ENV)

const {
    VITE_PAGE_DIR,
    VITE_LAUNCH_PATH,
    VITE_USE_LAUNCH_PAGE,
    VITE_HOME_PATH,
    VITE_SUB_PACKAGE_DIR,
    VITE_SUB_PACKAGE_CHILD_DIRS
} = VITE_ENV

/** STATIC: 分包子目录路径列表 */
const subPackageChildDirPathList = VITE_SUB_PACKAGE_CHILD_DIRS.split(",").map(item => `src/${VITE_SUB_PACKAGE_DIR}/${item}`)

export default defineConfig(async() => {

    return {
        plugins: [
            // 使用 `pages.config.ts` 文件来编写生成 `pages.json` 文件，注意: 生成的 `pages.json` 文件不要更改
            UniHelperPages({
                // .d.ts文件输出路径 默认: 根目录
                dts: `src/types/dts/${VITE_PAGE_DIR}.d.ts`,
                // 扫描的页面目录 默认: src/pages
                dir: `src/${VITE_PAGE_DIR}`,
                // 首页路径 默认: pages/index
                homePage: VITE_USE_LAUNCH_PAGE === "true" ? VITE_LAUNCH_PATH : VITE_HOME_PATH,
                // subPackages 扫描的目录 默认: src/pages-sub
                subPackages: subPackageChildDirPathList
            }),

            // 使用 `manifest.config.ts` 来编写生成 `manifest.json` 文件，注意: 生成的 `manifest.json` 文件不要更改
            UniHelperManifest(),

            // 组件自动导入插件
            UniHelperComponents({
                // 组件 扫描的目录 默认: src/components
                dirs: ["src/components", ...subPackageChildDirPathList.map(item => `${item}/components`)],
                // .d.ts文件输出路径
                dts: resolve(projectRootDir, "./src/types/dts/components.d.ts"),
                // 自定义自动导入逻辑
                resolvers: [NutResolver()]
            }),

            // 核心插件，能够在 `uni-app` 中使用 `vite` 来构建项目
            // 注意: 部分插件需要在 `Uni()` 的前面，这是因为其他插件代码最终会被 `Uni()` 做处理
            Uni()
        ],

        build: {
            // js兼容目标 默认：modules
            target: "es6",
            // css兼容目标 默认：与 build.target 一致
            cssTarget: ["chrome61"]
        },

        resolve: {
            // 设置路径别名
            alias: {
                "@": resolve(projectRootDir, "./src")
            },
            // 导入时想要省略的扩展名集合
            extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".mjs", ".mts", ".cjs", ".cts"]
        },

        // 定义变量，编译时会将使用的地方替换为硬编码的形式
        define: {
            __PROJECT_INFO__: JSON.stringify(__PROJECT_INFO__)
        },

        css: {
            preprocessorOptions: {
                // scss全局文件
                scss: {
                    additionalData: `
                    	@use "${projectRootDir}/src/styles/variable/uni.scss" as *;
                    	@use "${projectRootDir}/src/styles/variable/custom.scss" as *;
                    	@use "${projectRootDir}/src/styles/mixins/index.scss" as *;
                    	@use "${projectRootDir}/src/styles/funs/index.scss" as *;
                    	@import "nutui-uniapp/styles/variables.scss";
                    `
                }
            }
        },

        json: {
            // 是否支持从 .json 文件中进行按名导入，示例：import { name } from './package.json';
            namedExports: false,
            // 开启则会禁用按名导入,导入的 JSON 会被转换为 export default JSON.parse("...") 会比转译成对象字面量性能更好，
            stringify: true
        }
    }

})
