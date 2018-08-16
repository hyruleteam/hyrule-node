const template = require('art-template')
const moment = require('moment');
module.exports = () => {
    return async(ctx, next) => {
        try {
            //手机号后四位显示*号
            template.defaults.imports.formatPhone = value => {
                return value.substr(0, 7) + '****';
            }

            //日期格式化
            template.defaults.imports.dateFormater = (date, format) => {
                return moment(date).format(format);
            }

            //去除HTML标签
            template.defaults.imports.delHtmlTag = value => {
                if (value !== null) {
                    return value.replace(/<[^>]+>/g, "");
                } else {
                    return value
                }
            }

            await next();
        } catch (err) {
            throw new Error(err)
        }
    }
}