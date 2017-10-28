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
define(["jquery", "light7", "utils", "swiper"], function($, L, utils, swiper) {
    var register = {
        init: function() {
            var _self = this;
            $('.register-btn').click(function() {
                _self.submitForm();
            });
        },
        validateForm: function() {
            var self = this;
            var passowrd = $("input[name='password']").val();
            var smsCode = $("input[name='code']").val();
            if (passowrd === "" || passowrd === undefined || passowrd === null) {
                $.toast("请先填写密码");
                return false;
            }
        },
        submitForm: function() {
            var self = this;
            var jsonParam = {
                data: {
                    "username": $("input[name='username']").val(),
                    "password": $("input[name='password']").val()
                },
                opeType: "/login"
            };

            $.ajax({
                url: "/login",
                type: 'post',
                data: jsonParam.data,
                success: function(data) {
                    if(data.code === 0){
                        localStorage.setItem('user', utils.stringJson(data.data.accountUser))
                        localStorage.setItem('token', data.data.token);

                        if(utils.isWechat()){
                            localStorage.setItem('userInfo', utils.stringJson(data.data.userInfo));
                        }

                        var url = utils.getQueryString('returnUrl');

                        if(url){
                            window.location.href = url
                        }else{
                            window.location.href = '/'
                        }
                    }else{
                        $.toast('登录失败，请检查用户名或密码是否正确')
                    }

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
    return register;
});