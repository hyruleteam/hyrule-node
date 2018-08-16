const logger = require('../utils/winston');

module.exports = () => {
    return async(ctx, next) => {

        if(ctx.query.customerId){
            ctx.session.customerId = ctx.query.customerId
            logger.info(`customerid为 ${ctx.session.customerId}`)
        }

        await next();
    }
}
