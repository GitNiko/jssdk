'use strick';
angular.module('wxjs', [])
.factory('wxjs', [function() {
    var baseParam = {
        'success': function(res) {},
        'fail': function(res) {},
        'complete': function(res) {}
    };
    var apiList = [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'startRecord',
        'stopRecord',
        'onVoiceRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'onVoicePlayEnd',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'translateVoice',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
    ];
    var wxIns = {};
    for (name in apiList) {
        wxIns[apiList[name]] = {
            funcName: apiList[name],
            func:function(a) {
                wx[apiList[name]](a);
                return wx;
            }
        };
    }
    // wxConfig({}).onMenuShareAppMessage;
    //
    return {
        getWXUserInfo: function() {
            var userInfo = localStorage.getItem('wxUserInfo');
            userInfo = angular.fromJson(userInfo);
            return userInfo;
        },
        hasWXUserInfo: function() {
            var userInfo = localStorage.getItem('wxUserInfo');
            if(null === userInfo) {
                return false;
            } else {
                return true;
            }
        },
        isTokenExpire: function() {
            var userInfo = localStorage.getItem('wxUserInfo');
            userInfo = angular.fromJson(userInfo);
            var now = new Date().getTime();
            var savedTime = Date.parse(userInfo.savedTime);
            var during = 7200 * 1000;
            if(now - savedTime > during) {
                return true;
            } else {
                return false;
            }

        },
        isRefreshTokenExpire: function() {
            var userInfo = localStorage.getItem('wxUserInfo');
            userInfo = angular.fromJson(userInfo);
            var now = new Date().getTime();
            var savedTime = Date.parse(userInfo.savedTime);
            // 最低的7天
            var during = 7*24*60*60*1000;
            if(now - savedTime > during) {
                return true;
            } else {
                return false;
            }
        },
        isInWeiXin: function(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.indexOf("micromessenger") > 0){
                return true;
            }else{
                return false;
            }
        },
        isInWeiXin5: function(){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.indexOf("micromessenger") > 0 && (parseFloat(ua.substr(ua.lastIndexOf('/') + 1)) >= 5.0)){
                return true;
            }else{
                return false;
            }
        },
        wxConfig: function(debug, appId, timestamp, nonceStr, signature, jsApiList) {
            wx.config({
                debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                signature: signature,// 必填，签名，见附录1
                jsApiList: jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            return wxIns;
        },
        wxConfigAll: function(debug, appId, timestamp, nonceStr, signature) {
            wx.config({
                debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                signature: signature,// 必填，签名，见附录1
                jsApiList: apiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            return wxIns;
        },
        wxCheckAll: function(apiList,callback) {
            wx.checkJsApi({
                jsApiList:apiList,
                success:function(res){
                //TODO
                callback(res);
            }});
            return wxIns;
        }
    }
}])
