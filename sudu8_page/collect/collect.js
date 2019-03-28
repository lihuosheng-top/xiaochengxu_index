var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page: 1,
        collectlist: "",
        morePro: !1,
        baseinfo: []
    },
    onPullDownRefresh: function() {
        this.getCollect();
    },
    onLoad: function(a) {
        var t = this, e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getCollect(), app.util(t.getinfos, e, t.data.uniacid);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                });
            }
        });
    },
    getCollect: function() {
        var t = this, a = wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                a.data.data;
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            }
        }), wx.request({
            url: t.data.baseurl + "doPagegetCollect",
            data: {
                openid: a,
                uniacid: t.data.uniacid,
                page: 1
            },
            cachetime: "30",
            success: function(a) {
                t.setData({
                    collectlist: a.data.data.list
                }), 10 < a.data.data.num ? t.setData({
                    morePro: !0
                }) : t.setData({
                    morePro: !1
                }), wx.setNavigationBarTitle({
                    title: "我的收藏"
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    showMore: function() {
        var t = this, e = t.data.page + 1, a = wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPagegetCollect",
            data: {
                openid: a,
                page: e,
                uniacid: t.data.uniacid
            },
            success: function(a) {
                "" != a.data.data.list && t.setData({
                    collectlist: t.data.collectlist.concat(a.data.data.list),
                    page: e
                }), a.data.data.num == e && t.setData({
                    morePro: !1
                });
            }
        });
    }
});