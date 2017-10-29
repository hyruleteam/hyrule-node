/**
 * Created by wenyu on 2017/3/9.
 */
requirejs.config({
    baseUrl: '/js',
    paths: {
        apiURL: 'pages/module/apiURL',
        utils: 'pages/module/utils',
        wjs: 'pages/module/wjs',
        jquery: 'vendor/jquery/jquery.min',
        validate: 'vendor/jquery.validate.min',
        swiper: 'vendor/light7/light7-swiper.min',
        light7: 'vendor/light7/light7',
        template: 'vendor/template-web',
        scrollLoading: 'vendor/jquery.scrollLoading',
        larea: 'vendor/LArea',
        lareadata: 'vendor/LAreaData',
        Clipboard: 'vendor/clipboard.min',
        QRCode: 'vendor/qrcode.min',
        fly: 'vendor/jquery.fly.min',
        layer: 'vendor/layer',
        md5: "vendor/md5.min",
        moment: "vendor/moment.min",
        wx: 'http://res.wx.qq.com/open/js/jweixin-1.2.0',
        io: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io',
    },
    shim: {
        "swiper": {
            exports: "swiper"
        },
        "template": {
            exports: "template"
        },
        light7: {
            exports: "light7"
        },
        QRCode: {
            exports: "QRCode"
        },
        layer: {
            exports: "layer"
        },
        md5: {
            exports: "md5"
        },
        scrollLoading: ['jquery'],
        fly: ['jquery']
    }
});

requirejs(["jquery"], function($) {
    //去除全局的路由
    $.config = { router: false }

    var module = $('.page').attr('data-module');
    if (module && module !== '') {
        requirejs(["pages/" + module], function(module) {
            module.init();
        })
    }
});