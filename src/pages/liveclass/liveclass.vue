<template>
    <view class="yyt-container">
        <view class="yyt-live-class" v-for="(item,index) in livelist" :key="index">
            <!-- 直播 -->
            <view class="yyt-live"
                :style="{backgroundImage: 'url(' + item.background + ')', backgroundSize:'cover', height:'400rpx'}"
                @click="liveclassD(item.course_id)" v-if='item.type == 1'>
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
            <!-- 老师列表 -->
            <view class="yyt-list-title">{{item.title}}</view>
            <view class="yyt-list-user">
                <view class="user-view" v-for='(item,index) in item.anchor_id' :key="index"
                    @click="teacher(item.anchor_id)">
                    <img :src="item.avatar" />
                    <view>{{ item.realname }}</view>
                </view>
            </view>
            <view class="space"></view>
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
            this.store_id = STORE_ID;
            this.load();
        },
        methods: {
            load() {
                requestUrl({
                    url: 'course_lists',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        store_id: this.store_id
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
                this.status = 'loading';
                var page = this.page
                page += 1;
                this.page = page
                requestUrl({
                    url: 'course_lists',
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
            liveclassD(course_id) {
                uni.navigateTo({
                    url: '/pages/liveclassD/liveclassD?course_id=' + course_id
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

</style>