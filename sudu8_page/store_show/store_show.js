var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page_sign: "store",
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time
        },
        baseinfo: [],
        minHeight: 220,
        lat: "",
        lon: "",
        address: "",
        content: ""
    },
    onPullDownRefresh: function() {
        var a = this.data.id;
        this.getbaseinfo(), this.getAbout(a);
    },
    onLoad: function(a) {
        var t = this, e = a.id;
        t.setData({
            id: e
        });
        var i = 0;
        a.fxsid && (i = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getbaseinfo(), app.util(t.getinfos, i, t.data.uniacid);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                e.setData({
                    openid: a.data
                });
                var t = e.data.id;
                e.getAbout(t);
            }
        });
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    getbaseinfo: function() {
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
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getAbout: function(a) {
        var e = this;
        wx.request({
            url: e.data.baseurl + "doPageshowstore",
            data: {
                id: a,
                uniacid: e.data.uniacid
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    aboutinfo: a.data.data,
                    lat: a.data.data.lat,
                    lon: a.data.data.lon,
                    address: a.data.data.country,
                    content: WxParse.wxParse("content", "html", t.desc2, e, 0)
                }), wx.setNavigationBarTitle({
                    title: e.data.aboutinfo.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    dianPhoneCall: function(a) {
        var t = a.currentTarget.dataset.index;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    openMap: function() {
        var a = this;
        wx.openLocation({
            latitude: parseFloat(a.data.lat),
            longitude: parseFloat(a.data.lon),
            name: a.data.aboutinfo.title,
            address: a.data.address,
            scale: 22
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.aboutinfo.title
        };
    }
});