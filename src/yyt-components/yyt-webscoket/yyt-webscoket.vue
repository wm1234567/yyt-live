<template>
    <view class="yyt-container_chat" :style="{'height':_windowHeight + 'px'}">
        <scroll-view :style="{'height':_windowHeight + 'px'}" id="scrollview" scroll-y='true' :scroll-top="scrollTop">
            <view class="yyt-chat" v-for="(item,index) in serverMsg" :key='index'>
                <view class="yyt-chatlist" v-show="item.msg && item.is_user == 2">
                    <img class="yyt-chat-user" :src="item.avatar" />
                    <view class="yyt-chat-msg">{{ item.msg }}</view>
                </view>
                <view class="yyt-chatlist" v-show="item.msg && item.is_user == 1">
                    <img class="yyt-chat-user_my" :src="item.avatar" />
                    <view class="yyt-chat-msg_my">{{ item.msg }}</view>
                </view>
            </view>
            <view id="scrollBottom" class="space_"></view>
        </scroll-view>
        <form @submit="send">
            <input class="msg" type="text" maxlength="50" :disabled="disabledFlg" v-model="valMsg" name="msg"
                @blur.prevent="changeCount()" :focus="focusFlg"  placeholder="我来说两句">
            <button class="submitmsg" type="primary" :disabled="disabledFlg" formType="submit">{{ subMsg }}</button>
        </form>
    </view>
</template>

<script>
    import {
        requestUrl,
        IMGURL
    } from '@/common/request.js'
    export default {
        name: 'YytWebScoket',
        props: ['course_id', '_windowHeight'],
        data() {
            return {
                focusFlg: false,
                valMsg: '',
                subMsg: '发消息',
                disabledFlg: false,
                path: "", //后台服务地址
                socket: "",
                serverMsg: [], //聊天列表
                MsgObj: {}, //个人聊天信息
                scrollTop: 0,
                mitemHeight: 0
            }
        },
        mounted() {
            // 初始化
            var userInfo = uni.getStorageSync('userInfo');
            var openid = uni.getStorageSync('openid');
            this.path = "wss://yytzb.yueyat.net:5200?token=" + openid + "&group=" + this.course_id + "&login_type=" +
                1 + "&type=" + 2
            this.init()
        },

        methods: {

            init: function () {
                if (typeof (WebSocket) === "undefined") {
                    alert("您的浏览器不支持socket")
                } else {
                    // 实例化socket
                    this.socket = new WebSocket(this.path)
                    // 监听socket连接
                    this.socket.onopen = this.open
                    // 监听socket断开
                    this.socket.onclose = this.close
                    // 监听socket错误信息
                    this.socket.onerror = this.error
                    // 监听socket消息
                    this.socket.onmessage = this.getMessage
                }
            },
            open: function (e) {
                console.log(this.path)
                console.log("socket连接成功", e)
            },
            error: function () {
                console.log("连接错误")
            },
            getMessage: function (msg) {
                var getServerMsg = JSON.parse(msg.data)
                console.log('服务端:', getServerMsg);
                if (getServerMsg.code == '12') {
                    var getServerMsg_sf = JSON.parse(getServerMsg.data);
                    console.log('个人身份:', getServerMsg_sf);
                    if (getServerMsg_sf.status_banned == 1) { //不禁言
                        this.disabledFlg = false;
                        this.subMsg = '发消息'
                    } else { //禁言
                        this.disabledFlg = true;
                        this.subMsg = '禁言中'
                    }
                }

                //如果没有头像将用默认头像代替
                if (getServerMsg.avatar) {
                    var avatar = getServerMsg.avatar;
                } else {
                    var avatar = 'static/user.png'
                }
                this.MsgObj = {
                    username: getServerMsg.user_name,
                    msg: getServerMsg.mes,
                    avatar: avatar,
                    is_user: getServerMsg.is_user
                }
                this.serverMsg.push(this.MsgObj); //将服务端内容存储的数组serverMsg
                this.goTop(); //执行 计算各节点高度 实现实时滚动
            },
            send: function (e) {
                // 聚焦
                this.focusFlg = true;
                if (e.target.value.msg == '') {
                    uni.showToast({
                        title: '消息不能为空哦',
                        mask: false,
                        duration: 2000,
                        icon: "none"
                    });
                    return
                }
                this.socket.send(e.target.value.msg); //向服务端发送内容
                this.valMsg = ''; //清空input值
            },
            close: function (e) {
                console.log("socket已经关闭")
            },

            //实时滚动 
            goTop() {
                let that = this;
                let query = uni.createSelectorQuery(); //获取元素节点信息
                var chat = query.selectAll('.yyt-chat').boundingClientRect(); //指定元素进行查询
                var scrollview = query.select('#scrollview').boundingClientRect();

                query.exec((res) => { //检索上诉请求并返回一个数组
                    console.log(res)
                    var yyt_chat_height = res[0]; //.子元素盒子集合
                    var scrollview_height = res[1]; // scrollview元素
                    yyt_chat_height.forEach((rect) => that.mitemHeight = that.mitemHeight + rect
                        .height) //获取所有子元素的vi度 并相加
                    setTimeout(() => { //因为vue的虚拟DOM 每次生成的新消息都是之前的，所以采用异步setTimeout 
                        if (scrollview_height.height < that.mitemHeight) { //判断子元素高度是否大于显示高度
                            this.scrollTop = that.mitemHeight
                        }
                    }, 100)
                })
            },
            // input失去焦点 页面 强制滚回底部 解决输入法顶起后留白
            changeCount() {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            },
        },

        destroyed() {
            // 销毁监听
            this.socket.close();
        }
    }
</script>
<style scoped>
    .yyt-container_chat {
        width: 100%;
        height: auto;
        background: #f4f4f4f4
    }

    .yyt-chat {
        width: 95%;
        height: auto;
        margin: 0 auto;
        overflow: hidden;
    }

    .yyt-chatlist {
        width: 100%;
        height: auto;
        overflow: hidden;
        margin-bottom: 20rpx
    }

    .space_ {
        width: 100%;
        height: 60px;
    }

    form {
        width: 100%;
        height: 80rpx;
        background: #ffffff;
        position: fixed;
        bottom: 0;
        left: 0;
        padding: 10rpx;
        border-top: 1rpx solid #dedede;
    }

    .msg {
        width: 70%;
        height: 80rpx;
        border: 1rpx solid #dedede;
        float: left;
        border-radius: 10rpx
    }

    .submitmsg {
        width: 26%;
        height: 80rpx;
        float: left;
        margin-left: 1%;
        line-height: 80rpx;
        font-size: 30rpx
    }

    .yyt-chat-user {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        float: left;
    }

    .yyt-chat-msg {
        min-width: 50rpx;
        max-width: 51%;
        height: auto;
        float: left;
        margin-left: 15rpx;
        word-wrap: break-word;
        white-space: pre-wrap;
        word-break: break-all;
        background: #d5e3ff;
        color: #4986ff;
        padding: 15rpx;
        border-radius: 10rpx;
        margin-top: 10rpx;
        font-size: 25rpx
    }

    .yyt-chat-user_my {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        float: right;
    }

    .yyt-chat-msg_my {
        min-width: 50rpx;
        max-width: 51%;
        height: auto;
        float: right;
        margin-right: 15rpx;
        word-wrap: break-word;
        white-space: pre-wrap;
        word-break: break-all;
        background: #d5e3ff;
        color: #4986ff;
        padding: 15rpx;
        border-radius: 10rpx;
        margin-top: 10rpx;
        font-size: 25rpx
    }
</style>