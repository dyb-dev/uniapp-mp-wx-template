/*
 * @FileDesc: 使用流程
 */

import { cloneDeep } from "es-toolkit"
import { computed, ref } from "vue"

import type { ComputedRef, Ref } from "vue"

/** key */
export type TKey = string | number

/** 数据 */
export type TData = Record<string, any> | void

/** 步骤 */
export interface IStep<Key extends TKey = TKey, Data extends TData = TData> {
    /** key */
    key: Key
    /**
     * 传递的数据
     * - 用于在步骤之间传递数据
     */
    data?: Data
    /** 其他自定义属性 */
    [key: string]: any
}

/** 跳转到指定步骤 选项 */
export interface IGoToStepOptions<Key extends TKey = TKey, Data extends TData = TData> {
    /** key */
    key: Key
    /** 数据 */
    data?: Data
}

/** 上一步 选项 */
export interface IPrevStepOptions<Data extends TData = TData> {
    /**
     * 步数
     *
     * @default 1
     */
    step?: number
    /** 数据 */
    data?: Data
}

/** 下一步 选项 */
export interface INextStepOptions<Data extends TData = TData> {
    /**
     * 步数
     *
     * @default 1
     */
    step?: number
    /** 数据 */
    data?: Data
}

/** 新增步骤 选项 */
export interface IAddStepsOptions<Key extends TKey = TKey, Step extends IStep = IStep> {
    /** 需要新增的步骤列表 */
    steps: Step[]
    /**
     * 在指定 key 的步骤之后插入
     * - 如果不指定，则在最后一个位置新增
     */
    afterKey?: Key
}

/** 使用流程 选项 */
export interface IUseFlowOptions<Step extends IStep = IStep, SharedData extends TData = TData> {
    /**
     * 初始流程列表
     *
     * @default []
     */
    initialSteps?: Step[]
    /**
     * 初始步骤 key
     *
     * @default 第一个步骤的 key
     */
    initialStepKey?: Step["key"]
    /**
     * 初始共享数据
     * - 用于在步骤之间传递数据
     *
     * @default {}
     */
    initialSharedData?: SharedData
}

/** 使用流程 返回 */
export interface IUseFlowReturn<Step extends IStep = IStep, SharedData extends TData = TData> {
    /**
     * 流程列表
     *
     * @default []
     */
    steps: Ref<Step[]>
    /**
     * 当前步骤 key
     *
     * @default 第一个步骤的 key
     */
    currentStepKey: Ref<Step["key"] | undefined>
    /** 当前步骤索引 */
    currentStepIndex: ComputedRef<number>
    /** 当前步骤 */
    currentStep: ComputedRef<Step | undefined>
    /** 当前步骤数据 */
    currentStepData: ComputedRef<Step["data"] | undefined>
    /** 步骤总数 */
    totalSteps: ComputedRef<number>
    /** 是否为第一步 */
    isFirstStep: ComputedRef<boolean>
    /** 是否为最后一步 */
    isLastStep: ComputedRef<boolean>
    /**
     * 共享数据
     * - 用于在步骤之间传递数据
     *
     * @default {}
     */
    sharedData: Ref<SharedData>
    /**
     * 设置流程列表
     * - 会覆盖之前的流程列表
     * - 如果当前步骤 key 不在新的流程列表中，重置到第一个步骤
     */
    setSteps: (steps: Step[]) => void
    /**
     * 新增步骤
     * - 支持新增多个步骤
     * - 可以指定在某个 key 之后插入
     * - 默认在最后一个位置新增
     */
    addSteps: (options: IAddStepsOptions<Step["key"], Step>) => void
    /**
     * 删除步骤
     * - 支持删除多个步骤
     */
    removeSteps: (keys: Step["key"][]) => void
    /**
     * 重置流程列表
     * - 重置到初始流程列表，如果未指定初始流程列表，则不做任何操作
     */
    resetSteps: () => void
    /**
     * 上一步
     * - 默认步数为 1
     * - 如果步数小于 0，则直接跳转到第一步
     */
    prevStep: (options?: IPrevStepOptions<Step["data"]>) => void
    /**
     * 下一步
     * - 默认步数为 1
     * - 如果步数超过总步骤数，则直接跳转到最后一步
     */
    nextStep: (options?: INextStepOptions<Step["data"]>) => void
    /** 跳转到指定步骤 */
    goToStep: (options: IGoToStepOptions<Step["key"], Step["data"]>) => void
    /**
     * 重置步骤
     * - 重置到初始步骤，如果未指定初始步骤，则重置到第一个步骤
     */
    resetStep: () => void
    /**
     * 设置共享数据
     * - 会覆盖之前的共享数据
     */
    setSharedData: (data: SharedData) => void
    /**
     * 更新共享数据
     * - 会合并之前的共享数据
     */
    updateSharedData: (data: Partial<SharedData>) => void
    /**
     * 重置共享数据
     * - 重置到初始共享数据
     */
    resetSharedData: () => void
    /**
     * 重置所有
     * - 重置流程列表
     * - 重置步骤
     * - 重置共享数据
     */
    resetAll: () => void
}

