/** vite环境变量 */
interface ImportMetaEnv {
    // STATIC: 共用
    /** 页面目录 默认:pages */
    readonly VITE_PAGE_DIR: string
    /** `src`下 分包目录 默认:subPackages */
    readonly VITE_SUB_PACKAGE_DIR: string
    /** `VITE_SUB_PACKAGE_DIR`下 分包子目录集合 如果涉及多个子分包，用逗号分隔 默认:webview */
    readonly VITE_SUB_PACKAGE_CHILD_DIRS: string
    /** 登录页面的路径 默认:pages/login */
    readonly VITE_LOGIN_PATH: string
    /** 首页路径 默认:pages/home */
    readonly VITE_HOME_PATH: string
    /** 服务器网址 默认:http://xxx.com */
    readonly VITE_SERVER_URL: string
    /** 接口请求路径 默认:/test.aspx */
    readonly VITE_API_BASE_URL: string
    /**
     * 用户 node 环境
     * - development: 开发环境
     * - production: 生产环境
     */
    readonly VITE_USER_NODE_ENV: "development" | "production"

    // STATIC: wx小程序相关
    /** wx小程序appid */
    readonly VITE_MP_WX_APPID: string
}

/** 扩展 ImportMeta 接口 */
interface ImportMeta {
    readonly env: ImportMetaEnv
}
