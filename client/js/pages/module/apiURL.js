/**
 * 接口地址
 */
define([], function() {
    /*通用接口地址*/
    var apiURL = {};
    apiURL.baseURL = 'https://cnodejs.org/api/v1'; // 测试服务器

    apiURL.socketUrl = apiURL.baseURL.replace('http://', '');
    apiURL.yjUrl = apiURL.baseURL + "/open/api/";
    apiURL.hostUrl = apiURL.baseURL + "/open/api/wap";
    apiURL.getCaptcha = apiURL.baseURL + "/open/api/base/getCaptcha"; //全局获取验证码
    apiURL.checkCaptcha = apiURL.baseURL + "/open/api/base/checkCaptcha"; //全局验证验证码
    apiURL.uploadUrl = apiURL.baseURL + "/open/file/upload/wap"; //上传图片路径

    return apiURL;
});