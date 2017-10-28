/**
 * Created by Xic on 2017/10/24.
 *          __                                                __
 *   ____  / /_     ____ ___  __  __    ____  ____  ____     / /
 *  / __ \/ __ \   / __ `__ \/ / / /   / __ \/ __ \/ __ \   / /
 * / /_/ / / / /  / / / / / / /_/ /   / /_/ / /_/ / /_/ /  /_/
 * \____/_/ /_/  /_/ /_/ /_/\__, /    \__  /\__ _/_____/  __
 *                         /____/     /___/              /_/
 *   ━━━━━━感觉萌萌哒━━━━━━
 */
define(["jquery","light7","utils","layer"],function ($,L,utils,layer){
    var evaluate = {
        init:function () {
            this.getScore();
        },
        getScore:function () {
            var _self = this;
            $(".star").on('click',function () {
                $(this).siblings().removeClass("star-active");
                $(this).addClass("star-active").prevAll().addClass("star-active");
                var score = $(".star-active").length.toFixed(1) + "分";
                $(".score").text(score);
           });
            _self.submitEvaluate();
        },
        submitEvaluate:function () {
            var accountId = utils.parseJson(localStorage.getItem('user')).id;
            var token = localStorage.getItem('token');
            var orderId = $("input[name='orderId']").val();
            $(".j-commit").on("click",function () {
                var jsonParams = {
                    opeType: "/consult/appraise",
                    data:{
                        orderId:orderId,
                        note:$('textarea[name="evaluate"]').val(),
                        score:$(".star-active").length,
                        accountId:accountId,
                        token:token,
                    }
                }
                utils.sendAjax(jsonParams,function (data) {
                    layer.open({
                        type: 0,
                        content: '评价成功', //这里content是一个普通的String
                        btn:["确认"],
                        yes:function () {
                            window.location.href = "/questionDetail/"+orderId;
                        }
                    });
                });
            })
        }
    };
    return evaluate
});