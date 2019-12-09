<template>
    <view class="yyt-container">
        <!-- 轮播图 -->
        <swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
            duration="2000">
            <block v-for="(item,index) in booksD.shop_pic" :key="index">
                <swiper-item>
                    <img class="img" lazy-load :src="item" />
                </swiper-item>
            </block>
        </swiper>
        <view class="yyt-book-icon">
            <view class="yyt-book-icon-view">
                <img src='static/ok.png' />
                <view>发货&售后</view>
            </view>
            <view class="yyt-book-icon-view">
                <img src='static/ok.png' />
                <view>正品保障</view>
            </view>
            <view class="yyt-book-icon-view">
                <img src='static/ok.png' />
                <view>放心购</view>
            </view>
        </view>
        <view class="yyt-book-info">
            <view class="yyt-book-info-title">{{ booksD.title }}</view>
            <view class="yyt-book-info-money">￥{{ booksD.price }}</view>
            <view class="yyt-book-info-num">已售：{{ booksD.pay_num }}本</view>
        </view>
        <view class="space"></view>
         <view class="yyt-book-info">
            <rich-text :nodes="booksD.content"></rich-text>
         </view>
        <view class="yyt-book-bottom">
            <view class="yyt-book-bottom-left">
                <view class="bottom-block">
                    <view class="bottom-block-icon">
                        <img src="static/b-user.png" />
                    </view>
                    <view class="bottom-block-text">联系商家</view>
                </view>
                <view class="bottom-block" @click="car">
                    <view class="bottom-block-icon">
                        <img src="static/b-car.png" />
                    </view>
                    <view class="bottom-block-text">购物车</view>
                </view>
            </view>
            <view class="yyt-book-bottom-right">
                <view class="bottom-right">
                    <view class="bottom-right-view black" @click="addcar(booksD.shop_id)">加入购物车</view>
                    <view class="bottom-right-view blue" @click="togglePopup('bottom', 'popup')">立即购买
                    </view>
                </view>
            </view>
        </view>
        <!-- 模态 -->
        <uni-popup ref="popup" :type="type" :custom="true" @change="change">
            <view class="yyt-exc">
                <view class="yyt-exc-title">请添加购买数量</view>
                <view class='numBox'>
                    <view class='num-text'>数量</view>
                    <view class='right'>
                        <view class='yyt-numBox'>
                            <view class='yyt-right'>
                                <view class='yyt-minuts' @click="minusCount">-</view>
                                <view class='yyt-num'>{{ cnt }}</view>
                                <view class='yyt-plus' @click="addCount">+</view>
                            </view>
                        </view>
                    </view>
                </view>
                <button class="submit-button" @click="goFillOrder">确定</button>
            </view>
        </uni-popup>

    </view>
</template>

