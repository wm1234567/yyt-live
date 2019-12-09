<template>
    <view class="yyt-container">
        <view class="yyt-topspace"></view>
        <view class="yyt-con" v-for="(item,index) in livedemandlist" :key="index">
            <view @click="liveDemandDetail(item.course_id)">
                <img class="yyt-stateIcon" src="static/zb.png" />
                <view class="yyt-con-title">{{ item.title }}</view>
                <view class="yyt-con-time">开课时间：{{ item.opentime }}</view>
                <view class="yyt-con-time">授课时长：{{ item.duration }}小时</view>
            </view>
            <view class="yyt-bottom">
                <view class="yyt-bottom-lr">
                    <img v-for="(item,index) in item.anchor_id" :key="index" :src="item.avatar" @click="teacher(item.anchor_id)"/>
                </view>
                <view class="yyt-bottom-lr">
                    <view class="lr-class-type" v-if="item.paytype == '1'">￥{{ item.price }}</view>
                    <view class="lr-class-type" v-if="item.paytype == '2'">免费课</view>
                    <view class="lr-class-num">{{ item.join_num }}人加入学习</view>
                </view>
            </view>
        </view>
        <view class="example-body" v-if="livedemandlist != ''" @click="setLivedemd">
            <uni-load-more :status="status" :content-text="contentText" color="#666" />
        </view>
        <view class="yyt-null" v-if="livedemandlist == ''">
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
                livedemandlist: [],
                page: 0,
                store_id: ''
            }
        },
        // 初始数据
        onLoad() {
            this.URL = IMGURL;
            this.store_id = STORE_ID;
            this.livedemd();
        },
        // 下拉刷新
        onPullDownRefresh() {
            console.log('onPullDownRefresh');
            this.livedemd();
            this.page = 0
        },
        // 上拉加载
        onReachBottom() {
            console.log("onReachBottom");
            setTimeout(() => {
                this.setLivedemd();
            }, 300);
        },

        methods: {
            livedemd() {
                setTimeout(() => {
                    requestUrl({
                        url: 'recommend_lists',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: 'POST',
                        data: {
                            store_id: this.store_id
                        },
                        success: res => {
                            console.log('success', res)
                            if (res.data.code == 1001) {
                                this.livedemandlist = res.data.data;
                                uni.stopPullDownRefresh();
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
                }, 300);
            },
            // 查看更多
            setLivedemd() {
                this.status = 'loading';
                var page = this.page
                page += 1;
                this.page = page
                requestUrl({
                    url: 'recommend_lists',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        num: page,
                        store_id: this.store_id
                    },
                    success: res => {
                        console.log('success', res)
                        if (res.data.code == 1001) {
                            var newlivedemandlist = res.data.data;
                            this.livedemandlist = this.livedemandlist.concat(newlivedemandlist);
                            this.status = 'more';
                        }
                        if (res.data.code == 1002) {
                            this.status = 'noMore';
                            return
                        }
                    },
                });
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

</style>