<script>
	export default {

		onLaunch: function () {

		},
		onShow: function () {

		},
		onHide: function () {

		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/uni.css';

	page {
		background: #fff
	}

	.space {
		width: 100%;
		height: 20rpx;
		background: #f2f6ff;
	}

	.yyt-container {
		width: 100%;
		height: auto;
	}

	.yyt-top {
		width: 100%;
		height: auto;
		position: relative;
		background: #fff;
	}

	.img {
		width: 100%;
		height: 100%;
	}

	.swiper {
		width: 100%;
		height: 350rpx;
	}

	.yyt-search {
		width: 122rpx;
		height: 160rpx;
		position: absolute;
		top: 290rpx;
		right: 50rpx;
	}

	/* 导航 */

	.yyt-nav {
		width: 92%;
		background: #fff;
		overflow: hidden;
		height: auto;
		margin: 0 auto;
		margin-top: 75rpx;
		padding-bottom: 40rpx;
	}

	.yyt-nav-view {
		width: 25%;
		height: 150rpx;
		float: left;
	}

	.yyt-nav-icon {
		width: 90rpx;
		height: 90rpx;
		margin: 0 auto;
	}

	.yyt-nav-icon img {
		width: 100%;
		height: 100%;
		border-radius: 50%
	}

	.yyt-nav-text {
		width: 100%;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		color: #333;
		font-size: 23rpx;
	}

	/* 直播列表 */

	.yyt-list {
		width: 100%;
		height: auto;
		/* margin-top: 20rpx; */
		background: #fff;
	}

	.yyt-title {
		width: 92%;
		height: 90rpx;
		margin: 0 auto;
		position: relative;
	}

	.yyt-title-icon {
		width: 6rpx;
		height: 30rpx;
		position: absolute;
		top: 28rpx;
		left: 0;
	}

	.yyt-title-right {
		width: 11rpx;
		height: 20rpx;
		position: absolute;
		top: 37rpx;
		right: 0;
	}

	.yyt-title-text {
		width: 50%;
		height: 90rpx;
		line-height: 90rpx;
		float: left;
		margin-left: 16rpx;
		color: #000;
		font-size: 30rpx;
		font-weight: bold
	}

	.yyt-list-title {
		width: 92%;
		height: 80rpx;
		line-height: 80rpx;
		margin: 0 auto;
		color: #000;
		font-size: 29rpx;
	}

	.yyt-list-user {
		width: 92%;
		height: 90rpx;
		margin: 0 auto;
	}

	.user-view {
		width: 25%;
		height: 80rpx;
		float: left;
	}

	.user-view img {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		float: left;
	}

	.user-view view {
		width: 55%;
		height: 60rpx;
		line-height: 32rpx;
		float: left;
		padding-left: 10rpx;
		font-size: 22rpx;
		color: #5e5e5e;
	}

	/* 直播课程列表公共样式 */

	.yyt-live-class {
		width: 100%;
		height: auto;
	}

	.yyt-live {
		width: 100%;
		height: auto;
		position: relative;
	}

	.yyt-teacher-bg {
		width: 100%;
		height: 400rpx;
	}

	.yyt-teacher-bg-zz {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 400rpx;
		background: rgba(0, 0, 0, 0.5);
	}

	.yyt-live-state {
		width: 140rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		position: absolute;
		top: 25rpx;
		left: 20rpx;
		background: #fb4f6c;
		color: #fff;
		border-radius: 25rpx;
		font-size: 24rpx;
	}

	.yyt-live-state_1 {
		width: 140rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		position: absolute;
		top: 25rpx;
		left: 20rpx;
		background: #8a8a;
		color: #fff;
		border-radius: 25rpx;
		font-size: 24rpx;
	}

	/* 精品点播 */
	.yyt-con {
		width: 87%;
		margin: 0 auto;
		height: auto;
		background: #fff;
		margin-bottom: 22rpx;
		border-radius: 25rpx;
		position: relative;
		padding: 66rpx 25rpx 25rpx 25rpx;
		overflow: hidden;
		-moz-box-shadow: 0px 1px 7px #dedede;
		-webkit-box-shadow: 0px 1px 7px #dedede;
		box-shadow: 0px 1px 10px #dedede;
	}

	.yyt-con-title {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 30rpx;
		color: #000;
	}

	.yyt-con-time {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 24rpx;
		color: #5e5e5e;
	}

	.yyt-stateIcon {
		width: 161rpx;
		height: 53rpx;
		position: absolute;
		top: -1rpx;
		left: -1rpx;
	}

	.yyt-bottom {
		width: 100%;
		height: 80rpx;
		overflow: hidden;
	}

	.yyt-bottom-lr {
		width: 50%;
		height: 80rpx;
		float: left;
	}

	.yyt-bottom-lr img {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		float: left;
		margin: 10rpx 25rpx 0 0;
	}

	.lr-class-type {
		width: 100%;
		height: 40rpx;
		text-align: right;
		color: #fb4f6c;
		font-size: 28rpx;
		font-weight: bold
	}

	.lr-class-num {
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		text-align: right;
		color: #5e5e5e;
		font-size: 20rpx;
	}

	scroll-view {
		width: 100%;
		height: 560rpx;
		display: flex;
		flex-direction: row;
		white-space: nowrap;
	}

	/* 书籍列表公共样式 */

	.yyt-books {
		width: 44%;
		height: 550rpx;
		margin-left: 31rpx;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
		display: inline-block;
		-moz-box-shadow: 0px 1px 7px #dedede;
		-webkit-box-shadow: 0px 1px 7px #dedede;
		box-shadow: 0px 1px 10px #dedede;
	}

	.yyt-books-img {
		width: 100%;
		height: 350rpx;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}

	.yyt-books-img img {
		width: 100%;
		height: 100%;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
	}

	.yyt-books-bottom {
		width: 100%;
		margin: 0 auto;
		height: 200rpx;
		border-top: 1rpx solid #dedede;
	}

	.yyt-books-bottom-t {
		width: 90%;
		margin: 0 auto;
		height: 85rpx;
		padding-top: 15rpx;
		white-space: normal;
		font-size: 26rpx;
	}

	.yyt-books-bottom-st {
		width: 90%;
		margin: 0 auto;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 24rpx;
		color: #5e5e5e;
	}

	.yyt-books-bottom-money {
		width: 90%;
		margin: 0 auto;
		height: 50rpx;
		color: #fb4f6c;
		font-size: 26rpx;
	}

	/* 直播课程列表播放按钮样式 */
	.yyt-live-button {
		position: absolute;
		left: 0;
		top: 150rpx;
		z-index: 1;
		width: 100%;
		height: 100rpx;
	}

	.yyt-live-button-center {
		width: 100rpx;
		height: 100rpx;
		margin: 0 auto;
	}

	.yyt-live-button-center img {
		width: 100%;
		height: 100%;
		z-index: 999;
	}

	.yyt-topspace {
		width: 100%;
		height: 20rpx;
	}

	.yyt-loadmore {
		width: 100%;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		color: #5e5e5e;
		font-size: 29rpx
	}

	.yyt-rich-text {
		width: 95%;
		height: auto;
		margin: 0 auto;
		padding-top: 70rpx
	}

	rich-text img {
		width: 100% !important;
	}

	.yyt-null {
		width: 100%;
		height: 100rpx;
		padding-top: 200rpx
	}

	.yyt-null-icon {
		width: 250rpx;
		height: 250rpx;
		margin: 0 auto
	}

	.yyt-null-text {
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 26rpx;
		color: #bfbfbf
	}

	.vjs-big-play-button {
		width: 50px !important;
		height: 50px !important;
		border-radius: 50% !important;
		margin-left: -0.9em !important;
		font-size: 2.5em !important
	}

	/* 播放按钮自定义 */
	.vjs-play-control {
		background: rgba(0, 0, 0, 0.1);
		border: 0;
	}

	/* 音量按钮自定义 */
	.vjs-mute-control {
		padding-bottom: 0;
		background: rgba(0, 0, 0, 0.1);
		border: 0;
	}

	/* 播速按钮自定义 */
	.vjs-playback-rate {
		background: rgba(0, 0, 0, 0.1);
		border: 0;
	}

	/* audio按钮自定义 */
	.vjs-audio-button {
		background: rgba(0, 0, 0, 0.1);
		border: 0;
	}

	/* 全屏按钮自定义 */
	.vjs-fullscreen-control {
		background: rgba(0, 0, 0, 0.1);
		border: 0;
	}

	/* 按钮颜色自定义 */
	.vjs-icon-placeholder:before {
		color: #fff
	}

	.null {
		width: 100%;
		height: 70rpx;
		text-align: center;
		line-height: 70rpx;
		color: #666
	}
	a{
		 text-decoration:none;
	}
	/* .uni-video-video{
		width: 100%;
		height: auto !important;
	} */
	/* .uni-video-container{
		background: #fff
	} */
</style>