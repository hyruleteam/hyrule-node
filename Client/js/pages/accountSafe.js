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
define(["jquery", "light7", "utils", "layer","md5"], function($, L, utils, layer,md5) {
    var accountSafe = {
        init: function() {
            this.logout();
            this.cancelWechat();
        },
        logout:function(){
            var jsonParam = {
                data: {
                    "accountId": utils.parseJson(localStorage.getItem('user')).id,
                    "token": localStorage.getItem('token')
                }
            };

            $('.j-logout').on('click',function(){
                var index = layer.open({
                    content: '您确定退出吗？'
                    ,btn: ['不要', '确定']
                    ,no: function(index){
                        $.ajax({
                            url: "/logout",
                            type: 'post',
                            data: jsonParam.data,
                            success: function(data) {
                                layer.close(index);
                                $.toast("退出成功！");
                                localStorage.setItem('user', '')
                                localStorage.setItem('token', '');
                                window.location.href='/login'
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
                });
            })
        },
        cancelWechat:function(){
            if(utils.isWechat()){
                var paramsdata = {
                    "openid":utils.parseJson(localStorage.getItem('userInfo')).openid,
                    "accountId":utils.parseJson(localStorage.getItem('user')).id,
                    "timestamp":new Date().getTime(),
                }

                var jsonParam = {
                    data: {
                        "openid":paramsdata.openid,
                        "accountId":paramsdata.accountId,
                        "timestamp":paramsdata.timestamp,
                        "hashKey":md5(paramsdata.openid+paramsdata.accountId+paramsdata.timestamp+"scxm")
                    }
                };

                $('.j-cancelwx').on('click',function(){
                    var index = layer.open({
                        content: '您确定解除绑定吗？'
                        ,btn: ['不要', '确定']
                        ,no: function(index){
                            $.ajax({
                                url: "/cancelwx",
                                type: 'post',
                                data: jsonParam.data,
                                success: function(data) {
                                    layer.close(index);
                                    $.toast("解绑成功！");
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
                    });
                })
            }
        }
    };
    return accountSafe;
});