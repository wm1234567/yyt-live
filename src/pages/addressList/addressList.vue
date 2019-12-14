<template>
    <view class="yyt-container">
        <view class="yyt-fillOrder-address-info" v-for="(item, index) in addresslist" :key="index">
            <view class="info-name" @click="_last(index)">{{ item.realname }}</view>
            <view class="info-MA" @click="_last(index)">
                <view class="info-MA-mobile">{{ item.mobile }}</view>
                <view class="info-MA-address">{{ item.address }}</view>
            </view>
            <img class='yyt-icon_address' src="static/del.png" @click="addressDel(item.address_id)" />
            <!-- <img class='yyt-icon_edit' src="static/edit.png" @click="addressEdit(index)" /> -->
            <img class='yyt-icon_mr' v-show="item.status == 1" src="static/mr.png" />
        </view>
        <view class="yyt-exc-button">
            <view class="yyt-button-center">
                <button type="button" @click="address">新建收货地址</button>
            </view>
        </view>
        <view class="yyt-null" v-if="addresslist == ''">
            <view class="yyt-null-icon">
                <img src="static/nodata.png" width="100%" alt="">
            </view>
            <view class="yyt-null-text">您还没有收货地址哦</view>
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
                store_id: '',
                addresslist: [],
                fill: '', // 识别 是否下单页fillOrder进入
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
            this.fill = opt.fill
            this.store_id = STORE_ID;
            this.load();
        },
        onShow() {
            this.load();
        },
        methods: {
            load() {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'address_lists',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id
                    },
                    success: res => {
                        console.log('success', res)
                        if (res.data.code == 1001) {
                            this.addresslist = res.data.data;
                            uni.stopPullDownRefresh();
                        } else {
                            this.addresslist = []
                        }
                    },
                });
            },
            // 删除收货地址
            addressDel(address_id) {
                var that = this
                var openid = uni.getStorageSync('openid');
                uni.showModal({
                    content: '确定删除吗？',
                    success: function (res) {
                        console.log(res)
                        if (res.confirm) {
                            requestUrl({
                                url: 'address_del',
                                header: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                method: 'POST',
                                data: {
                                    account: openid,
                                    store_id: that.store_id,
                                    address_id: address_id
                                },
                                success: res => {
                                    console.log('success', res)
                                    if (res.data.code == 1001) {
                                        uni.showToast({
                                            title: '删除成功',
                                            mask: false,
                                            duration: 2000,
                                            icon: "none"
                                        });
                                        setTimeout(() => {
                                            that.load();
                                        }, 500)

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
                        }
                    }
                })

            },
            address() {
                uni.navigateTo({
                    url: '/pages/address/address'
                })
            },
            addressEdit(index) {
                let address = this.addresslist[index]
                this.$fire.fire('nextAddress', address);
                uni.navigateTo({
                    url: '/pages/address/address'
                })
            },
            _last(index) {
                if (this.fill == 'fill') {
                    let address = this.addresslist[index]
                    this.$fire.fire('lastAddress', address);
                    uni.navigateBack({})
                }
            }
        }
    }
</script>

<style scoped>
    .yyt-fillOrder-address-info {
        position: relative;
        width: 94%;
        height: auto;
        position: relative;
        padding: 20rpx;
        border-bottom: 1rpx solid #f4f4f4;
        overflow: hidden;
    }

    .info-name {
        width: 15%;
        height: 100rpx;
        float: left;
    }

    .info-MA {
        width: 70%;
        height: auto;
        float: left;
        padding-left: 20rpx
    }

    .info-MA-mobile {
        width: 100%;
        height: 50rpx;
        color: #666
    }

    .info-MA-address {
        width: 100%;
        height: auto;
        color: #666
    }

    .yyt-icon_address {
        position: absolute;
        top: 50rpx;
        right: 15rpx;
        width: 40rpx;
        height: 40rpx;
    }

    .yyt-icon_edit {
        position: absolute;
        top: 50rpx;
        right: 60rpx;
        width: 40rpx;
        height: 40rpx;
    }

    .yyt-icon_mr {
        position: absolute;
        top: 0rpx;
        right: 15rpx;
        width: 50rpx;
        height: 50rpx;
    }

    .yyt-exc-button {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100rpx;
    }

    .yyt-button-center {
        width: 90%;
        height: 75rpx;
        margin: 0 auto
    }

    .yyt-button-center button {
        width: 100%;
        height: 75rpx;
        line-height: 75rpx;
        font-size: 30rpx;
        background: #007AFF;
        color: #fff;
        border-radius: 40rpx
    }
</style>