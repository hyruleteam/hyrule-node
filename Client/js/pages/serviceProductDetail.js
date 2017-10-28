define(["jquery","light7","utils","swiper"],function ($,L,utils,swiper){
    var serviceProductDetail = {
        init:function(){
            var self=this;
            self.swiper();
            this.createOrder();
        },
        swiper:function(){
            $(".detail-banner").swiper({
                loop: true,
                pagination: '.swiper-pagination',
                paginationType : 'fraction'
                
              })
        },
        createOrder:function(){
            $('.j-buy').on('click',function(){
                var userinfo = utils.auth.getUserInfo();

                if(userinfo){
                    var jsonParam = {
                        data: {
                            "payType": 0,
                            "accountId": userinfo.user.id,
                            "itemId":$('#itemid').val(),
                            "note":"",
                            "token":userinfo.user.token
                        },
                        opeType:'/serviceorder/createMobileOrder'
                    };

                    utils.sendAjax(jsonParam,function(data){
                        window.location.href = "/productDetailBuy?orderId="+data.data
                    })
                }
            })
        }
    };

    return serviceProductDetail;
});