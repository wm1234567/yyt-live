
/* 公共图片路径前缀 */
const IMGURL = 'https://yytzb.yueyat.net/storage/';
// 门店id
const STORE_ID = '5';
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
    let server = 'https://yytzb.yueyat.net/api/'; //基域名

    uni.request({
        url: server + url, //基域名 + 方法
        method: method,
        data: data,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        success: res => {
            // uni.hideLoading();
            return typeof success == 'function' && success(res)
        },
        fail: res => {
            uni.hideLoading();
            uni.showModal({
                title: '网络错误',
                content: '网络出错，请刷新重试',
                showCancel: false
            })
            return typeof fail == 'function' && fail(res)
        },
        complete: res => {
            // uni.hideLoading()
            return typeof complete == 'function' && complete(res)
        }
    });
}

module.exports = {
    requestUrl: requestUrl,
    IMGURL: IMGURL,
    STORE_ID: STORE_ID
}