<script>
    import uniPopup from '@/components/uni-popup/uni-popup.vue'
    import {
        requestUrl,
        IMGURL,
        STORE_ID
    } from '@/common/request.js'
    export default {
        components: {
            uniPopup,
        },
        data() {
            return {
                indicatorDots: true,
                autoplay: true,
                interval: 5000,
                show: false,
                type: '',
                cnt: 1,
                flag: false,
                store_id: '',
                booksD: {},
                URL: ''
            }
        },
        // // 下拉刷新
        // onPullDownRefresh() {
        //     this.load();
        // },
        onLoad(opt) {
            this.URL = IMGURL;
            this.store_id = STORE_ID;
            var openid = uni.getStorageSync('openid');
            requestUrl({
                url: 'shop_info',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: 'POST',
                data: {
                    store_id: STORE_ID,
                    shop_id: opt.shop_id,
                    account: openid
                },
                success: res => {
                    uni.hideLoading();
                    // uni.stopPullDownRefresh();
                    console.log('success书籍D', res)
                    if (res.data.code == 1001) {
                        this.booksD = res.data.data
                    }

                },
            });
        },
        methods: {
            addcar(shop_id) {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'trolley_add',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        store_id: this.store_id,
                        account: openid,
                        shop_id: shop_id,
                        num: 1
                    },
                    success: res => {
                        console.log('success加入购物车', res)
                        if (res.data.code == 1001) {
                            uni.showToast({
                                title: '添加成功',
                                mask: false,
                                duration: 2000,
                                icon: "none"
                            });
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
            // 减少商品数量
            minusCount: function () {
                let cnt = this.cnt;
                if (cnt <= 1) {
                    return;
                }
                cnt = cnt - 1;
                this.cnt = cnt
            },
            // 增加商品数量
            addCount: function () {
                let cnt = this.cnt;
                cnt = cnt + 1;
                this.cnt = cnt
            },
            togglePopup(type, open) {
                console.log(type)
                this.type = type
                if (open === 'tip') {
                    this.show = true
                } else {
                    this.$refs[open].open()
                }
            },
            cancel(type) {
                if (type === 'tip') {
                    this.show = false
                    return
                }
                this.$refs[type].close()
            },
            change(e) {
                console.log(e.show)
            },
            goFillOrder() {
                var allPrice = Number(this.cnt) * Number(this.booksD.price)
                uni.navigateTo({
                    url: '/pages/fillOrder/fillOrder?shop_id=' + this.booksD.shop_id + '&num=' + this.cnt +
                        '&allPrice=' + allPrice + '&type=' + 1
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
    .yyt-exc {
        background: #fff;
        padding: 20rpx
    }

    .yyt-exc-title {
        width: 100%;
        height: 75rpx;
    }

    .yyt-exc-input {
        width: 100%;
        height: 75rpx;
        background: #f4f4f4f4;
        border-radius: 15rpx;
        margin-bottom: 30rpx
    }

    .submit-button {
        width: 100%;
        height: 75rpx;
        line-height: 75rpx;
        font-size: 29rpx;
        background: #007AFF;
        color: #fff;
        border-radius: 40rpx
    }

    .yyt-bookImg {
        width: 100%;
        height: 100%;
    }

    .yyt-book-icon {
        width: 100%;
        height: 90rpx;
        background: #d5e3ff;
    }

    .yyt-book-icon-view {
        width: 25%;
        height: 90rpx;
        display: inline-block;
    }

    .yyt-book-icon-view img {
        width: 30rpx;
        height: 30rpx;
        float: left;
        margin: 31rpx 0 0 20rpx;
    }

    .yyt-book-icon-view view {
        width: 68%;
        height: 90rpx;
        line-height: 90rpx;
        float: left;
        font-size: 24rpx;
        color: #4986ff;
        padding-left: 10rpx;
    }

    .yyt-book-info {
        width: 92%;
        height: 210rpx;
        margin: 0 auto;
        line-height: 63rpx;
        padding-top: 10rpx;
    }

    .yyt-book-info-title {
        width: 100%;
        height: 70rpx;
        font-size: 30rpx;
    }

    .yyt-book-info-money {
        width: 100%;
        height: 70rpx;
        font-size: 31rpx;
        color: #fb4f6c;
    }

    .yyt-book-info-num {
        width: 100%;
        height: 70rpx;
        font-size: 25rpx;
        color: #5e5e5e;
    }

    .yyt-book-bottom {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100rpx;
        border-top: 1rpx solid #f4f4f4;
    }

    .yyt-book-bottom-left {
        width: 45%;
        height: 100rpx;
        float: left;
        margin-top: 10rpx;
    }

    .yyt-book-bottom-right {
        width: 55%;
        height: 100rpx;
        float: left;
        margin-top: 10rpx;
    }

    .bottom-block {
        width: 50%;
        height: 100rpx;
        display: inline-block;
    }

    .bottom-block-icon {
        width: 45rpx;
        height: 45rpx;
        margin: 0 auto;
    }

    .bottom-block-icon img {
        width: 45rpx;
        height: 45rpx;
    }

    .bottom-block-text {
        width: 100%;
        text-align: center;
        font-size: 25rpx;
        color: #9c9c9c;
    }

    .bottom-right {
        width: 95%;
        height: 80rpx;
        line-height: 80rpx;
        margin: 0 auto;
        border-radius: 40rpx;
    }

    .bottom-right-view {
        width: 50%;
        height: 80rpx;
        line-height: 80rpx;
        float: left;
        text-align: center;
        color: #fff;
    }

    .black {
        border-top-left-radius: 40rpx;
        border-bottom-left-radius: 40rpx;
        background: #333;
    }

    .blue {
        background: #4986ff;
        border-top-right-radius: 40rpx;
        border-bottom-right-radius: 40rpx;
    }

    .numBox {
        width: 100%;
        height: 80rpx;
    }

    .numBox .right {
        width: 250rpx;
        height: 80rpx;
        text-align: center;
        line-height: 110rpx;
        float: right;
        /* margin-right: 20rpx; */
    }

    .numBox .right .minuts {
        float: left;
        width: 70rpx;
        border: none;
        height: 70rpx;
        line-height: 70rpx;
        color: #4a86ff;
        font-size: 50rpx;
        background: #d5e3ff;
        text-align: center;
    }

    button::after {
        border: none;
    }

    .numBox .right .num {
        float: left;
        width: 100rpx;
        height: 70rpx;
        line-height: 70rpx;
        color: #333;
        font-size: 31rpx;
        background: #f4f4f4;
        margin: 0 5rpx 0 5rpx;
    }

    .numBox .right .plus {
        float: left;
        width: 70rpx;
        border: none;
        height: 70rpx;
        line-height: 70rpx;
        background: #d5e3ff;
        color: #4a86ff;
        text-align: center;
    }

    .num-text {
        width: 90rpx;
        float: left;
        height: 70rpx;
        line-height: 70rpx;
        padding-left: 20rpx;
    }

    .num-text2 {
        width: 35rpx;
        float: left;
        height: 70rpx;
        line-height: 70rpx;
    }

    .car-ok {
        width: 100%;
        height: 80rpx;
        background: #4986ff;
        color: #fff;
        position: absolute;
        bottom: 0;
        text-align: center;
        line-height: 80rpx;
        font-size: 32rpx;
    }

    .yyt-numBox-title {
        width: 100%;
        height: 45px;
        text-align: left;
        line-height: 85rpx;
        padding-left: 20rpx;
        font-size: 30rpx;
    }

    /* 计数 */

    .yyt-numBox {
        width: 100%;
        height: 60rpx;
    }

    .yyt-numBox .yyt-right {
        width: 230rpx;
        height: 60rpx;
        text-align: center;
        line-height: 110rpx;
        float: left;
    }

    .yyt-numBox .yyt-right .yyt-minuts {
        float: left;
        width: 31%;
        border: 1px solid #eee;
        height: 60rpx;
        line-height: 60rpx;
        color: #8a8a8a;
        font-size: 50rpx;
        background: #fff;
    }

    .yyt-numBox .yyt-right .yyt-num {
        float: left;
        width: 31%;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        height: 60rpx;
        line-height: 60rpx;
        color: #333;
        font-size: 31rpx;
    }

    .yyt-numBox .yyt-right .yyt-plus {
        float: left;
        width: 31%;
        border: 1px solid #eee;
        height: 60rpx;
        line-height: 60rpx;
        color: #8a8a8a;
        background: #fff;
    }
</style>