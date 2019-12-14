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
        <view class="yyt-null" v-if="books.length == 0">
            <view class="yyt-null-icon">
                <img src="static/nodata.png" width="100%" alt="">
            </view>
            <view class="yyt-null-text">暂无数据</view>
        </view>
        <view class="yyt-car-icon" @click="car">
            <img src="static/carIcon.png" />
        </view>
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
                books: [],
                URL: ''
            }
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.load();
        },
        onLoad() {
            this.load();
        },
        methods: {
            load() {
                uni.showLoading({
                    title: '加载中',
                });
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
                        uni.stopPullDownRefresh();
                        console.log('success商城书籍列表', res)
                        if (res.data.code == 1001) {
                            this.books = res.data.data;
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