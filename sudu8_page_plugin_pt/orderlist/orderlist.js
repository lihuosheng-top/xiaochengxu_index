var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page_sign: "order",
        page: 1,
        morePro: !1,
        baseinfo: [],
        orderinfo: [],
        type: 9,
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time,
            i_view: app.globalData.i_view,
            close: app.globalData.close,
            v_ico: app.globalData.v_ico
        }
    },
    onPullDownRefresh: function() {
        this.getinfos(), wx.stopPullDownRefresh();
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "我的拼团订单"
        }), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                t.setData({
                    baseinfo: a.data.data
                }), console.log(t.data.baseinfo), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            }
        }), a.type && t.setData({
            type: a.type
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), app.util(t.getinfos, e, t.data.uniacid);
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
                }), t.getList();
            }
        });
    },
    getList: function(a) {
        var t = this;
        wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "dopageptorderlist",
            data: {
                uniacid: t.data.uniacid,
                openid: wx.getStorageSync("openid")
            },
            success: function(a) {
                console.log(a.data.data), t.setData({
                    orderinfo: a.data.data
                });
            }
        });
    },
    makePhoneCallB: function(a) {
        var t = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    qrshouh: function(a) {
        var t = this, e = a.target.dataset.order, i = wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPagequerenxc",
            data: {
                uniacid: t.data.uniacid,
                openid: i,
                orderid: e
            },
            success: function(a) {
                t.getList();
            }
        });
    }
});