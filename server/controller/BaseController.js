const config = require('../../config/server/index');
const crypto = require('crypto');
const log = require('../utils/log')

class BaseController {
    static config() {
        return config;
    }

    /**
     * 登录拦截器 检测token的有效性
     * @param data
     * @param ctx
     * @param next
     * @returns {Promise.<*>}
     */
    static async interceptor(data, ctx, next) {
        const d = await data;
        const start = new Date();
        let ms;
        try {
            if (d.code === -1) {
                ctx.redirect('/login?returnUrl=' + ctx.url)
                return false;
            } else if (d.code === 1) {
                let err = {
                    status:ctx.status,
                    message:d.msg,
                    stack:`${d.uri}:${d.msg}`,
                    name:'后台接口报错'
                };

                ms = new Date() - start;
                log.e(ctx, err, ms);

                return false;
            } else {
                return d;
            }

        } catch (error) {
            throw new Error(error);
        }
    }

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
}

module.exports = BaseController;