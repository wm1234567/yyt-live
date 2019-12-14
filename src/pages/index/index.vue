<template>
	<view class="yy-container">
		<!-- 登录入口 -->
		<view class="yy-model" v-show="showFlg">
			<view class="yy-mask"></view>
			<view class="yy-modelContent">
				<view class="yy-title">
					<!-- <img src="static/wxIcon.png" alt="" width="50px" height="40px"> -->
					<view class="yy-title-text" style="margin-top:10px">请同意授权</view>
					<view class="yy-title-text">· 以便为您提供更好的服务</view>
				</view>
				<view class="yy-submit">
					<view @click="setcode">同意</view>
				</view>
			</view>
		</view>
		<!-- 登录授权 -->
		<yyt-login />
		<!-- 轮播图 -->
		<yyt-banner :banner="banner"/>
		<!-- 课程分类 -->
		<yyt-nav :navlist="navlist"/>
		<!-- 直播课程 -->
		<yyt-live-class :liveclass="liveclass" v-show="!showFlg"/>
		<!-- 精品点播 -->
		<yyt-live-demand :livedemand="livedemand"/>
		<!-- 精品书籍 -->
		<yyt-books :books="books"/>
	</view>
</template>

<script>
	import YytBanner from '@/yyt-components/yyt-banner/yyt-banner'
	import YytNav from '@/yyt-components/yyt-nav/yyt-nav'
	import YytLiveClass from '@/yyt-components/yyt-liveclass/yyt-liveclass'
	import YytLiveDemand from '@/yyt-components/yyt-livedemand/yyt-livedemand'
	import YytBooks from '@/yyt-components/yyt-books/yyt-books'
	import YytLogin from '@/yyt-components/yyt-login/yyt-login'
	import {
		requestUrl,
		STORE_ID,
		URL
	} from '@/common/request.js'

	export default {
		components: {
			YytBanner,
			YytNav,
			YytLiveClass,
			YytLiveDemand,
			YytBooks,
			YytLogin
		},
		data() {
			return {
				showFlg: false,
				flg: true,
				store_id: '', //商户ID
				URL: '', // 授权地址
				banner: {}, //轮播图数据
				navlist: {}, //课程分类
				liveclass: {}, //直播推荐课程
				livedemand: {}, //点播推荐课程
				books: {}, //精品书籍
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.load()
		},
		onLoad() {
			// var openid = 'oY_QVv32gzUl2FJe5hoYSpscEk-Y';
			// uni.setStorageSync('openid', openid);
			this.store_id = STORE_ID;
			this.URL = URL;
			this.load()
		},
		onShow() {
			/**
			 * 判断是否是微信环境
			 */
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") { //微信环境
				var herf = window.location.search.substr(1);
				var paramObj = {};
				var hrefArr = herf.split('&');
				for (var i = 0; i < hrefArr.length; i++) {
					var paramall = hrefArr[i].split('=');
					paramObj[paramall[0]] = paramall[1]
				}
				var code = paramObj.code
				var openid = uni.getStorageSync('openid');
				if (!code) {
					requestUrl({
						url: 'checkLogin',
						header: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						method: 'POST',
						data: {
							login_type: 1,
							account: openid,
							store_id: this.store_id
						},
						success: res => {
							console.log('是否登录', res)
							if (res.data.code == 1004) {
								this.showFlg = true
							} else {
								this.showFlg = false;
								if (openid) {
									this.login();
								}
							}
						},
					});
				}
				// 如果已经openid存在已经授权 再次请求是否绑定手机号
			} else { //浏览器环境
				console.log('浏览器')
			}
		},

		methods: {
			setcode() {
				this.showFlg = false
				window.location.href = this.URL
			},
			// 初始化首页数据
			load() {
				var openid = uni.getStorageSync('openid');
				// 轮播图数据
				requestUrl({
					url: 'banner_lists',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'POST',
					data: {
						store_id: STORE_ID,
						account: this.store_id,
					},
					success: res => {
						console.log('success轮播图', res)
						if (res.data.code == 1001) {
							this.banner = res.data.data
						}
					},
				});
				// 课程分类数据
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
						console.log('success课程分类', res)
						if (res.data.code == 1001) {
							this.navlist = res.data.data
						}
					},
				});
				// 直播推荐课程数据
				requestUrl({
					url: 'course_index',
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
							this.liveclass = res.data.data

						}
					},
				});
				// 点播推荐课程数据
				requestUrl({
					url: 'course_recommend',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'POST',
					data: {
						store_id: this.store_id
					},
					success: res => {
						console.log('success首页点播', res)
						if (res.data.code == 1001) {
							this.livedemand = res.data.data;
							// uni.stopPullDownRefresh();
						}
					},
				});
				// 精品书籍数据
				requestUrl({
					url: 'shop_lists',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'POST',
					data: {
						store_id: STORE_ID,
						num: 0
					},
					success: res => {
						console.log('success首页书籍', res)
						if (res.data.code == 1001) {
							this.books = res.data.data
						}
					},
				});
				uni.stopPullDownRefresh();
			},
			// 传值用户信息登录 并检测用户是否绑定手机号
			login() {
				var userInfo = uni.getStorageSync('userInfo');
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
						console.log('是否绑定手机号', res)
						if (res.data.code == 1003) { //1003 用户未绑定手机号码
							uni.showModal({
								content: '请绑定您的手机号',
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

<style scoped>
	#myVideo {
		width: 100%;
	}

	.yy-model {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999;
		display: block;
		box-sizing: border-box;
		z-index: 999;
	}

	.yy-mask {
		position: fixed;
		z-index: 999;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .6);
	}

	.yy-modelContent {
		position: fixed;
		z-index: 999;
		width: 80%;
		max-width: 300px;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background-color: #fff;
		text-align: center;
		border-radius: 10px;
		overflow: hidden;
	}

	.yy-title {
		padding: 1.3em 1.6em 1.3em;
		min-height: 40px;
		font-size: 15px;
		line-height: 1.4;
		color: #999;
		max-height: 400px;
		font-family: '宋体';
		overflow-y: auto;
		word-wrap: break-word;
		word-break: break-all;
		white-space: pre-wrap;
		box-sizing: border-box;
	}

	.yy-title-text {
		font-size: 25rpx
	}

	.yy-submit {
		position: relative;
		line-height: 48px;
		font-size: 18px;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		border-top: 1rpx solid #f4f4f4;
	}

	.yy-submit view {
		display: block;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		flex: 1;
		color: #007AFF;
		text-decoration: none;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0);
		position: relative;
		line-height: 48px;
		font-size: 15px;
		font-family: '宋体'
	}
</style>