/**
 * HOOKS: 使用流程
 *
 * @author dyb-dev
 * @date 2025-11-08 12:20:39
 * @template Step 步骤数据类型
 * @template SharedData 共享数据类型
 * @param {IUseFlowOptions<Step, SharedData>} [options] 选项
 * @returns {*}  {IUseFlowReturn<Step, SharedData>} 返回值
 */
export const useFlow = <Step extends IStep = IStep, SharedData extends TData = TData>(
    options?: IUseFlowOptions<Step, SharedData>
): IUseFlowReturn<Step, SharedData> => {

    const { initialSteps, initialStepKey, initialSharedData = {} } = options ?? {}

    /** REF: 流程列表 */
    const steps: IUseFlowReturn<Step, SharedData>["steps"] = ref(cloneDeep(initialSteps ?? [])) as Ref<Step[]>

    /** REF: 当前步骤 key */
    const currentStepKey: IUseFlowReturn<Step, SharedData>["currentStepKey"] = ref(initialStepKey ?? steps.value[0]?.key)

    /** COMPUTED: 当前步骤索引 */
    const currentStepIndex: IUseFlowReturn<Step, SharedData>["currentStepIndex"] = computed(() =>
        steps.value.findIndex(step => step.key === currentStepKey.value)
    )

    /** COMPUTED: 当前步骤 */
    const currentStep: IUseFlowReturn<Step, SharedData>["currentStep"] = computed(() => steps.value[currentStepIndex.value])

    /** COMPUTED: 当前步骤数据 */
    const currentStepData: IUseFlowReturn<Step, SharedData>["currentStepData"] = computed(() => currentStep.value?.data)

    /** COMPUTED: 步骤总数 */
    const totalSteps: IUseFlowReturn<Step, SharedData>["totalSteps"] = computed(() => steps.value.length)

    /** COMPUTED: 是否第一步 */
    const isFirstStep: IUseFlowReturn<Step, SharedData>["isFirstStep"] = computed(
        () => totalSteps.value > 0 && currentStepIndex.value === 0
    )

    /** COMPUTED: 是否最后一步 */
    const isLastStep: IUseFlowReturn<Step, SharedData>["isLastStep"] = computed(
        () => totalSteps.value > 0 && currentStepIndex.value === totalSteps.value - 1
    )

    /**
     * FUN: 设置流程列表
     *
     * @param newSteps 新的流程列表
     */
    const setSteps: IUseFlowReturn<Step, SharedData>["setSteps"] = newSteps => {

        const cloneNewSteps = cloneDeep(newSteps)
        steps.value = cloneNewSteps
        const exists = cloneNewSteps.some(step => step.key === currentStepKey.value)
        // 如果当前步骤 key 不在新的流程列表中，重置到第一个步骤
        if (!exists) {

            currentStepKey.value = cloneNewSteps[0]?.key

        }

    }

    /** FUN: 重置流程列表 */
    const resetSteps: IUseFlowReturn<Step, SharedData>["resetSteps"] = () => {

        setSteps(initialSteps ?? steps.value)

    }

    /**
     * FUN: 新增步骤
     *
     * @param options 选项
     */
    const addSteps: IUseFlowReturn<Step, SharedData>["addSteps"] = options => {

        const { steps: newSteps, afterKey } = options

        // 如果没有指定 afterKey，直接添加到末尾
        if (afterKey === void 0) {

            setSteps([...steps.value, ...newSteps])
            return

        }

        const targetStepIndex = steps.value.findIndex(step => step.key === afterKey)

        if (targetStepIndex < 0) {

            console.warn(`[useFlow] 未找到指定的步骤 key: ${afterKey}`)
            return

        }

        const before = steps.value.slice(0, targetStepIndex + 1)
        const after = steps.value.slice(targetStepIndex + 1)
        // 在指定位置之后插入
        setSteps([...before, ...newSteps, ...after])

    }

    /**
     * FUN: 删除步骤
     *
     * @param keys 需要删除的步骤 key 列表
     */
    const removeSteps: IUseFlowReturn<Step, SharedData>["removeSteps"] = keys => {

        setSteps(steps.value.filter(step => !keys.includes(step.key)))

    }

    /**
     * FUN: 跳转到指定步骤
     *
     * @param options 选项
     */
    const goToStep: IUseFlowReturn<Step, SharedData>["goToStep"] = options => {

        const { key, data } = options

        const targetStep = steps.value.find(step => step.key === key)
        if (!targetStep) {

            console.warn(`[useFlow] 无效的步骤 key: ${key}`)
            return

        }
        targetStep.data = data
        currentStepKey.value = key

    }

    /**
     * FUN: 上一步
     *
     * @param options 选项
     */
    const prevStep: IUseFlowReturn<Step, SharedData>["prevStep"] = (options = {}) => {

        const { step = 1, data } = options
        const targetStepIndex = currentStepIndex.value - step
        const targetStep = steps.value[Math.max(0, targetStepIndex)]
        goToStep({ key: targetStep?.key, data })

    }

    /**
     * FUN: 下一步
     *
     * @param options 选项
     */
    const nextStep: IUseFlowReturn<Step, SharedData>["nextStep"] = (options = {}) => {

        const { step = 1, data } = options
        const targetStepIndex = currentStepIndex.value + step
        const targetStep = steps.value[Math.min(totalSteps.value - 1, targetStepIndex)]
        goToStep({ key: targetStep?.key, data })

    }

    /** FUN: 重置步骤 */
    const resetStep: IUseFlowReturn<Step, SharedData>["resetStep"] = () => {

        goToStep({ key: initialStepKey ?? steps.value[0]?.key })

    }

    /** REF: 共享数据 */
    const sharedData: IUseFlowReturn<Step, SharedData>["sharedData"] = ref(cloneDeep(initialSharedData)) as Ref<SharedData>

    /**
     * FUN: 设置共享数据
     *
     * @param data 共享数据
     */
    const setSharedData: IUseFlowReturn<Step, SharedData>["setSharedData"] = data => {

        sharedData.value = cloneDeep(data)

    }

    /**
     * FUN: 更新共享数据
     *
     * @param data 共享数据
     */
    const updateSharedData: IUseFlowReturn<Step, SharedData>["updateSharedData"] = data => {

        setSharedData({ ...sharedData.value, ...data })

    }

    /** FUN: 重置共享数据 */
    const resetSharedData: IUseFlowReturn<Step, SharedData>["resetSharedData"] = () => {

        setSharedData(initialSharedData as SharedData)

    }

    /** FUN: 重置所有 */
    const resetAll: IUseFlowReturn<Step, SharedData>["resetAll"] = () => {

        // 重置流程列表
        resetSteps()
        // 重置步骤
        resetStep()
        // 重置共享数据
        resetSharedData()

    }

    return {
        steps,
        currentStepKey,
        currentStepIndex,
        currentStep,
        currentStepData,
        totalSteps,
        isFirstStep,
        isLastStep,

        setSteps,
        resetSteps,
        addSteps,
        removeSteps,

        goToStep,
        prevStep,
        nextStep,
        resetStep,

        sharedData,
        setSharedData,
        updateSharedData,
        resetSharedData,

        resetAll
    }

}
