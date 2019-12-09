<template>
    <view class="yyt-container">
        <view class="navli" v-for="(item,index) in navList" :key="index" :class="{'active':nowIndex === index}"
            @click="tabClick(index)"><i>{{ item.title }}</i>
        </view>
        <!-- 商品列表 -->
        <view v-if="nowIndex != 4">
            <view class='com' v-for='(item, index) in orderlist' :key='"key-" + index'>
                <view class='shop'>
                    <view class='shop-list' v-for='(itemShop, index) in item.shop' :key='"keyShop-" + index'>
                        <view class='list-img'>
                            <img :src='itemShop.shop_pic' />
                        </view>
                        <view class='list-title'>
                            <view class="list-title-tit">{{ itemShop.title }}</view>
                            <view class="list-title-tq" v-show="itemShop.status == 2"
                                @click="shop_order_refund(itemShop.items_id, itemShop.order_id)">退款</view>
                            <view class="list-title-tq" v-show="itemShop.status == 3 && itemShop.refund_status == 1"
                                @click="shop_order_refund(itemShop.items_id, itemShop.order_id)">退款</view>
                            <view class="list-title-ok" v-show="itemShop.status == 3 && itemShop.refund_status == 2"
                                @click="shop_order_refund_send(itemShop.items_id)">买家发货</view>
                            <view class="list-title-tq" v-show="itemShop.status == 3 && itemShop.refund_status == 3">已拒绝</view>
                            <view class="list-title-ok" v-show="itemShop.status == 3 && itemShop.refund_status == 4">买家已发货</view>
                            <view class="list-title-ok" v-show="itemShop.status == 3"
                                @click="getOrder(itemShop.items_id)">确认收货</view>
                            <view class="list-title-ok" v-show="itemShop.status == 4 && itemShop.appraise_status == 1"
                                @click="evaluation(itemShop.items_id, itemShop.items_id)">待评价</view>
                            <view class="list-title-ypl" v-show="itemShop.status == 4 && itemShop.appraise_status == 2">
                                已评价</view>
                        </view>
                        <view class='list-num'>
                            <view class='num-fee'>￥{{ itemShop.price }}</view>
                            <view class='num-count'>x {{ itemShop.num }}</view>
                        </view>
                    </view>
                </view>
                <view class='orderlist-footer-more' v-show="item.showFlg" @click="moreInfo(index)">收起</view>
                <view class='orderlist-footer-more' v-show="!item.showFlg" @click="moreInfo(index)">展开</view>
                <view class="show" v-show="item.showFlg">
                    <view class='orderlist-footer'>
                        <view class='footer-left'>实付</view>
                        <view class='footer-right'><span>￥{{ item.money }}</span></view>
                    </view>
                    <view class='orderlist-footer'>
                        <view class='footer-left'>订单编号</view>
                        <view class='footer-right'>{{ item.number }}</view>
                    </view>
                    <view class='orderlist-footer'>
                        <view class='footer-left'>下单时间</view>
                        <view class='footer-right'>{{ item.creation_date }}</view>
                    </view>
                </view>
                <view class='footer-button' v-if="item.status == 1">
                    <view class='button-right'>
                        <view class='button-pay' v-show="item.status == 1" @click="pay(item.order_id)">支付</view>
                        <view class='button' v-show="item.status == 1" @click="closeOrder(item.order_id)">取消订单</view>
                    </view>
                </view>
                <view class='space'></view>
            </view>
            <view class="yyt-null" v-if="orderlist == ''">
                <view class="yyt-null-icon">
                    <img src="static/nodata.png" width="100%" alt="">
                </view>
                <view class="yyt-null-text">暂无相关订单</view>
            </view>
            <view class="example-body" v-if="orderlist != ''" @click="setload">
                <uni-load-more :status="statusLoad" :content-text="contentText" color="#666" />
            </view>
        </view>
        <view v-if="nowIndex == 4">
            <view class='com' v-for='(itemShop, index) in refundorderlist' :key='"key-refund-" + index'>
                <view class='shop'>
                    <view class='shop-list'>
                        <view class='list-img'>
                            <img :src='itemShop.shop_pic' />
                        </view>
                        <view class='list-title'>
                            <view class="list-title-tit">{{ itemShop.title }}</view>
                            <view class="list-title-ypl" v-show="itemShop.status == 7"><span>已退款</span></view>
                        </view>
                        <view class='list-num'>
                            <view class='num-fee'>￥{{ itemShop.price }}</view>
                            <view class='num-count'>x {{ itemShop.num }}</view>
                        </view>
                    </view>
                </view>
                <view class='space'></view>
            </view>
            <view class="yyt-null" v-if="refundorderlist.length == 0">
                <view class="yyt-null-icon">
                    <img src="static/nodata.png" width="100%" alt="">
                </view>
                <view class="yyt-null-text">暂无相关订单</view>
            </view>
            <view class="example-body" v-if="refundorderlist.length != 0" @click="setrefund">
                <uni-load-more :status="statusLoad" :content-text="contentText" color="#666" />
            </view>
        </view>
    </view>
