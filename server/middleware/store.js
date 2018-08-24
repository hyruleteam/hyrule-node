const logger = require('../utils/winston');

module.exports = () => {
    return async(ctx, next) => {

        if(ctx.query.name){
            ctx.session.name = ctx.query.name
            logger.info(`name为 ${ctx.session.name}`)
        }

        await next();
    }
}
