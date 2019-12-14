<template>
    <view class="yyt-container">
        <form @submit="formSubmit">
            <view class="yyt-address">
                <view class="yyt-address-title">收货人：</view>
                <input class="yyt-address-info" name="name" :value="addressInfo.realname" type="text">
            </view>
            <view class="yyt-address">
                <view class="yyt-address-title">联系电话：</view>
                <input class="yyt-address-info" name="mobile" type="text">
            </view>
            <view class="yyt-address">
                <view class="yyt-address-select-title">
                    <view class="select-title">省 级：</view>
                    <view class="select-title">市 级：</view>
                    <view class="select-title">区 级：</view>
                </view>
                <view class="yyt-address-select">
                    <select v-model="prov">
                        <option v-for="(item,index) in arr" :key="index" :value="item.text">
                            {{ item.text }}
                        </option>

                    </select>
                    <select v-model="city">
                        <option v-for="item in cityArr" :key="item.value" :value="item.text">
                            {{ item.text }}
                        </option>
                    </select>
                    <select v-model="district">
                        <option v-for="item in districtArr" :key="item.value" :value="item.text">
                            {{ item.text }}
                        </option>
                    </select>
                </view>
            </view>
            <view class="yyt-address">
                <view class="yyt-address-title">详细地址：</view>
                <input class="yyt-address-info" name="addressD" type="text">
            </view>
            <view class="yyt-exc-button">
                <view class="yyt-button-center">
                    <button type="button" form-type="submit">确定</button>
                </view>
            </view>
            <view class="yyt-address">
                <view class="yyt-address-title">默认地址：</view>
                <view class="yyt-address-info">
                    <switch :checked="checked" @change="switch1Change" />
                </view>
            </view>
        </form>
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
                checked: false,
                status: '',
                arr: [], //省市区数据
                prov: '', //省名绑定
                city: '', //市级绑定
                district: '', //区级绑定
                cityArr: [], //市级数据
                districtArr: [], //区级数据
                pdata: '',
                cdata: '',
                adata: '',
                addressInfo: {},
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.load();
        },
        // 上拉加载
        // onReachBottom() {
        //     console.log("onReachBottom");
        //     this.status = 'loading';
        //     setTimeout(() => {
        //         this.load();
        //     }, 300);
        // },

        //初始加载
        onLoad(opt) {
            let that = this
            this.$fire.on('nextAddress', res => {
                console.log(res.realname)
                that.addressInfo = res;
                console.log(that.addressInfo)
            })
            this.store_id = STORE_ID;
            this.load();
        },

        watch: {
            prov() {
                this.updateCity();
                this.updateDistrict();
            },
            city() {
                this.updateDistrict();
            },
            district() {
                this.updateArea();
            }
        },
        methods: {
            load() {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'area',
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
                            this.arr = res.data.data;
                            uni.stopPullDownRefresh();
                        }
                    },
                });
            },
            formSubmit(e) {
                var openid = uni.getStorageSync('openid');
                var val = e.detail.value;
                var TELRGE = /^[1][3,4,5,7,8][0-9]{9}$/;
                var address = this.prov + this.city + this.district + val.addressD;
                if (this.status == '') {
                    var status = '2'
                } else {
                    var status = this.status
                }
                if (val.name == '') {
                    uni.showToast({
                        title: '请填写收货人姓名',
                        mask: false,
                        duration: 2000,
                        icon: "none"
                    });
                    return
                }
                if (val.mobile == '') {
                    uni.showToast({
                        title: '请填写手机号',
                        mask: false,
                        duration: 2000,
                        icon: "none"
                    });
                    return
                }
                if (!TELRGE.test(val.mobile)) {
                    uni.showToast({
                        title: '手机号码格式错误',
                        mask: false,
                        duration: 2000,
                        icon: "none"
                    });
                    return;
                }
                if (this.prov == '') {
                    uni.showToast({
                        title: '请选择收货地区',
                        mask: false,
                        duration: 2000,
                        icon: "none"
                    });
                    return
                }
                if (val.addressD == '') {
                    uni.showToast({
                        title: '请填写详细地址',
                        mask: false,
                        duration: 2000,
                        icon: "none"
                    });
                    return
                }
                requestUrl({
                    url: 'address_add',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id, //门店ID
                        realname: val.name, //收货人
                        mobile: val.mobile, //联系电话
                        province: this.pdata, //省级value
                        province_name: this.prov, //省级名称
                        city: this.cdata, //市级value
                        city_name: this.city, //市级名称
                        district: this.adata, //区级value
                        district_name: this.district, //区级名称
                        address: address, //完整地址
                        status: status, // 是否为默认地址 1为默认 2普通
                    },
                    success: res => {
                        console.log('success', res)
                        if (res.data.code == 1001) {
                            uni.showToast({
                                title: '添加成功',
                                mask: false,
                                duration: 2000,
                                icon: "none"
                            });
                            setTimeout(() => {
                                uni.navigateBack({})
                            }, 1000)
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
            // 匹配省级 联动市级
            updateCity() {
                for (var i in this.arr) {
                    var obj = this.arr[i];
                    if (obj.text == this.prov) {
                        this.pdata = obj.value;
                        this.cityArr = obj.children;
                        break;
                    }
                }
                this.city = this.cityArr[0].text;
            },
            // 匹配市级 联动区级
            updateDistrict() {
                for (var i in this.cityArr) {
                    var obj = this.cityArr[i];
                    if (obj.text == this.city) {
                        this.cdata = obj.value;
                        this.districtArr = obj.children;
                        break;
                    }
                }
                if (this.districtArr && this.districtArr.length > 0 && this.districtArr[0].text) {
                    this.district = this.districtArr[0].text;
                } else {
                    this.district = '';
                }
            },
            // 监听区级 获取value
            updateArea() {
                for (var i in this.districtArr) {
                    var obj = this.districtArr[i];
                    if (obj.text == this.district) {
                        this.adata = obj.value;
                        break;
                    }
                }
            },
            // 设置默认地址
            switch1Change: function (e) {
                console.log('switch1 发生 change 事件，携带值为', e.target.value)
                if (e.target.value) {
                    this.status = '1'
                } else {
                    this.status = '2'
                }
            },

        }
    }
</script>

<style scoped>
    .yyt-address {
        width: 95%;
        height: auto;
        padding: 20rpx;
        border-bottom: 1rpx solid #f4f4f4;
        overflow: hidden;
    }

    .yyt-address-title {
        width: 25%;
        height: 70rpx;
        line-height: 70rpx;
        float: left;
        font-size: 30rpx;
    }

    .yyt-address-info {
        width: 65%;
        height: 70rpx;
        line-height: 70rpx;
        float: left;
    }

    .yyt-address-select {
        width: 70%;
        height: auto;
        float: left;
    }

    .yyt-address-select-title {
        width: 20%;
        height: 210rpx;
        float: left;
    }

    .select-title {
        width: 100%;
        height: 70rpx;
        line-height: 70rpx;
        font-size: 30rpx
    }

    select {
        width: 100%;
        height: 70rpx;
        border: none;
        background: #fff;
        /* appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none; */
        font-size: 30rpx
    }

    select:focus {
        outline: none;
    }
    option{
        background: #fff
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