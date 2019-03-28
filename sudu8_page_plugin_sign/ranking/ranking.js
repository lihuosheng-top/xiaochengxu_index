var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        minHeight: 220,
        bg: "",
        userinfo: "",
        hasEmptyGrid: !1,
        showPicker: !1,
        paixu: ""
    },
    onPullDownRefresh: function() {
        this.data.id;
        this.getsign(), wx.stopPullDownRefresh();
    },
    onLoad: function(a) {
        var t = this;
        t.getsign(), wx.setNavigationBarTitle({
            title: "签到排行榜"
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
        }), app.util(t.getinfos, e, t.data.uniacid);
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
    getsign: function() {
        var e = this, a = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "dopagePaihb",
            data: {
                uniacid: e.data.uniacid,
                openid: a
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    paixu: t
                });
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: "签到排行榜"
        };
    }
});