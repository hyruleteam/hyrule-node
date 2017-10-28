/**
 * Created by Xic on 2017/10/12.
 *          __                                                __
 *   ____  / /_     ____ ___  __  __    ____  ____  ____     / /
 *  / __ \/ __ \   / __ `__ \/ / / /   / __ \/ __ \/ __ \   / /
 * / /_/ / / / /  / / / / / / /_/ /   / /_/ / /_/ / /_/ /  /_/
 * \____/_/ /_/  /_/ /_/ /_/\__, /    \__  /\__ _/_____/  __
 *                         /____/     /___/              /_/
 *   ━━━━━━感觉萌萌哒━━━━━━
 */
define(["jquery", "light7", "utils", "swiper","validate"], function ($, L, utils, swiper,validate) {
    var register = {
        init: function () {
            var self = this;
            self.initEvent();
            self.validateForm();
        },
        initEvent: function () {
            var self = this;
            $(".j-password").on("focus", function () {
                self.checkMobile();
            })
            $(".captcha").on("focus", function () {
                self.checkMobile();
            })
            // 获取验证码
            $(".js-get-code").on("click", function () {
                var jsonParam = {
                    opeType: "captcha",
                    data: {
                        "mobile": $("input[name='mobile']").val(),
                    }
                };
                if (self.checkMobile()) {
                    self.setTime($(this));
                    utils.sendAjax(jsonParam, function (data) {
                        console.log("获取验证码返回信息");
                        console.log(data);
                    })
                }
            })
            // 校验验证码
        },
        checkMobile: function () {
            var mobile = $(".mobile").val();
            if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
                $.toast("请先填写正确的手机号码");
                return false;
            }
            return true;
        },
        countdown: 60,
        setTime: function (val) {
            var self = this;
            var timer = null
            if (self.countdown == 0) {
                clearTimeout(timer);
                val.text("获取验证码");
                self.countdown = 60;
            } else {
                timer = setTimeout(function () {
                    self.setTime(val)
                }, 1000)
                val.text("重新发送(" + self.countdown + ")");
                self.countdown--;
            }
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
                    mobile: {
                        required: true,
                    },
                    password: {
                        required: true

                    },
                    code:{
                        required:true
                    },
                    repassword:{
                        required:true,
                        equalTo:"#password"
                    }
                },
                messages: {
                    mobile: {
                        required: "请输入手机号码"
                    },
                    password: {
                        required: "请输入密码"
                    },
                    code:{
                        required:"请输入验证码"
                    },
                    repassword:{
                        required:"请再次确认密码",
                        equalTo:"两次密码输入不一致"
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
                    "mobile": $("input[name='mobile']").val(),
                    "password": $("input[name='password']").val(),
                    "smsCode": $("input[name='code']").val(),
                    "accountType": $("input[name='accountType']").val(),
                },
                opeType: "app/register"
            };
            utils.sendAjax(jsonParam, function (data) {
               window.location.href = '/login'
            });
        },
    };
    return register;
});