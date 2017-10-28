define(["jquery", "light7", "utils", "md5","wjs","wx"], function($, L, utils,md5, wjs,wx) {
    var productDetailBuy = {
        init: function() {
            var _self = this;
            this.selectPhoneType()
            this.getCapchaCode()

            var apilist = ["chooseWXPay"];

            wjs.init(apilist,function(){
                _self.goPay();
            })
        },
        countdown: 60,
        selectPhoneType: function() {
            $('input[name=phoneNumber]').on('click', function() {
                if ($(this).attr('id') === 'other-pn') {
                    $('.new-tel').removeClass('f-dn')
                } else {
                    $('.new-tel').addClass('f-dn')
                }
            })
        },
        getCapchaCode: function() {
            var self = this;

            $(".captcha").on("focus", function() {
                self.checkMobile();
            });

            $(".j-sendCode").on("click", function() {
                var jsonParam = {
                    opeType: "captcha",
                    data: {
                        "mobile": $("input[name='mobile']").val(),
                    }
                };

                if (self.checkMobile()) {
                    self.setTime($(this));
                    utils.sendAjax(jsonParam, function(data) {
                        console.log("获取验证码返回信息");
                        console.log(data);
                    })
                }
            })
        },
        checkMobile: function() {
            var mobile = $("#mobile").val();
            console.log(mobile)
            if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
                $.toast("请先填写正确的手机号码");
                return false;
            }
            return true;
        },
        setTime: function(val) {
            var self = this;
            var timer = null
            if (self.countdown == 0) {
                clearTimeout(timer);
                val.text("获取验证码");
                self.countdown = 60;
            } else {
                timer = setTimeout(function() {
                    self.setTime(val)
                }, 1000)
                val.text("重新发送(" + self.countdown + ")");
                self.countdown--;
            }
        },
        goPay: function() {
            $('.j-gopay').on('click',function(){
                var id = $(this).attr('data-id');
                var openid = utils.parseJson(localStorage.getItem('userInfo')).openid;

                var paramsdata = {
                    "openid":openid,
                    "orderId":id,
                    "mobile": $(".mobile").attr('data-val'),
                    "payBody":id+'订单支付内容',
                    "timestamp":new Date().getTime(),
                }

                var jsonParam = {
                    opeType: "wx/wxPay",
                    data: {
                        "openid":paramsdata.openid,
                        "orderId":paramsdata.orderId,
                        "mobile": paramsdata.mobile,
                        "payBody":paramsdata.payBody,
                        "timestamp":paramsdata.timestamp,
                        "hashKey":md5(paramsdata.openid+paramsdata.orderId+paramsdata.mobile+paramsdata.payBody+paramsdata.timestamp+"scxm")
                    }
                };

                utils.sendAjax(jsonParam, function(data) {
                    wx.chooseWXPay({
                        timestamp: data.data.timeStamp,
                        nonceStr: data.data.nonceStr,
                        package: data.data.package,
                        signType: data.data.signType,
                        paySign: data.data.paySign, // 支付签名
                        success: function (res) {
                            window.location.href='/paySuccess'
                        }
                    });
                })
            })
        }
    };

    return productDetailBuy;
});