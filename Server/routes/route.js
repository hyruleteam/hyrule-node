const router = require('koa-router')();
const path = require('path');

const routerModule = [
    'consult',
    'evaluate',
    'serviceActivity',
    'serviceNeed',
    'serviceOnline',
    'serviceOrganization',
    'serviceProduct',
    'special',
    'user',
    'wechat',
    'home'
]

routerModule.forEach(function (file) {
    let route = require(path.join(__dirname, file));
    router.use(route.routes(), route.allowedMethods())
})

module.exports = router;