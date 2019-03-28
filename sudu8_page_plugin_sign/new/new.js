var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page: 1,
        collectlist: "",
        baseinfo: [],
        arr: ""
    },
    onPullDownRefresh: function() {
        this.getCollect(), wx.stopPullDownRefresh();
    },
    onLoad: function(a) {
        var t = this;
        this.getCollect(), wx.setNavigationBarTitle({
            title: "最新签到"
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), wx.request({
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
        }), app.util(this.getinfos, e, t.data.uniacid);
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
            url: t.data.baseurl + "dopageZxqd",
            data: {
                uniacid: t.data.uniacid,
                openid: a
            },
            success: function(a) {
                t.setData({
                    arr: a.data.data
                });
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: "最新签到"
        };
    }
});