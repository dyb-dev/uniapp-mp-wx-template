/*
 * @Author: dyb-dev
 * @Date: 2025-02-21 21:01:57
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 21:02:04
 * @FilePath: /uniapp-mp-wx-template/src/constants/userInfo.ts
 * @Description: 用户信息常量模块
 */

import { ECertificatesType, EGenderType } from "@/types"

/** CONST: 性别配置列表 */
const GENDER_CONFIG_LIST = [
    { type: EGenderType.Man, desc: "男" },
    { type: EGenderType.Woman, desc: "女" }
]

/** CONST: 证件配置列表 */
const CERTIFICATE_CONFIG_LIST = [
    { type: ECertificatesType.IdCard, desc: "身份证" },
    { type: ECertificatesType.MilitaryCard, desc: "军人证" },
    { type: ECertificatesType.Passport, desc: "护照" },
    { type: ECertificatesType.BirthCertificate, desc: "出生证" },
    { type: ECertificatesType.HkMoTwPass, desc: "港澳台通行证" },
    { type: ECertificatesType.SoldierCard, desc: "士兵证" },
    { type: ECertificatesType.PoliceCard, desc: "警官证" },
    { type: ECertificatesType.HkMoTwResidentPermit, desc: "港澳台居民居住证" },
    { type: ECertificatesType.ForeignerPermanentResidentIdCard, desc: "外国人永久居留身份证" },
    { type: ECertificatesType.ResidentAccountBook, desc: "居民户口薄" }
]

export { GENDER_CONFIG_LIST, CERTIFICATE_CONFIG_LIST }
