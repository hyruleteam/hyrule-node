const router = require('koa-router')()
const WechatCtrl = require('./../controller/WechatController')

router.get('/wechat', WechatCtrl.home);

router.post('/wechatSignNature',WechatCtrl.getWechatJSSignature)

module.exports = router;