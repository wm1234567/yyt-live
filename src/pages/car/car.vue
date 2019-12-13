<template>
    <view class="yyt-container">
        <view v-if="hasList">
            <view class="yyt-for" v-for="(item, index) in carts" :key="index">
                <!-- 商品循环开始 -->
                <view class="yyt-cart-list">
                    <view class="yyt-cart-sel">
                        <!-- 选中 -->
                        <img class="yyt-cart-pro-select" src='static/cartSelect.png' v-show="item.selected"
                            @click="selectList(index)" />
                        <!-- 未选中 -->
                        <img class="yyt-cart-pro" src='static/cart.png' @click="selectList(index)" v-show="!item.selected"/>
                    </view>
                    <!-- 列表 -->
                    <view class='yyt-conCar'>
                        <view class='yyt-cart-thumb'>
                            <img :src="item.shop_pic" />
                        </view>
                        <view class='yyt-conCar-info'>
                            <view class='yyt-listheader'>
                                <view class='yyt-list-title'>{{ item.title }}</view>
                            </view>
                            <view class='yyt-list-footer'>
                                <view class='yyt-list-fee'>￥{{ item.price }}</view>
                            </view>
                        </view>
                        <view class='yyt-list-delete' @click="deleteList(index)">
                            <img class="yyt-delete-icon" src='static/delete.png' />
                        </view>
                        <view class='yyt-numBox'>
                            <view class='yyt-right'>
                                <view class='yyt-minuts' @click="minusCount(index)">-</view>
                                <view class='yyt-num'>{{ item.num }}</view>
                                <view class='yyt-plus' @click="addCount(index)">+</view>
                            </view>
                        </view>
                    </view>

                </view>
                <view class="space"></view>
                <!-- 商品循环结束 -->
            </view>

            <!-- 底部 -->
            <view class="yyt-cart-footer" v-if="carts.length != 0">
                <view class='yyt-footer-left'>
                    <img src='static/cartSelect.png' v-if="selectAllStatus" class="yyt-total-select"
                        @click="selectAll" />
                    <img src='static/cart.png' v-else type="circle" class="yyt-total-select" @click="selectAll" />
                    <text class='yyt-allselect'>已选({{ allcount }})</text>
                    <text class="yyt-cart-toatl-price">合计：<text style='color:#d81e06'>{{ totalPrice }}</text></text>
                </view>
                <view class="yyt-footer-right" @click='goFillOrder'>提交订单</view>
            </view>
        </view>
        <view class="yyt-null" v-if="carts.length == 0">
            <view class="yyt-null-icon">
                <img src="static/noCar.png" width="100%" alt="">
            </view>
            <view class="yyt-null-text">您的购物车中没有商品哦</view>
            <view class="yyt-null-go" @click="goBooks">去商城逛逛吧</view>
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
                store_id: '',
                URL: '',
                hasList: true, // 列表是否有数据
                totalPrice: 0, // 总价，初始为0
                allcount: 0,
                selectAllStatus: false, // 全选状态，默认全选
                carts: [],
                trolley_id_Arr: []
            }
        },
        onLoad() {
            this.URL = IMGURL;
            this.store_id = STORE_ID;
            this.load();
            this.getTotalPrice();
        },
        // onShow() {
        //     this.load();
        //     this.getTotalPrice();
        // },
        methods: {
            load() {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'trolley_lists',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id
                    },
                    success: res => {
                        console.log('success购物车列表', res)
                        if (res.data.code == 1001) {
                            var carts = res.data.data;
                            for (let i in carts) {
                                carts[i].selected = false
                            }
                            this.carts = carts
                            console.log(this.carts)
                        }
                    },
                });
            },
            /**
             * 当前商品选中事件
             */
            selectList(index) {
                var that = this;
                let selectAllStatus = this.selectAllStatus;
                let carts = this.carts;
                const selected = carts[index].selected;
                carts[index].selected = !selected;
                // 如果列表选项未全选则取消全选状态
                var flag = 0;
                console.log(selected)
                if (selected == false) {
                    for (let i = 0; i < carts.length; i++) {
                        if (carts[i].selected !== true) {
                            flag = 1;
                            break;
                        }
                    }
                    if (flag == 0) {
                        that.selectAllStatus = true
                    }
                    let obj = {
                        trolley_id: carts[index].trolley_id
                    }
                    this.trolley_id_Arr.push(obj)
                } else { //如果列表选项去全选则全选状态
                    for (let i = 0; i < carts.length; i++) {
                        if (carts[i].selected !== true) {
                            flag = 1;
                            break;
                        }
                    }
                    if (flag == 1) {
                        this.selectAllStatus = false
                    }
                    this.trolley_id_Arr.pop()
                }
                this.carts = carts
                this.getTotalPrice();
            },

            /**
             * 删除购物车当前商品
             */
            deleteList(index) {
                var that = this;
                uni.showModal({
                    title: '提示',
                    content: '确定删除吗？',
                    success: function (res) {
                        console.log(res)
                        if (res.confirm) {
                            let carts = that.carts;
                            var trolley_id = that.carts[index].trolley_id
                            carts.splice(index, 1);
                            this.carts = carts
                            if (!carts.length) {
                                this.hasList = false;
                                that.deletCar(trolley_id);
                            } else {
                                that.getTotalPrice();
                            }
                        }
                    }
                })
            },

            /**
             * 购物车全选事件
             */
            selectAll(e) {
                let selectAllStatus = this.selectAllStatus;
                selectAllStatus = !selectAllStatus;
                let carts = this.carts;

                for (let i = 0; i < carts.length; i++) {
                    carts[i].selected = selectAllStatus;
                    if (selectAllStatus) { //全选将购物车ID存入trolley_id_Arr
                        let obj = {
                            trolley_id: carts[i].trolley_id
                        }
                        this.trolley_id_Arr.push(obj)
                    } else {
                        this.trolley_id_Arr.pop()
                    }
                }
                this.selectAllStatus = selectAllStatus;
                this.carts = carts;
                this.getTotalPrice();
            },

            /**
             * 绑定加数量事件
             */
            addCount(index) {
                let carts = this.carts;
                let num = carts[index].num;
                let trolley_id = carts[index].trolley_id;
                num = num + 1;
                console.log(num)
                carts[index].num = num;
                this.carts = carts;
                this.getTotalPrice();
                this.carCount(trolley_id, 1)
            },

            /**
             * 绑定减数量事件
             */
            minusCount(index) {
                let carts = this.carts;
                let num = carts[index].num;
                let trolley_id = carts[index].trolley_id;
                if (num <= 1) {
                    return false;
                }
                num = num - 1;
                console.log(num)
                carts[index].num = num;
                this.carts = carts;
                this.getTotalPrice();
                this.carCount(trolley_id, 2)
            },

            /**
             * 计算总价
             */
            getTotalPrice() {
                let carts = this.carts; // 获取购物车列表
                let total = 0;
                var allcount = 0;
                for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
                    if (carts[i].selected) { // 判断选中才会计算价格
                        total += carts[i].num * carts[i].price; // 所有价格加起来
                        allcount += carts[i].num
                    }
                }
                this.carts = carts;
                this.totalPrice = total.toFixed(2);
                this.allcount = allcount;
            },

            /**
             * 购物车数量加减
             */
            carCount(trolley_id, type) {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'trolley_edit',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        trolley_id: trolley_id,
                        type: type

                    },
                    success: res => {
                        console.log('success购物车商品数量加减', res)
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

            /**
             * 删除购物车
             */
            deletCar(trolley_id) {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'trolley_del',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        trolley_id: trolley_id,

                    },
                    success: res => {
                        if (res.data.code == 1001) {
                            uni.showToast({
                                title: '删除成功',
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

            /**
             * 跳转订单页
             */
            goFillOrder() {
                console.log(this.trolley_id_Arr)
                if (this.trolley_id_Arr.length == 0) {
                    uni.showToast({
                        title: '请勾选商品',
                        mask: false,
                        duration: 2000,
                        icon: "none"
                    });
                    return
                }
                var trolley_id = JSON.stringify(this.trolley_id_Arr)
                uni.navigateTo({
                    url: '/pages/fillOrder/fillOrder?trolley_id=' + trolley_id +
                        '&allPrice=' + this.totalPrice + '&type=' + 2
                })
            },
            goBooks(){
                 uni.switchTab({
                    url: '/pages/books/books'
                })
            }

        }
    }
</script>

<style scoped>
    .yyt-container {
        padding-top: 50rpx
    }

    .yyt-cart-list {
        width: 92%;
        height: 185rpx;
        margin: 0 auto;
        padding: 20rpx;
    }

    .yyt-conCar {
        position: relative;
        width: 90%;
        height: 185rpx;
        float: left;
    }

    .yyt-cart-sel {
        width: 10%;
        height: 185rpx;
        float: left;
    }

    .yyt-cart-pro {
        /* position: absolute;
        left: 44rpx;
        top: 135rpx; */
        width: 44rpx;
        height: 44rpx;
        margin-top: 66rpx
    }

    .yyt-cart-pro-select {
        /* position: absolute;
        left: 44rpx;
        top: 135rpx; */
        width: 45rpx;
        height: 45rpx;
        z-index: 1;
        margin-top: 66rpx
    }

    .yyt-cart-thumb {
        width: 30%;
        height: 185rpx;
        float: left;
    }

    .yyt-cart-thumb img {
        width: 150rpx;
        height: 150rpx;
        margin-left: 10rpx;
        margin-top: 16rpx
    }

    .yyt-conCar-info {
        width: 70%;
        height: 185rpx;
        float: left;
    }

    .yyt-cart-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 90rpx;
        line-height: 90rpx;
        background: #fff;
        border-top: 1rpx solid rgba(0, 0, 0, 0.1);
    }

    .yyt-total-select {
        position: absolute;
        left: 20rpx;
        top: 25rpx;
        width: 45rpx;
        height: 45rpx;
    }

    .yyt-allselect {
        margin-left: 70rpx;
        height: 90rpx;
        line-height: 90rpx
    }

    .yyt-order-icon {
        position: absolute;
        width: 200rpx;
        height: 90rpx;
        background: #d81e06;
    }

    .yyt-order-icon img,
    .yyt-order-icon navigator {
        display: block;
        width: 45rpx;
        height: 45rpx;
    }

    .yyt-cart-toatl-price {
        float: right;
        width: 250rpx;
        height: 90rpx;
        line-height: 90rpx
    }

    .yyt-cart-no-data {
        padding: 40rpx 0;
        color: #999;
        text-align: center;
    }


    .yyt-listheader {
        width: 80%;
        height: 90rpx;
    }

    .yyt-list-title {
        width: 100%;
        height: 90rpx;
        line-height: 90rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        float: left;
    }

    .yyt-list-delete {
        width: 50rpx;
        height: 50rpx;
        position: absolute;
        right: 20rpx;
        top: 20rpx
    }

    .yyt-delete-icon {
        width: 45rpx;
        height: 45rpx;
    }

    .yyt-list-footer {
        width: 96%;
        height: 90rpx;
        line-height: 90rpx;
    }

    .yyt-list-fee {
        width: 35%;
        height: 90rpx;
        float: left;
        line-height: 90rpx;
        color: #d81e06;
    }

    /* .yyt-list-num {
        width: 45%;
        height: 60rpx;
        float: left;
    } */

    /* 计数 */

    .yyt-numBox {
        position: absolute;
        right: 0;
        top: 104rpx;
        width: 220rpx;
        height: 60rpx;
    }

    .yyt-numBox .yyt-right {
        width: 220rpx;
        height: 80rpx;
        text-align: center;
        line-height: 110rpx;
        float: left;
    }

    .yyt-numBox .yyt-right .yyt-minuts {
        float: left;
        width: 60rpx;
        border: 1px solid #eee;
        height: 60rpx;
        line-height: 60rpx;
        color: #8a8a8a;
        font-size: 50rpx;
        background: #fff;
    }

    .yyt-numBox .yyt-right .yyt-num {
        float: left;
        width: 60rpx;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        height: 60rpx;
        line-height: 60rpx;
        color: #333;
        font-size: 31rpx;
    }

    .yyt-numBox .yyt-right .yyt-plus {
        float: left;
        width: 60rpx;
        border: 1px solid #eee;
        height: 60rpx;
        line-height: 60rpx;
        color: #8a8a8a;
        background: #fff;
    }

    .yyt-num-text {
        width: 70rpx;
        float: left;
        height: 70rpx;
        line-height: 70rpx;
    }

    .yyt-num-text2 {
        width: 35rpx;
        float: left;
        height: 70rpx;
        line-height: 70rpx;
    }

    .yyt-footer-left {
        width: 75%;
        height: 90rpx;
        float: left;
    }

    .yyt-footer-right {
        width: 25%;
        height: 90rpx;
        float: right;
        background: #4a86ff;
        color: #fff;
        text-align: center;
        line-height: 90rpx;
    }
    .yyt-null-go{
        width: 230rpx;
        height: 56rpx;
        margin: 0 auto;
        margin-top: 20rpx;
        line-height: 56rpx;
        text-align: center;
        background: #ffffff;
        color: #4a86ff;
        border: 1rpx solid #4a86ff;
        font-size: 27rpx;
        border-radius: 28rpx;
    }
</style>