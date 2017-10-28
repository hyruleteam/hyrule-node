const BaseController = require('./BaseController');
const IndexService = require('./../service/IndexService');

class IndexController extends BaseController {
    static async home(ctx, next) {
        try {
            const hotService = await new IndexService().hotServiceItemsData(); //热门服务产品
            const requirement = await new IndexService().requirementData(); //最新需求
            const expert = await new IndexService().expertData() //专家列表
            const content = await new IndexService().contentData(); //政策资讯
            const carousel = await new IndexService().carouselData();//首页轮播图
            const org = await new IndexService().serviceorg();//热推机构
            const config = super.config()

            let value = await Promise.all([hotService, requirement, expert, content, carousel, org])

            let [hsData, reqData, exData, cntData, carData, orgData] = value;
            await ctx.render('index', {
                title: '首页',
                act: '0',
                hotService: hsData.data,
                requirement: reqData.data,
                expert: exData.data,
                content: cntData.data,
                carousel:carData.data,
                org:orgData.data,
                imgUrl:config.imgURL
            })

        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = IndexController;