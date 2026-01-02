/*
 * @FileDesc: 用户信息相关工具函数
 */

import { CERTIFICATE_CONFIG_LIST, GENDER_CONFIG_LIST } from "@/constants"
import { isIdentityCard } from "@/utils"

import type { ECertificatesType } from "@/types"
import { EGenderType } from "@/types"

/**
 * FUN: 获取性别描述
 *
 * @author dyb-dev
 * @date 15/10/2024/  15:17:06
 * @param {EGenderType} genderType - 性别类型
 * @returns {*}  {string} - 性别字符串 如果未知性别，返回空字符串
 */
export const getGenderDesc = (genderType: EGenderType): string =>
    GENDER_CONFIG_LIST.find(item => item.type === genderType)?.desc || ""

/**
 * FUN: 获取证件描述
 *
 * @author dyb-dev
 * @date 16/10/2024/  22:44:22
 * @param {ECertificatesType} certificateType - 证件类型
 * @returns {*}  {string} - 证件描述字符串，如果未知证件，返回空字符串
 */
export const getCertificateDesc = (certificateType: ECertificatesType): string =>
    CERTIFICATE_CONFIG_LIST.find(item => item.type === certificateType)?.desc || ""

/**
 * FUN: 通过身份证号码获取性别
 *
 * @author dyb-dev
 * @date 15/10/2024/  21:37:45
 * @param {string} identityCardNumber - 身份证号码
 * @returns {*}  {string} - 返回性别字符串，如果身份证无效，返回空字符串
 */
export const getGenderFromIdentityCard = (identityCardNumber: string): string => {

    // 检查身份证号码是否合法
    if (!isIdentityCard(identityCardNumber)) {

        console.error("getGenderFromIdentityCard() 身份证号码无效 identityCardNumber:", identityCardNumber)
        return ""

    }

    // 提取性别信息，身份证号码的倒数第二位表示性别，奇数为男，偶数为女
    const _genderCode = identityCardNumber.charAt(16)

    const _gender = parseInt(_genderCode, 10) % 2 === 1 ? EGenderType.Man : EGenderType.Woman

    return getGenderDesc(_gender)

}

/**
 * FUN: 通过身份证号码获取生日
 *
 * @author dyb-dev
 * @date 15/10/2024/  21:38:14
 * @param {string} identityCardNumber - 身份证号码
 * @returns {*}  {string} - 返回生日字符串，格式为 YYYY/MM/DD，如果身份证无效，返回空字符串
 */
export const getBirthdayFromIdentityCard = (identityCardNumber: string): string => {

    // 检查身份证号码是否合法
    if (!isIdentityCard(identityCardNumber)) {

        console.error("getBirthdayFromIdentityCard() 身份证号码无效 identityCardNumber:", identityCardNumber)
        return ""

    }

    // 提取生日信息，身份证号码的第7位到第14位是生日
    const _birthYear = identityCardNumber.substring(6, 10)
    const _birthMonth = identityCardNumber.substring(10, 12)
    const _birthDay = identityCardNumber.substring(12, 14)

    return `${_birthYear}/${_birthMonth}/${_birthDay}`

}
