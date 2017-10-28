define(["jquery", "light7", "utils"], function ($, L, utils) {
    var onlinePolicyService = {
        init: function () {
            this.fixKeyboardBug();
            this.doSendMsg()
        },
        fixKeyboardBug: function () {
            var interval;
            var bfscrolltop = document.body.scrollTop;
            $("input.inputframe,div[contenteditable=true]").focus(function () {
                interval = setInterval(function () {
                    document.body.scrollTop = document.body.scrollHeight;
                }, 100)
            }).blur(function () {
                clearInterval(interval);
                document.body.scrollTop = bfscrolltop;
            });
        },
        doSendMsg: function () {
            $('div[contenteditable=true]').on('click', function () {
                $(this).focus()
            })
            $('div[contenteditable=true]').on('focus', function () {
                if ($('div[contenteditable=true]').html() === '请输入问题') {
                    $('div[contenteditable=true]').html('')
                }
            })

            $('.j-send').on('click', function () {
                var mes = $('#msgBox').text();
                $('div[contenteditable=true]').html('')
                onlinePolicyService.sendMsg(mes)
            })
        },
        doScroll: function () {
            $('.m-online-policy').animate({
                scrollTop: $('.m-op-msg-box').height()
            }, 200)
        },
        sendMsg: function (content) {
            var _self = this;
            if (content !== "" && content.length !== 0) {
                $.getJSON('http://www.tuling123.com/openapi/api?key=' + '1ab114786d7b4490b117ae4b24f84869' + '&info=' + content, function (data) {
                    if (data.code === 100000) {
                        var scnt = {
                            cnt: content
                        }
                        utils.renderMoreList(scnt, 'm-op-rmsg-tpl', '.m-op-msg-box');

                        var rcnt = {
                            cnt: data.text
                        }
                        utils.renderMoreList(rcnt, 'm-op-smsg-tpl', '.m-op-msg-box');

                        _self.doScroll()
                    }
                })
            }
        }
    };

    return onlinePolicyService;
});