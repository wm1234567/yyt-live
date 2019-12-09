<template>
    <view class="yyt-container">
        <view class="yyt-live-class" v-for="(item,index) in livelist" :key="index">
            <!-- 直播 -->
            <view class="yyt-live"
                :style="{backgroundImage: 'url(' + item.background + ')', backgroundSize:'cover', height:'400rpx'}"
                @click="liveclassD(item.course_id)">
                <view class="yyt-teacher-bg-zz"></view>
                <view class="yyt-live-button">
                    <view class="yyt-live-button-center">
                        <img src="static/play.png" />
                    </view>
                </view>
            </view>
            <view class="yyt-list-title">{{item.title}}</view>
            <view class="space"></view>
        </view>
        <view class="example-body" v-if="livelist != ''" @click="setload">
            <uni-load-more :status="status" :content-text="contentText" color="#666" />
        </view>
        <view class="yyt-null" v-if="livelist == ''">
            <view class="yyt-null-icon">
                <img src="static/nodata.png" width="100%" alt="">
            </view>
            <view class="yyt-null-text">暂无观看记录</view>
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
            this.store_id = STORE_ID;
            this.load();
        },
        methods: {
            load() {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'course_history',
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
                        if (res.data.code == 1002) {
                            // uni.showToast({
                            //     title: res.data.message,
                            //     mask: false,
                            //     duration: 2000,
                            //     icon: "none"
                            // });
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
                    url: 'course_history',
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
        }
    }
</script>

<style scoped>

</style>