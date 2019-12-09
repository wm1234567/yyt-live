<template>
    <view class="yyt-nav">
        <view class="yyt-nav-view" v-for='(item,index) in navlist' :key="index" @click="navclass(item.type_id,index)">
            <view class="yyt-nav-icon">
                <img :src="item.img" lazy-load alt="" />
            </view>
            <view class="yyt-nav-text">{{ item.title }}</view>
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
                indicatorDots: true,
                autoplay: true,
                interval: 2000,
                URL: '', //图片前缀
                navlist: {}, //轮播图数据
            }
        },
        created() {
            uni.showLoading({
                title: '加载中',
            })
            
            this.URL = IMGURL;
            //  轮播图数据
            requestUrl({
                url: 'course_type',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: 'POST',
                data: {
                    store_id: STORE_ID
                },
                success: res => {
                    uni.hideLoading();
                    console.log('success', res)
                    if (res.data.code == 1001) {
                        this.navlist = res.data.data
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
            // 跳转导航分类
            navclass(e, index) {
                uni.navigateTo({
                    url: '/pages/navclass/navclass?type_id=' + e +'&nowIndex=' + index
                })
            },
        }
    }
</script>
<style scoped>

</style>