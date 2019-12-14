<template>
    <view class="yyt-container">
        <view class="yyt-top">
            <view class="yy-topnav">
                <!-- <uni-search-bar radius="100" clearButton="always" @confirm="search" /> -->
            </view>
            <view class='yyt-TabSwiper'>
                <scroll-view class="yyt-scroll" scroll-x='false' style="width: 100%">
                    <view class="navli" v-for="(item,index) in navList" :key="index"
                        :class="{'activeT':nowIndex === index}" @click="tabClick(index)"><i>{{ item.title }}</i>
                    </view>
                </scroll-view>
                <scroll-view class="yyt-scroll" scroll-y='true' :style="{'height':_windowHeight + 'px'}">
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
                            <img src="static/nodata.png" width="100%" alt="">
                        </view>
                        <view class="yyt-null-text">暂无内容</view>
                    </view>
                    <view class="example-body" v-if="list != ''" @click="setload">
                        <uni-load-more :status="status" :content-text="contentText" color="#666" />
                    </view>
                </scroll-view>
                <!-- <swiper class='swiper' :style="{'height':_windowHeight + 'px'}" @change="onchange">
                    <block>
                        <swiper-item>
                            <scroll-view :style="{'height':_windowHeight + 'px'}" scroll-y='true'> -->
                <!-- </scroll-view>
                        </swiper-item>
                    </block>
                </swiper> -->
            </view>
        </view>
    </view>
</template>

<script>
    import {
        requestUrl,
        STORE_ID
    } from '@/common/request.js';
    import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    export default {
        components: {
            uniSearchBar,
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
                navList: [],
                list: [],
                type_id: '',
                searchVal: '',
                nowIndex: 0,
                _windowHeight: '',
                store_id: ''
            }
        },

        /**
         * 当 searchInput 配置 disabled 为 true 时触发
         */
        onNavigationBarSearchInputClicked(e) {
            uni.navigateTo({
                url: '/pages/search/search'
            });
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.nav();
            this.navlist();
        },
        onLoad(opt) {
            // 获取可见视图信息
            uni.getSystemInfo({
                success: res => {
                    console.log(res.windowHeight);
                    this._windowHeight = res.windowHeight - 90;
                }
            })
            this.store_id = STORE_ID;
            this.type_id = opt.type_id
            this.nowIndex = Number(opt.nowIndex)
            this.nav();
            this.navlist();
        },
        methods: {
            // 分类标题
            nav() {
                uni.showLoading({
                    title: '加载中',
                });
                requestUrl({
                    url: 'course_type',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        store_id: this.store_id
                    },
                    success: res => {
                        console.log('分类标题', res)
                        uni.stopPullDownRefresh();
                        if (res.data.code == 1001) {
                            this.navList = res.data.data
                        }
                    },
                });
            },
            // 列表
            navlist() {
                requestUrl({
                    url: 'course_type_info',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        type_id: this.type_id,
                        store_id: this.store_id,
                        num: 0,
                        title: ''
                    },
                    success: res => {
                        console.log('success分类列表', res)
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
                console.log(666)
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
            search(res) {
                uni.showModal({
                    content: '搜索：' + res.value,
                    showCancel: false
                })
            },
            input(res) {
                this.searchVal = res.value
            },
            cancel(res) {
                uni.showModal({
                    content: '点击取消，输入值为：' + res.value,
                    showCancel: false
                })
            },
            tabClick(index) {
                this.page = 0;
                this.status = 'more'
                this.nowIndex = index
                this.type_id = this.navList[index].type_id;
                this.navlist();
            },
            onchange(e) {
                this.nowIndex = e.target.current
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

<style>
    .example {
        padding: 0 30upx 30upx
    }

    .yyt-top {
        width: 100%;
        height: 158rpx;
        margin: 0 auto;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1;
        background: #4986ff;
        padding-top: 20rpx;
    }

    .yy-topnav {
        padding: 0 10rpx;
        background: #4986ff;
        width: 100%;
        height: 70rpx;
    }

    .yyt-TabSwiper {
        width: 100%;
        height: 100rpx;
        color: #fff;
        font-size: 28rpx;
    }

    .swiper {
        width: 100%;
        height: 500rpx;
        /* padding-top: 20rpx */
    }

    .yyt-scroll {
        width: 100%;
        height: 100rpx;
        display: flex;
        flex-direction: row;
        white-space: nowrap;
    }

    .navli {
        padding: 10px 0px;
        text-align: center;
        display: inline-block;
        margin: 0 0.8rem;
    }

    .navli i {
        font-style: normal;
        font-size: 28rpx;
    }

    .activeT {
        color: #fff;
        padding-bottom: .3rem;
        border-bottom: 3rpx solid #fff;
    }

    .yyt-con {
        margin-top: 20rpx
    }
</style>