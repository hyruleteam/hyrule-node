define(["jquery", "light7", "utils"], function($, L, utils) {
    var index = {
        init: function() {
            $.init();
            this.loadMore();
        },
        loadMore: function() {
            var _self = this,
                loading = false,
                page = 1,
                a = 1;

            $(document).on('infinite', '.infinite-scroll', function() {
                if (loading) return;

                // 设置flag
                page++;
                loading = true;
                $('.loading-page').removeClass('f-dn');

                setTimeout(function() {
                    _self.moreData(page, function() {
                        loading = false;
                        $('.loading-page').addClass('f-dn');
                    })
                }, 100)
            })
        },
        moreData: function(page, callback) {
            var jsonParam = {
                data: {
                    page: page,
                    tab: 'share',
                    limit: 10,
                    mdrender: true
                }
            };

            $.ajax({
                url: 'https://cnodejs.org/api/v1/topics',
                type: 'get',
                data: jsonParam.data,
                success: function(data) {
                    utils.renderMoreList(data, 'm-topics-list-tpl', '.lists');
                    callback()
                },
                error: function(xhr, errorMsg, errorThrown) {
                    $.toast("发送请求失败！");
                    console.warn("%c调用接口" + jsonParam.opeType + "出错", "color:red;font-size:36px;");
                    console.log("XMLHttpRequest 对象:" + xhr);
                    console.log("错误信息:" + errorMsg);
                    console.log("捕获的异常对象" + errorThrown);
                }
            })
        }
    };

    return index;
});