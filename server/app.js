const Koa = require('koa');
const app = new Koa();
const render = require('koa-views');
const path = require('path');
const json = require('koa-json');
const session = require('koa-session');
const staticAssets = require('koa-static')
const logger = require('./utils/winston');

//config
const config = require('config');
const appConfig = config.get('Customer.appConfig');
const redisConfig = config.get('Customer.redisConfig');
const sessionConfig = config.get('Customer.sessionConfig');

const redisStore = require('koa-redis')({
    prefix: 'front',
    host: redisConfig.host,
    port: redisConfig.port,
    pass: redisConfig.pass,
})
const bodyparser = require('koa-bodyparser');
const route = require('./routes/route');

//middleware
const loggerError = require('./middleware/logger');
const globalVar = require('./middleware/global');
const authtoken = require('./middleware/authtoken');
const store = require('./middleware/store');

//接口限流
// app.proxy = true

app.use(globalVar())

// error handler
app.use(loggerError())

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())

app.use(staticAssets(
    path.join(__dirname, appConfig.staticPath)
))

app.keys = ['budiotapp'];

const CONFIG = {
    key: sessionConfig.key,
    overwrite: true,
    httpOnly: true,
    signed: true,
    maxAge: sessionConfig.maxAge,
    rolling: false
};

redisStore.on("error", function (err) {
    throw new Error(err);
});

app.use(session(CONFIG, app));

// app.use(store());

// app.use(authtoken());

app.use(render(path.join(__dirname, 'views'), {extension: 'ejs'}))


// routes
app.use(route.routes(),route.middleware(), route.allowedMethods())


logger.info(`当前开发环境：${process.env.NODE_ENV}`)

module.exports = app
