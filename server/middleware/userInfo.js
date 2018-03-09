const log = require('../utils/log')
module.exports = () => {
    return async(ctx, next) => {
        const start = new Date();
        let ms;
        try {
            let data = {};
            if (ctx.session.accountLink) {
                data.userType = ctx.session.accountLink.type
                ctx.state = Object.assign(ctx.state, data);
            } else {
                data.userType = 99;
                ctx.state = Object.assign(ctx.state, data);
            }
            await next();
        } catch (err) {
            ctx.status = err.status || 500;

            ms = new Date() - start;
            //记录异常日志
            log.e(ctx, err, ms);

            await ctx.render('error', {
                title: "错误",
                err: err
            })

            ctx.app.emit('error', err, ctx);
        }
    }
}