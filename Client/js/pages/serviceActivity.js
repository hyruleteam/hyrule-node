define(["jquery", "light7", "utils", "swiper","validate"], function ($, L, utils, swiper,validate) {
    var serviceActivity = {
        init: function () {
            var self = this;
            self.swiper();
            self.validateForm();
        },
        swiper: function () {
            $(".activity-banner").swiper({
                loop: true,
//              autoplay : 2000,
                // 如果需要分页器
                pagination: '.swiper-pagination',
            })
        },
        validateForm: function () {
            var self = this;
            $(".register-form").validate({
                debug:true,
                onkeyup: false,
                submitHandler: function(form) { //表单提交句柄,为一回调函数，带一个参数：form
                    self.submitForm();
                },
                rules: {
                    linkman: {
                        required: true,
                    },
                    participateNum: {
                        required: true,
                        number:true
                    },
                    tel:{
                        required:true,
                        isMobile:true
                    }
                },
                messages: {
                    linkman: {
                        required: "请输入联系人"
                    },
                    participateNum: {
                        required: "请输入参会人数",
                        number:"参会人数必须是数字"
                    },
                    tel:{
                        required:"请输入联系方式"
                    }
                },
                onfocusout:false,
                showErrors: function(errorMap, errorList) {
                    if(errorList.length > 0) {
                        var arr = [];
                        for(var i in errorList) {
                            arr.push(errorList[i].message+"<br/>");
                        }
                        $.toast(arr.join());
                    }
                }
            });
        },
        submitForm: function () {
            var self = this;
            var jsonParam = {
                data: {
                    "accountId": "6bf6117e6edc47f280fe457ea5cc1c31",
                    "token": "1",
                    "id": $("input[name='id']").val(),
                    "linkman": $("input[name='linkman']").val(),
                    "participateNum": $("input[name='participateNum']").val(),
                    "tel":$("input[name='tel']").val()
                },
                opeType: "serviceActivity/sign"
            };
            utils.sendAjax(jsonParam, function (data) {
                window.location.href = '/signUpSuccess'
            });
        },
    };

    $.validator.addMethod("isMobile", function(value, element) {
        var length = value.length;
        var mobile = /^1(3|4|5|7|8)\d{9}$/;
        return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请正确填写您的手机号码");

    return serviceActivity;
});