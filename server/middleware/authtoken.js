const logger = require('../utils/winston');
const redis = require('../utils/redis');
const AuthService = require('../service/AuthService');

module.exports = () => {
    return async(ctx, next) => {
        const token = await redis.getKey('token')

        if (!token) {
            // await new AuthService().getAccessToken()
            logger.log('info', token);
        }

        await next();
    }
}
