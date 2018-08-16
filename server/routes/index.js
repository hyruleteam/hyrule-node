const router = require('koa-router')()
const IndexCtrl = require('./../controller/IndexController')

const indexController = new IndexCtrl()

router.get('/list', async (ctx, next) => {
    await indexController.list(ctx, next)
});

router.get('/details/:id', async (ctx, next) => {
    await indexController.details(ctx, next)
});

module.exports = router;
