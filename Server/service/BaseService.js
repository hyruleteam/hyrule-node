const config = require('../../Config/server/index');
const rp = require('request-promise');

class BaseService {
    constructor() {
        this.url = config.baseURL
    }

    error() {
        const error = "数据请求失败"
        return error;
    }

    async getData(postParams){
        const options = {
            method: 'GET',
            json: true,
            qs: postParams.qs,
            uri: `${this.url}${postParams.uri}`
        };
        try {
            const response = await rp(options);
            response.uri = options.uri;

            return response;

        } catch (error) {
            throw new Error(error);
        }
    }

    async postData(postParams){
        const options = {
            method: 'POST',
            json: true,
            qs:postParams.qs,
            uri: `${this.url}${postParams.uri}`
        };
        try {
            const response = await rp(options);
            response.uri = options.uri;

            return response;

        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = BaseService;