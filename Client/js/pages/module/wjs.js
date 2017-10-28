define(["utils", "wx"], function(utils, wx) {
    var wjs = {
        init: function(apilist, callback) {
            if (utils.isWechat()) {
                var jsonParam = {
                    "url": window.location.href.split('#')[0]
                };

                $.ajax({
                    url: "/wechatSignNature",
                    type: 'post',
                    data: jsonParam,
                    success: function(data) {
                        wx.config({
                            appId: data.appId,
                            timestamp: data.timestamp,
                            nonceStr: data.nonceStr,
                            signature: data.signature,
                            jsApiList: apilist
                        });
                    },
                    error: function(xhr, errorMsg, errorThrown) {
                        $.toast("发送请求失败！");
                    }
                })
                if (callback) {
                    wx.ready(function() {
                        callback()
                    })
                }
            }
        }
    };

    return wjs;
});