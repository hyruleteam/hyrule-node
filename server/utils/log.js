const log4js = require('../../config/server/log_config')

const errorLog = log4js.getLogger('errorLog')
const resLog = log4js.getLogger('responseLog')

const log = {}

log.i = function (ctx, resTime) {
    if(ctx){
        resLog.info(formatRes(ctx, resTime));
    }
}

log.e = function (ctx, error, resTime) {
    if(ctx&&error){
        errorLog.error(formatError(ctx, error, resTime));
    }
}

//格式化响应日志
const formatRes = function (ctx, resTime) {
    let logText = new String();

    //响应日志开始
    logText += "\n" + "*************** response 日志 开始 ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //响应状态码
    logText += "response status: " + ctx.status + "\n";

    //响应内容
    logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //响应日志结束
    logText += "*************** response 日志 结束 ***************" + "\n";

    return logText;

}

//格式化错误日志
const formatError = function (ctx, err, resTime) {
    let logText = new String();

    //错误信息开始
    logText += "\n" + "*************** error 日志 开始 ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";

    //错误信息结束
    logText += "*************** error 日志 结束 ***************" + "\n";

    return logText;
};

//格式化请求日志
const formatReqLog = function (req, resTime) {

    let logText = new String();

    const method = req.method;
    //访问方法
    logText += "request method: " + method + "\n";

    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n";

    //客户端ip
    logText += "request client ip:  " + req.ip + "\n";

    //开始时间
    let startTime;
    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n";
        // startTime = req.query.requestStartTime;
    } else {
        logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
        // startTime = req.body.requestStartTime;
    }
    //服务器响应时间
    logText += "response time: " + resTime + "\n";

    return logText;
}

module.exports = log;