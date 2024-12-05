/** vite环境变量 */
interface ImportMetaEnv {
    // STATIC: 共用
    /** 组件目录 默认:components */
    readonly VITE_COMPONENT_DIR: string
    /** 页面目录 默认:pages */
    readonly VITE_PAGE_DIR: string
    /** `src`下 分包目录 默认:subPackages */
    readonly VITE_SUB_PACKAGE_DIR: string
    /** `VITE_SUB_PACKAGE_DIR`下 分包子目录集合 如果涉及多个子分包，用逗号分隔 默认:webview */
    readonly VITE_SUB_PACKAGE_CHILD_DIRS: string
    /** 启动页路径 默认:pages/launch */
    readonly VITE_LAUNCH_PATH: string
    /**
     * 是否使用启动页 默认:false
     * - 可以在小程序运行时控制首次显示的页面,使用时注意:
     * - 小程序首页变为`VITE_LAUNCH_PATH`,页面跳转逻辑将在`App.vue`中进行,可根据需求修改
     * - 小程序码路径示例: 目标页面为`a`页面,则路径应该为 `/pages/launch?targetPath=pages/a&test=1`,其中`test=1`会传递给`a`页面
     */
    readonly VITE_USE_LAUNCH_PAGE: string
    /** 登录页面的路径 默认:pages/login */
    readonly VITE_LOGIN_PATH: string
    /** 首页路径 默认:pages/home */
    readonly VITE_HOME_PATH: string
    /** 开发环境服务器网址（小程序开发版、体验版用到） 默认:http://xxx.com */
    readonly VITE_DEV_SERVER_URL: string
    /** 生产环境服务器网址（小程序体验版、线上版用到） 默认:http://xxx.com */
    readonly VITE_PROD_SERVER_URL: string
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
