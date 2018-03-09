const config = require('../../config/server/index');
const BaseController = require('./BaseController');
const WechatAPI = require('co-wechat-api');

class WechatController extends BaseController {
    /**
     * 生成微信JS-SDK签名
     * @param {*Object} ctx 
     * @param {*Function} next 
     */
    static async getWechatJSSignature(ctx, next) {
        const api = await new WechatAPI(config.wechat.appId, config.wechat.appSecret);
        let params = ctx.request.body;
        ctx.body = await api.getJsConfig(params)
    }
}

module.exports = WechatController;