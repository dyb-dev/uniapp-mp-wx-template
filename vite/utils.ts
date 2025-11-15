/*
 * @FileDesc: vite配置工具函数
 */

import dayjs from "dayjs"

import pkg from "../package.json"

/**
 * FUN: 生成项目信息
 *
 * @author dyb-dev
 * @date 30/09/2024/  15:00:27
 * @param {ImportMetaEnv} env - 环境变量
 * @returns {*}  {IProjectInfo}
 */
export const generateProjectInfo = (env: ImportMetaEnv): IProjectInfo => {

    const { name, version, dependencies } = pkg
    const _dayObj = dayjs()
    const _projectVersion = _dayObj.format("YYYYMMDDHHmmss")
    const _lastBuildTime = _dayObj.format("YYYY-MM-DD HH:mm:ss")

    const _projectInfo: IProjectInfo = {
        version: _projectVersion,
        lastBuildTime: _lastBuildTime,
        env,
        pkg: { name, version, dependencies }
    }

    return _projectInfo

}
