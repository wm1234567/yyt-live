<template>
    <view class="yyt-list">
        <view class="yyt-title" @click="jpbooks">
            <img class="yyt-title-icon" src="static/titIcon.png" />
            <view class="yyt-title-text">精品书籍</view>
            <img class="yyt-title-right" src="static/right.png" />
        </view>
        <scroll-view scroll-x='false' style="width: 100%" v-if="books">
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
         <view class="null" v-else>暂无数据</view>
    </view>
</template>

<script>
    import {
        requestUrl,
        STORE_ID
    } from '@/common/request.js'
    export default {
        name: 'YytBooks',
        props: ['books'],
        data() {
            return {
 
            }
        },
        created() {

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