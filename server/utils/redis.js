const config = require('config');
const redisConfig = config.get('Customer.redisConfig');

const redisStore = require('koa-redis')({
    prefix: 'front',
    host: redisConfig.host,
    port: redisConfig.port,
    pass: redisConfig.pass,
})

const redis = {}

redis.setKey =  async function setKey(key, val, ttl) {
    return await redisStore.set(key, val, ttl)
}

redis.getKey =  async function getKey(key, ttl) {
    return await redisStore.get(key, ttl)
}

redis.destroyKey =  async function destroyKey(key) {
    return await redisStore.destroy(key)
}


module.exports = redis;
