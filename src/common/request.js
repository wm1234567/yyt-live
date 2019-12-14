
/* 公共图片路径前缀 */
const IMGURL = '';

/**
 * 公共 门店ID
 */

// const STORE_ID = '5'; //开发版
const STORE_ID = '1'; //正式测试
// const STORE_ID = '2'; //正式使用 屹伦教育
// const STORE_ID = '4'; //正式使用 玉溪小红马网络科技有限公司
// const STORE_ID = '8'; //正式使用 鄂尔多斯橙果科技

/** 
 * 公共 授权地址
 */

// store_id = 5 开发版
// const URL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaf87a0b12aaeaaf8&redirect_uri=http%3A%2F%2Fzb1.yueyat.net%2F&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

// store_id = 1 正式测试
const URL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaf87a0b12aaeaaf8&redirect_uri=http%3A%2F%2Fmzb.yueyat.vip%2F&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

// store_id = 2 正式使用 屹伦教育
// const URL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfbd890210884b64d&redirect_uri=http%3A%2F%2Fyljy.yueyat.vip%2F&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

// store_id = 4 正式使用 玉溪小红马网络科技有限公司
// const URL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc238823e390e11b9&redirect_uri=http%3A%2F%2Fyxxhm.yueyat.vip&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

// store_id = 8 正式使用 鄂尔多斯橙果科技
// const URL = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx283d25b7a640891a&redirect_uri=http%3A%2F%2Fcgkj.yueyat.vip&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

/* 公共 request 方法 */
const requestUrl = ({
    url,
    data,
    success,
    fail,
    complete,
    method,
}) => {
    // uni.showLoading({
    //     title: '加载中',
    // });
    // let server = 'https://yytzb.yueyat.net/api/'; //开发基域名

    let server = 'https://zb.yueyat.vip/api/'; //正式使用基域名

    uni.request({
        url: server + url, //基域名 + 方法
        method: method,
        data: data,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        success: res => {
            uni.hideLoading();
            return typeof success == 'function' && success(res)
        },
        fail: res => {
            uni.hideLoading();
            // uni.showModal({
            //     title: '网络错误',
            //     content: '网络出错，请刷新重试',
            //     showCancel: false
            // })
            return typeof fail == 'function' && fail(res)
        },
        complete: res => {
            uni.hideLoading()
            return typeof complete == 'function' && complete(res)
        }
    });
}

module.exports = {
    requestUrl: requestUrl,
    IMGURL: IMGURL,
    STORE_ID: STORE_ID,
    URL: URL
}