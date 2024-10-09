<!--
 * @Author: dyb-dev
 * @Date: 2024-10-05 20:10:11
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-09 20:04:46
 * @FilePath: /uniapp-mp-wx-template/src/App.vue
 * @Description: 程序全局组件
-->

<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"

/** LIFECYCLE: 小程序首次进入 */
onLaunch(options => {

    console.log("项目信息:", __PROJECT_INFO__)
    console.log("小程序首次进入:", options)

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
