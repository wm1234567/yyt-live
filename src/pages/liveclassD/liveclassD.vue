<template>
    <view class="yyt-container">
        <!-- 直播 -->
        <view class="yyt-live" v-if="liveclassD.type == 1">
            <!-- 收费 -->
            <view class="yyt-container" v-show="liveclassD.paytype == 1">
                <!-- 未购买 当前小课收费 -->
                <view class="yyt-live" v-show="liveclassD.pay_status == 1 && liveclassD.list_paytype == 1"
                    :style="{backgroundImage: 'url(' + liveclassD.background + ')', backgroundSize:'cover', height:'400rpx'}">
                    <view class="yyt-teacher-bg-zz"></view>
                    <view class="yyt-live-button">
                        <view class="yyt-live-button-pay" @click="pay(liveclassD.course_id)">
                            <view class="center-fee">￥{{ liveclassD.price }}</view>
                            <view class="center-pay">立即购买</view>
                        </view>
                    </view>
                </view>
                <!-- 未购买 当前小课免费 -->
                <view class="video-wrapper" v-show="liveclassD.pay_status == 1 && liveclassD.list_paytype == 2">
                    <video-player class="vjs-custom-skin" ref="videoPlayer" webkit-playsinline playsinline
                        x-webkit-airplay="allow" x5-playsinline="true" :options="playerOptions"
                        @canplay="onPlayerCanplay($event)" @play="onPlayerplay($event)">
                    </video-player>
                </view>
                <!-- 没有小课 -->
                <view class="yyt-live" v-show="!liveclassD.list_paytype">
                    <view class="yyt-live"
                        :style="{backgroundImage: 'url(' + liveclassD.background + ')', backgroundSize:'cover', height:'400rpx'}">
                        <view class="yyt-teacher-bg-zz"></view>
                        <view class="yyt-live-button">
                            <view class="yyt-live-button-pay">
                                <view class="center-fee">暂无课程</view>
                            </view>
                        </view>
                    </view>
                </view>
                <!-- 已购买 -->
                <view class="yyt-pay" v-show="liveclassD.pay_status == 2">
                    <!-- 未开播 已结束-->
                    <view class="yyt-live" v-show="liveclassD.live_status == 1 || liveclassD.live_status == 3"
                        :style="{backgroundImage: 'url(' + liveclassD.background + ')', backgroundSize:'cover', height:'400rpx'}">
                        <view class="yyt-teacher-bg-zz"></view>
                        <view class="yyt-live-button">
                            <view class="yyt-live-button-center">
                                <img src="static/play.png" />
                            </view>
                        </view>
                    </view>
                    <!-- 开播 回放-->
                    <view class="video-wrapper" v-show="liveclassD.live_status == 2 || liveclassD.live_status == 4">
                        <video-player class="vjs-custom-skin" ref="videoPlayer" webkit-playsinline playsinline
                            x-webkit-airplay="allow" x5-playsinline="true" :options="playerOptions"
                            @canplay="onPlayerCanplay($event)" @play="onPlayerplay($event)">
                        </video-player>
                    </view>
                </view>
            </view>
            <!-- 免费 -->
            <view class="yyt-container" v-show="liveclassD.paytype == 2">
                <!-- 开播 回放-->
                <view class="video-wrapper" v-show="liveclassD.live_status == 2 || liveclassD.live_status == 4">
                    <video-player class="vjs-custom-skin" ref="videoPlayer" webkit-playsinline playsinline
                        x-webkit-airplay="allow" x5-playsinline="true" :options="playerOptions"
                        @canplay="onPlayerCanplay($event)">
                    </video-player>
                </view>
                <!-- 未开播 已结束-->
                <view class="yyt-live" v-show="liveclassD.live_status == 1 || liveclassD.live_status == 3"
                    :style="{backgroundImage: 'url(' + liveclassD.background + ')', backgroundSize:'cover', height:'400rpx'}">
                    <view class="yyt-teacher-bg-zz"></view>
                    <view class="yyt-live-button">
                        <view class="yyt-live-button-center">
                            <img src="static/play.png" />
                        </view>
                    </view>
                </view>
            </view>
            <view class="yyt-live-state_1" v-show="liveclassD.live_status == 1">未开播</view>
            <view class="yyt-live-state" v-show="liveclassD.live_status == 2">直播中</view>
            <view class="yyt-live-state_1" v-show="liveclassD.live_status == 3">已结束</view>
            <view class="yyt-live-state" v-show="liveclassD.live_status == 4">回放中</view>
        </view>
        <!-- 选项卡 -->
        <scroll-view class="yyt-scroll" scroll-x='false' style="width: 100%">
            <view class="navli" v-for="(item,index) in navList" :key="index" :class="{'activeT':nowIndex === index}"
                @click="tabClick(index)"><i>{{ item.name }}</i>
            </view>
        </scroll-view>
        <swiper :current="nowIndex" class='swiper' :style="{'height':_windowHeight + 'px'}" @change="onchange">
            <!-- 简介 -->
            <block>
                <swiper-item>
                    <scroll-view :style="{'height':_windowHeight + 'px'}" scroll-y='true'>
                        <view class="yyt-intr">
                            <view class="yyt-con-title">{{ liveclassD.title }}</view>
                            <view class="yyt-con-time">开课时间：{{ liveclassD.opentime }}</view>
                            <view class="yyt-con-time">授课时长：{{ liveclassD.duration }}小时</view>
                        </view>
                        <view class="space"></view>
                        <view class="yyt-intr">
                            <view class="yyt-info-title">名师介绍</view>
                            <view class="yyt-list-user">
                                <view class="user-view" v-for='(item,index) in liveclassD.anchor_id' :key="index"
                                    @click="teacher(item.anchor_id)">
                                    <img :src="item.avatar" alt="" />
                                    <view>{{ item.realname }}</view>
                                </view>
                            </view>
                        </view>
                        <view class="space"></view>
                        <view class="yyt-intr">
                            <view class="yyt-info-title">课程介绍</view>
                            <view class="yyt-list-user">
                                <rich-text :nodes="liveclassD.content"></rich-text>
                            </view>
                        </view>
                    </scroll-view>
                </swiper-item>
            </block>
            <!-- 目录 -->
            <block>
                <swiper-item>
                    <scroll-view :style="{'height':_windowHeight + 'px'}" scroll-y='true'>
                        <view class="yyt-intr_">
                            <!-- <view class="yyt-info-title_">目录</view> -->
                            <uni-collapse :accordion="true">
                                <uni-collapse-item v-for="(item,index) in liveclassD.course_list" :key="index"
                                    :title="item.title" :show-animation="true">
                                    <view class='yyt-vipPay_H' v-for='(item,index) in item.children' :key="index">
                                        <view class='yyt-btn_H'
                                            @click="minClass(item.paytype, item.live_status, item.viderUrl, liveclassD.pay_status,item.list_id)">
                                            <!-- 付费 -->
                                            <view class="yyt-btn_H_paytype" v-if="item.paytype == 1">
                                                <!-- 未购买 -->
                                                <view class="yyt-btn_H_live_status" v-if="liveclassD.pay_status == 1">
                                                    <view class="yyt-smallclass-name">{{item.title}}</view>
                                                    <view class="yyt-smallclass-span" v-show="item.live_status == 1">
                                                        <view class="span-paytype red">付费</view>
                                                        <view class="span-status gary">未开播</view>
                                                    </view>
                                                    <view class="yyt-smallclass-span" v-show="item.live_status == 2">
                                                        <view class="span-paytype red">付费</view>
                                                        <view class="span-status blue">直播中</view>
                                                    </view>
                                                    <view class="yyt-smallclass-span" v-show="item.live_status == 3">
                                                        <view class="span-paytype red">付费</view>
                                                        <view class="span-status gary">已结束</view>
                                                    </view>
                                                    <view class="yyt-smallclass-span" v-show="item.live_status == 4">
                                                        <view class="span-paytype red">付费</view>
                                                        <view class="span-status blue">回放中</view>
                                                    </view>
                                                </view>
                                                <!-- 已购买 -->
                                                <view class="yyt-btn_H_live_status" v-else>
                                                    <view class="yyt-smallclass-name">{{item.title}}</view>
                                                    <view class="yyt-smallclass-span" v-show="item.live_status == 1">
                                                        <view class="span-paytype green">已购买</view>
                                                        <view class="span-status gary">未开播</view>
                                                    </view>
                                                    <view class="yyt-smallclass-span" v-show="item.live_status == 2">
                                                        <view class="span-paytype green">已购买</view>
                                                        <view class="span-status blue">直播中</view>
                                                    </view>
                                                    <view class="yyt-smallclass-span" v-show="item.live_status == 3">
                                                        <view class="span-paytype green">已购买</view>
                                                        <view class="span-status gary">已结束</view>
                                                    </view>
                                                    <view class="yyt-smallclass-span" v-show="item.live_status == 4">
                                                        <view class="span-paytype green">已购买</view>
                                                        <view class="span-status blue">回放中</view>
                                                    </view>
                                                </view>
                                            </view>
                                            <!-- 免费 -->
                                            <view class="yyt-btn_H_paytype" v-else>
                                                <view class="yyt-smallclass-name">{{item.title}}</view>
                                                <view class="yyt-smallclass-span" v-show="item.live_status == 1">
                                                    <view class="span-paytype green">免费</view>
                                                    <view class="span-status gary">未开播</view>
                                                </view>
                                                <view class="yyt-smallclass-span" v-show="item.live_status == 2">
                                                    <view class="span-paytype green">免费</view>
                                                    <view class="span-status blue">直播中</view>
                                                </view>
                                                <view class="yyt-smallclass-span" v-show="item.live_status == 3">
                                                    <view class="span-paytype green">免费</view>
                                                    <view class="span-status gary">已结束</view>
                                                </view>
                                                <view class="yyt-smallclass-span" v-show="item.live_status == 4">
                                                    <view class="span-paytype green">免费</view>
                                                    <view class="span-status blue">回放中</view>
                                                </view>
                                            </view>
                                        </view>
                                        <view class='yyt-icon_H'></view>
                                    </view>
                                </uni-collapse-item>
                            </uni-collapse>
                        </view>
                    </scroll-view>
                </swiper-item>
            </block>
            <!-- 资料 -->
            <block>
                <swiper-item>
                    <scroll-view :style="{'height':_windowHeight + 'px'}" scroll-y='true'>
                        <view class="yyt-intr">
                            <uni-collapse :accordion="true">
                                <uni-collapse-item v-for="(item,index) in liveclassD.course_datum" :key="index"
                                    :title="item.title" :show-animation="true">
                                    <view class='yyt-vipPay_H' v-for='(item,index) in item.children' :key="index">
                                        <view class='yyt-btn_H' @click="down(item.content)">{{ item.title }}</view>
                                        <!-- <img src="static/down.png" class="yyt-down" alt="" > -->
                                        <view class='yyt-icon_H'></view>
                                    </view>
                                </uni-collapse-item>
                            </uni-collapse>
                        </view>
                    </scroll-view>
                </swiper-item>
            </block>
            <!-- 聊天 -->
            <block>
                <swiper-item>
                    <YytWebScoket :course_id="course_id" :_windowHeight="_windowHeight" />
                </swiper-item>
            </block>
        </swiper>
        <!-- 取消收藏 -->
        <view class="collection" v-if="collect_status" @click="collection(2)">
            <img src="static/yescoll.png" width="100%" alt="">
        </view>
        <!-- 收藏 -->
        <view class="collection" v-else @click="collection(1)">
            <img src="static/nocoll.png" width="100%" alt="">
        </view>
    </view>
