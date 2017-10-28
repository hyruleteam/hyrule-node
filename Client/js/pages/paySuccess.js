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
define(["jquery", "light7", "utils", "swiper"], function ($, L, utils, swiper) {
    var paySuccess = {
        init: function () {
            var url = utils.getQueryString('url');
            setTimeout(function () {
                window.location.href = url;
            },1000);
        },
    };
    return paySuccess;
});