/*
 * @Author: dyb-dev
 * @Date: 2025-02-21 21:02:41
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 21:02:46
 * @FilePath: /uniapp-mp-wx-template/src/types/userInfo.ts
 * @Description: 用户信息类型模块
 */

/** 性别类型枚举 */
enum EGenderType {
    /** 男 */
    Man = 1,
    /** 女 */
    Woman = 2
}

/** 证件类型枚举 */
enum ECertificatesType {
    /** 身份证 */
    IdCard = 1,
    /** 军人证 */
    MilitaryCard,
    /** 护照 */
    Passport,
    /** 出生证 */
    BirthCertificate,
    /** 港澳台通行证 */
    HkMoTwPass,
    /** 士兵证 */
    SoldierCard,
    /** 警官证 */
    PoliceCard,
    /** 港澳台居民居住证 */
    HkMoTwResidentPermit,
    /** 外国人永久居留身份证 */
    ForeignerPermanentResidentIdCard,
    /** 居民户口薄 */
    ResidentAccountBook
}

export { EGenderType, ECertificatesType }
