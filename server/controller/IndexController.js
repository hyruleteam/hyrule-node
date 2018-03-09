const BaseController = require('./BaseController');
const IndexService = require('./../service/IndexService');

class IndexController extends BaseController {
    static async home(ctx, next) {
        try {
            const topics = await new IndexService().topics(); //话题列表
            const config = super.config()
            let value = await Promise.all([topics])

            let [tData] = value;
            await ctx.render('index', {
                title: '首页',
                act: '0',
                topics: tData.data
            })

        } catch (error) {
            throw new Error(error);
        }
    }

    static async details(ctx, next) {
        try {
            const topics = await new IndexService().topicsDetails(ctx.params.id); //话题详情
            const config = super.config()
            let value = await Promise.all([topics])

            let [tData] = value;
            await ctx.render('details', {
                title: '详情',
                topicsDetails: tData.data
            })

        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = IndexController;