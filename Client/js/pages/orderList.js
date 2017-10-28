define(["jquery", "light7", "utils"], function ($, L, utils) {
    var orderList = {
        init: function () {
            this.selectStatus();
            console.log(666);
        },
        selectStatus:function () {
            var _self = this;
            $(".j-order").on('click',function () {
                $(this).addClass("active").siblings().removeClass("active");
                var orderStatus = $(this).attr('data-id');
                _self.updOrderList(orderStatus);
            })
        },
        updOrderList:function (orderStatus) {
            var accountId = utils.parseJson(localStorage.getItem('user')).id;
            var token = localStorage.getItem('token');
            var jsonParams = {
                "opeType": "serviceorder/list",
                data:{
                    accountId:accountId,
                    token:token,
                }
            }
            if(orderStatus){
                jsonParams.data.orderStatus = orderStatus;
                utils.sendAjax(jsonParams,function (data) {
                    utils.renderList(data.data,"m-orders",".m-order-list");
                })
            }else {
                utils.sendAjax(jsonParams,function (data) {
                    utils.renderList(data.data,"m-orders",".m-order-list");
                    console.log(data)
                })
            }
        },
    };
    return orderList;
});