</template>

<script>
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
    import {
        requestUrl,
        IMGURL,
        STORE_ID
    } from '@/common/request.js'

    export default {
        components: {
            uniLoadMore
        },
        data() {
            return {
                statusLoad: 'more',
                contentText: {
                    contentdown: '查看更多',
                    contentrefresh: '加载中',
                    contentnomore: '没有更多啦'
                },
                page: 0,
                navList: [{
                    title: '待支付'
                }, {
                    title: '待发货'
                }, {
                    title: '待收货'
                }, {
                    title: '已完成'
                }, {
                    title: '退款单'
                }],
                nowIndex: 0, //选择卡索引
                URL: '',
                store_id: '',
                orderlist: [], //订单列表
                refundorderlist: [], //退款订单列表
                status: 1, //订单状态
            }
        },
        onPullDownRefresh() {
            this.load()
        },
        // 上拉加载
        onReachBottom() {
            console.log("onReachBottom");
            this.statusLoad = 'loading';
            setTimeout(() => {
                if (this.nowIndex == 4) {
                    this.setrefund()
                } else {
                    this.setload()
                }
            }, 300);
        },
        onLoad() {
            this.store_id = STORE_ID;
            this.URL = IMGURL;
            this.load()
        },
        onShow() {
            this.load()
        },
        methods: {
            load() {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'shop_order_lists',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        num: 0,
                        status: this.status
                    },
                    success: res => {
                        console.log('订单', res)
                        uni.stopPullDownRefresh();
                        if (res.data.code == 1001) {
                            var orderlist = res.data.data;
                            for (let i in orderlist) {
                                orderlist[i].showFlg = false;
                            }
                            this.orderlist = orderlist;
                        } else {
                            this.orderlist = ''
                        }
                    },
                });
            },
            // 取消订单
            closeOrder(order_id) {
                var openid = uni.getStorageSync('openid');
                var that = this;
                uni.showModal({
                    content: '确定取消该订单吗',
                    showCancel: true,
                    success: function (res) {
                        if (res.confirm) {
                            requestUrl({
                                url: 'shop_order_del',
                                header: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                method: 'POST',
                                data: {
                                    account: openid,
                                    store_id: that.store_id,
                                    order_id: order_id
                                },
                                success: res => {
                                    if (res.data.code == 1001) {
                                        uni.showToast({
                                            title: '取消成功',
                                            mask: false,
                                            duration: 2000,
                                            icon: "none"
                                        });
                                        that.load(1)
                                    } else {
                                        uni.showToast({
                                            title: res.data.message,
                                            mask: false,
                                            duration: 2000,
                                            icon: "none"
                                        });
                                    }
                                },
                            });
                        } else if (res.cancel) {}
                    }
                });
            },
            // 订单支付
            pay(order_id) {
                var openid = uni.getStorageSync('openid');
                var that = this
                requestUrl({
                    url: 'shop_order_pay',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        order_id: order_id,
                        pay_type: 1
                    },
                    success: res => {
                        console.log('订单支付', res)
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
                                            that.load()
                                        }, 500)

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
            // 确认收货
            getOrder(items_id) {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'shop_order_send',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        items_id: items_id
                    },
                    success: res => {
                        if (res.data.code == 1001) {
                            uni.showToast({
                                title: '收货成功',
                                mask: false,
                                duration: 2000,
                                icon: "none"
                            });
                            this.load()
                        } else {
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

            // 退款订单列表
            shop_order_refund_lists() {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'shop_order_refund_lists',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        num: 0,
                    },
                    success: res => {
                        console.log('退款订单', res)
                        if (res.data.code == 1001) {
                            this.refundorderlist = res.data.data;
                        } else {
                            this.refundorderlist = ''
                        }
                    },
                });
            },
            // 查看更多
            setload() {
                this.statusLoad = 'loading';
                var openid = uni.getStorageSync('openid');
                var page = this.page
                page += 1;
                this.page = page
                requestUrl({
                    url: 'shop_order_lists',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        num: page,
                        status: this.status
                    },
                    success: res => {
                        if (res.data.code == 1001) {
                            var neworderlist = res.data.data;
                            this.orderlist = this.orderlist.concat(neworderlist);
                            this.statusLoad = 'more';
                        }
                        if (res.data.code == 1002) {
                            this.statusLoad = 'noMore';
                            return
                        }
                    },
                });
            },
            // 查看更多退款列表
            setrefund() {
                this.statusLoad = 'loading';
                var openid = uni.getStorageSync('openid');
                var page = this.page
                page += 1;
                this.page = page
                requestUrl({
                    url: 'shop_order_refund_lists',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        num: page,
                        status: this.status
                    },
                    success: res => {
                        if (res.data.code == 1001) {
                            var newreFundOrderlist = res.data.data;
                            this.refundorderlist = this.refundorderlist.concat(newreFundOrderlist);
                            this.statusLoad = 'more';
                        }
                        if (res.data.code == 1002) {
                            this.statusLoad = 'noMore';
                            return
                        }
                    },
                });
            },
            // 跳转订单退款
            shop_order_refund(items_id, order_id) {
                uni.navigateTo({
                    url: '/pages/refund/refund?items_id=' + items_id + '&order_id=' + order_id
                })
            },
            // 跳转订单退货退款
            shop_order_refund_send(items_id) {
                uni.navigateTo({
                    url: '/pages/refunds/refunds?items_id=' + items_id
                })
            },
            // 选项卡切换
            tabClick(index) {
                this.page = 0;
                this.statusLoad = 'more';
                this.nowIndex = index;
                console.log(this.nowIndex)
                this.status = index + 1;
                if (index == 4) {
                    this.shop_order_refund_lists()
                } else {
                    this.load()
                }
            },
            // 查看收起
            moreInfo(index) {
                var showFlg = this.orderlist[index].showFlg;
                this.orderlist[index].showFlg = !showFlg;
            },
            // 跳转评价
            evaluation(items_id, shop_id) {
                uni.navigateTo({
                    url: '/pages/evaluation/evaluation?items_id=' + items_id + '&shop_id=' + shop_id
                })
            },
        }
    }
