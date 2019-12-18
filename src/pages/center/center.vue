<template>
	<view class="yyt-container">
		<view class="yyt-center">
			<!-- <view class="yyt-center-bg"></view>
			<img class="yyt-center-bg-bottom" src="static/bg_bottom.png" /> -->
			<view class="waveWrapper waveAnimation">
				<view class="waveWrapperInner bgTop">
					<view class="wave waveTop" style="background-image: url('static/wave-top.png');background-size:100%"></view>
				</view>
				<view class="waveWrapperInner bgMiddle">
					<view class="wave waveMiddle" style="background-image: url('static/wave-mid.png');background-size:100%"></view>
				</view>
				<view class="waveWrapperInner bgBottom">
					<view class="wave waveBottom" style="background-image: url('static/wave-bot.png');background-size:100%"></view>
				</view>
			</view>
			<view class="yyt-center-user">
				<view class="yyt-center-user-avatar">
					<img :src="user.avatar" />
					<!-- <view class="yyt-center-user-aname">已认证</view> -->
				</view>
				<view class="yyt-center-user-name">{{ user.nickname }}</view>
			</view>
			<view class="yyt-center-nav">
				<view class="yyt-center-nav-center">
					<view class="navs" @click="colectCourse">
						<view class="navs-num">{{ info.collect_list }}</view>
						<view>收藏课程</view>
					</view>
					<view class="navs" @click="payCourse">
						<view class="navs-num">{{ info.pay_course }}</view>
						<view>购买课程</view>
					</view>
					<view class="navs" @click="exchange">
						<view class="navs-num">{{ info.code_num }}</view>
						<view>兑换中心</view>
					</view>
				</view>
			</view>
		</view>
		<view class="yyt-center-r">
			<view class='yyt-vipPay_H' @click="history">
				<img src="static/1.png" alt="">
				<view class='yyt-btn_H'>观看历史</view>
				<view class='yyt-icon_H'></view>
			</view>
		</view>
		<scroll-view style="height:300rpx" scroll-x='false' v-if="info.history">
			<view class="yyt-watch" v-for="(item,index) in info.history" :key="index"
				@click="liveclassD(item.course_id, item.list_id)">
				<img :src="item.background" />
				<view>{{ item.title }}</view>
			</view>
		</scroll-view>
		<view class="space"></view>
		<view class="yyt-center-r">
			<view class='yyt-vipPay_H yyt-bottom-border' @click="order">
				<img src="static/2.png" alt="">
				<view class='yyt-btn_H'>我的订单</view>
				<view class='yyt-icon_H'></view>
			</view>
			<view class='yyt-vipPay_H yyt-bottom-border' @click="addressList">
				<img src="static/3.png" alt="">
				<view class='yyt-btn_H'>收货地址</view>
				<view class='yyt-icon_H'></view>
			</view>
			<view class='yyt-vipPay_H' @click="car">
				<img src="static/4.png" alt="">
				<view class='yyt-btn_H'>购物车</view>
				<view class='yyt-icon_H'></view>
			</view>
		</view>
		<view class="space"></view>
		<view class="yyt-center-r">
			<!-- <view class='yyt-vipPay_H yyt-bottom-border'>
				<a href="tel:15611686162">
					<view class='yyt-btn_H'>在线客服</view>
					<view class='yyt-icon_H'></view>
				</a>
			</view> -->
			<view class='yyt-vipPay_H yyt-bottom-border' @click="message">
				<img src="static/6.png" alt="">
				<view class='yyt-btn_H'>意见反馈</view>
				<view class='yyt-icon_H'></view>
			</view>
			<view class='yyt-vipPay_H' @click="aboutUs">
				<img src="static/7.png" alt="">
				<view class='yyt-btn_H'>关于我们</view>
				<view class='yyt-icon_H'></view>
			</view>
		</view>
		<view class="space"></view>
	</view>
</template>

<script>
	import {
		requestUrl,
		STORE_ID
	} from '@/common/request.js'

	export default {

		data() {
			return {
				title: 'Hello',
				user: '',
				info: {},
				store_id: ''
			}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
			this.load();
		},
		onLoad() {
			// uni.setNavigationBarTitle({
			// 	title: '个人中心'
			// })
			var userInfo = uni.getStorageSync('userInfo');
			this.user = userInfo;
			this.store_id = STORE_ID
			this.load();

		},
		methods: {
			load() {
				var openid = uni.getStorageSync('openid');
				requestUrl({
					url: 'user_info',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'POST',
					data: {
						store_id: this.store_id,
						account: openid,
					},
					success: res => {
						console.log('success个人中心', res)
						uni.stopPullDownRefresh();
						if (res.data.code == 1001) {
							this.info = res.data.data;
						}
					},
				});
			},
			liveclassD(course_id, list_id) {
				uni.navigateTo({
					url: '/pages/liveclassD/liveclassD?course_id=' + course_id + '&list_id=' + list_id,
				})
			},
			colectCourse() {
				uni.navigateTo({
					url: '/pages/colectCourse/colectCourse'
				})
			},
			payCourse() {
				uni.navigateTo({
					url: '/pages/payCourse/payCourse'
				})
			},
			history() {
				uni.navigateTo({
					url: '/pages/history/history'
				})
			},
			exchange() {
				uni.navigateTo({
					url: '/pages/exchange/exchange'
				})
			},
			order() {
				uni.navigateTo({
					url: '/pages/order/order'
				})
			},
			addressList() {
				uni.navigateTo({
					url: '/pages/addressList/addressList'
				})
			},
			car() {
				uni.navigateTo({
					url: '/pages/car/car'
				})
			},
			aboutUs() {
				uni.navigateTo({
					url: '/pages/aboutUs/aboutUs'
				})
			},
			message() {
				uni.navigateTo({
					url: '/pages/message/message'
				})
			},
		}
	}
