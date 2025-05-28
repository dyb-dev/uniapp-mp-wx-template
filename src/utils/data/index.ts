/*
 * @Author: dyb-dev
 * @Date: 2024-11-05 00:55:26
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-05-28 23:48:40
 * @FilePath: /uniapp-mp-wx-template/src/utils/data/index.ts
 * @Description: 数据处理相关工具函数
 */

/**
 * FUN: 深度克隆
 * - 支持对象、数组、Map、Set、Date、RegExp 等类型的深度克隆
 *
 * 注意：
 * - 为了能够在克隆目标对象内部处理含有相同引用的对象，因此不支持处理循环引用问题，书写代码时需注意
 *
 * @author dyb-dev
 * @date 28/05/2025/  23:10:22
 * @template T
 * @param {T} obj 要克隆的对象
 * @returns {*}  {T} 克隆后的对象
 */
export const deepClone = <T = unknown>(obj: T): T => {

    // 如果 obj 是 null 或者不是对象（即基本类型），直接返回该值，因为这些值不需要深度克隆
    if (obj === null || typeof obj !== "object") {

        return obj

    }

    let _clone

    // 如果 obj 是 Date 类型，创建一个新的 Date 实例并赋值给 clone
    if (obj instanceof Date) {

        _clone = new Date(obj.getTime())

    }
    else if (obj instanceof RegExp) {

        _clone = new RegExp(obj)

    }
    else if (obj instanceof Map) {

        _clone = new Map(Array.from(obj, ([key, value]) => [key, deepClone(value)]))

    }
    else if (obj instanceof Set) {

        _clone = new Set(Array.from(obj, value => deepClone(value)))

    }
    else if (Array.isArray(obj)) {

        _clone = obj.map(value => deepClone(value))

    }
    else if (Object.prototype.toString.call(obj) === "[object Object]") {

        // 创建一个新的对象，保持原始对象的原型链
        _clone = Object.create(Object.getPrototypeOf(obj))
        // 使用 Object.entries 遍历对象的每一个键值对，并递归地克隆每个属性
        for (const [key, value] of Object.entries(obj)) {

            _clone[key] = deepClone(value)

        }

    }
    else {

        _clone = Object.assign({}, obj)

    }

    return _clone

}

/**
 * FUN: 检查是否是一个字面量对象 {}
 *
 * @author dyb-dev
 * @date 28/05/2025/  23:12:40
 * @param {*} obj 目标对象
 * @returns {*}  {boolean} 结果
 */
export const isObject = (obj: unknown): boolean => Object.prototype.toString.call(obj) === "[object Object]"

/** 字段名类型 */
type TFieldName = string | number | symbol

/** 字段映射类型 */
type TFieldMapping<T> = {
    [newField in TFieldName]: keyof T | ((key: keyof T) => boolean)
}

/**
 * FUN: 替换字段名
 * - 支持对象、数组，并返回新的引用
 *
 * @author dyb-dev
 * @date 28/05/2025/  23:17:39
 * @template T
 * @param {(T | T[])} data 目标对象、数组
 * @param {TFieldMapping<T>} fieldMapping 字段名映射关系对象 新字段名: 被替换字段名
 * @returns {*}  {(T | T[])} 结果
 */
export const replaceFieldNames = <T>(data: T | T[], fieldMapping: TFieldMapping<T>): T | T[] => {

    // 深度克隆传入的数据，避免修改原数据
    const _clonedData = deepClone(data)
    // 字段映射key数组
    const _fieldMappingKeys = Object.keys(fieldMapping)

    // 递归替换字段名的函数
    const _replaceFieldNames = (targetData: any): any => {

        // 如果是数组，则递归处理每个元素
        if (Array.isArray(targetData)) {

            return targetData.map(_item => _replaceFieldNames(_item))

        }

        // 如果是对象，则递归处理每个属性
        if (isObject(targetData)) {

            Object.keys(targetData).forEach(key => {

                const _key = key as keyof T
                const _fieldMappingKey = _fieldMappingKeys.find(_field => {

                    const _mappingValue = fieldMapping[_field]
                    return typeof _mappingValue === "function" ? _mappingValue(_key) : _mappingValue === _key

                })

                // 新的字段名
                const _newKey = _fieldMappingKey || key

                // 如果新字段名和原字段名不同，进行替换
                if (_newKey !== key) {

                    // 新字段赋值
                    targetData[_newKey] = targetData[key]
                    // 删除旧字段
                    delete targetData[key]

                }
                // 递归处理字段值
                targetData[_newKey] = _replaceFieldNames(targetData[_newKey])

            })

        }

        return targetData

    }

    return _replaceFieldNames(_clonedData)

}

/**
 * FUN: 根据分隔符分割字符串
 *
 * @author dyb-dev
 * @date 28/05/2025/  23:24:19
 * @param {string} str 需要分割的字符串
 * @param {string} delimiter 分隔符
 * @returns {*}  {string[]} 结果数组
 */
export const splitStringByDelimiter = (str: string, delimiter: string): string[] => {

    return delimiter ? str.split(new RegExp(`(?<=${delimiter})|(?=${delimiter})`, "g")) : [str]

}
