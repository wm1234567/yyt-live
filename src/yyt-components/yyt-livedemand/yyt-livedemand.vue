<template>
    <view class="yyt-list">
        <view class="yyt-title" @click="livedemandlist">
            <img class="yyt-title-icon" src="static/titIcon.png" />
            <view class="yyt-title-text">精品点播</view>
            <img class="yyt-title-right" src="static/right.png" />
        </view>
        <view class="yyt-con" v-if="livedemand">
            <view @click="liveDemandDetail(livedemand.course_id)">
                <img class="yyt-stateIcon" src="static/zb.png" />
                <view class="yyt-con-title">{{ livedemand.title }}</view>
                <view class="yyt-con-time">开课时间：{{ livedemand.opentime }}</view>
                <view class="yyt-con-time">授课时长：{{ livedemand.duration }}小时</view>
            </view>
            <view class="yyt-bottom">
                <view class="yyt-bottom-lr">
                    <img v-for="(item,index) in livedemand.anchor_id" :key="index" :src="item.avatar"
                        @click="teacher(item.anchor_id)" />
                </view>
                <view class="yyt-bottom-lr">
                    <view class="lr-class-type" v-if="livedemand.paytype == '1'">￥{{ livedemand.price }}</view>
                    <view class="lr-class-type" v-if="livedemand.paytype == '2'">免费课</view>
                    <view class="lr-class-num">{{ livedemand.join_num }}人加入学习</view>
                </view>
            </view>
        </view>
        <view class="null" v-else>暂无数据</view>
        <view class="space"></view>
    </view>
</template>

<script>
    import {
        requestUrl,
        STORE_ID
    } from '@/common/request.js'
    export default {
        name: 'YytLiveDemand',
        props: ['livedemand'], //父组件传值
        data() {
            return {
                indicatorDots: true,
                autoplay: true,
                interval: 2000,
            }
        },
        created() {
     
        },
        methods: {
            // 跳转精品点播
            livedemandlist() {
                uni.navigateTo({
                    url: '/pages/livedemand/livedemand'
                })
            },
            // 跳转直播详情
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
<style scoped>

</style>