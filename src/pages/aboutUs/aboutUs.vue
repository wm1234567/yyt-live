<template>
    <view class="yyt-container">
        <rich-text :nodes="about"></rich-text>
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
                store_id: '',
                about: ''
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.load();
        },


        //初始加载
        onLoad(opt) {
            this.store_id = STORE_ID;
            this.load();
        },

        methods: {
            load() {
                requestUrl({
                    url: 'about',
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
                            this.about = res.data.data.about;
                            uni.stopPullDownRefresh();
                        }
                    },
                });
            },

        }
    }
</script>

<style scoped>

</style>