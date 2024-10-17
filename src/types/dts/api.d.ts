/*
 * @Author: dyb-dev
 * @Date: 2024-10-17 16:21:11
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 16:21:26
 * @FilePath: /uniapp-mp-wx-template/src/types/dts/api.d.ts
 * @Description: api 类型声明补充文件
 */

import "@uni-helper/uni-network"

declare module "@uni-helper/uni-network" {
    interface UnResponse {
        /** 请求是否成功 */
        success: boolean
        /** 结果描述信息 */
        message: string
    }
}
