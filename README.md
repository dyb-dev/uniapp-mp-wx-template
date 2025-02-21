# UniApp-MP-WX-Template

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://zh.wikipedia.org/wiki/MIT%E8%A8%B1%E5%8F%AF%E8%AD%89)

## 项目简介

UniApp-MP-WX-Template 提供了一个用于开发微信小程序的基本模板，该项目基于 [Uniapp](https://uniapp.dcloud.net.cn/) + [Vue3](https://cn.vuejs.org/) + [TS](https://www.typescriptlang.org/) 构建，该模板预配置了一些常用的开发工具和插件，帮助你快速开发微信小程序，为您带来极致的体验。

## 功能特点

- **UniApp 工具链**: 支持自动生成 `pages.json` 和 `manifest.json` 配置文件，自动化处理页面和项目配置文件。
- **TypeScript**: 项目使用 TypeScript 进行开发，集成 `vue-tsc` 插件自动进行 Vue 组件的类型检查，同时支持项目的模块化管理
- **Vue 3 组件库**: 集成了 `nutui-uniapp` 组件库，支持 Vue 3 组件的按需自动导入，支持 TypeScript 类型提示。
- **自定义布局组件**: 内置多个自定义布局组件（如顶部导航栏、底部导航栏），兼容 `pages.json` 配置。
- **网络请求**: 提供 Promise 方式调用 UniApp API，处理网络请求和异步操作更加简洁高效。
- **页面导航**: 内置多种跳转方法封装，支持跳转小程序内部页面、H5 页面和第三方小程序，提供统一的导航接口。
- **登录拦截与路由守卫**: 集成登录拦截器和路由守卫功能，自动处理用户登录状态，确保未登录用户访问受限页面时跳转到登录页面，兼容 `pages.json` 配置。
- **公用 WebView 页面**: 内置的公用 WebView 页面，用于展示 H5 页面或进行 H5 分享功能，兼容 `pages.json` 配置。
- **业务开发**: 内置获取用户手机号、微信头像和昵称的组件，简化了微信授权和用户信息收集的流程。
- **代码风格管理**: 预配置了 ESLint、Stylelint 及 Prettier 工具，集成自定义的 ESLint、Stylelint 规则集，帮助开发者统一代码风格。

## 安装与使用

你可以使用 npm、pnpm 或 yarn 等包管理器来安装项目依赖。推荐使用 pnpm 作为首选包管理器。在下面的示例中，我们默认使用 pnpm 进行演示：

### 环境要求

- Node.js 版本 >= 18.0.0
- 如果包管理器为 pnpm，版本需 >= 8.15.5

### 环境变量配置

该模板项目支持通过 `.env` 文件进行环境变量配置，你可以根据实际需要修改 `.env` 中的以下配置项：

- `VITE_MP_WX_APPID`: 小程序的 AppID，用于微信小程序的配置和相关 API 调用。
- `VITE_PAGE_DIR`: 页面目录，默认值为 `pages`，用于指定项目中主包页面所在的文件夹。
- `VITE_SUB_PACKAGE_DIR`: 分包目录，默认值为 `subPackages`，用于指定 `src` 目录下的分包目录名称。
- `VITE_SUB_PACKAGE_CHILD_DIRS`: 分包子目录集合，默认值为 `webview`，如果项目中存在多个子分包，可以用逗号分隔（例如：`webview,profile,shop`），用于配置分包子目录名称集合。
- `VITE_LAUNCH_PATH`: 启动页路径，默认值为 `pages/launch`，用于指定小程序的启动页面路径。如果 `VITE_USE_LAUNCH_PAGE` 设为 `true`，小程序启动时将默认加载该页面。
- `VITE_USE_LAUNCH_PAGE`: 是否使用启动页，默认值为 `false`。如果设为 `true`，启动页将作为小程序首次展示的页面，并且跳转逻辑将在 `App.vue` 中进行。启动页中可根据逻辑判断用户状态，再决定跳转到登录页或首页。使用时注意：
    1. 设置 `VITE_USE_LAUNCH_PAGE=true` 后，小程序的首页将变为 `VITE_LAUNCH_PATH` 指定的路径。
    2. 小程序码路径的格式为：目标页面为 `a` 页面，则路径应为 `/pages/launch?targetPath=pages/a&param1=value1`，其中 `targetPath` 参数将指定跳转目标页面，而其他参数（如 `param1=value1`）会传递给目标页面作为查询参数使用。
- `VITE_LOGIN_PATH`: 登录页面的路径，默认值为 `pages/login`，用于指定登录页面的位置。当用户未登录时，自动跳转到该页面进行登录。
- `VITE_HOME_PATH`: 首页路径，默认值为 `pages/home`，用于指定应用程序的首页路径。用户登录成功后将跳转到该路径。
- `VITE_DEV_SERVER_URL`: 开发环境服务器网址（小程序开发版、体验版用到），默认值为 `http://xxxx.com`，用于指定后端 API 的根路径。
- `VITE_PROD_SERVER_URL`: 生产环境服务器网址（小程序体验版、线上版用到），默认值为 `http://xxxx.com`，用于指定后端 API 的根路径。
- `VITE_API_BASE_PATH`: 接口请求基础路径，默认值为 `/test.aspx`，用于配置接口的基础路径，与 `VITE_DEV_SERVER_URL` 或者 `VITE_PROD_SERVER_URL` 结合使用，形成完整的 API 请求路径。

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev
```

### 构建产物

```bash
pnpm build
```

## 许可证

本项目基于 `MIT 许可证` 开源。