</script>

<style scoped>
    .navli {
        width: 20%;
        height: 90rpx;
        line-height: 90rpx;
        text-align: center;
        display: inline-block;
    }

    .navli i {
        font-style: normal;
        font-size: 28rpx;
    }

    .active {
        color: #007AFF;
        font-weight: bold;
        background: url('/static/active.jpg') no-repeat;
        background-position: bottom ;
    }

    .null {
        text-align: center;
    }

    .space {
        width: 100%;
        height: 20rpx;
    }

    .orderlist-header {
        width: 100%;
        height: 90rpx;
        background: #fff;
        /* border: 1rpx solid rgba(0, 0, 0, 0.1); */
    }

    .order-num {
        width: 50%;
        height: 90rpx;
        float: left;
        line-height: 90rpx;
        padding-left: 15rpx;
        font-size: 27rpx;
        color: #666
    }

    .header-r {
        float: right;
        height: 90rpx;
        line-height: 90rpx;
        font-size: 27rpx;
        padding-right: 15rpx;
    }

    /* 商品列表 */
    .com {
        width: 100%;
        margin: 0 auto;
        height: auto;
    }

    .com-img {
        width: 100%;
        height: 1200rpx;
    }

    .shop {
        width: 95%;
        height: auto;
        margin: 0 auto;
        background: #fff;
        border-top: 1rpx solid rgba(0, 0, 0, 0.1);
    }

    .shop-list {
        width: 100%;
        height: 160rpx;
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
        background: #fff;
    }

    .list-img {
        width: 20%;
        height: 130rpx;
        float: left;
    }

    .list-img img {
        width: 120rpx;
        height: 120rpx;
        margin: 19rpx 0 0 0;
    }

    .list-title {
        width: 60%;
        height: 160rpx;
        float: left;
    }

    .list-title-tit {
        width: 100%;
        height: 85rpx;
        line-height: 70rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap
    }

    .list-title-tq {
        width: 130rpx;
        height: 46rpx;
        text-align: center;
        line-height: 46rpx;
        font-size: 20rpx;
        color: #d81e06;
        border: #d81e06 1rpx solid;
        border-radius: 10rpx;
        float: left;
        margin-right: 10rpx
    }

    .list-title-ok {
        width: 130rpx;
        height: 46rpx;
        text-align: center;
        line-height: 46rpx;
        font-size: 20rpx;
        color: #007AFF;
        border: #007AFF 1rpx solid;
        border-radius: 10rpx;
        float: left;
        margin-right: 10rpx
    }

    .list-title-ypl {
        width: 130rpx;
        height: 46rpx;
        text-align: center;
        line-height: 46rpx;
        font-size: 20rpx;
        color: #8a8a8a;
        border: #8a8a8a 1rpx solid;
        border-radius: 10rpx;
        float: left;
        margin-right: 10rpx
    }

    .list-num {
        width: 20%;
        height: 130rpx;
        float: left;
    }

    .num-fee {
        margin-top: 20rpx;
        color: #d81e06;
        font-size: 27rpx;
        padding-right: 20rpx;
        text-align: right
    }

    .num-count {
        float: right;
        margin-right: 20rpx;
        font-size: 25rpx;
        color: #666
    }

    .orderlist-footer-more {
        width: 95%;
        height: 90rpx;
        line-height: 90rpx;
        margin: 0 auto;
        background: #fff;
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
        text-align: center;
        color: #666;
        font-size: 25rpx
    }

    .orderlist-footer {
        width: 95%;
        height: 90rpx;
        margin: 0 auto;
        background: #fff;
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
    }

    .footer-right {
        height: 90rpx;
        line-height: 90rpx;
        float: right;
        padding-right: 15rpx;
        font-size: 26rpx;
        color: #666
    }

    .footer-right span {
        color: #d81e06
    }

    .footer-left {
        height: 90rpx;
        line-height: 90rpx;
        float: left;
        padding-left: 15rpx;
        width: 30%;
        font-size: 26rpx;
        color: #666
    }

    .footer-button {
        width: 95%;
        height: 90rpx;
        margin: 0 auto;
        background: #fff;
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
    }

    .button-right {
        width: 60%;
        height: 90rpx;
        float: right;
        padding-top: 15rpx;
        margin-right: 10rpx
    }

    .button {
        width: 30.5%;
        height: 50rpx;
        float: right;
        margin: 0 auto;
        text-align: center;
        border: 1rpx solid rgba(0, 0, 0, 0.3);
        border-radius: 10rpx;
        padding-top: 6rpx;
        line-height: 46rpx;
        font-size: 24rpx;
        margin-right: 10rpx;
        color: #666
    }

    .button-pay {
        width: 30.5%;
        height: 50rpx;
        float: right;
        margin: 0 auto;
        text-align: center;
        color: #007AFF;
        border: 1rpx solid #007AFF;
        border-radius: 10rpx;
        padding-top: 6rpx;
        line-height: 46rpx;
        font-size: 24rpx;
    }

    .button-tq {
        width: 30.5%;
        height: 50rpx;
        float: right;
        margin: 0 auto;
        text-align: center;
        color: #d81e06;
        border: 1rpx solid #d81e06;
        border-radius: 10rpx;
        padding-top: 6rpx;
        line-height: 46rpx;
        font-size: 24rpx;
        margin-right: 10rpx;
    }
</style>