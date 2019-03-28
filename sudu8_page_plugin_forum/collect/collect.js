var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        list: [],
        page: 1,
        isview: 0
    },
    onPullDownRefresh: function() {
        this.setData({
            page: 1
        }), this.getlist(), wx.stopPullDownRefresh();
    },
    onLoad: function() {
        var t = this;
        wx.setNavigationBarTitle({
            title: "收藏页"
        }), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), app.util(t.getinfos, 0, t.data.uniacid), t.getlist();
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    getlist: function() {
        var t = this, a = t.data.page;
        wx.request({
            url: t.data.baseurl + "doPageGetForumCollect",
            data: {
                uniacid: t.data.uniacid,
                openid: wx.getStorageSync("openid"),
                page: a
            },
            success: function(a) {
                t.setData({
                    list: a.data.data
                });
            },
            fail: function(a) {}
        });
    },
    onReachBottom: function() {
        var t = this, e = t.data.page + 1;
        wx.request({
            url: t.data.baseurl + "doPageGetForumCollect",
            data: {
                uniacid: t.data.uniacid,
                page: e,
                openid: t.data.openid
            },
            success: function(a) {
                t.setData({
                    list: t.data.list.concat(a.data.data),
                    page: e
                });
            }
        });
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var t = a.data;
                console.log(t), e.setData({
                    openid: t
                });
            },
            fail: function(a) {
                e.setData({
                    isview: 1
                });
            }
        });
    },
    huoqusq: function() {
        var d = this, u = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(a) {
                var t = a.userInfo, e = t.nickName, n = t.avatarUrl, i = t.gender, o = t.province, s = t.city, c = t.country;
                wx.request({
                    url: d.data.baseurl + "doPageUseupdate",
                    data: {
                        uniacid: d.data.uniacid,
                        openid: u,
                        nickname: e,
                        avatarUrl: n,
                        gender: i,
                        province: o,
                        city: s,
                        country: c
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        wx.setStorageSync("golobeuid", a.data.data.id), wx.setStorageSync("golobeuser", a.data.data), 
                        d.setData({
                            isview: 0,
                            globaluser: a.data.data
                        });
                    }
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onShareAppMessage: function() {}
});