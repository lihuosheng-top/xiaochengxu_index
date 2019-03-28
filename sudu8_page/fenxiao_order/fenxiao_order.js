var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        nav: 1,
        page_signs: "/sudu8_page/fenxiao_order/fenxiao_order"
    },
    onPullDownRefresh: function() {
        this.getlistqf(1), this.getbase();
    },
    onLoad: function(a) {
        var i = this;
        wx.setNavigationBarTitle({
            title: "分销订单"
        }), wx.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#fafafa"
        });
        var t = 0;
        a.fxsid && (t = a.fxsid, i.setData({
            fxsid: a.fxsid
        })), wx.request({
            url: i.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: i.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                if (a.data.data.video) var t = "show";
                if (a.data.data.c_b_bg) var e = "bg";
                i.setData({
                    baseinfo: a.data.data,
                    show_v: t,
                    c_b_bg1: e
                }), wx.setNavigationBarColor({
                    frontColor: i.data.baseinfo.base_tcolor,
                    backgroundColor: i.data.baseinfo.base_color
                });
            }
        }), app.util(i.getinfos, t, i.data.uniacid);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var t = a.data;
                e.setData({
                    openid: t
                }), e.getlistqf(1), e.getbase();
            }
        });
    },
    nav: function(a) {
        this.setData({
            nav: a.currentTarget.dataset.id
        });
        var t = a.currentTarget.dataset.id;
        this.getlistqf(t);
    },
    getbase: function() {
        var t = this, a = wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPagefxcount",
            data: {
                uniacid: t.data.uniacid,
                openid: a
            },
            success: function(a) {
                t.setData({
                    orderscount: a.data.data
                });
            }
        });
    },
    getlistqf: function(a) {
        var t = this, e = wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPagefxdingd",
            data: {
                uniacid: t.data.uniacid,
                openid: e,
                types: a
            },
            success: function(a) {
                console.log(888888), console.log(a), t.setData({
                    orders: a.data
                });
            }
        });
    }
});