const template = require('art-template')
const moment = require('moment');
module.exports = () => {
    return async (ctx, next) => {
        try {
            template.defaults.imports.formatPhone = value => {
                return value.substr(0, 7) + '****';
            }

            template.defaults.imports.dateFormater = (date, format) => {
                return moment(date).format(format);
            }

            template.defaults.imports.delHtmlTag = value => {
                if (value !== null) {
                    return value.replace(/<[^>]+>/g, "");
                } else {
                    return value
                }
            }
            template.defaults.imports.getGrade = value => {
                return (value / 100).toFixed(1);
            }
            template.defaults.imports.getStatus = value => {
                switch (value) {
                    case 1:
                        return "报名未开始";
                        break;
                    case 2:
                        return "报名中";
                        break;
                    case 3:
                        return "报名结束";
                        break;
                    case 4:
                        return "活动中";
                        break;
                    case 5:
                        return "活动已结束";
                        break;
                    default:
                        break;
                }
            }
            template.defaults.imports.getOrderStatus = value => {
                switch (value) {
                    case 1:
                        return "待付款";
                        break;
                    case 2:
                        return "待完成";
                        break;
                    case 3:
                        return "交易成功";
                        break;
                    case 4:
                        return "交易关闭";
                        break;
                    default:
                        break;
                }
            }
            template.defaults.imports.getSignStatus = value => {
                if (value) {
                    return "已签到";
                }
                return "签到";
            }
            template.defaults.imports.getConsultStatus = value => {
                switch (value) {
                    case -1:
                        return "未支付";
                        break;
                    case 0:
                        return "待回复";
                        break;
                    case 1:
                        return "咨询中";
                        break;
                    case 2:
                        return "已完成";
                        break;
                    default:
                        break;
                }
            }

            await next();
        }
        catch (err) {
            throw new Error(err)
        }
    }
}