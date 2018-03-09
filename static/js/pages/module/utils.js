/**
 * Created by wenyu on 2017/3/9.
 */
define(['apiURL', 'template'], function(apiURL, template) {
    /*通用接口地址*/
    var baseUrl = apiURL.baseUrl; //外网
    var apiCallUrl = baseUrl + ""; //通用，上传除外
    var uploadUrl = baseUrl + "api/h5/fileupload"; //上传图片专用地址

    var rule = template.defaults.rules[1];
    rule.test = new RegExp(rule.test.source.replace('{{', '<\\\?').replace('}}', '\\\?>'));

    template.defaults.imports.delHtmlTag = function(value) {
        if (value !== null) {
            return value.replace(/<[^>]+>/g, "");
        } else {
            return value
        }
    }


    var utils = {};

    /**
     * [supportStorage 检测是否支持localstorage]
     * @return {[Boolean]} [是否支持的布尔类型结果]
     */
    utils.supportStorage = function() {
        if (typeof window.localStorage == 'object') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * [randomNumber 生成随机数]
     * @return {[Int]} [调用randomFromInterval方法，返回该方法的返回值]
     */
    utils.randomNumber = function() {
        return randomFromInterval(1, 1e6)
    }

    /**
     * [randomFromInterval 生成随机数]
     * @return {[Int]} [返回一个随机数字]
     */
    utils.randomFromInterval = function() {
        return Math.floor(Math.random() * (t - e + 1) + e)
    }

    /**
     * [parseJson 解析json]
     * @param  {[String]} data [JSON字符串]
     * @return {[Object]}      [返回序列化之后的JSON对象]
     */
    utils.parseJson = function(data) {
        if (data && data.length > 0 && typeof(data) == 'string') {
            return JSON.parse(data);
        }
    }

    /**
     * [stringJson json字符串化]
     * @param  {[Object]} data [JSON对象]
     * @return {[String]}      [返回字符串后的JSON字符串]
     */
    utils.stringJson = function(data) {
        if (data && typeof(data) == 'object') {
            return JSON.stringify(data);
        }
    }

    /**
     * [getQueryString 获取地址栏的地址参数]
     * @param  {[String]} name [需要获取的参数名称]
     * @return {[String]}      [返回获取的参数值]
     * @return {[Null]}        [没有参数则返回null]
     */
    utils.getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }

    /**
     * [cloneObj 对象深拷贝]
     * @param  {[Object]} obj [需要被深拷贝的对象]
     * @return {[Object]}     [返回深拷贝之后的对象]
     */
    utils.cloneObj = function(obj) {
        var str, newobj = obj.constructor === Array ? [] : {};

        if (typeof obj !== 'object') {
            return;
        } else if (window.JSON) {
            str = decoration.base.stringJson(obj),
                newobj = decoration.base.parseJson(str);
        } else {
            for (var i in obj) {
                newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
            }
        }

        return newobj;
    };

    utils.sendAjax = function(jsonParam, cb, error, async) {
        var Url = apiCallUrl + jsonParam.opeType;
        $.ajax({
            url: Url,
            type: 'post',
            async: async == undefined ? 'true' : async,
            data: jsonParam.data,
            success: function(data) {
                var code = data.code || data.return_code || "";
                var msg = data.msg || "无返回信息";
                if (code === 0) {
                    cb(data)
                } else if (code === -1) {
                    window.location.href = '/login?returnUrl=' + window.location.href;
                    return false;
                } else {
                    $.toast(msg);

                    if (error === undefined) {
                        return
                    } else {
                        error(data)
                    }

                }
            },
            error: function(xhr, errorMsg, errorThrown) {
                $.toast("发送请求失败！");
                console.warn("%c调用接口" + jsonParam.opeType + "出错", "color:red;font-size:36px;");
                console.log("XMLHttpRequest 对象:" + xhr);
                console.log("错误信息:" + errorMsg);
                console.log("捕获的异常对象" + errorThrown);
            }
        })
    };
    utils.singleFileUpload = function(obj) {
        $(".loading").removeClass("hide");
        var maxSize = 500 * 1024;
        if (!obj[0].files.length) return;
        var files = Array.prototype.slice.call(obj[0].files);

        if (files.length > 1) {
            alert("最多只能选择1张图片");
            return;
        }

        var filejson = {};

        var img = null;
        var location = obj.val();
        var point = location.lastIndexOf(".");
        var type = location.substr(point);
        if (type == ".jpg" || type == ".jpeg" || type == ".JPG" || type == ".JPEG" || type == ".PNG" || type == ".png") {
            img = document.createElement("img");
            img.src = location;
            if (img.fileSize > maxSize) {
                $.toast("图片尺寸请不要大于500KB");
                obj.show();
                return;
            }
        } else {
            $.toast("只能选择jpg/gif/png格式的图片");
            obj.show();
            return;
        }

        var fd = new FormData();
        fd.append("file", obj[0].files[0]);

        $.ajax({
            type: "post",
            url: uploadUrl,
            async: false,
            contentType: false,
            processData: false,
            data: fd,
            dataType: 'text',
            success: function(data) {
                var json = utils.parseJson(data);
                filejson = json;
            }
        });

        console.log(filejson)

        return filejson;
    };

    utils.isType = function(type) {
        return function(o) {
            return Object.prototype.toString.call(o) === '[object ' + type + ']';
        }
    }

    utils.renderList = function(data, tmp, target) {
        var html = template(tmp, data);
        $(target).html(html);

        //utils.loadingOff();
    };


    utils.renderListHTML = function(data, tmp, target) {
        template.config("escape", false)
        var html = template(tmp, data);
        $(target).html(html);

        //utils.loadingOff();
    };

    utils.renderMoreList = function(data, tmp, target) {
        var html = template(tmp, data);
        $(target).append(html);

        //utils.loadingOff();
    };

    utils.renderMoreListHTML = function(data, tmp, target) {
        template.config("escape", false)
        var html = template(tmp, data);
        $(target).append(html);

        //utils.loadingOff();
    };

    utils.loadMore = function(target) {
        var val = $(target).text();
        $(target).text('加载中...');
        setTimeout(function() {
            $(target).text(val);
        }, 1000)
    };

    utils.pageInit = function(cb) {
        $(document).on("pageInit", function(e, pageId, $page) {
            console.log(pageId);
            cb(e, pageId, $page)
        });
    };

    utils.loadingOff = function() {
        $('.content').removeClass('loader-ovh');
        $('.m-loading').hide();
        // $(".loader").hide();
    };


    utils.scrollLoad = function(cb) {
        var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
        var nScrollTop = 0; //滚动到的当前位置
        var nDivHight = $(".content").height();
        $(".content").off('scroll').on('scroll', function() {
            nScrollHight = $(this)[0].scrollHeight;
            nScrollTop = $(this)[0].scrollTop;
            if (nScrollTop + nDivHight >= nScrollHight) {
                cb();
            }

        });
    };


    /**
     * [btnLoading 按钮加载]
     * @param  {[Object]} target [按钮加载的目标对象]
     * @param  {[Object]} val [加载的文字]
     * @param  {[Object]} time [加载关闭的时间]
     */
    utils.btnLoading = function(target, val) {
        val = val == undefined ? '加载中...' : val;

        $(target).val(val);
        $(target).text(val);
        $(target).attr('disabled', true);
        $(target).addClass('f-disabled');
    };

    utils.btnLoadingOff = function(target, val) {
        $(target).val(val);
        $(target).text(val);
        $(target).removeAttr('disabled');
        $(target).removeClass('f-disabled');
    };

    utils.isWechat = function() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    utils.auth = {}
    utils.auth.getUserInfo = function() {
        var user = utils.parseJson(localStorage.getItem('user')),
            token = localStorage.getItem('token');

        if (user && token) {
            return {
                user: user,
                token: token
            }
        } else {
            window.location.href = '/login?returnUrl=' + window.location.href
        }
    };



    return utils;
});