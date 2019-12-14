<template>
    <view class="yyt-container">
        <view class="yyt-fillOrder-address-info" @click="addressList">
            <view class="info-name">{{ addressInfo.realname }}</view>
            <view class="info-MA" v-if="addressInfo">
                <view class="info-MA-mobile">{{ addressInfo.mobile }}</view>
                <view class="info-MA-address">{{ addressInfo.address }}</view>
            </view>
            <view class="info-MA" v-else>
                <view class="info-MA-add-address">添加收货地址</view>
            </view>
            <view class='yyt-icon_address'></view>
        </view>
        <view class="space"></view>
        <view class="yyt-fillOrder-list" v-for="(item, index) in fillOrderInfo.shop" :key="index">
            <view class="list-img">
                <img :src="item.shop_pic" />
            </view>
            <view class="list-info">
                <view class="list-info-title">{{ item.title }}</view>
                <view class="list-info-fee">￥{{ item.price }}</view>
            </view>
            <view class="list-num">
                <view>x {{ item.num }}</view>
            </view>
        </view>
        <view class="space"></view>
        <view class="space-my"></view>
        <view class="yyt-fillOrder-nums">
            <view class="yyt-fillOrder-nums-info">
                <view class="nums-t">金额总计</view>
                <view class="nums-t">
                    <view class="fee">￥{{ allPrice }}</view>
                </view>
            </view>
        </view>
        <view class="space"></view>
        <view class="yyt-fillOrder-footer">
            <view class="yyt-fillOrder-footer-allfee">应付
                <text>￥{{ allPrice }}</text>
            </view>
            <view class="yyt-fillOrder-footer-botton">
                <button :loading="loadingFLg" :disabled="disabledFlg" @click="pay">结算</button>
            </view>
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
                shop_id: '', //商品ID
                num: '', //数量
                fillOrderInfo: {}, //商品信息
                allPrice: '', //总价
                store_id: '', //商户ID
                type: '', // 类型区分 单商品还是购物车多商品
                trolley_id: '', //购物车ID
                addressInfo: {}, //地址
                items: [], //购物车 提交信息
                shop_items: [], //单商品提交信息
                loadingFLg: false,
                disabledFlg: false,
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.load();
        },
        // 上拉加载
        onReachBottom() {
            console.log("onReachBottom");
            this.status = 'loading';
            setTimeout(() => {
                this.load();
            }, 300);
        },

        //初始加载
        onLoad(opt) {
            console.log(opt)
            this.allPrice = opt.allPrice;
            this.type = opt.type;
            this.store_id = STORE_ID;
            if (opt.shop_id && opt.num) {
                this.shop_id = opt.shop_id;
                this.num = opt.num;
                this.load();
            }
            if (opt.trolley_id) {
                this.trolley_id = opt.trolley_id;
                this.loadTrolley();
            }
        },
        onShow() {
            this.$fire.on('lastAddress', res => {
                this.addressInfo = res
            })
        },
        methods: {
            // 单个商品下单详情
            load() {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'order_info',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        type: this.type,
                        shop_id: this.shop_id,
                        num: this.num,
                        address_id: ''
                    },
                    success: res => {
                        console.log('单个商品订单详情', res)
                        if (res.data.code == 1001) {
                            this.fillOrderInfo = res.data.data;
                            this.addressInfo = res.data.data.address
                        }
                    },
                });
            },
            // 购物车下单详情
            loadTrolley() {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'order_info',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        type: this.type,
                        trolley_id: this.trolley_id,
                        address_id: ''
                    },
                    success: res => {
                        console.log('购物车订单详情', res)
                        if (res.data.code == 1001) {
                            this.fillOrderInfo = res.data.data;
                            this.addressInfo = res.data.data.address
                        }
                    },
                });
            },
            // 下单
            pay() {
                if (!this.addressInfo) {
                    uni.showToast({
                        title: '请添加收货地址',
                        mask: false,
                        duration: 2000,
                        icon: "none"
                    });
                    return;
                }
                this.disabledFlg = true;
                this.loadingFLg = true;

                var openid = uni.getStorageSync('openid');
                if (this.type == 1) {
                    let obj = {
                        shop_id: this.shop_id,
                        num: this.num
                    }
                    this.items.push(obj)
                    var items = JSON.stringify(this.items)
                }
                if (this.type == 2) {
                    var items = this.fillOrderInfo.shop;
                    for (let i in items) { //提炼购物车数据
                        let obj = {
                            num: items[i].num,
                            shop_id: items[i].shop_id,
                            trolley_id: items[i].trolley_id
                        }
                        this.shop_items.push(obj)
                    }
                    var items = JSON.stringify(this.shop_items)
                }

                requestUrl({
                    url: 'shop_order_add',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        name: this.addressInfo.realname,
                        mobile: this.addressInfo.mobile,
                        address: this.addressInfo.address,
                        province: this.addressInfo.province,
                        city: this.addressInfo.city,
                        district: this.addressInfo.district,
                        all_money: this.allPrice,
                        money: this.allPrice,
                        type: this.type,
                        items: items
                    },
                    success: res => {
                        console.log('订单提交', res)
                        this.disabledFlg = false;
                        this.loadingFLg = false;
                        if (res.data.code == 1001) {
                            var paystr = res.data.data.jsApiParameters;
                            // var pay = eval('(' + paystr + ')');
                            var pay = JSON.parse(paystr);
                            console.log(pay)
                            WeixinJSBridge.invoke( //支付
                                'getBrandWCPayRequest', {
                                    timeStamp: pay.timeStamp, // 支付签名时间戳
                                    appId: pay.appId, // 商户appId
                                    nonceStr: pay.nonceStr, // 支付签名随机串，不长于 32 位
                                    package: pay.package, // 统一支付接口返回的prepay_id参数值
                                    signType: 'MD5', // 签名方式使用新版支付需传入'MD5'
                                    paySign: pay.paySign, // 支付签名
                                },
                                function (res) {
                                    console.log(res)
                                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                                        // 使用以上方式判断前端返回,微信团队郑重提示：
                                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                                        setTimeout(() => {
                                            uni.showToast({
                                                title: '支付成功',
                                                mask: false,
                                                duration: 2000,
                                                icon: "none"
                                            });
                                        }, 300)
                                        setTimeout(() => {
                                            uni.navigateTo({
                                                url: '/pages/order/order'
                                            })
                                        }, 1000)

                                    }
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
            addressList() {
                uni.navigateTo({
                    url: '/pages/addressList/addressList?fill=' + 'fill'
                })
            },

        }
    }
</script>

<style scoped>
    .yyt-fillOrder-address {
        width: 100%;
        height: 90rpx;
        background: #d5e3ff;
        color: #4986ff;
        line-height: 90rpx;
        text-align: center;
    }

    .yyt-fillOrder-address-info {
        width: 92%;
        height: auto;
        background: #ffffff;
        color: #666;
        position: relative;
        padding: 30rpx;
        overflow: hidden;
    }

    .info-name {
        width: 15%;
        height: 100rpx;
        float: left;
    }

    .info-MA {
        width: 80%;
        height: 100rpx;
        float: left;
    }

    .info-MA-add-address {
        width: 80%;
        height: 100rpx;
        line-height: 100rpx;
        color: #4986ff;
        padding-left: 160rpx
    }

    .info-MA-mobile {
        width: 100%;
        height: 40rpx;
    }

    .info-MA-address {
        width: 100%;
        height: 60rpx
    }

    .yyt-fillOrder-list {
        width: 92%;
        height: 120rpx;
        padding: 30rpx;
    }

    .list-img {
        width: 20%;
        height: 120rpx;
        float: left;
    }

    .list-img img {
        width: 120rpx;
        height: 120rpx;
    }

    .list-info {
        width: 62%;
        height: 120rpx;
        float: left;
    }

    .list-num {
        width: 10%;
        height: 120rpx;
        float: left;
    }

    .list-num view {
        float: right;
        margin-top: 45rpx;
    }

    .list-info-title {
        width: 100%;
        height: 80rpx;
        color: #333;
    }

    .list-info-fee {
        width: 100%;
        height: 40rpx;
        color: #fb4f6c;
        line-height: 40rpx;
    }

    .yyt-vipPay_ {
        width: 100%;
        height: 90rpx;
        background: #fff;
        position: relative;
    }

    .yyt-icon_ {
        position: absolute;
        top: 40rpx;
        right: 40rpx;
        width: 15rpx;
        height: 15rpx;
        border-top: 1px solid #363636;
        border-right: 1px solid #363636;
        transform: rotate(45deg);
    }

    .yyt-icon_address {
        position: absolute;
        top: 77rpx;
        right: 40rpx;
        width: 15rpx;
        height: 15rpx;
        border-top: 1px solid #666;
        border-right: 1px solid #666;
        transform: rotate(45deg);
    }

    .yyt-btn_ {
        width: 100%;
        height: 75rpx;
        line-height: 75rpx;
        float: left;
        margin-right: 30rpx;
        padding-left: 30rpx;
        color: #333;
    }

    .yyt-fillOrder-nums {
        width: 92%;
        height: 70rpx;
        padding: 30rpx;
    }

    .yyt-fillOrder-nums-info {
        width: 100%;
        height: 70rpx;
        float: left;
    }

    .nums-t {
        width: 46%;
        height: 70rpx;
        line-height: 70rpx;
        float: left;
    }

    .fee {
        height: 70rpx;
        line-height: 70rpx;
        float: right;
        color: #fb4f6c;
    }

    .yyt-fillOrder-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        background: #fff;
        border-top: 1rpx solid rgba(0, 0, 0, 0.1);
    }

    .yyt-fillOrder-footer-allfee {
        width: 56%;
        height: 100rpx;
        line-height: 100rpx;
        padding-left: 30rpx;
        float: left;
    }

    .yyt-fillOrder-footer-botton {
        width: 40%;
        height: 100rpx;
        float: left;
    }

    .yyt-fillOrder-footer-allfee text {
        color: #fb4f6c;
        font-size: 30rpx;
    }

    .yyt-fillOrder-footer-botton button {
        width: 70%;
        height: 70rpx;
        margin: 0 auto;
        background: #4986ff;
        color: #fff;
        text-align: center;
        line-height: 75rpx;
        margin-top: 15rpx;
        border-radius: 40rpx;
        font-size: 30rpx
    }
</style>