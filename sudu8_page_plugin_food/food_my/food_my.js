var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        gwc: "",
        allprice: "",
        xiansz: !1,
        mydingd: ""
    },
    onPullDownRefresh: function() {
        this.getIndex(), this.getmy();
    },
    onLoad: function(a) {
        var t = this, e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getIndex(), app.util(t.getinfos, e, t.data.uniacid);
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
                }), t.getmy();
            }
        });
    },
    getIndex: function() {
        var i = this;
        wx.request({
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
                }), wx.setNavigationBarTitle({
                    title: "餐饮订单"
                }), wx.setNavigationBarColor({
                    frontColor: i.data.baseinfo.base_tcolor,
                    backgroundColor: i.data.baseinfo.base_color
                }), a.data.data.form_index;
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getmy: function() {
        var t = this, a = wx.getStorageSync("openid");
        t.data.allprice;
        t.setData({
            xiansz: !0
        }), wx.request({
            url: t.data.baseurl + "doPageMycai",
            data: {
                openid: a,
                uniacid: t.data.uniacid
            },
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function(a) {
                t.setData({
                    mydingd: a.data.data
                });
            }
        });
    }
});