</script>

<style>
	.video_demo {
		width: 100%;
	}

	.yyt-center {
		width: 100%;
		height: 530rpx;
		position: relative;
	}

	.yyt-center-bg {
		width: 100%;
		height: 400rpx;
		background: #4986ff;
	}

	.yyt-center-bg-bottom {
		position: absolute;
		left: 0;
		top: 300rpx;
		width: 100%;
		height: 100rpx;
	}

	.yyt-center-user {
		position: absolute;
		top: 45rpx;
		left: 0;
		width: 100%;
		height: 250rpx;
		z-index: 20
	}

	.yyt-center-user-avatar {
		width: 180rpx;
		height: 180rpx;
		margin: 0 auto;
		position: relative;
	}

	.yyt-center-user-avatar img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.yyt-center-user-aname {
		position: absolute;
		top: 150rpx;
		left: 42rpx;
		width: 100rpx;
		height: 40rpx;
		line-height: 40rpx;
		background: #fff;
		color: #4986ff;
		text-align: center;
		font-size: 24rpx;
		border-radius: 5rpx;
	}

	.yyt-center-user-name {
		width: 100%;
		height: 40rpx;
		margin-top: 20rpx;
		text-align: center;
		font-size: 30rpx;
		color: #fff;
	}

	.yyt-center-nav {
		position: absolute;
		bottom: 20rpx;
		left: 0;
		width: 100%;
		height: 150rpx;
		z-index: 20
	}

	.yyt-center-nav-center {
		width: 90%;
		height: 142rpx;
		margin: 0 auto;
		border-radius: 10rpx;
		border: 1rpx solid #ebebeb;
		background: #fff;
		-moz-box-shadow: 0px 1px 7px #dedede;
		-webkit-box-shadow: 0px 1px 7px #dedede;
		box-shadow: 0px 1px 10px #dedede;
	}

	.navs {
		display: inline-block;
		width: 30.3333333%;
		height: 150rpx;
		padding: 10rpx;
	}

	.navs view {
		text-align: center;
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
	}

	.navs-num {
		font-size: 32rpx;
	}

	.yyt-info-title {
		width: 92%;
		height: 90rpx;
		margin: 0 auto;
		line-height: 90rpx;
	}

	.yyt-center-r {
		width: 92%;
		height: auto;
		margin: 0 auto;
	}

	.yyt-watch {
		width: 42%;
		height: 340rpx;
		display: inline-block;
		margin-left: 30rpx;
	}

	.scroll-view {
		width: 100%;
		height: 350rpx;
		display: flex;
		flex-direction: row;
		white-space: nowrap;
	}

	.yyt-watch img {
		width: 100%;
		height: 200rpx;
	}

	.yyt-watch view {
		width: 100%;
		height: 100rpx;
		white-space: normal;
		font-size: 24rpx;
	}

	/* 列表 */

	.yyt-vipPay_H {
		width: 100%;
		height: 95rpx;
		line-height: 95rpx;
		background: #fff;
		position: relative;
	}

	.yyt-vipPay_H img {
		position: absolute;
		top: 31rpx;
		left: 10rpx;
		width: 35rpx;
		height: 35rpx;
	}

	.yyt-icon_H {
		position: absolute;
		top: 40rpx;
		right: 15rpx;
		width: 15rpx;
		height: 15rpx;
		border-top: 1px solid #363636;
		border-right: 1px solid #363636;
		transform: rotate(45deg);
	}


	.yyt-btn_H {
		width: 50%;
		height: 95rpx;
		color: #000;
		float: left;
		margin-left: 54rpx;
		line-height: 95rpx;
		font-size: 28rpx;
	}

	.yyt-bottom-border {
		border-bottom: 1rpx solid rgba(0, 0, 0, 0.1);
	}

	@keyframes move_wave {
		0% {
			transform: translateX(0) translateZ(0) scaleY(1)
		}

		50% {
			transform: translateX(-25%) translateZ(0) scaleY(0.55)
		}

		100% {
			transform: translateX(-50%) translateZ(0) scaleY(1)
		}
	}

	.waveWrapper {
		overflow: hidden;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		margin: auto;
	}

	.waveWrapperInner {
		position: absolute;
		width: 100%;
		overflow: hidden;
		height: 200px;
		top: 0;
		background-image: linear-gradient(to top, #4986ff 20%, #4986ff 80%);
	}

	.bgTop {
		z-index: 15;
		opacity: 0.5;
	}

	.bgMiddle {
		z-index: 10;
		opacity: 0.75;
	}

	.bgBottom {
		z-index: 5;
	}

	.wave {
		position: absolute;
		left: 0;
		width: 200%;
		height: 100%;
		background-repeat: repeat no-repeat;
		background-position: 0 bottom;
		transform-origin: center bottom;
	}

	.waveTop {
		background-size: 50% 100px;
	}

	.waveAnimation .waveTop {
		animation: move-wave 3s;
		-webkit-animation: move-wave 3s;
		-webkit-animation-delay: 1s;
		animation-delay: 1s;
	}

	.waveMiddle {
		background-size: 50% 120px;
	}

	.waveAnimation .waveMiddle {
		animation: move_wave 10s linear infinite;
	}

	.waveBottom {
		background-size: 50% 100px;
	}

	.waveAnimation .waveBottom {
		animation: move_wave 15s linear infinite;
	}
</style>