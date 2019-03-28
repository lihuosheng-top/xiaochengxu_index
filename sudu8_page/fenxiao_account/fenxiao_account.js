var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid
    },
    onPullDownRefresh: function() {
        this.getmzh();
    },
    onLoad: function(a) {
        var o = this;
        wx.setNavigationBarTitle({
            title: "我的账户"
        }), wx.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#fafafa"
        });
        var t = 0;
        a.fxsid && (t = a.fxsid, o.setData({
            fxsid: a.fxsid
        })), wx.request({
            url: o.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: o.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                if (a.data.data.video) var t = "show";
                if (a.data.data.c_b_bg) var i = "bg";
                o.setData({
                    baseinfo: a.data.data,
                    show_v: t,
                    c_b_bg1: i
                }), wx.setNavigationBarColor({
                    frontColor: o.data.baseinfo.base_tcolor,
                    backgroundColor: o.data.baseinfo.base_color
                }), o.getmzh();
            },
            fail: function(a) {
                console.log(a);
            }
        }), app.util(o.getinfos, t, o.data.uniacid);
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
                });
            }
        });
    },
    account_tixian: function() {
        wx.navigateTo({
            url: "/sudu8_page/fenxiao_tixian/fenxiao_tixian"
        });
    },
    fenxiao_order: function() {
        wx.navigateTo({
            url: "/sudu8_page/fenxiao_order/fenxiao_order"
        });
    },
    tixian_record: function() {
        wx.navigateTo({
            url: "/sudu8_page/fenxiao_tixian_do/fenxiao_tixian_do"
        });
    },
    getmzh: function() {
        var t = this, a = wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPagegetmzh",
            data: {
                uniacid: t.data.uniacid,
                openid: a
            },
            success: function(a) {
                t.setData({
                    myzh: a.data.data.userinfo,
                    yj: a.data.data.wfmoney
                });
            }
        });
    }
});