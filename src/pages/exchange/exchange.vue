<template>
    <view class="yyt-container">
        <view class="yyt-container" v-for="(item,index) in livelist" :key="index">
            <view class="yyt-live-class" v-if="item.type == 1">
                <!-- 直播 -->
                <view class="yyt-live"
                    :style="{backgroundImage: 'url(' + item.background + ')', backgroundSize:'cover', height:'400rpx'}"
                    @click="liveclassD(item.id)">
                    <view class="yyt-teacher-bg-zz"></view>
                    <view class="yyt-live-state_1" v-show='item.live_status == 1'>未开播</view>
                    <view class="yyt-live-state" v-show='item.live_status == 2'>直播中</view>
                    <view class="yyt-live-state_1" v-show='item.live_status == 3'>已结束</view>
                    <view class="yyt-live-state" v-show='item.live_status == 4'>回放中</view>
                    <view class="yyt-live-button">
                        <view class="yyt-live-button-center">
                            <img src="static/play.png" />
                        </view>
                    </view>
                </view>
                <!-- 录播 -->
                <view class="yyt-list-l"></view>
                <view class="yyt-list-title">{{item.title}}</view>
                <!-- 老师列表 -->
                <!-- <view class="yyt-list-user">
                    <view class="user-view" v-for='(item,index) in item.anchor_id' :key="index"
                        @click="teacher(item.anchor_id)">
                        <img :src="item.avatar" />
                        <view>{{item.realname}}</view>
                    </view>
                </view> -->
                <view class="space"></view>
            </view>
            <view class="yyt-con" v-else>
                <view @click="liveDemandDetail(item.id)">
                    <img class="yyt-stateIcon" src="static/zb.png" />
                    <view class="yyt-con-title">{{ item.title }}</view>
                    <view class="yyt-con-time">开课时间：{{ item.opentime }}</view>
                    <view class="yyt-con-time">授课时长：{{ item.duration }}小时</view>
                </view>
                <view class="yyt-bottom">
                    <view class="yyt-bottom-lr">
                        <img v-for="(item, index) in item.anchor_id" :key="index" :src="item.avatar"
                            @click="teacher(item.anchor_id)" />
                    </view>
                    <view class="yyt-bottom-lr">
                        <view class="lr-class-type" v-if="item.paytype == '1'">￥{{ item.price }}</view>
                        <view class="lr-class-type" v-if="item.paytype == '2'">免费课</view>
                        <view class="lr-class-num">16人加入学习</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="example-body" v-if="livelist != ''" @click="setload">
            <uni-load-more :status="status" :content-text="contentText" color="#666" />
        </view>
        <view class="yyt-null" v-if="livelist == ''">
            <view class="yyt-null-icon">
                <img src="static/nodata.png" width="100%" alt="">
            </view>
            <view class="yyt-null-text">暂无兑换</view>
        </view>
        <!-- 兑换 -->
        <view class="yyt-exc-button">
            <view class="yyt-button-center">
                <button type="button" @click="togglePopup('bottom', 'share')">去兑换</button>
            </view>
        </view>
        <!-- 兑换框 -->
        <uni-popup ref="share" :type="type" :custom="true" @change="change">
            <view class="yyt-exc">
                <view class="yyt-exc-title">请输入兑换码</view>
                <form @submit="formSubmit">
                    <input class="yyt-exc-input" name="code" type="text">
                    <button class="submit-button" form-type="submit">兑换</button>
                </form>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import uniPopup from '@/components/uni-popup/uni-popup.vue'
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'
    import {
        requestUrl,
        STORE_ID
    } from '@/common/request.js'

    export default {
        components: {
            uniPopup,
            uniLoadMore
        },
        data() {
            return {
                status: 'more',
                contentText: {
                    contentdown: '查看更多',
                    contentrefresh: '加载中',
                    contentnomore: '没有更多啦'
                },
                livelist: [],
                store_id: '',
                page: 0,
                show: false,
                type: '',
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
        onLoad() {
            this.store_id = STORE_ID
            this.load();
        },
        methods: {
            load() {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'code_order_list',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        num: 0,
                        store_id: this.store_id,
                        type: 1
                    },
                    success: res => {
                        console.log('success', res)
                        uni.stopPullDownRefresh();
                        if (res.data.code == 1001) {
                            this.livelist = res.data.data;
                        }
                    },
                });
            },
            // 查看更多
            setload() {
                console.log(666)
                this.status = 'loading';
                var page = this.page
                page += 1;
                this.page = page
                requestUrl({
                    url: 'collect_list',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        num: page,
                        store_id: this.store_id
                    },
                    success: res => {
                        if (res.data.code == 1001) {
                            var newlivelist = res.data.data;
                            this.livelist = this.livelist.concat(newlivelist);
                            this.status = 'more';
                        }
                        if (res.data.code == 1002) {
                            this.status = 'noMore';
                            return
                        }
                    },
                });
            },
            formSubmit(e) {
                var value = e.detail.value;
                var openid = uni.getStorageSync('openid');
                if (value.code == '') {
                    uni.showToast({
                        title: '请输入兑换码',
                        mask: false,
                        duration: 2000,
                        icon: "none"
                    });
                }
                requestUrl({
                    url: 'code',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        code: value.code,
                        store_id: this.store_id,
                        account: openid
                    },
                    success: res => {
                        if (res.data.code == 1001) {
                            uni.showToast({
                                title: '兑换成功',
                                mask: false,
                                duration: 2000,
                                icon: "none"
                            });
                            this.cancel('share');
                            this.load()
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
            liveclassD(course_id) {
                uni.navigateTo({
                    url: '/pages/liveclassD/liveclassD?course_id=' + course_id
                })
            },
            togglePopup(type, open) {
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
            // 跳转直播详情
            liveclassD(e) {
                uni.navigateTo({
                    url: '/pages/liveclassD/liveclassD?course_id=' + e
                })
            },
            liveDemandDetail(e) {
                uni.navigateTo({
                    url: '/pages/livedemandD/livedemandD?course_id=' + e
                })
            },
            teacher(e) {
                uni.navigateTo({
                    url: '/pages/teacherInfo/teacherInfo?anchor_id=' + e
                })
            },
        }
    }
</script>

<style scoped>
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

    button::after {
        border: 0
    }

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
</style>