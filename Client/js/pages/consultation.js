define(["jquery","light7","utils","layer","wjs","wx","md5"],function ($,L,utils,layer,wjs,wx,md5){
    var consultation = {
        init:function(){
			var jsApiList = ["startRecord","stopRecord","onVoiceRecordEnd","playVoice","translateVoice","chooseWXPay"];
            this.submitOrder();
			this.checkEvent();
			wjs.init(jsApiList);
			this.automaticVoice();
        },
		checkData:function () {
			var title = $('input[name="ques-title"]').val();
			var content = $('textarea[name="ques-ctx"]').val();
			if(title == "" || title == null || title == undefined){
				$.toast("请填写问题标题");
				return false;
			}
			if(content == "" || content == null || content == undefined){
                $.toast("请填写问题内容");
                return false;
			}
			return true;
        },
        submitOrder:function(){
        	var _self = this;
        	$(".j-order").on("click",function(){
				var jsonParams = {
					opeType:'consult/order',
					data:{
						questionItem: "93c9d8cc9005461abffe653abd7bf07f",//$('.j-categroy').val(),
						questiontTitle:$('input[name="ques-title"]').val(),
						note:$('textarea[name="ques-ctx"]').val(),
						expertId:"3c35e2abebaf4dd3911e2f379b698855",//$("input[name='expertId']").val(),
						accountId:"6bf6117e6edc47f280fe457ea5cc1c31",
						token:"",
					}
				}
				if (utils.isWechat()){
					if(_self.checkData()){
                        utils.sendAjax(jsonParams,function(data){
                            var orderId = data.data.id;
                            var timestamp = new Date().getTime();
                            layer.open({
                                type: 1,
                                area: ['420px', '240px'], //宽高
                                title: ['确认订单','font-weight: 600;font-size:0.4rem;color:#000 '],
                                btn: ['确认'],
                                content:  $('#order-comfirm').html().toString(),
                                yes:function (index, layero) {
                                    var openid = utils.parseJson(localStorage.getItem('userInfo')).openid;
                                    var accountId = utils.parseJson(localStorage.getItem('user')).id;
                                    var token = localStorage.getItem('token');
                                    var jsonParam = {
                                        opeType: "wx/wxExpertPay",
                                        data: {
                                            "openid":openid,
                                            "orderId":orderId,
                                            "timestamp":timestamp,
                                            "token":"123",
                                            "hashKey":md5(openid+orderId+timestamp+"scxm"),
                                            "accountId":"06ed2795b1344e38aa5b8fd8b93ba3f2",
                                        }
                                    };
                                    utils.sendAjax(jsonParam, function(data) {
                                        layer.close(index);
                                        wx.chooseWXPay({
                                            timestamp: data.data.timeStamp,
                                            nonceStr: data.data.nonceStr,
                                            package: data.data.package,
                                            signType: data.data.signType,
                                            paySign: data.data.paySign, // 支付签名
                                            success: function (res) {
                                                window.location.href='/paySuccess?url=/questionDetail?orderId='+orderId;
                                            }
                                        });
                                    })

                                }

                            });
                        })
					}

				}else{
					$.toast("请在微信中打开");
				};

		  	
        	});

        },
        checkEvent:function(){
        	$(document).on("click",".checkbox",function(){
        		console.log(111);
        		$(".checkbox").removeClass("active");
        		$(this).addClass("active");
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

    return consultation;
});