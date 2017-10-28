const router = require('koa-router')()
const IndexCtrl = require('./../controller/IndexController')

router.get('/home', IndexCtrl.home);

router.get('/topic/:id', IndexCtrl.details);

router.get('/error', async(ctx, next) => {
    await ctx.render('error', {
        title: "错误",
        msg: ctx.message
    })
})

module.exports = router;