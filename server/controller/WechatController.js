const WechatAPI = require('co-wechat-api');
const BaseController = require('./BaseController');

const config = require('config');
const wechatConfig = config.get('Customer.wechatConfig');


class WechatController extends BaseController {
    /**
     * 生成微信JS-SDK签名
     * @param {*Object} ctx
     * @param {*Function} next
     */
    static async getWechatJSSignature(ctx, next) {
        const api = await new WechatAPI(wechatConfig.appId, wechatConfig.appSecret);
        let params = ctx.request.body;
        ctx.body = await api.getJsConfig(params)
    }
}

module.exports = WechatController;
