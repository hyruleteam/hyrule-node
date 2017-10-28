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
define(["jquery","light7","utils","swiper"],function ($,L,utils,swiper){
    var serviceNeedsList = {
        init:function(){
            this.category();
            this.location();
        },
        category:function () {
            $('.j-category').click(function () {
                $('.category').toggle();
                $('.location').hide();
            });
            $('.category ').click(function () {
                $('.category').toggle();
            })
            $('.j-category-item').on('click','.item',function (event) {
                event.stopPropagation();
                $(this).addClass('active').siblings().removeClass('active');
                var categoryId = $(this).attr('id');
                var jsonParam = {
                    "opeType": "orgrequirement",
                    data:{
                        categoryId:categoryId,
                    }
                };
                utils.sendAjax(jsonParam, function(data) {
                    utils.renderList(data.data, 'm-needs', '.needs-list');
                    $('.category').hide();
                })
            });
        },
        location:function () {
            $('.j-location').click(function () {
                $('.location').toggle();
                $('.category').hide();
            });
            $('.location ').click(function () {
                $('.location').toggle();
            })
            $('.j-location-item').on('click','.item',function (event) {
                event.stopPropagation();
                $(this).addClass('active').siblings().removeClass('active');
                var areaId = $(this).attr('id');
                var jsonParam = {
                    "opeType": "orgrequirement",
                    data:{
                        area:areaId,
                    }
                };
                utils.sendAjax(jsonParam, function(data) {
                    utils.renderList(data.data, 'm-needs', '.needs-list');
                    $('.location').hide();
                })
            });
        },
    };

    return serviceNeedsList;
});