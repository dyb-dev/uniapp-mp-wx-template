/*
 * @FileDesc: 位置相关工具函数
 */

/** 位置 */
export interface ILocation {
    /** 纬度 */
    latitude: number
    /** 经度 */
    longitude: number
}

/**
 * FUN: 计算两个位置之间的距离
 *
 * @author dyb-dev
 * @date 15/10/2024/  14:59:41
 * @param {ILocation} startLocation 起始位置
 * @param {ILocation} endLocation 结束位置
 * @returns {*}  {number} 两个坐标之间的距离 (单位: 米)
 */
export const calculateDistanceBetweenLocations = (startLocation: ILocation, endLocation: ILocation): number => {

    // 解构起始位置的纬度和经度
    const { latitude: startLatitude, longitude: startLongitude } = startLocation
    // 解构结束位置的纬度和经度
    const { latitude: endLatitude, longitude: endLongitude } = endLocation

    /** 地球半径, 单位: 米 */
    const _earthRadius = 6378136.49

    // 角度转换为弧度的函数
    const _rad = (d: number) => d * Math.PI / 180.0

    // 将起始和结束的纬度转换为弧度
    const _startRadLat = _rad(startLatitude)
    const _endRadLat = _rad(endLatitude)

    // 计算纬度之差的弧度
    const _latitudeDifference = _startRadLat - _endRadLat
    // 计算经度之差的弧度
    const _longitudeDifference = _rad(startLongitude) - _rad(endLongitude)

    // 计算 sin(纬度差/2) 的平方
    const _sinLatDiffSquared = Math.pow(Math.sin(_latitudeDifference / 2), 2)

    // 计算 cos(起始纬度) * cos(结束纬度)
    const _cosLatProduct = Math.cos(_startRadLat) * Math.cos(_endRadLat)

    // 计算 sin(经度差/2) 的平方
    const _sinLongDiffSquared = Math.pow(Math.sin(_longitudeDifference / 2), 2)

    // 计算 Haversine 公式的核心值，即 (sin(纬度差/2))^2 + cos(起始纬度) * cos(结束纬度) * (sin(经度差/2))^2
    const _haversineCore = _sinLatDiffSquared + _cosLatProduct * _sinLongDiffSquared

    // 计算两个点之间的弧度距离
    const _angularDistance = 2 * Math.asin(Math.sqrt(_haversineCore))

    // 将弧度距离转换为米
    let _distance = _angularDistance * _earthRadius

    // 对结果进行四舍五入到最接近的整数
    _distance = Math.round(_distance * 10000) / 10000

    // 返回以米为单位的距离，结果为整数
    return parseFloat(_distance.toFixed(0))

}
