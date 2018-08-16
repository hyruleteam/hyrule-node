const BaseController = require('./BaseController');
const TopicService = require('../service/TopicService');
const logger = require('../utils/winston');

const config = require('config');
const apiConfig = config.get('Customer.apiConfig');

class ApiController extends BaseController {
    async list(ctx, next) {
        try {
            const params = {
                qs: {
                    page: 1,
                    tab: 'share',
                    limit: 10,
                    mdrender: true
                }
            }

            logger.log('info', '查询列表');

            const {response} = await new ApiService().topics(params);

            ctx.body = this.toJson(response, response)

        } catch (e) {
            logger.log('error', e.stack);
        }
    }
}

module.exports = ApiController;
