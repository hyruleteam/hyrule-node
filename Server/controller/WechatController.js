const BaseController = require('./BaseController');
const WechatAPI = require('co-wechat-api');
const LoginService = require('./../service/LoginService');
const config = require('../../Config/server/index');

class WechatController extends BaseController {
    static async home(ctx, next) {
        await ctx.render('wechat', {
            title: '微信'
        })
    }

    static async getWechatJSSignature(ctx,next){
        const api = await new WechatAPI(config.wechat.appId, config.wechat.appSecret);
        let params = ctx.request.body;
        ctx.body = await api.getJsConfig(params)
    }

    static async wechatLogin(ctx,next){
        try{
            let params = {
                openid: ctx.session.userInfo.openid,
                timestamp: new Date().getTime(),
            };

            params.hashKey = await super.md5(params.openid+params.timestamp+"scxm");

            const loginData = await super.interceptor(new LoginService().wechatLogin(params),ctx);

            if(loginData){
                ctx.session.users = loginData.data.accountUser;
                ctx.session.token = loginData.data.token;
            }

            return loginData;

        }catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = WechatController;