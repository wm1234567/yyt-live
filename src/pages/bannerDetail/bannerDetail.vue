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
        IMGURL,
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
            this.URL = IMGURL;
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
                    // uni.hideLoading();
                    console.log('success轮播图详情', res)
                    if (res.data.code == 1001) {
                        this.bannerD = res.data.data
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
        created() {

        },
        methods: {

        }
    }
</script>
<style scoped>
    .yyt-text {
        width: 100%
    }
</style>