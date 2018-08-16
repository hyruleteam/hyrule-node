const router = require('koa-router')()
const ApiCtrl = require('./../controller/ApiController')
const RateLimit = require('koa2-ratelimit').RateLimit;

const config = require('config');
const appConfig = config.get('Customer.appConfig');

const ApiController = new ApiCtrl()

//接口限流
const limiter = RateLimit.middleware({
    interval: { min: 15 }, // 15 minutes = 15*60*1000
    max: 100, // limit each IP to 100 requests per interval
    prefixKey: '/api/v1',
    msg:'访问次数太多，请稍后重试',
    handler:async (ctx/*, next*/) =>{
        // console.log(ctx.request.ip)
        ctx.status = 500;
        ctx.body = {
            code: 400000,
            msg: '访问次数太多，请稍后重试'
        };
    }
});

const checkAPIStatus = () => {
    return (ctx, next)=> {
        if(ctx.status === 404 || ctx.status === 500){
            ctx.body = {
                code: 400404,
                msg: `接口访问出错`
            }
        }else{
            next()
        }
    }
}

const refererAuth = () => {
    return async (ctx, next)=> {
        const domainPatt = new RegExp(appConfig.appDomain);
        if(process.env.NODE_ENV === 'production'){
            if(domainPatt.test(ctx.request.header.referer)){
                await next()
            }else{
                ctx.body = {
                    code: 400502,
                    msg: '禁止访问'
                }
            }
        }else{
            await next()
        }
    }
}

router.prefix('/api/v1/')

router
    // .use(limiter)
    .use(refererAuth())

router.post('/list', async (ctx, next) => {
    await ApiController.list(ctx, next)
});


module.exports = router;
