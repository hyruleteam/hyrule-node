const BaseController = require('./BaseController');
const TopicService = require('../service/TopicService');

const topic = new TopicService()
class IndexController extends BaseController {
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

            const {response} = await topic.topics(params);

            await ctx.render('index', {
                title: '列表页',
                data: response.data
            })

        } catch (error) {
            throw new Error(error);
        }
    }

    async details(ctx, next) {
        try {
            const params = {
                qs: {
                    mdrender: true
                }
            }
            const id = ctx.params.id

            const {response} = await topic.topicsDetails(params,id);

            await ctx.render('details', {
                title: '详情页',
                data: response.data
            })

        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = IndexController;
