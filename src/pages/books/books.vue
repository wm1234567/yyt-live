<template>
    <view class="yyt-container">
        <view class="yyt-topspace"></view>
        <view class="yyt-books" v-for='( item,index ) in books' :key="index" @click="booksD(item.shop_id)">
            <view class="yyt-books-img">
                <img :src="item.shop_pic" lazy-load alt="" />
            </view>
            <view class="yyt-books-bottom">
                <view class="yyt-books-bottom-t">{{ item.title }}</view>
                <view class="yyt-books-bottom-st">已售：{{ item.pay_num }}</view>
                <view class="yyt-books-bottom-money">￥{{ item.price }}</view>
            </view>
        </view>
        <view class="yyt-car-icon" @click="car">
            <img src="static/carIcon.png" />
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
        data() {
            return {
                books: [],
                URL: ''
            }
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.load();
        },
        onLoad() {
            this.URL = IMGURL;
            this.load();
        },
        methods: {
            load() {
                requestUrl({
                    url: 'shop_lists',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        store_id: STORE_ID,
                        num: 0
                    },
                    success: res => {
                        uni.hideLoading();
                        console.log('success首页书籍', res)
                        if (res.data.code == 1001) {
                            this.books = res.data.data;
                            uni.stopPullDownRefresh();
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
            booksD(shop_id) {
                uni.navigateTo({
                    url: '/pages/booksD/booksD?shop_id=' + shop_id
                })
            },
            car() {
                uni.navigateTo({
                    url: '/pages/car/car'
                })
            }
        }
    }
</script>

<style scoped>
    .yyt-car-icon {
        position: fixed;
        right: 5rpx;
        bottom: 150rpx;
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
    }

    .yyt-car-icon img {
        width: 100%;
        height: 100%
    }
</style>