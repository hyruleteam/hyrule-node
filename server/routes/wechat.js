const router = require('koa-router')()
const WechatCtrl = require('./../controller/WechatController')

router.post('/wechatSignNature', WechatCtrl.getWechatJSSignature)

module.exports = router;