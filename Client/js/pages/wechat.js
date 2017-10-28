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
define(["jquery", "light7", "utils", "wx"], function ($, L, utils, wx) {
    var wechat = {
        init: function () {
            var _self = this;
            _self.submitForm();
        },
        submitForm: function () {
            var self = this;
            var localId = null;
            var jsonParam = {
                "url":window.location.href.split('#')[0]
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
                        jsApiList: ["startRecord","stopRecord","onVoiceRecordEnd","playVoice","translateVoice"]
                    });
                },
                error: function(xhr, errorMsg, errorThrown) {
                    $.toast("发送请求失败！");
                    console.warn("%c调用接口" + jsonParam.opeType + "出错", "color:red;font-size:36px;");
                    console.log("XMLHttpRequest 对象:" + xhr);
                    console.log("错误信息:" + errorMsg);
                    console.log("捕获的异常对象" + errorThrown);
                }
            })

            wx.ready(function () {
                $('.j-record').on('click',function(){
                    wx.startRecord();
                })

                $('.j-closerecord').on('click',function(){
                    wx.stopRecord({
                        success: function (res) {
                            localId = res.localId;
                        }
                    });
                })

                $('.j-play').on('click',function(){
                    wx.playVoice({
                        localId: localId
                    });
                })

                $('.j-trans').on('click',function(){
                    wx.translateVoice({
                        localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function (res) {
                            alert(res.translateResult); // 语音识别的结果
                        }
                    });
                })
            });
        },
    };
    return wechat;
});