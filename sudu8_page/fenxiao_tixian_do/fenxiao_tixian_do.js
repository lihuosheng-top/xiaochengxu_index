var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        nav: 1,
        page_signs: "/sudu8_page/fenxiao_tixian_do/fenxiao_tixian_do"
    },
    onPullDownRefresh: function() {
        this.tixianjl(1);
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: "提现记录"
        });
        var t = 0;
        a.fxsid && (t = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), wx.request({
            url: e.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: e.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                if (a.data.data.video) var t = "show";
                if (a.data.data.c_b_bg) var i = "bg";
                e.setData({
                    baseinfo: a.data.data,
                    show_v: t,
                    c_b_bg1: i
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                });
            }
        }), app.util(e.getinfos, t, e.data.uniacid);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, i = a.currentTarget.dataset.linktype;
        app.redirectto(t, i);
    },
    getinfos: function() {
        var i = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var t = a.data;
                i.setData({
                    openid: t
                }), i.tixianjl(1);
            }
        });
    },
    nav: function(a) {
        var t = a.currentTarget.dataset.id;
        this.setData({
            nav: t
        }), this.tixianjl(t);
    },
    tixianjl: function(a) {
        var t = this, i = wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPagefxstxjl",
            data: {
                uniacid: t.data.uniacid,
                openid: i,
                val: a
            },
            success: function(a) {
                t.setData({
                    tixsq: a.data.data
                });
            }
        });
    }
});