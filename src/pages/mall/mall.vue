<template>
	<!-- 暂时弃用组件就不删了 万一有用呢?-->
	<view class="yyt-container">
		<!-- 轮播图 -->
		<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
			:duration="duration">
			<block v-for="(item,index) in banner" :key="index">
				<swiper-item>
					<img class="img" :src="item" />
				</swiper-item>
			</block>
		</swiper>
		<view class="yyt-title">
			<img class="yyt-title-icon" src="static/titIcon.png" />
			<view class="yyt-title-text">热卖书籍</view>
		</view>
		<view class="yyt-books" v-for='(item,index) in books' :key="index" @click="booksD">
			<view class="yyt-books-img">
				<img :src="item.img" lazy-load alt="" />
			</view>
			<view class="yyt-books-bottom">
				<view class="yyt-books-bottom-t">{{item.title}}</view>
				<view class="yyt-books-bottom-st">已售：{{item.ys}}/库存：{{item.kc}}</view>
				<view class="yyt-books-bottom-money">￥{{item.fee}}</view>
			</view>
		</view>
		<view class="yyt-car-icon" @click="car">
			<img src="static/carIcon.png" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				banner: [
					'static/indexbaner.jpg',
					'static/indexbaner.jpg',
				],
				books: [{
					img: 'static/indexbaner.jpg',
					title: '事业单位录用考试全科公共基础知识',
					ys: '3.6',
					kc: '99',
					fee: '99'
				}, {
					img: 'static/indexbaner.jpg',
					title: '事业单位录用考试全科公共基础知识',
					ys: '3.6',
					kc: '99',
					fee: '99'
				}, {
					img: 'static/indexbaner.jpg',
					title: '事业单位录用考试全科公共基础知识',
					ys: '3.6',
					kc: '99',
					fee: '99'
				}, ]
			}
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		},
		onLoad() {

		},
		methods: {
			booksD() {
				uni.navigateTo({
					url: '/pages/booksD/booksD'
				})
			},
			car() {
				uni.navigateTo({
					url: '/pages/car/car'
				})
			}
		}
	}
</script>

<style>
	.yyt-car-icon {
		position: fixed;
		right: 5rpx;
		bottom: 150rpx;
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}

	.yyt-car-icon img {
		width: 100%;
		height: 100%
	}
</style>