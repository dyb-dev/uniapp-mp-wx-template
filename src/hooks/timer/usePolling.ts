/*
 * @FileDesc: 使用轮询器
 */

/** 使用轮询器返回值 */
export interface IUsePollingReturn {
    /** 开始轮询 */
    start: () => void
    /** 停止轮询 */
    stop: () => void
}

/**
 * HOOKS: 使用轮询器
 *
 * @author dyb-dev
 * @date 28/05/2025/  23:01:57
 * @param {(() => boolean | void | Promise<boolean | void>)} callback 回调函数
 * @param {number} [interval=1000] 轮询间隔，默认为 1000ms
 * @returns {*}  {IUsePollingReturn} 返回值
 */
export const usePolling = (
    callback: () => boolean | void | Promise<boolean | void>,
    interval: number = 1000
): IUsePollingReturn => {

    /** 轮询器 */
    let _timer: TTimeoutId
    /** 是否轮询中 */
    let _polling: boolean = false

    /** 启动轮询 */
    const start = () => {

        // 如果已经在轮询中，不重复启动
        if (_polling) {

            return

        }

        _polling = true

        const _poll = async () => {

            try {

                // 执行回调函数，判断是否需要继续轮询
                const _isStop = await callback()

                if (!_isStop) {

                    // 如果不需要停止，继续轮询
                    _timer = setTimeout(() => {

                        _poll()

                    }, interval)
                    return

                }

                stop()

            }
            catch (error) {

                stop()
                console.error("usePolling()", error)

            }

        }

        _poll()

    }

    /** 停止轮询 */
    const stop = () => {

        clearTimeout(_timer)
        _polling = false

    }

    return { start, stop }

}
