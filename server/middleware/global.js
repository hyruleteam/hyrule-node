const logger = require('../utils/winston');

module.exports = () => {
    return async(ctx, next) => {
        ctx.state.G = {
            env: process.env.NODE_ENV
        }
        await next()
    }
}
