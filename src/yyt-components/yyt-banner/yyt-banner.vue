<template>
    <view class="yyt-top">
        <!-- 轮播图 -->
        <swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
            duration="2000">
            <block v-for="(item,index) in banner" :key="index">
                <swiper-item @click="bannerDetail(item.banner_id, item.type, item.content)">
                    <img class="img" lazy-load :src="item.banner_pic" />
                </swiper-item>
            </block>
        </swiper>
        <!-- 搜索 -->
        <img class="yyt-search" src="static/search.png" @click="search" />
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
                interval: 5000,
                URL: '', //图片前缀
                banner: {}, //轮播图数据
            }
        },
        created() {
            uni.showLoading({
                title: '加载中',
            });
            this.URL = IMGURL;
            var openid = uni.getStorageSync('openid');
            //  轮播图数据
            requestUrl({
                url: 'banner_lists',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: 'POST',
                data: {
                    store_id: STORE_ID,
                    account: openid,
                },
                success: res => {
                    uni.hideLoading();
                    console.log('success轮播图', res)
                    if (res.data.code == 1001) {
                        this.banner = res.data.data
                    }
                },
            });
        },
        methods: {
            bannerDetail(id, type, content) {
                if (type == 1) {
                    uni.navigateTo({
                        url: '/pages/bannerDetail/bannerDetail?banner_id=' + id + '&type=' + type
                    })
                }
                if(type == 2){
                    window.location.href = content;
                }
                if (type == 3) {
                    uni.navigateTo({
                        url: '/pages/booksD/booksD?shop_id=' + content 
                    })
                }
                if (type == 4) {
                    uni.navigateTo({
                        url: '/pages/liveclassD/liveclassD?course_id=' + content
                    })
                }
                
            },
            search() {
                console.log(889)
                uni.navigateTo({
                    url: '/pages/search/search'
                })
            },
        }
    }
</script>
<style scoped>

</style>