</template>

<script>
    import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
    import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
    import YytWebScoket from '@/yyt-components/yyt-webscoket/yyt-webscoket'
    import {
        requestUrl,
        STORE_ID
    } from '@/common/request.js'
    //引入video样式
    import 'video.js/dist/video-js.css'
    import 'vue-video-player/src/custom-theme.css'

    //引入hls.js 才能播放m3u8文件
    import 'videojs-contrib-hls'

    export default {
        components: {
            uniCollapse,
            uniCollapseItem,
            YytWebScoket
        },
        data() {
            return {
                list_id: '',
                collect_status: true,
                course_id: '', //课程ID
                liveclassD: {}, //数据集合
                nowIndex: 0,
                _windowHeight: '',
                navList: [{
                    name: '简介'
                }, {
                    name: '目录'
                }, {
                    name: '资料'
                }, {
                    name: '问答'
                }],
                playerOptions: {
                    playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
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
                        src: 'http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8' //播流地址
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
        // 下拉刷新
        onPullDownRefresh() {
            uni.stopPullDownRefresh();
            this.load()
        },
        // 初始加载
        onLoad(opt) {
            console.log(this.collect_status)
            // uni.getSystemInfo({
            //     success: res => {
            //         console.log(res.windowHeight)
            //         this._windowHeight = res.windowHeight - 252.94
            //     }
            // })
            // 获取body 可视区域高度
            var clientHeight = document.body.clientHeight
            console.log(clientHeight)
            this._windowHeight = clientHeight - 300
            this.store_id = STORE_ID;
            this.course_id = opt.course_id;
            if (opt.list_id) {
                this.list_id = opt.list_id
            }
            this.load()
        },
        methods: {
            load() {
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'course_info',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        course_id: this.course_id,
                        account: openid,
                        list_id: this.list_id,
                        store_id: this.store_id
                    },
                    success: res => {
                        console.log('success直播详情', res)
                        if (res.data.code == 1001) {
                            this.liveclassD = res.data.data;
                            this.playerOptions.sources[0].src = res.data.data.url;
                            if (res.data.data.collect_status == 1) { //收藏了
                                this.collect_status = true
                            } else {
                                this.collect_status = false
                            }
                            this.history()
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
            },
            // 支付
            pay(e) {
                console.log(e)
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'order_add',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        course_id: e,
                        pay_type: 1,
                        account: openid,
                        store_id: STORE_ID
                    },
                    success: res => {
                        console.log('支付参数', res)
                        if (res.data.code == 1001) {
                            var paystr = res.data.data.jsApiParameters;
                            // var pay = eval('(' + paystr + ')');
                            var pay = JSON.parse(paystr);
                            console.log(pay)
                            WeixinJSBridge.invoke(
                                'getBrandWCPayRequest', {
                                    timeStamp: pay.timeStamp, // 支付签名时间戳
                                    appId: pay.appId, // 商户appId
                                    nonceStr: pay.nonceStr, // 支付签名随机串，不长于 32 位
                                    package: pay.package, // 统一支付接口返回的prepay_id参数值
                                    signType: 'MD5', // 签名方式使用新版支付需传入'MD5'
                                    paySign: pay.paySign, // 支付签名
                                },
                                function (res) {
                                    console.log(res)
                                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                                        // 使用以上方式判断前端返回,微信团队郑重提示：
                                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                                        uni.showToast({
                                            title: '支付成功',
                                            mask: false,
                                            duration: 2000,
                                            icon: "none"
                                        });
                                        setTimeout(() => {
                                            uni.navigateBack({})
                                        }, 1000)

                                    }
                                });
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
            // 选项卡切换
            tabClick(index) {
                this.nowIndex = index
            },
            // swiper 滑动
            onchange(e) {
                this.nowIndex = e.target.current
            },
            // 跳转 名师介绍
            teacher(e) {
                uni.navigateTo({
                    url: '/pages/teacherInfo/teacherInfo?anchor_id=' + e
                })
            },
            // 资料下载
            down(url) {
                console.log(url)
                window.location.href = url;
            },
            // 小节播放
            minClass(paytype, live_status, viderUrl, pay_status, list_id) {
                if (paytype == 1) { //小课付费
                    if (pay_status == 1) {
                        uni.showToast({
                            title: '请购买',
                            mask: false,
                            duration: 2000,
                            icon: "none"
                        });
                    } else {
                        if (live_status == 1) {
                            uni.showToast({
                                title: '未开播',
                                mask: false,
                                duration: 2000,
                                icon: "none"
                            });
                        }
                        if (live_status == 2) {
                            uni.showToast({
                                title: '直播中',
                                mask: false,
                                duration: 2000,
                                icon: "none"
                            });
                        }
                        if (live_status == 3) {
                            uni.showToast({
                                title: '已结束,请耐心等待回放',
                                mask: false,
                                duration: 2000,
                                icon: "none"
                            });
                        }
                        if (live_status == 4) {
                            this.liveclassD.live_status = live_status;
                            this.playerOptions.sources[0].type = 'application/x-mpegURL';
                            this.playerOptions.sources[0].src = viderUrl;
                            this.history(list_id);
                            this.is_id = list_id
                        }
                    }
                } else { //小课免费
                    if (live_status == 2 && list_id == this.liveclassD.list_id) {
                        uni.showToast({
                            title: '直播中',
                            mask: false,
                            duration: 2000,
                            icon: "none"
                        });
                    }
                    if (live_status == 4 && list_id == this.liveclassD.list_id) {
                        uni.showToast({
                            title: '回放中',
                            mask: false,
                            duration: 2000,
                            icon: "none"
                        });
                    }
                    if (live_status == 2 && list_id != this.liveclassD.list_id) {
                        this.liveclassD.list_paytype = 2;
                        this.playerOptions.sources[0].type = 'video/mp4';
                        this.playerOptions.sources[0].src = viderUrl;
                    }
                    if (live_status == 4 && list_id != this.liveclassD.list_id) {
                        this.liveclassD.live_status = live_status;
                        this.playerOptions.sources[0].type = 'video/mp4';
                        this.playerOptions.sources[0].src = viderUrl;
                        this.history(list_id);
                        this.is_id = list_id
                    }
                    if (live_status == 3 && list_id == this.liveclassD.list_id) {
                        uni.showToast({
                            title: '已结束,请耐心等待回放',
                            mask: false,
                            duration: 2000,
                            icon: "none"
                        });
                    }
                }
            },
            // 监听创建播放器 给video加同层播放属性 兼容安卓
            onPlayerCanplay(player) {
                document.getElementsByTagName("video")[0].removeAttribute("x5-video-player-type");
                document.getElementsByTagName("video")[0].removeAttribute("x5-video-player-fullscreen");
                document.getElementsByTagName("video")[0].setAttribute("webkit-playsinline", "");
                document.getElementsByTagName("video")[0].setAttribute("x5-playsinline", "")
                document.getElementsByTagName("video")[0].setAttribute("x-webkit-airplay", "allow")

                document.getElementsByTagName("video")[1].removeAttribute("x5-video-player-type");
                document.getElementsByTagName("video")[1].removeAttribute("x5-video-player-fullscreen");
                document.getElementsByTagName("video")[1].setAttribute("webkit-playsinline", "");
                document.getElementsByTagName("video")[1].setAttribute("x5-playsinline", "")
                document.getElementsByTagName("video")[1].setAttribute("x-webkit-airplay", "allow")

                document.getElementsByTagName("video")[2].removeAttribute("x5-video-player-type");
                document.getElementsByTagName("video")[2].removeAttribute("x5-video-player-fullscreen");
                document.getElementsByTagName("video")[2].setAttribute("webkit-playsinline", "");
                document.getElementsByTagName("video")[2].setAttribute("x5-playsinline", "")
                document.getElementsByTagName("video")[2].setAttribute("x-webkit-airplay", "allow")

            },
            // 监听播放
            onPlayerplay() {

            },
            // 历史记录
            history(list_id) {
                var openid = uni.getStorageSync('openid');
                if (list_id) {
                    var _list_id = list_id
                } else {
                    if (this.liveclassD.list_id) {
                        var _list_id = this.liveclassD.list_id;
                    } else {
                        var _list_id = ''
                    }
                }
                requestUrl({
                    url: 'history',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        course_id: this.course_id,
                        account: openid,
                        list_id: _list_id,
                        store_id: STORE_ID
                    },
                    success: res => {
                        console.log('success存入历史记录', res)
                    },
                });
            },
            // 课程收藏
            collection(status) {
                console.log(status)
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'collect',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        course_id: this.course_id,
                        account: openid,
                        status: status,
                        store_id: STORE_ID
                    },
                    success: res => {
                        console.log('success小课收藏', res)
                        if (res.data.code == 1001) {
                            if (status == 1) {
                                this.collect_status = true;
                            } else {
                                this.collect_status = false;
                            }
                            uni.showToast({
                                title: res.data.message,
                                mask: false,
                                duration: 2000,
                                icon: "none"
                            });
                        } else {
                            if (status == 1) {
                                this.collect_status = true;
                            } else {
                                this.collect_status = false;
                            }
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
        }
    }
</script>

<style scoped>
    .yyt-scroll {
        width: 100%;
        height: 100rpx;
        display: flex;
        flex-direction: row;
        white-space: nowrap;
    }

    .navli {
        width: 25%;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        display: inline-block;
    }

    .navli i {
        font-style: normal;
        font-size: 28rpx;
    }

    .activeT {
        color: #fff;
        border-bottom: 3rpx solid #fff;
        background: #4986ff
    }

    .swiper {
        width: 100%;
        height: 500rpx;
    }

    .yyt-intr {
        width: 92%;
        height: auto;
        margin: 0 auto;
    }

    .yyt-intr_ {
        width: 100%;
        height: auto;
        margin: 0 auto;
    }

    .yyt-intr-space {
        width: 100%;
        height: 20rpx;
        background: #f2f6ff;
    }

    .yyt-info-title {
        width: 100%;
        height: 90rpx;
        margin: 0 auto;
        line-height: 90rpx;
    }

    .yyt-info-title_ {
        width: 92%;
        height: 90rpx;
        margin: 0 auto;
        line-height: 90rpx;
        font-size: 28rpx
    }

    .yyt-list-user {
        width: 100%;
        height: 90rpx;
        margin: 0 auto;
    }

    .yyt-vipPay_H {
        width: 92%;
        height: 95rpx;
        line-height: 95rpx;
        background: #fff;
        position: relative;
        margin: 0 auto
    }

    .yyt-icon_H {
        position: absolute;
        top: 40rpx;
        right: 15rpx;
        width: 15rpx;
        height: 15rpx;
        border-top: 1px solid #bfbfbf;
        border-right: 1px solid #bfbfbf;
        transform: rotate(45deg);
    }


    .yyt-btn_H {
        color: #000;
        float: left;
        margin-right: 30rpx;
        width: 100%;
        line-height: 95rpx;
        font-size: 28rpx;
    }

    .yyt-bottom-border {
        border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
    }

    #myVideo {
        width: 100%
    }

    .yyt-live-button-pay {
        width: 200rpx;
        height: 50rpx;
        text-align: center;
        color: #fff;
        margin: 0 auto
    }

    .center-pay {
        width: 100%;
        height: 50rpx;
        background: #4986ff;
        color: #fff;
        border-radius: 25rpx
    }

    .yyt-down {
        position: absolute;
        top: 30rpx;
        right: 15rpx;
        width: 30rpx;
        height: 30rpx;
    }

    .yyt-btn_H_paytype {
        width: 100%;
        height: 95rpx;
        line-height: 95rpx;
        background: #fff;
        margin: 0 auto
    }

    .yyt-btn_H_live_status {
        width: 100%;
        height: 95rpx;
        line-height: 95rpx;
        background: #fff;
        margin: 0 auto
    }

    .yyt-smallclass-name {
        width: 70%;
        height: 95rpx;
        line-height: 95rpx;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .span-status {
        width: 40%;
        height: 34rpx;
        float: right;
        font-size: 18rpx;
        line-height: 34rpx;
        text-align: center;
        margin-right: 5%;
        margin-top: 31rpx;
        color: #fff;
        border-radius: 17rpx
    }

    .span-paytype {
        width: 40%;
        height: 34rpx;
        line-height: 34rpx;
        text-align: center;
        float: right;
        font-size: 18rpx;
        margin-top: 31rpx;
        color: #fff;
        border-radius: 17rpx
    }

    .yyt-smallclass-span {
        width: 25%;
        height: 95rpx;
        float: left;
    }

    .red {
        background: #fb4f6c;
    }

    .green {
        background: green
    }

    .gary {
        background: #bfbfbf
    }

    .blue {
        background: #4986ff
    }

    .collection {
        position: fixed;
        right: 0;
        top: 200rpx;
        width: 60rpx;
        height: 60rpx;
        line-height: 50rpx;
        z-index: 999
    }
</style>