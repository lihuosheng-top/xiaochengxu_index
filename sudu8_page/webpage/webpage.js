var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        var t = this;
        t.setData({
            url: decodeURIComponent(a.url)
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getIndex(), app.util(t.getinfos, e, t.data.uniacid);
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
    getIndex: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            cachetime: "30",
            success: function(a) {
                t.setData({
                    baseinfo: a.data.data
                }), console.log(t.data.baseinfo), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    onShareAppMessage: function() {
        return {};
    }
});