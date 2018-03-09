const baseURL = "https://cnodejs.org/api/v1"
module.exports = {
    hostUrl: baseURL,
    wechat: {
        appId: "wx3039b960a183e45c",
        appSecret: "66fc3a8087885ddee3bc24d6bbf7ef52",
        scope: 'snsapi_userinfo'
    },
    redis: {
        host: '127.0.0.1',
        port: '6379',
        pass: ''
    }
}