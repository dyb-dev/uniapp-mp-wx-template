/*
 * @FileDesc: 身份证相关工具函数
 */

/**
 * FUN: 是否为有效的省、直辖市代码
 *
 * @author dyb-dev
 * @date 15/10/2024/  16:34:48
 * @param {string} identityCardNumber - 身份证号码
 * @returns {*}  {boolean} 是否为有效的省、直辖市代码
 */
const _isProvinceCode = (identityCardNumber: string): boolean => {

    /** CONST: 省、直辖市代码表映射 */
    const provinceCodeMap: Record<number, string> = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    }

    const _addressCode = identityCardNumber.substring(0, 6)
    const _check = /^[1-9]\d{5}$/.test(_addressCode)
    if (!_check) {

        return false

    }

    return !!provinceCodeMap[parseInt(_addressCode.substring(0, 2))]

}

/**
 * FUN: 是否为有效的生日
 *
 * @author dyb-dev
 * @date 15/10/2024/  16:41:44
 * @param {string} identityCardNumber - 身份证号码
 * @returns {*}  {boolean} 是否为有效的生日
 */
const _isBirthday = (identityCardNumber: string): boolean => {

    // 生日代码
    const _birDay = identityCardNumber.substring(6, 14)
    const _check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(_birDay)
    if (!_check) {

        return false

    }
    const _year = parseInt(_birDay.substring(0, 4))
    const _month = parseInt(_birDay.substring(4, 6))
    const _day = parseInt(_birDay.substring(6))
    const _date = new Date(_year, _month - 1, _day)

    // 生日大于当前日期时
    if (_date > new Date()) {

        return false

    }
    return _date.getFullYear() === _year && _date.getMonth() === _month - 1 && _date.getDate() === _day

}

/**
 * FUN: 是否为有效的校验位
 *
 * @author dyb-dev
 * @date 15/10/2024/  16:57:06
 * @param {string} identityCardNumber - 身份证号码
 * @returns {*}  {boolean} 是否为有效的校验位
 */
const _isParityBit = (identityCardNumber: string): boolean => {

    /** CONST: 每位加权因子 */
    const powers = ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"]
    /** CONST: 第18位校检码 */
    const parityBit = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]

    // 18位身份证需要验证最后一位校验位
    const _parityBit = identityCardNumber.charAt(17).toUpperCase()

    // 加权因子
    let _power = 0
    for (let i = 0; i < 17; i++) {

        _power += parseInt(identityCardNumber.charAt(i)) * parseInt(powers[i])

    }

    return _parityBit === parityBit[_power % 11]

}

/**
 * FUN: 是否为有效的身份证号码
 *
 * @author dyb-dev
 * @date 15/10/2024/  16:59:56
 * @param {string} identityCardNumber - 身份证号码
 * @returns {*}  {boolean} 是否为有效的身份证号码
 */
export const isIdentityCard = (identityCardNumber: string): boolean => {

    const _check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(
        identityCardNumber
    )
    return _check && _isProvinceCode(identityCardNumber) && _isBirthday(identityCardNumber) && _isParityBit(identityCardNumber)

}
