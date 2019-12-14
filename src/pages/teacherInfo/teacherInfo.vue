<template>
    <view class="yyt-container">
        <view class='yyt-teacher' :style="{backgroundImage: 'url(' + teacherInfo.avatar + ')', backgroundSize:'cover'}">
            <view class="yyt-teacher-bg-zz"></view>
            <view class="yyt-teacher-avatar">
                <view class="avatar-center">
                    <img :src="teacherInfo.avatar" />
                </view>
            </view>
            <view class="yyt-teacher-name">{{ teacherInfo.realname }}</view>
        </view>
        <view class="yyt-info-title">名师介绍</view>
        <view class="yyt-info-text">{{ teacherInfo.content }}</view>
    </view>
</template>

<script>
    import {
        requestUrl,
        STORE_ID
    } from '@/common/request.js'
    export default {
        data() {
            return {
                teacherInfo: {},
            }
        },
        onLoad(opt) {
            console.log(opt)
            // 分类标题
            requestUrl({
                url: 'anchor_info',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: 'POST',
                data: {
                    anchor_id: opt.anchor_id,
                    store_id: STORE_ID
                },
                success: res => {
                    console.log('success教师详细', res)
                    if (res.data.code == 1001) {
                        this.teacherInfo = res.data.data
                    }
                    if (res.data.code == 1002) {
                        uni.showToast({
                            title: res.data.message,
                            mask: false,
                            duration: 2000,
                            icon: "none"
                        });
                    }
                },
            });

        },
        methods: {

        }
    }
</script>

<style scoped>
    .yyt-teacher {
        position: relative;
        width: 100%;
        height: 400rpx;
    }

    .yyt-teacher-bg {
        width: 100%;
        height: 100%;
    }

    .yyt-teacher-bg-zz {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 400rpx;
        background: rgba(0, 0, 0, 0.7);
    }

    .yyt-teacher-avatar {
        position: absolute;
        left: 0;
        bottom: 120rpx;
        width: 100%;
        height: 150rpx;
    }

    .avatar-center {
        width: 150rpx;
        height: 150rpx;
        margin: 0 auto;
    }

    .avatar-center img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .yyt-teacher-name {
        position: absolute;
        left: 0;
        bottom: 60rpx;
        width: 100%;
        height: 50rpx;
        text-align: center;
        color: #fff;
    }

    .yyt-info-title {
        width: 95%;
        height: 90rpx;
        margin: 0 auto;
        line-height: 90rpx;
        font-weight: bold;
    }

    .yyt-info-text {
        width: 95%;
        height: auto;
        margin: 0 auto;
    }
</style>