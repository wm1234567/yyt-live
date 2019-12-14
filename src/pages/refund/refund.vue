<template>
    <view class="yyt-container">
        <form @submit="formSubmit">
            <view class="uni-textarea"><textarea placeholder-style="color:#666" placeholder="请填写你的退款理由"
                    name="content" /></view>
            <view class="yyt-upload-img" @tap="chooseImage">
            <view class="yyt-imglist" v-for="(item, index) in imgArr" :key="index" >
                <img class="yyt-delimg" src="static/del.png" alt="" @click="delImg(index)">
                <img class="yyt-img" :src="item" alt="">
            </view> 
            <img class="upload-img" src="static/upload.png" alt="">
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
                items_id:'',
                order_id:''
            }
        },

        onLoad(opt) {
            this.store_id = STORE_ID;
            this.order_id = opt.order_id;
            this.items_id = opt.items_id
        },
        methods: {
            // 发起表单提交事件
            formSubmit(e){
                var that = this
                var _imgArr = []
                var openid = uni.getStorageSync('openid');
                var content = e.detail.value.content
                if(content == ''){
                    uni.showToast({
                        title: '请填写',
                        mask: false,
                        duration: 2000,
                        icon: "none"
                    });
                    return
                }
                this.disabledFlg = true;
                this.loadingFLg = true;
                for(let i in this.imgArr){
                    uni.uploadFile({
                        url : 'https://yytzb.yueyat.net/api/upload_img',
                        filePath: this.imgArr[i],
                        name: 'file',
                        success: function (res) {
                            var imgStr = JSON.parse(res.data)
                            if (imgStr.code == 1001) {
                                _imgArr.push(imgStr.data)
                                if (_imgArr.length == that.imgArr.length) {
                                    that.formData(content, _imgArr)
                                }
                            }else{
                                uni.showToast({
                                    title: '图片上传失败',
                                    mask: false,
                                    duration: 2000,
                                    icon: "none"
                                });
                            }
                        }
                    });
                }
            },
            // 提交提交
            formData(content, _imgArr){
                var openid = uni.getStorageSync('openid');
                requestUrl({
                    url: 'shop_order_refund',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: 'POST',
                    data: {
                        account: openid,
                        store_id: this.store_id,
                        refund_type: 1,
                        refuse: content,
                        discuss_pic: _imgArr,
                        items_id: this.items_id,
                        order_id: this.order_id
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
            // 上传图片
            chooseImage(){
                var that = this
                var _imgArr = []
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
            // 删除照片
            delImg(index){
                var picArr = this.imgArr;
                picArr.splice(index, 1);
                this.imgArr = picArr;
            }
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
    .yyt-imglist{
        position: relative;
        width: 130rpx;
        height: 130rpx;
        overflow: hidden;
        float: left;
        margin-right: 10rpx
    }
    .yyt-delimg{
        position: absolute;
        top: 0rpx;
        right: 0rpx;
        width: 35rpx;
        height: 35rpx;
        z-index: 1
    }
    .yyt-img{
        width: 110rpx;
        height: 110rpx;
        float: left;
    }
    .upload-img{
        width: 110rpx;
        height: 110rpx;
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