/**
 * Created by Xic on 2017/10/25.
 *          __                                                __
 *   ____  / /_     ____ ___  __  __    ____  ____  ____     / /
 *  / __ \/ __ \   / __ `__ \/ / / /   / __ \/ __ \/ __ \   / /
 * / /_/ / / / /  / / / / / / /_/ /   / /_/ / /_/ / /_/ /  /_/
 * \____/_/ /_/  /_/ /_/ /_/\__, /    \__  /\__ _/_____/  __
 *                         /____/     /___/              /_/
 *   ━━━━━━感觉萌萌哒━━━━━━
 */
define(["jquery","light7","utils","io","moment","wx",'wjs'],function ($,L,utils,io,moment,wx,wjs){
    var questtionChat = {
        init:function(){
            var jsApiList = ["startRecord","stopRecord","onVoiceRecordEnd","playVoice","translateVoice"];
            wjs.init(jsApiList);
            moment.locale('zh-cn');
            this.checkModel();
            this.connectChat();
        },
        connectChat:function () {
            var _self = this
            var socket = new WebSocket("ws://192.168.1.120:8080/sc/mobile/websocket");
            var orderId = utils.getQueryString("orderId");
            var json = {
                action:"join",
                orderId:orderId,
            }
            socket.onopen = function (event) {
                socket.send(utils.stringJson(json));
                $(".f-dn").show();
                _self.sendQuesChat(socket,orderId);
                _self.receiveQuseChat(socket)
            }
            socket.onerror = function (event) {
                alert("连接失败");
            }
        },
        doScroll: function () {
            $('.content').animate({
                scrollTop: $('.question-box').height()
            }, 200)
        },
        sendQuesChat:function (socket,orderId) {
            var _self = this;
            var accountId = utils.parseJson(localStorage.getItem('user')).id;
            $(".submit").on('click',function () {
                var time = moment().format("dddd HH:mm");
                var content =  $("input[name='content']").val();
                var msg = '<div class="enquire">\n' +
                    '                   <p class="q-time">'+time+'</p>\n' +
                    '                   <div class="question">\n' +content+
                    '                   </div>\n' +
                    '               </div>'
                ;
                var jsonParams = {
                    action:"chat",
                    orderId:orderId,
                    note:content,
                    accountId:accountId,
                }
                if(content){
                    $(".question-box").append(msg);
                    socket.send(utils.stringJson(jsonParams));
                    $("input[name='content']").val('');
                    _self.doScroll();
                }else {
                    $.toast("无法发送空内容")
                }

            })

        },
        receiveQuseChat:function (socket) {
            socket.onmessage = function (event) {
                var msg = '<div class="exp-reply f-cb f-dn">\n' +
                    '                    <p class="q-time">刚刚</p>\n' +
                    '                    <div class="exp-logo f-fl"><img src="../images/list2.png" alt=""></div>\n' +
                    '                    <div class="reply f-fl">你好，你需要准备相关资料报备到公积金管理处。</div>\n' +
                    '                </div>'
                console.log(utils.parseJson(event.data));
            }
        },
        checkModel:function () {
            $(".j-model").on('click',function () {
                $(".button").toggle();
                $(".ques-box").toggle();
                $(".submit").toggle();
            })
        },
        automaticVoice:function(){
            wx.ready(function(){
                $('.j-voice').on('touchstart',function(){
                    $(this).addClass("voice").text("松开 结束");
                    $('.voice-loding').show();
                    wx.startRecord();
                });
                $('.j-voice').on('touchend',function(){
                    $(this).removeClass("voice").text("按住 说话");
                    $('.voice-loding').hide();
                    wx.stopRecord({
                        success: function (res) {
                            wx.translateVoice({
                                localId: res.localId, // 需要识别的音频的本地Id，由录音相关接口获得
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    var content= $('textarea[name="ques-ctx"]').val()+res.translateResult;
                                    $('textarea[name="ques-ctx"]').val(content); // 语音识别的结果

                                }
                            });
                        }
                    });
                    wx.onVoiceRecordEnd({
                        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                        complete: function (res) {
                            wx.translateVoice({
                                localId: res.localId, // 需要识别的音频的本地Id，由录音相关接口获得
                                isShowProgressTips: 1, // 默认为1，显示进度提示
                                success: function (res) {
                                    alert(res.translateResult); // 语音识别的结果
                                }
                            })
                        }
                    });

                })

            });
        }
    };

    return questtionChat;
});