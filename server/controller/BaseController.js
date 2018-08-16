const logger = require('../utils/winston');
const crypto = require('crypto');

class BaseController {
    /**
     * 从session中获取用户信息
     * @param ctx
     * @param next
     * @returns {Promise.<*>}
     */
    static async getUserSession(ctx, next) {
        if (ctx.session.users && ctx.session.token) {
            let data = {
                users: ctx.session.users,
                token: ctx.session.token
            };
            next();
            return data;
        } else {
            ctx.redirect('/login?returnUrl=' + ctx.url);
            return false;
        }
    }

    /**
     * md5加密
     * @param data
     * @returns {Promise.<*>}
     */
    static async md5(data) {
        return crypto.createHash('md5').update(data).digest('hex');
    }

    /**
     * 判断是否是微信浏览器环境
     * @param ctx
     * @returns {boolean}
     */
    static isWechatBrowser(ctx) {
        let ua = ctx.headers["user-agent"].toLowerCase();
        if(ua.match(/MicroMessenger/i)) {
            return ua.match(/MicroMessenger/i)[0] === 'micromessenger';
        }else{
            return false;
        }
    }

    /**
     * 返回正确的json信息
     */
    toJson(data,originData) {
        const successData = {
            code:0,
            msg:'操作成功',
            data: data.data,
        }


        if(data.code === 0){
            if(process.env.NODE_ENV === 'development'){
                successData.originData = originData.data
            }
            return successData
        }else{
            return {
                code:data.code,
                msg:data.msg,
            }
        }
    }

    /**
     * 返回错误信息
     */
    toError(){
        return {
            code:-1,
            msg:"网络错误",
        }
    }
}

module.exports = BaseController;
