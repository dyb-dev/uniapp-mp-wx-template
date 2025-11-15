<!--
 * @FileDesc: 上传文件组件
 -->

<script setup lang="ts">
import { useVModels } from "@vueuse/core"

import { isImagePath } from "@/utils"

import type { ImageMode } from "@uni-helper/uni-app-types"
import type {
    ChooseFile,
    FileItem,
    MediaType,
    OnProgressUpdateResult,
    SizeType,
    SourceType,
    UploadFileSuccessCallbackResult,
    UploadOptions
} from "nutui-uniapp"

/** 上传文件布局类型 */
export type TUploaderLayout = "picture" | "list"

/** 上传文件信息 */
export interface IUploaderFileItem<T extends Record<string, any>> extends FileItem {
    /** 接口返回值数据 */
    responseData: T
}

/** 上传结果事件 */
export interface IUploaderResultEvent {
    /** 上传成功或失败的回调数据 */
    data: UploadFileSuccessCallbackResult
    /** 上传成功或失败的文件项 */
    fileItem: IUploaderFileItem<Record<string, any>>
    /** 上传选项 */
    option: UploadOptions
}

/** 上传文件对象事件 */
export interface IUploaderProgressEvent {
    /** 上传进度事件对象 */
    event: OnProgressUpdateResult
    /** 当前文件对象的上传进度 */
    percentage: string | number
    /** 上传选项 */
    option: UploadOptions
}

/** 上传文件改变时的事件 */
export interface IUploaderChangeEvent {
    /** 文件列表 */
    fileList: IUploaderFileItem<Record<string, any>>[]
    /** 输入框事件对象 */
    event: InputEvent
}

/** 文件删除事件 */
export interface IUploaderDeleteEvent {
    /** 文件列表 */
    fileList: IUploaderFileItem<Record<string, any>>[]
    /** 当前文件项 */
    file: IUploaderFileItem<Record<string, any>>
    /** 当前文件的索引 */
    index: number
}

/** 点击文件项 */
export interface IUploaderFileItemClickEvent {
    /** 当前文件项 */
    fileItem: IUploaderFileItem<Record<string, any>>
}

/** 组件属性接口 */
export interface IUploaderProps {
    /**
     * 当前已上传的文件列表(包含上传成功、失败状态)
     *
     * @default []
     */
    modelValue: IUploaderFileItem<Record<string, any>>[]
    /**
     * 是否自动上传
     *
     * @default true
     */
    autoUpload?: boolean
    /**
     * 给到服务器的文件参数名
     *
     * @default 'file'
     */
    name?: string
    /**
     * 上传服务器的接口地址
     */
    url?: string
    /**
     * 是否展示删除按钮
     *
     * @default true
     */
    deletable?: boolean
    /**
     * 上传组件展示的布局类型
     *
     * @default 'picture'
     */
    layout?: TUploaderLayout
    /**
     * 上传组件展示的布局类型 单位: MB
     *
     * @default 5
     */
    maxSize?: number | string
    /**
     * 文件上传数量限制
     *
     * @default 1
     */
    maxCount?: number | string
    /**
     * 选择文件的来源
     *
     * @default ['album','camera']
     */
    sourceType?: SourceType[]
    /**
     * 压缩文件大小的类型
     *
     * @default ['original','compressed']
     */
    sizeType?: SizeType[]
    /**
     * 允许上传的文件类型
     * - 'image': 图片
     * - 'video': 视频
     * - 'mix': 图片 & 视频
     *
     * @default 'image'
     */
    accept?: MediaType
    /**
     * 设置上传的请求头部
     *
     * @default {}
     */
    headers?: Record<string, any>
    /**
     * 附加上传的信息 formData
     *
     */
    data?: Record<string, any>
    /**
     * 是否禁用文件上传
     *
     * @default false
     */
    disabled?: boolean
    /**
     * 是否支持文件多选
     *
     * @default true
     */
    multiple?: boolean
    /**
     * 上传图片的图标 可传入图标名称或者图片地址
     *
     * @default 'photograph'
     */
    uploadIcon?: string
    /**
     * 上传图片的图标宽度
     *
     * @default '30rpx'
     */
    uploadIconWidth?: string
    /**
     * 上传图片的图标高度
     *
     * @default '30rpx'
     */
    uploadIconHeight?: string
    /**
     * uploadIcon 为图标名称时 上传图片的图标颜色
     *
     * @default '#949494'
     */
    uploadIconColor?: string
    /**
     * uploadIcon 为图标名称时 上传图片的图标类名前缀
     *
     * @default 'nut-icon'
     */
    uploadIconClassPrefix?: string
    /**
     * uploadIcon 为图标名称时 上传图片的图标字体类名
     *
     * @default 'nutui-iconfont'
     */
    uploadIconFontClassName?: string
    /**
     * 预览图和上传区域的尺寸
     *
     * @default '200rpx'
     */
    previewSize?: string
    /**
     * 预览图的缩放模式
     *
     * @default 'aspectFit'
     */
    previewMode?: ImageMode
    /**
     * 是否在点击预览图后展示全屏图片预览
     *
     * @default true
     */
    previewFullImage?: boolean
    /**
     * 上传区域的背景
     *
     * @default '#f7f8fa'
     */
    uploadBackground?: string
    /**
     * 上传图片之前触发
     *
     * @param uploadFile 上传图片函数
     * @param option 上传图片参数选项
     */
    beforeUpload?: (uploadFile: typeof uni.uploadFile, option: UploadOptions) => void
    /**
     * 删除图片之前触发
     *
     * @param file 删除的文件
     */
    beforeDelete?: (file: IUploaderFileItem<Record<string, any>>) => boolean | Promise<boolean>
}

