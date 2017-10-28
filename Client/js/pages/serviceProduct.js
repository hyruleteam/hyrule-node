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
define(["jquery", "light7", "utils", "swiper"], function ($, L, utils, swiper) {
    var serviceProduct = {
        init: function () {
            $.init()
            this.category();
            this.location();
            this.loadMore();
        },
        categoryId: $('.category ').find('.item').attr('id'),
        area: $('.location ').find('.item').attr('id'),
        category: function () {
            var _self = this;

            $('.j-category').click(function () {
                $('.category').toggle();
                $('.location').hide();
            });
            $('.category ').click(function () {
                $('.category').toggle();
            })
            $('.j-category-item').off('infinite').on('touchstart', '.item', function (event) {
                event.stopPropagation();
                $(this).addClass('active').siblings().removeClass('active');
                var categoryId = $(this).attr('id');
                _self.categoryId = categoryId;

                _self.searchData(categoryId, _self.area, function () {
                    $('.category').hide();
                })
            });
        },
        location: function () {
            var _self = this;
            $('.j-location').click(function () {
                $('.location').toggle();
                $('.category').hide();
            });
            $('.location ').click(function () {
                $('.location').toggle();
            })
            $('.j-location-item').off('infinite').on('touchstart', '.item', function (event) {
                event.stopPropagation();
                $(this).addClass('active').siblings().removeClass('active');
                var areaId = $(this).attr('id');
                _self.area = areaId;

                _self.searchData(_self.categoryId, areaId, function () {
                    $('.location').hide();
                })

            });
        },
        loadMore:function(){
            var _self = this,
                loading = false,
                page = 1;

            $(document).on('infinite', '.infinite-scroll', function () {
                if (loading) return;

                // 设置flag
                page++;
                loading = true;
                $('.loading-page').removeClass('f-dn');

                setTimeout(function(){
                    _self.moreData(_self.categoryId, _self.area,page, function () {
                        loading = false;
                        $('.loading-page').addClass('f-dn');
                    })
                },100)
            })
        },
        moreData:function(cateid, areaid,page,callback){

            var jsonParam = {
                "opeType": "serviceItem",
                data: {
                    categoryId: cateid,
                    area: areaid,
                    pageNo:page
                }
            };
            utils.sendAjax(jsonParam, function (data) {
                if(page<data.data.totalPage){
                    utils.renderMoreList(data.data, 'm-serives', '.m-serive-list');
                    callback()
                }else{
                    $.detachInfiniteScroll($('.infinite-scroll'));
                    $('.loading-page').text('没有更多了');
                    return false;
                }
            })
        },
        searchData: function (cateid, areaid, callback) {
            $('.content').animate({
                'scrollTop':0
            },0);

            var jsonParam = {
                "opeType": "serviceItem",
                data: {
                    categoryId: cateid,
                    area: areaid
                }
            };
            utils.sendAjax(jsonParam, function (data) {
                utils.renderList(data.data, 'm-serives', '.m-serive-list');
                callback()
            })
        }
    };

    return serviceProduct;
});