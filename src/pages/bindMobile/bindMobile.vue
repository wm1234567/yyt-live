<template>
	<view class="yyt-container">
		<form @submit="formSubmit">
			<view class="yyt-input-view">
				<view class="yyt-input-tltle">
					+86
				</view>
				<input class="yyt-input" name="mobile" placeholder="" />
				<!-- <view class="yyt-input-code" v-show="show" @click="getCode">获取验证码</view>
				<view class="yyt-input-code_" v-show="!show">{{ count }}s后重新获取</view> -->
			</view>
			<!-- <view class="yyt-input-view">
				<view class="yyt-input-tltle">
					验证码
				</view>
				<input class="yyt-code" name="code" placeholder="" />
			</view>
			<view class="yyt-input-view">
				<view class="yyt-input-tltle">
					登录密码
				</view>
				<input class="yyt-code" name="pass" placeholder="" />
			</view> -->
			<view class="yyt-submit">
				<button form-type="submit" :loading="loadingFLg" :disabled="disabledFlg">确定</button>
			</view>
		</form>
		<view class="yyt-toast">提示：请务必绑定您的手机号，以便创建您的个人信息</view>
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
				show: true,
				count: '',
				timer: null,
				store_id: '',
				loadingFLg: false,
				disabledFlg: false,
			}
		},
		onLoad() {
			this.store_id = STORE_ID
		},
		methods: {
			formSubmit: function (e) {
				var value = e.detail.value;
				var TELRGE = /^[1][3,4,5,7,8][0-9]{9}$/;
				var openid = uni.getStorageSync('openid');
				if (value.mobile == '') {
					uni.showToast({
						title: '请填写手机号',
						mask: false,
						duration: 2000,
						icon: "none"
					});
					return
				}
				if (!TELRGE.test(value.mobile)) {
					uni.showToast({
						title: '手机号码格式错误',
						mask: false,
						duration: 2000,
						icon: "none"
					});
					return;
				}
				this.disabledFlg = true;
				this.loadingFLg = true;
				requestUrl({
					url: 'mobile',
					header: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					method: 'POST',
					data: {
						login_type: 1,
						mobile: value.mobile,
						account: openid,
						store_id: this.store_id
					},
					success: res => {
						console.log('success', res)
						this.disabledFlg = false;
						this.loadingFLg = false;
						if (res.data.code == 1001) {
							uni.showToast({
								title: res.data.message,
								mask: false,
								duration: 2000,
								icon: "none"
							});
							// this.$store.commit('yesTel')
							setTimeout(() => {
								uni.navigateBack({})
							}, 1000)
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

			// 验证码倒计时
			getCode() {
				const TIME_COUNT = 60;
				if (!this.timer) {
					this.count = TIME_COUNT;
					this.show = false;
					this.timer = setInterval(() => {
						if (this.count > 0 && this.count <= TIME_COUNT) {
							this.count--;
						} else {
							this.show = true;
							clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000)
				}
			}
		}
	}
</script>

<style scoped>
	page {
		background: #f4f4f4
	}

	.yyt-input-view {
		width: 100%;
		height: 100rpx;
		margin: 0 auto;
		background: #fff;
		margin-top: 20rpx
	}

	.yyt-input-tltle {
		width: 20%;
		height: 100rpx;
		float: left;
		line-height: 100rpx;
		border-right: #f4f4f4 5rpx solid;
		font-size: 33rpx;
		padding-left: 10rpx;
		color: #000
	}

	.yyt-input {
		width: 50%;
		height: 70rpx;
		float: left;
		margin-top: 15rpx
	}

	.yyt-input-code {
		width: 25%;
		height: 60rpx;
		text-align: center;
		line-height: 56rpx;
		color: orange;
		float: left;
		border: orange 1rpx solid;
		border-radius: 10rpx;
		margin-top: 20rpx;
		font-size: 22rpx
	}

	.yyt-input-code_ {
		width: 25%;
		height: 60rpx;
		text-align: center;
		line-height: 56rpx;
		color: #dedede;
		float: left;
		border: #dedede 1rpx solid;
		border-radius: 10rpx;
		margin-top: 20rpx;
		font-size: 22rpx
	}

	.yyt-code {
		width: 75%;
		height: 70rpx;
		float: left;
		margin-top: 15rpx
	}

	.yyt-submit {
		width: 95%;
		height: 80rpx;
		margin: 0 auto;
		margin-top: 50rpx
	}

	.yyt-submit button {
		width: 100%;
		height: 80rpx;
		background: orange;
		color: #fff;
		text-align: center;
		line-height: 80rpx;
		font-size: 32rpx
	}

	button::after {
		border: none;
	}

	.yyt-toast {
		width: 100%;
		height: 60rpx;
		text-align: center;
		color: #fb4f6c;
		margin-top: 40rpx;
		font-size: 28rpx
	}
</style>