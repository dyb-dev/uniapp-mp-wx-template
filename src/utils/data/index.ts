/*
 * @Author: dyb-dev
 * @Date: 2024-11-05 00:55:26
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-11-05 11:55:40
 * @FilePath: /uniapp-mp-wx-template/src/utils/data/index.ts
 * @Description: 数据处理相关工具函数
 */

/**
 * FUN: 深度克隆
 * - 支持对象、数组、Map、Set、Date、RegExp 等类型的深度克隆
 *
 * @author dyb-dev
 * @date 05/11/2024/  11:45:21
 * @param {T} obj 要克隆的对象
 * @param {*} [cache=new WeakMap()] 缓存对象
 * @returns {*}  {T} 克隆后的对象
 */
const deepClone = <T = any>(obj: T, cache = new WeakMap()): T => {

    // 如果 obj 是 null 或者不是对象（即基本类型），直接返回该值，因为这些值不需要深度克隆
    if (obj === null || typeof obj !== "object") {

        return obj

    }

    // 如果 cache 中已经存在 obj，则直接返回缓存中的克隆对象，防止循环引用导致的无限递归
    if (cache.has(obj)) {

        return cache.get(obj)

    }

    let clone

    // 如果 obj 是 Date 类型，创建一个新的 Date 实例并赋值给 clone
    if (obj instanceof Date) {

        clone = new Date(obj.getTime())

    }
    // 如果 obj 是 RegExp 类型，创建一个新的正则表达式实例并赋值给 clone
    else if (obj instanceof RegExp) {

        clone = new RegExp(obj)

    }
    // 如果 obj 是 Map 类型，则使用递归来克隆 Map 中的每一个键值对，并创建新的 Map 实例
    else if (obj instanceof Map) {

        // 使用 Array.from 遍历 obj 中的每一个键值对，并递归地克隆值
        clone = new Map(Array.from(obj, ([key, value]) => [key, deepClone(value, cache)]))

    }
    // 如果 obj 是 Set 类型，则使用递归来克隆 Set 中的每一个值，并创建新的 Set 实例
    else if (obj instanceof Set) {

        // 使用 Array.from 遍历 obj 中的每一个值，并递归地克隆
        clone = new Set(Array.from(obj, value => deepClone(value, cache)))

    }
    // 如果 obj 是数组，则使用 map 方法递归地克隆数组中的每一个元素
    else if (Array.isArray(obj)) {

        clone = obj.map(value => deepClone(value, cache))

    }
    // 如果 obj 是普通对象（即 [object Object]），则创建一个新的对象并递归地克隆其属性
    else if (Object.prototype.toString.call(obj) === "[object Object]") {

        // 创建一个新的对象，保持原始对象的原型链
        clone = Object.create(Object.getPrototypeOf(obj))
        // 将 obj 存入缓存，防止循环引用
        cache.set(obj, clone)
        // 使用 Object.entries 遍历对象的每一个键值对，并递归地克隆每个属性
        for (const [key, value] of Object.entries(obj)) {

            clone[key] = deepClone(value, cache)

        }

    }
    // 如果 obj 是其他类型（例如函数），直接创建一个浅拷贝
    else {

        clone = Object.assign({}, obj)

    }

    // 在缓存中记录克隆的对象，防止重复克隆
    cache.set(obj, clone)

    // 返回深度克隆后的对象
    return clone

}

export { deepClone }
