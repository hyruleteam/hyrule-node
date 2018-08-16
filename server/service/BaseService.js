const logger = require('../utils/winston');
const redis = require('../utils/redis')
const rp = require('request-promise');

const config = require('config');
const appConfig = config.get('Customer.appConfig');
const apiConfig = config.get('Customer.apiConfig');

class BaseService {
    constructor() {
        this.url = apiConfig.url
    }

    error() {
        return "数据请求失败";
    }

    async _formatterParams(params){
        let baseParams = {}
        const token = await redis.getKey('token')

        if (!params.uri.match('token/get')) {
            baseParams = {
                appid: appConfig.appid,
                token: token
            }
        } else {
            baseParams = {
                appid: appConfig.appid,
            }
        }

        return baseParams;
    }

    async _getResponse(params){

        try{
            logger.response.info("向服务器发送请求")
            logger.response.info(`请求地址:${params.uri}`)
            logger.response.info(`请求参数:${JSON.stringify(params.qs,null,4)}`)

            let response = await rp(params);

            if (response.code === -2) {

                params.qs.token = await this.getAccessToken()

                response = await rp(params)
            }

            logger.response.info("请求结果")
            logger.response.info(JSON.stringify(response,null,4))
            logger.response.info("请求结束")

            return response;
        }catch(e){
            logger.log('error', e.stack);

            return {
                code:-1,
                msg:"网络错误",
            }
        }
    }

    async getAccessToken() {
        const options = {
            qs: {},
            uri: '/token/get'
        };

        const {response} = await this.postData(options);

        if (response.code === 0) {
            await redis.setKey('token', response.data.token, (response.data.expires - 200) * 1000)
        }

        return await redis.getKey('token')
    }

    async getData(postParams) {

        const params = await this._formatterParams(postParams)

        const options = {
            method: 'GET',
            json: true,
            qs: {
                ...postParams.qs,
                ...params
            },
            uri: `${this.url}${postParams.uri}`
        };


        let response = await this._getResponse(options);

        return {response, options}
    }

    async postData(postParams) {

        const params = await this._formatterParams(postParams)

        const options = {
            method: 'POST',
            json: true,
            qs: {
                ...params,
                ...postParams.qs
            },
            uri: `${this.url}${postParams.uri}`
        };
        let response = await this._getResponse(options);

        return {response, options}
    }
}

module.exports = BaseService;
