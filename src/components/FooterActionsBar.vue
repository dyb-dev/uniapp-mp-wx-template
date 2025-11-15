<!--
 * @FileDesc: 页面底部操作栏组件
 -->

<script setup lang="ts">
/**
 * 底部操作栏图标
 */
export interface IFooterActionsBarIcon {
/**
 * 图标名称
 */
    icon: string
/**
 * 图标大小
 *
 * @default '50rpx'
 */
    size?: string
/**
 * 图标颜色
 *
 * @default '#575B66'
 */
    color?: string
/**
 * 图标类名前缀
 *
 * @default 'nut-icon'
 */
    classPrefix?: string
/**
 * 图标字体类名
 *
 * @default 'nutui-iconfont'
 */
    fontClassName?: string
/**
 * 点击事件
 */
    onClick: (item: IFooterActionsBarIcon) => void
}

/**
 * 底部操作栏按钮
 */
export interface IFooterActionsBarButton {
    /**
     * 按钮文本
     */
    text: string
    /**
     * 按钮文本大小
     *
     * @default '28rpx'
     */
    textSize?: string
    /**
     * 按钮文本颜色
     *
     * @default '#ffffff'
     */
    textColor?: string
    /**
     * 按钮背景颜色
     *
     * @default '#A68001'
     */
    background?: string
    /**
     * 按钮圆角
     *
     * @default '64rpx'
     */
    radius?: string
    /**
     * 按钮边框是否显示
     *
     * @default false
     */
    border?: boolean
    /**
     * 按钮边框颜色
     *
     * @default '#eee'
     */
    borderColor?: string
    /**
     * 点击事件
     */
    onClick: (item: IFooterActionsBarButton) => void
}

/**
 * 底部操作栏组件属性
 */
export interface IFooterActionsBarProps {
    /**
     * 高度
     *
     * @default '150rpx'
     */
    height?: string
    /**
     * 底部背景颜色
     *
     * @default '#ffffff'
     */
    background?: string
    /**
     * 是否显示顶部边框
     *
     * @default true
     */
    borderTop?: boolean
    /**
     * 顶部边框颜色
     *
     * @default '#eee'
     */
    borderTopColor?: string
    /**
     * 是否在 FooterActionsBar 位置生成一个等高的占位元素
     *
     * @default true
     */
    placeholder?: boolean
    /**
     * 图标列表
     */
    iconList?: IFooterActionsBarIcon[]
    /**
     * 按钮列表
     */
    buttonList?: IFooterActionsBarButton[]
}

// DATA: 定义 props & 给定默认值
const props = withDefaults(defineProps<IFooterActionsBarProps>(), {
    height: "150rpx",
    background: "#ffffff",
    borderTop: true,
    borderTopColor: "#eee",
    placeholder: true
})
</script>

<script lang="ts">
export default {
    options: {
        // 虚拟化组件节点，使组件外部样式能够直接作用到组件内部的第一层节点
        virtualHost: true,
        // 允许父组件样式穿透到子组件
        styleIsolation: "shared"
    }
}
</script>

<template>
    <view class="footer-actions-bar-placeholder" :style="{ height: props.placeholder ? props.height : '0rpx' }">
        <view
            class="footer-actions-bar"
            :style="{
                height: props.height,
                background: props.background,
                borderTop: props.borderTop ? `1rpx solid ${props.borderTopColor}` : 'none'
            }"
        >
            <!-- 图标区域 -->
            <view
                v-if="props?.iconList?.length"
                class="footer-actions-bar__icon-box"
                :style="{ flex: props?.buttonList?.length ? 0 : 1 }"
            >
                <nut-icon
                    v-for="(item, index) in props.iconList"
                    :key="index"
                    :name="item.icon"
                    :class-prefix="item.classPrefix || 'nut-icon'"
                    :font-class-name="item.fontClassName || 'nutui-iconfont'"
                    :custom-color="item.color || '#575B66'"
                    :size="item.size || '50rpx'"
                    @tap="item.onClick(item)"
                />
            </view>

            <!-- 按钮区域 -->
            <view v-if="props?.buttonList?.length" class="footer-actions-bar__button-box">
                <nut-button
                    class="footer-actions-bar__button-box__item"
                    v-for="(item, index) in props.buttonList"
                    :key="index"
                    :custom-color="item.background || '#A68001'"
                    :style="{
                        color: item.textColor || '#ffffff',
                        fontSize: item.textSize || '28rpx',
                        borderRadius: item.radius || '64rpx',
                        border: item.border ? `1rpx solid ${item.borderColor || '#eee'}` : 'none'
                    }"
                    @tap="item.onClick(item)"
                >
                    {{ item.text }}
                </nut-button>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.footer-actions-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
    display: flex;
    gap: 0 70rpx;
    align-items: center;
    box-sizing: border-box;
    width: 100vw;
    padding: 0 42rpx 50rpx;

    &__icon-box {
        display: flex;
        gap: 0 70rpx;
        align-items: center;
        justify-content: space-evenly;
    }

    &__button-box {
        display: flex;
        flex: 1;
        gap: 0 20rpx;
        align-items: center;

        &__item {
            flex: 1;
            padding: 0 !important;
        }
    }
}
</style>
