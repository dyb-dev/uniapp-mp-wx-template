<!--
 * @FileDesc: 程序全局组件
 -->

<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"

import { useUserInfoStore } from "@/stores"

/** HOOKS: 用户信息商店 */
const { login } = useUserInfoStore()

/** LIFECYCLE: 小程序首次进入 */
onLaunch(options => {

    console.log("项目信息:", __PROJECT_INFO__)
    console.log("小程序首次进入:", options)

    const { VITE_USE_LAUNCH_PAGE } = import.meta.env

    // 如果使用启动页，则登录在启动页中的 `onLoad` 进行，因此这里不再登录，避免重复登录
    if (VITE_USE_LAUNCH_PAGE === "true") {

        return

    }

    login()

})

/** LIFECYCLE: 小程序切入前台 */
onShow(options => {

    console.log("小程序切入前台:", options)

})

/** LIFECYCLE: 小程序切入后台 */
onHide(() => {

    console.log("小程序切入后台")

})
</script>

<style lang="scss">
@import "nutui-uniapp/styles/index";
@import "./styles/index";
</style>
