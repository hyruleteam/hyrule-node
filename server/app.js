const Koa = require('koa');
const app = new Koa();
const config = require('../config/server/index');
const render = require('koa-art-template');
const path = require('path');
const json = require('koa-json');
const session = require('koa-session');
const redisStore = require('koa-redis')({
    prefix: 'front',
    host: config.redis.host,
    port: config.redis.port,
    pass: config.redis.pass,
})
const bodyparser = require('koa-bodyparser');
const route = require('./routes/route');

//middleware
const loggerError = require('./middleware/logger');
const wechat = require('./middleware/wechat');
const templateFilter = require('./middleware/templateFilter');


// error handler
app.use(loggerError())

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())

app.use(require('koa-static')('./Static'))

app.keys = ['scapp'];

const CONFIG = {
    store: redisStore,
    key: 'koa:sess',
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false
};

redisStore.on("error", function(err) {
    throw new Error(err);
});

app.use(session(CONFIG, app));

render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.art',
    minimize: true,
    debug: process.env.NODE_ENV !== 'production'
});

app.use(templateFilter());

app.use(wechat());

// logger
app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


// routes
app.use(route.routes(), route.allowedMethods())

app.use(async(ctx) => {
    switch (ctx.status) {
        case 404:
            await ctx.render('404');
            break;
        case 500:
            await ctx.render('500');
            break;
    }
})

module.exports = app