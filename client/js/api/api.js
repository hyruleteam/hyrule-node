import request from '../utils/request'

export function getQueryString (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

export function getProductInfo(params) {
    return request({
        url: '/api/v1/productInfo',
        method: 'post',
        params
    })
}

export function confirmOrder(params) {
    return request({
        url: '/api/v1/order/iotOrder',
        method: 'post',
        params
    })
}

export function orderPay(params) {
    return request({
        url: '/api/v1/order/pay',
        method: 'post',
        params
    })
}

export function packageUsage(params) {
    return request({
        url: '/api/v1/card/packageUsage',
        method: 'post',
        params
    })
}

export function searchHistory(params) {
    return request({
        url: '/api/v1/card/searchHistory',
        method: 'post',
        params
    })
}

export function connectNetwork(params) {
    return request({
        url: '/api/v1/card/connectNetwork',
        method: 'post',
        params
    })
}
