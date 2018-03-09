const BaseService = require('./BaseService');
const rp = require('request-promise');

class IndexService extends BaseService {
    async topics() {
        const options = {
            method: 'GET',
            json: true,
            qs: {
                page: 1,
                tab: 'share',
                limit: 10,
                mdrender: true
            },
            uri: `${this.url}/topics`
        };
        try {
            const response = await rp(options);
            return response;

        } catch (error) {
            throw new Error(error);
        }
    }

    async topicsDetails(id) {
        const options = {
            method: 'GET',
            json: true,
            qs: {
                mdrender: true
            },
            uri: `${this.url}/topic/${id}`
        };
        try {
            const response = await rp(options);
            return response;

        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = IndexService;