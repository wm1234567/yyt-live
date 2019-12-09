<template>
</template>

<script>
    import {
        requestUrl,
        STORE_ID,
    } from '@/common/request.js';
    export default {
        name: 'YytLogin',
        data() {
            return {
                userInfo: {},
                store_id:''
            }
        },
        created() {
            this.store_id = STORE_ID;
            // 微信环境执行
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                this.getCode();
            }
        },
        methods: {
            getCode() {
                // 传值 code 获取用户信息
                var herf = window.location.search.substr(1);
                var paramObj = {};
                var hrefArr = herf.split('&');
                for (var i = 0; i < hrefArr.length; i++) {
                    var paramall = hrefArr[i].split('=');
                    paramObj[paramall[0]] = paramall[1]
                }
                var code = paramObj.code
                console.log(code)
                if (code) {
                    requestUrl({
                        url: 'official_account',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: 'POST',
                        data: {
                            code: code,
                            store_id: this.store_id
                        },
                        success: res => {
                            console.log('获取用户信息(official_account)', res)
                            if (res.data.code == 1001) {
                                this.userInfo = res.data.data;
                                uni.setStorageSync('userInfo', res.data.data);
                                uni.setStorageSync('openid', res.data.data.id);
                                this.login();
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
                }

            },
            
            // 传值用户信息登录 并检测用户是否绑定手机号
            login() {
                let userInfo = this.userInfo
                requestUrl({
                    url: 'login',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        login_type: 1,
                        openid: userInfo.id,
                        nickname: userInfo.nickname,
                        avatar: userInfo.avatar,
                        store_id: this.store_id
                    },
                    success: res => {
                        console.log('login回调', res)
                        if (res.data.code == 1001) {// 1001 授权成功
                            uni.showToast({
                                title: res.data.message,
                                mask: false,
                                duration: 2000,
                                icon: "none"
                            });
                        }
                        if (res.data.code == 1002) { //1002 授权失败
                            uni.showToast({
                                title: res.data.message,
                                mask: false,
                                duration: 2000,
                                icon: "none"
                            });
                        }
                        if (res.data.code == 1003) { //1003 用户未绑定手机号码
                            uni.showModal({
                                content: res.data.message,
                                showCancel: false,
                                success: function (res) {
                                    if (res.confirm) {
                                        uni.navigateTo({ //去绑定手机号码
                                            url: '/pages/bindMobile/bindMobile'
                                        });
                                    } else if (res.cancel) {}
                                }
                            });
                        }
                    },
                });
            },

        }
    }
</script>

<style>

</style>