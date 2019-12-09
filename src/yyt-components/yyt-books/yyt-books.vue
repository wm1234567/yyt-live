<template>
    <view class="yyt-list">
        <view class="yyt-title" @click="jpbooks">
            <img class="yyt-title-icon" src="static/titIcon.png" />
            <view class="yyt-title-text">精品书籍</view>
            <img class="yyt-title-right" src="static/right.png" />
        </view>
        <scroll-view scroll-x='false' style="width: 100%">
            <view class="yyt-books" v-for="(item,index) in books" :key="index" @click="booksD(item.shop_id)">
                <view class="yyt-books-img">
                    <img :src="item.shop_pic" lazy-load alt="" />
                </view>
                <view class="yyt-books-bottom">
                    <view class="yyt-books-bottom-t">{{ item.title }}</view>
                    <view class="yyt-books-bottom-st">已售：{{ item.pay_num }}本</view>
                    <view class="yyt-books-bottom-money">￥{{ item.price }}</view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
    import {
        requestUrl,
        IMGURL,
        STORE_ID
    } from '@/common/request.js'
    export default {
        name: 'YytBooks',
        data() {
            return {
                URL:'',
                books: [],
            }
        },
        created() {
            uni.showLoading({
                title: '加载中',
            });
            this.URL = IMGURL;
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
                        this.books = res.data.data
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
            // 跳转精品书籍
            jpbooks() {
                uni.switchTab({
                    url: '/pages/books/books'
                })
            },
            booksD(shop_id) {
                uni.navigateTo({
                    url: '/pages/booksD/booksD?shop_id=' + shop_id
                })
            },
        }
    }
</script>
<style scoped>

</style>