<template>
    <view class="yyt-container">
        <view class="yyt-container" v-for="(item,index) in livelist" :key="index">
            <view class="yyt-live-class" v-if="item.type == 1">
                <!-- 直播 -->
                <view class="yyt-live"
                    :style="{backgroundImage: 'url(' + item.background + ')', backgroundSize:'cover', height:'400rpx'}"
                    @click="liveclassD(item.course_id)">
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
                <view @click="liveDemandDetail(item.course_id)">
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
            <view class="yyt-null-text">暂无数据</view>
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
                status: 'more',
                contentText: {
                    contentdown: '查看更多',
                    contentrefresh: '加载中',
                    contentnomore: '没有更多啦'
                },
                URL: '',
                livelist: [],
                store_id: '',
                page: 0
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
                this.setload();
            }, 300);
        },
        //初始加载
        onLoad() {
            this.URL = IMGURL;
            this.store_id = STORE_ID
            this.load();
        },
        methods: {
            load() {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'collect_list',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        num: 0,
                        store_id: this.store_id
                    },
                    success: res => {
                        console.log('success', res)
                        if (res.data.code == 1001) {
                            this.livelist = res.data.data;
                            uni.stopPullDownRefresh();
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
        }
    }
</script>

<style scoped>

</style>