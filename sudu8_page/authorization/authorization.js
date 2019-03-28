var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid
    },
    onLoad: function(a) {
        var e = this;
        wx.request({
            url: e.data.baseurl + "doPageBase",
            cachetime: "30",
            data: {
                uniacid: e.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                e.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    goback: function() {
        var s = this, d = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(a) {
                var e = a.userInfo, t = e.nickName, n = e.avatarUrl, o = e.gender, i = e.province, c = e.city, r = e.country;
                wx.request({
                    url: s.data.baseurl + "doPageUseupdate",
                    data: {
                        uniacid: s.data.uniacid,
                        openid: d,
                        nickname: t,
                        avatarUrl: n,
                        gender: o,
                        province: i,
                        city: c,
                        country: r
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        wx.setStorageSync("golobeuid", a.data.data.id), wx.setStorageSync("golobeuser", a.data.data), 
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            },
            fail: function() {
                app.selfinfoget(s.chenggfh, s.data.uniacid);
            }
        });
    }
});