<template>
    <view class="yyt-container">
        <view class="yyt-text" v-if="type == 1">
            <rich-text :nodes="bannerD.content"></rich-text>
        </view>
        <view class="yyt-null" v-if="bannerD.content == ''">
            <view class="yyt-null-icon">
                <img src="static/nodata.png" width="100%" alt="">
            </view>
            <view class="yyt-null-text">暂无数据</view>
        </view>
    </view>
</template>

<script>
    import {
        requestUrl,
        STORE_ID
    } from '@/common/request.js'
    export default {
        name: 'YytBanner',
        data() {
            return {
                type: '',
                bannerD: {}
            }
        },
        onLoad(opt) {
            console.log(opt)
            this.type = opt.type;
            requestUrl({
                url: 'banner_info',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: 'POST',
                data: {
                    banner_id: opt.banner_id,
                    store_id: STORE_ID
                },
                success: res => {
                    console.log('success轮播图详情', res)
                    if (res.data.code == 1001) {
                        this.bannerD = res.data.data
                    }
                },
            });
        },
        created() {

        },
        methods: {

        }
    }
</script>
<style scoped>
    .yyt-text {
        width: 95%;
        height: auto;
        margin: 0 auto;
        padding-top: 70rpx
    }
</style>