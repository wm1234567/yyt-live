<template>
    <view class="yyt-container">
        <form @submit="formSubmit">
            <view class="uni-textarea"><textarea placeholder-style="color:#666" placeholder="期待你得评价" name="content" /></view>
            <view class="yyt-upload-img" @tap="chooseImage">
            <view class="yyt-imglist" v-for="(item, index) in imgArr" :key="index" >
                <img :src="item" alt="">
            </view> 
            <img class="upload-img" src="static/upload.png" alt="">
            </view>
            <view class="example-body">
                <view class="yyt-ev-title">交易评分</view>
                <uni-rate :max="5" :size="23" :value="0"  @change="onChange" />
            </view>
            <view class="yyt-submit">
				<button form-type="submit" :loading="loadingFLg" :disabled="disabledFlg">提交</button>
			</view>
        </form>
    </view>
</template>

<script>
    import uniRate from '@/components/uni-rate/uni-rate.vue'
    import {
        requestUrl,
        STORE_ID
    } from '@/common/request.js'
    export default {
        components: {
            uniRate
        },
        data() {
            return {
                loadingFLg: false,
                disabledFlg: false,
                imgArr:[],
                URL: '',
                imgist: [],
                store_id: '',
                level:'',
                items_id:'',
                shop_id:''
            }
        },

        onLoad(opt) {
            this.store_id = STORE_ID;
            this.shop_id = opt.shop_id;
            this.items_id = opt.items_id
        },
        methods: {
            formSubmit(e){
                var openid = uni.getStorageSync('openid');
                if(e.detail.value.content == ''){
                    uni.showToast({
                        title: '请评价',
                        mask: false,
                        duration: 2000,
                        icon: "none"
                    });
                    return
                }
                this.disabledFlg = true;
                this.loadingFLg = true;
                requestUrl({
                    url: 'shop_order_discuss',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        content: e.detail.value.content,
                        level: this.level,
                        discuss_pic: 1,
                        items_id: this.items_id,
                        shop_id: this.shop_id
                    },
                    success: res => {
                        console.log('success', res)
                        this.disabledFlg = true;
                        this.loadingFLg = true;
                        if (res.data.code == 1001) {
                            uni.showToast({
                                title: '提交成功',
                                mask: false,
                                duration: 2000,
                                icon: "none"
                            });
                            setTimeout(()=>{
                                uni.navigateBack({})
                            },500)
                        }else{
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
            // 交易打分
            onChange(e) {
                this.level = e.value;
            },
            // 上传图片
            chooseImage(){
                var that = this
                uni.chooseImage({
                    count: 9, //默认9
                    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album'], //从相册选择
                    success: function (res) {
                        console.log(res.tempFilePaths)
                        that.imgArr = res.tempFilePaths
                        console.log(that.imgArr)
                    }
                 })
            },
        }
    }

</script>

<style scoped>
    .uni-textarea{
        border-top: 1rpx solid #f4f4f4
    }
    .example-body{
        width: 95%;
        height: auto;
        margin: 20rpx

    }
    .yyt-ev-title{
        width: 20%;
        height: 50rpx;
        float: left;
    }
    uni-rate{
        width: 50%;
        float: left;
    }
    .yyt-upload-img{
        width: 95%;
        height: auto;
        margin: 0 auto;
        border-bottom: 1rpx solid #f4f4f4;
        padding: 10rpx;
        overflow: hidden;
    }
    .yyt-imglist img{
        width: 100rpx;
        height: 100rpx;
        float: left;
        margin-right: 10rpx
    }
    .upload-img{
        width: 100rpx;
        height: 100rpx;
        float: left; 
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
</style>