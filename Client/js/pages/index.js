define(["jquery","light7","utils","swiper"],function ($,L,utils,swiper){
    var index = {
        init:function(){
            console.log(111);
            this.banner();
        },
        banner:function(){
			  $(".index-banner").swiper({
			    loop: true,
//			    autoplay : 2000,
			    // 如果需要分页器
			    pagination: '.swiper-pagination',
			    
			  })
        }
    };

    return index;
});