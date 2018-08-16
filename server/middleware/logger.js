const logger = require('../utils/winston');
module.exports = () => {
    return async(ctx, next) => {
        try {
            const start = new Date()
            await next()
            const ms = new Date() - start
            // logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);

            if(ctx.status === 404){
                await ctx.render('error/404',{
                    title: '页面找不到了'
                });
            }
        } catch (err) {

            ctx.status = err.status || 500;
            logger.log('error', err.stack);

            await ctx.render('error/500',{
                title: '服务器错误'
            });

            ctx.app.emit('error', err, ctx);
        }
    }
}
