const router = require('koa-router')();
const path = require('path');

const routerModule = [
    'wechat',
    'home'
]

routerModule.forEach(function(file) {
    let route = require(path.join(__dirname, file));
    router.use(route.routes(), route.allowedMethods())
})

module.exports = router;