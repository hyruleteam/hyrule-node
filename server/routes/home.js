const router = require('koa-router')()

router.get('/error', async(ctx, next) => {
    await ctx.render('error', {
        title: "错误",
        msg: ctx.message
    })
})

module.exports = router;
