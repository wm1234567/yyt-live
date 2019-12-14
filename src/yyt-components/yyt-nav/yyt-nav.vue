<template>
    <view class="yyt-nav">
        <view class="yyt-nav-view" v-for='(item,index) in navlist' :key="index" @click="navclass(item.type_id,index)">
            <view class="yyt-nav-icon">
                <img :src="item.img" lazy-load alt="" />
            </view>
            <view class="yyt-nav-text">{{ item.title }}</view>
        </view>
    </view>
</template>

<script>
    import {
        requestUrl,
        STORE_ID
    } from '@/common/request.js'
    export default {
        name: 'YytBanner',
        props: ['navlist'], //父组件传值
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
            // 跳转导航分类
            navclass(e, index) {
                uni.navigateTo({
                    url: '/pages/navclass/navclass?type_id=' + e +'&nowIndex=' + index
                })
            },
        }
    }
</script>
<style scoped>

</style>