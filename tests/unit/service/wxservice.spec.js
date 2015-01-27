'use strict';

describe('wxjs', function() {
  var $httpBackend;
  // load modules
  beforeEach(module('wxjs'));
  // beforeEach(inject(function($cookies) {
  //   $cookies.isLogin = {};
  // }));
  // beforeEach(inject(function($injector) {
  //     $httpBackend = $injector.get('$httpBackend');
  //
  // }));
  afterEach(function() {
    localStorage.removeItem('wxUserInfo');
  });
  // Test service availability
  it('没有WXUserInfo', inject(function(wxjs) {
    expect(wxjs.hasWXUserInfo()).toBe(false);
  }));
  it('有WXUserInfo', inject(function(wxjs) {
    var stuwxUserInfo = {
            "access_token":"ACCESS_TOKEN",
            "expires_in":7200,
            "refresh_token":"REFRESH_TOKEN",
            "openid":"OPENID",
            "scope":"SCOPE"
        };
    stuwxUserInfo['savedTime'] = new Date();
    localStorage.setItem('wxUserInfo', angular.toJson(stuwxUserInfo));
    expect(wxjs.hasWXUserInfo()).toBe(true);
  }));
  it('微信token过期', inject(function(wxjs) {
    var stuwxUserInfo = {
            "access_token":"ACCESS_TOKEN",
            "expires_in":7200,
            "refresh_token":"REFRESH_TOKEN",
            "openid":"OPENID",
            "scope":"SCOPE"
    };
    var twoHourAgo = new Date(new Date().getTime() - 2*60*60*1000 - 20*1000);
    stuwxUserInfo['savedTime'] = twoHourAgo;
    localStorage.setItem('wxUserInfo', angular.toJson(stuwxUserInfo));
    expect(wxjs.isTokenExpire()).toBe(true);
  }));
  it('微信token没有过期', inject(function(wxjs) {
    var stuwxUserInfo = {
            "access_token":"ACCESS_TOKEN",
            "expires_in":7200,
            "refresh_token":"REFRESH_TOKEN",
            "openid":"OPENID",
            "scope":"SCOPE"
    };
    var exTwoHourAgo = new Date(new Date().getTime() - 2*60*60*1000 + 10*1000);
    stuwxUserInfo['savedTime'] = exTwoHourAgo;
    localStorage.setItem('wxUserInfo', angular.toJson(stuwxUserInfo));
    expect(wxjs.isTokenExpire()).toBe(false);
  }));
  it('微信refresh token过期', inject(function(wxjs) {
    var stuwxUserInfo = {
            "access_token":"ACCESS_TOKEN",
            "expires_in":7200,
            "refresh_token":"REFRESH_TOKEN",
            "openid":"OPENID",
            "scope":"SCOPE"
    };
    var oneWeekAgo = new Date(new Date().getTime() - 7*24*60*60*1000 - 20*1000);
    stuwxUserInfo['savedTime'] = oneWeekAgo;
    localStorage.setItem('wxUserInfo', angular.toJson(stuwxUserInfo));
    expect(wxjs.isRefreshTokenExpire()).toBe(true);
  }));
  it('微信refresh token没有过期', inject(function(wxjs) {
    var stuwxUserInfo = {
            "access_token":"ACCESS_TOKEN",
            "expires_in":7200,
            "refresh_token":"REFRESH_TOKEN",
            "openid":"OPENID",
            "scope":"SCOPE"
    };
    var ExOneWeekAgo = new Date(new Date().getTime() - 7*24*60*60*1000 + 10*1000);
    stuwxUserInfo['savedTime'] = ExOneWeekAgo;
    localStorage.setItem('wxUserInfo', angular.toJson(stuwxUserInfo));
    expect(wxjs.isRefreshTokenExpire()).toBe(false);
  }));
});