const props = withDefaults(defineProps<IUploaderProps>(), {
    modelValue: () => [],
    autoUpload: true,
    name: "file",
    url: "",
    deletable: true,
    layout: "picture",
    maxSize: 5,
    maxCount: 1,
    sourceType: () => ["album", "camera"],
    sizeType: () => ["original", "compressed"],
    accept: "image",
    headers: () => ({}),
    data: () => ({}),
    disabled: false,
    multiple: true,
    previewMode: "aspectFit",
    uploadIcon: "photograph",
    uploadIconWidth: "30rpx",
    uploadIconHeight: "30rpx",
    uploadIconColor: "#949494",
    uploadIconClassPrefix: "nut-icon",
    uploadIconFontClassName: "nutui-iconfont",
    previewSize: "200rpx",
    previewFullImage: true,
    uploadBackground: "#f7f8fa"
})

// 定义 emits
const emits = defineEmits<{
    /** 当前索引更新事件 */
    (event: "update:modelValue", value: IUploaderFileItem<Record<string, any>>[]): void
    /** 文件上传开始 */
    (event: "start", option: UploadOptions): void
    /** 文件上传的进度 */
    (event: "progress", e: IUploaderProgressEvent): void
    /** 文件大小超过限制时触发 */
    (event: "oversize", files: ChooseFile[]): void
    /** 上传成功事件 */
    (event: "success", fileItem: IUploaderFileItem<Record<string, any>>): void
    /** 上传失败事件 */
    (event: "fail", fileItem: IUploaderFileItem<Record<string, any>>): void
    /** 上传文件改变时的状态 */
    (event: "change", e: IUploaderChangeEvent): void
    /** 删除文件时触发 */
    (event: "delete", e: IUploaderDeleteEvent): void
    /** 文件项点击事件 */
    (event: "file-item-click", e: IUploaderFileItemClickEvent): void
}>()

// 双向绑定 modelValue
const { modelValue } = useVModels(props, emits)

// EVENT: 监听文件大小超过限制
const onOversize = (files: ChooseFile[]) => {

    uni.showToast({
        title: `文件大小超过限制，图片大小不能超过${props.maxSize}MB`,
        icon: "none"
    })
    emits("oversize", files)

}

// EVENT: 监听上传结果
const onUploaderResult = (event: IUploaderResultEvent, eventName: "success" | "fail") => {

    event.fileItem.responseData = JSON.parse(event.data.data)
    // @ts-ignore
    emits(eventName, event.fileItem)

}

// EVENT: 点击文件项
const onFileItemClick = (e: IUploaderFileItemClickEvent) => {
    // 允许预览图片且图片存在时
    if (props.previewFullImage && props.layout === "picture" && e.fileItem.url) {

        uni.previewImage({
            urls: [e.fileItem.url],
            showmenu: true,
            indicator: "none"
        })

    }
    else {

        console.error("onFileItemClick() 图片地址不存在 e:", e)

    }

    emits("file-item-click", e)

}
</script>

<script lang="ts">
export default {
    options: {
        // 虚拟化组件节点，使组件外部样式能够直接作用到组件内部的第一层节点
        // eslint-disable-next-line padded-blocks
        virtualHost: true,
        // eslint-disable-next-line padded-blocks
        // 允许父组件样式穿透到子组件
        styleIsolation: "shared"
    }
}
</script>

<template>
    <nut-uploader
        class="uploader"
        :class="{ 'uploader--disabled': props.disabled }"
        v-model:file-list="modelValue"
        :auto-upload="props.autoUpload"
        :name="props.name"
        :url="props.url"
        :is-deletable="props.deletable"
        :list-type="props.layout"
        :maximize="~~props.maxSize * 1024 * 1024"
        :maximum="props.maxCount"
        :source-type="props.sourceType"
        :size-type="props.sizeType"
        :media-type="[props.accept]"
        :headers="props.headers"
        :data="props.data"
        :disabled="props.disabled"
        :multiple="props.multiple"
        :mode="props.previewMode"
        :before-upload="props.beforeUpload"
        :before-delete="props.beforeDelete"
        @start="(e: any) => emits('start', e)"
        @progress="(e: any) => emits('progress', e)"
        @oversize="onOversize"
        @success="(e: any) => onUploaderResult(e, 'success')"
        @failure="(e: any) => onUploaderResult(e, 'fail')"
        @change="(e: any) => emits('change', e as IUploaderChangeEvent)"
        @delete="(e: any) => emits('delete', e as IUploaderDeleteEvent)"
        @file-item-click="onFileItemClick"
    >
        <template #uploadIcon>
            <image
                v-if="isImagePath(props.uploadIcon)"
                :src="props.uploadIcon"
                :style="{
                    display: 'block',
                    width: props.uploadIconWidth,
                    height: props.uploadIconHeight
                }"
                mode="scaleToFill"
            />

            <nut-icon
                v-else
                :name="props.uploadIcon"
                :size="props.uploadIconWidth || props.uploadIconHeight"
                :class-prefix="props.uploadIconClassPrefix"
                :font-class-name="props.uploadIconFontClassName"
                :custom-color="props.uploadIconColor"
            />
        </template>
    </nut-uploader>
</template>

<style lang="scss" scoped>
.uploader {
    &--disabled {
        opacity: 0.4;
    }

    &:deep(.nut-uploader__upload),
    &:deep(.nut-uploader__preview-img) {
        width: v-bind("props.previewSize");
        height: v-bind("props.previewSize");
    }

    &:deep(.nut-uploader__upload) {
        width: v-bind("props.previewSize");
        height: v-bind("props.previewSize");
        background: v-bind("props.uploadBackground");

        &:active {
            background: #ececec;
        }
    }
}
</style>
