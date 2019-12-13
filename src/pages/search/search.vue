<template>
    <view class="wrapper">
        <view class="yyt-container" v-for="(item,index) in list" :key="index">
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
                <!-- 老师列表 -->
                <view class="yyt-list-title">{{item.title}}</view>
                <view class="yyt-list-user">
                    <view class="user-view" v-for='(item,index) in item.anchor_id' :key="index"
                        @click="teacher(item.anchor_id)">
                        <img :src="item.avatar" />
                        <view>{{item.realname}}</view>
                    </view>
                </view>
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
                        <view class="lr-class-num">{{ item.join_num }}人加入学习</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="yyt-null" v-if="list == ''">
            <view class="yyt-null-icon">
                <img src="static/noSearch.png" width="100%" alt="">
            </view>
            <view class="yyt-null-text">暂无搜索内容</view>
        </view>
        <view class="example-body" v-if="list != ''" @click="setload">
            <uni-load-more :status="status" :content-text="contentText" color="#666" />
        </view>
    </view>
</template>

<script>
    import {
        requestUrl,
        IMGURL,
        STORE_ID
    } from '@/common/request.js';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
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
                list: [],
                store_id: ''
            }
        },
        onLoad() {
            this.store_id = STORE_ID;
        },
        // 上拉加载
        onReachBottom() {
            this.status = 'loading';
            setTimeout(() => {
                this.setload();
            }, 300);
        },
        /**
         * 点击软键盘搜索按键触发
         */
        onNavigationBarSearchInputConfirmed(e) {
            let text = e.text;
            if (!text) {
                uni.showToast({
                    title: '请输入搜索内容',
                    mask: false,
                    duration: 2000,
                    icon: "none"
                });
                return;
            } else {
                this.searchList(text);
            }
        },
        methods: {
            // 搜索列表
            searchList(text) {
                requestUrl({
                    url: 'course_type_info',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        store_id: this.store_id,
                        num: 0,
                        title: text
                    },
                    success: res => {
                        uni.hideLoading();
                        console.log('success搜索列表', res)
                        if (res.data.code == 1001) {
                            this.list = res.data.data
                        }
                        if (res.data.code == 1002) {
                            this.list = ''
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
                    url: 'course_type_info',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        num: page,
                        store_id: this.store_id
                    },
                    success: res => {
                        console.log(res)
                        if (res.data.code == 1001) {
                            var newlist = res.data.data;
                            this.list = this.list.concat(newlist);
                            this.status = 'more';
                        }
                        if (res.data.code == 1002) {
                            this.status = 'noMore';
                            return
                        }
                    },
                });
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
        },

        /**
         *  点击导航栏 buttons 时触发
         */
        onNavigationBarButtonTap() {
            console.log('点击导航栏 buttons 时触发')
        }
    };
</script>

<style>

</style>