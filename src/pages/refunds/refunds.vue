<template>
    <view class="yyt-container">
        <form @submit="formSubmit">
            <view class="yyt-submit-info">
                <view class="yyt-submit-info-title">快递公司：</view>
                <picker class="yyt-submit-info-picker" @change="bindPickerChange" :value="index" :range="array"
                    range-key="name">
                    <view class="uni-input">{{array[index].name}}</view>
                </picker>
            </view>
            <view class="yyt-submit-info">
                <view class="yyt-submit-info-title">快递单号：</view>
                <input class="yyt-submit-info-input" type="text">
            </view>
            <view class="yyt-submit">
                <button form-type="submit" :loading="loadingFLg" :disabled="disabledFlg">提交</button>
            </view>
        </form>
    </view>
</template>

<script>
    import uniRate from '@/components/uni-rate/uni-rate.vue'
    import {
        requestUrl,
        STORE_ID
    } from '@/common/request.js'
    export default {
        components: {
            uniRate
        },
        data() {
            return {
                array: [{
                    name: '顺丰速运'
                }, {
                    name: '百世快递'
                }, {
                    name: '中通快递'
                }, {
                    name: '申通快递'
                },{
                    name: '圆通速递'
                }, {
                    name: '韵达速递'
                }, {
                    name: '邮政快递包裹'
                }],
                index: 0,
                loadingFLg: false,
                disabledFlg: false,
                URL: '',
                imgist: [],
                store_id: '',
                items_id: '',
                refund_express_id:'' //快递公司名
            }
        },

        onLoad(opt) {
            this.store_id = STORE_ID;
            this.items_id = opt.items_id
        },
        methods: {
            formSubmit(e) {
                var openid = uni.getStorageSync('openid');
                if (e.detail.value.content == '') {
                    uni.showToast({
                        title: '请填写',
                        mask: false,
                        duration: 2000,
                        icon: "none"
                    });
                    return
                }
                this.disabledFlg = true;
                this.loadingFLg = true;
                requestUrl({
                    url: 'shop_order_refund_send',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        items_id: this.items_id,
                        refund_express_id: this.refund_express_id, //快递公司
                        refund_express_no: 666, //快递单号
                    },
                    success: res => {
                        console.log('success', res)
                        this.disabledFlg = true;
                        this.loadingFLg = true;
                        if (res.data.code == 1001) {
                            uni.showToast({
                                title: '提交成功',
                                mask: false,
                                duration: 2000,
                                icon: "none"
                            });
                            setTimeout(() => {
                                uni.navigateBack({})
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

            },
            bindPickerChange: function (e) {
                var index = e.target.value
                this.index = index;
                this.refund_express_id = this.array[index].name
            },
        }
    }
</script>

<style scoped>
    .yyt-submit-info {
        width: 95%;
        height: 80rpx;
        margin: 0 auto;
        margin-top: 15rpx;
        border: 1rpx solid #f4f4f4;
        border-radius: 10rpx
    }

    .yyt-submit-info-title {
        width: 25%;
        height: 80rpx;
        float: left;
        line-height: 80rpx;
        padding-left: 10rpx
    }

    .yyt-submit-info-picker {
        width: 70%;
        height: 80rpx;
        float: left;
    }

    .yyt-submit-info-input {
        width: 65%;
        height: 80rpx;
        float: left;
        padding-left: 22rpx
    }

    .yyt-submit {
        width: 95%;
        height: 80rpx;
        margin: 0 auto;
        margin-top: 50rpx
    }

    .yyt-submit button {
        width: 100%;
        height: 80rpx;
        background: orange;
        color: #fff;
        text-align: center;
        line-height: 80rpx;
        font-size: 32rpx
    }

    button::after {
        border: none;
    }
</style>