<template>
    <view class="yyt-container">
        <view class="space"></view>
        <view class="yyt-list">
            <view class="yyt-title" @click="liveclass_">
                <img class="yyt-title-icon" src="static/titIcon.png" />
                <view class="yyt-title-text">直播课程</view>
                <img class="yyt-title-right" src="static/right.png" />
            </view>

            <view class="yyt-live" v-if="liveclass">
                <view class="yyt-live">
                    <view class="yyt-live"
                        :style="{backgroundImage: 'url(' + liveclass.background + ')', backgroundSize:'cover', height:'400rpx'}"
                        v-show="liveclass.live_status == 1 || liveclass.live_status == 3">
                        <view class="yyt-teacher-bg-zz"></view>
                        <view class="yyt-live-button">
                            <view class="yyt-live-button-center">
                                <img src="static/play.png" />
                            </view>
                        </view>
                    </view>
                    <view class="video-wrapper" v-show="liveclass.live_status == 2 || liveclass.live_status == 4">
                        <video-player class="vjs-custom-skin" ref="videoPlayer" ebkit-playsinline="" playsinline=""
                            x-webkit-airplay="allow" x5-playsinline="true" :options="playerOptions"
                            @canplay="onPlayerCanplay($event)">
                        </video-player>
                    </view>
                    <view class="yyt-live-state_1" v-show="liveclass.live_status == 1">未开播
                    </view>
                    <view class="yyt-live-state" v-show="liveclass.live_status == 2">直播中
                    </view>
                    <view class="yyt-live-state_1" v-show="liveclass.live_status == 3">已结束
                    </view>
                    <view class="yyt-live-state" v-show="liveclass.live_status == 4">回放中
                    </view>
                </view>
                <view class="yyt-list-title">{{ liveclass.title }}</view>
                <view class="yyt-list-user">
                    <view class="user-view" v-for="(item, index) in liveclass.anchor_id" :key="index"
                        @click="teacher(item.anchor_id)">
                        <img :src="item.avatar" lazy-load alt="" />
                        <view>{{ item.realname }}</view>
                    </view>
                </view>
            </view>
            <view class="null" v-else>暂无数据</view>
        </view>
        <view class="space"></view>
    </view>
</template>

<script>
    import {
        requestUrl,
        IMGURL,
        STORE_ID
    } from '@/common/request.js'
    //引入video样式
    import 'video.js/dist/video-js.css'
    import 'vue-video-player/src/custom-theme.css'

    //引入hls.js 才能播放m3u8文件
    import 'videojs-contrib-hls'
    export default {
        name: 'YytBanner',
        data() {
            return {
                URL: '', //图片前缀
                liveclass: {},
                playerOptions: {
                    // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: true, //如果true,浏览器准备好时开始回放。
                    controls: true, //控制条
                    preload: 'auto', //视频预加载
                    muted: false, //默认情况下将会消除任何音频。
                    loop: true, //导致视频一结束就重新开始。
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                        type: 'application/x-mpegURL', //播放类型
                        src: 'http://ivi.bupt.edu.cn/hls/cctv6hd.m3u8' //播流地址
                    }],
                    poster: "http://img4.cache.netease.com/photo/0001/2010-11-08/6L0DPB5400AQ0001.jpg", //你的封面地址
                    width: document.documentElement.clientWidth,
                    notSupportedMessage: '暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    controlBar: {
                        timeDivider: false,
                        durationDisplay: false,
                        remainingTimeDisplay: false,
                        fullscreenToggle: true //全屏按钮
                    }
                }
            }
        },
        created() {
            uni.showLoading({
                title: '加载中',
            });
            this.URL = IMGURL;
            //  轮播图数据
            requestUrl({
                url: 'course_index',
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: 'POST',
                data: {
                    store_id: STORE_ID
                },
                success: res => {
                    uni.hideLoading();
                    console.log('success', res)
                    if (res.data.code == 1001) {
                        this.liveclass = res.data.data
                        if (res.data.data.dbUrl) {
                            this.playerOptions.sources[0].src = res.data.data.dbUrl;
                        } else {
                            this.playerOptions.sources[0].src = res.data.data.playUrl;
                        }
                    }
                },
            });
        },

        methods: {
            // 跳转直播课程
            liveclass_() {
                uni.navigateTo({
                    url: '/pages/liveclass/liveclass'
                })
            },
            onPlayerPlay(e) {

            },
            onPlayerPause(e) {

            },
            teacher(e) {
                uni.navigateTo({
                    url: '/pages/teacherInfo/teacherInfo?anchor_id=' + e
                })
            },

            onPlayerCanplay(player) {
                console.log('player Canplay!', player)
                document.getElementsByTagName("video")[0].removeAttribute("x5-video-player-type");
                document.getElementsByTagName("video")[0].removeAttribute("x5-video-player-fullscreen");
                document.getElementsByTagName("video")[0].setAttribute("webkit-playsinline", "");
                document.getElementsByTagName("video")[0].setAttribute("x5-playsinline", "")
                document.getElementsByTagName("video")[0].setAttribute("x-webkit-airplay", "allow")
            }
        }
    }
</script>
<style scoped>
    .vjs-mute-control {
        padding-bottom: 0
    }

    #myVideo {
        width: 100%;
        height: 500rpx
    }
</style>