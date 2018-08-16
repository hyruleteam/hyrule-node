const BaseService = require('./BaseService');

class TopicService extends BaseService {
    async topics(params) {
        const options = {
            qs: {
                ...params
            },
            uri: `/topics`
        };

        return await this.getData(options);
    }

    async topicsDetails(params,id) {
        const options = {
            qs: {
                ...params
            },
            uri: `/topic/${id}`
        };

        return await this.getData(options);
    }
}

module.exports = TopicService;
