const logger = require('../utils/winston');

module.exports = () => {
    return async(ctx, next) => {
        const G = {
            env: process.env.NODE_ENV
        }

        ctx.state = Object.assign(ctx.state,G);
        await next()
    }
}
