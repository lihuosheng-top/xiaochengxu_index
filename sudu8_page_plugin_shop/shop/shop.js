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
        content: "",
        id: 0
    },
    onPullDownRefresh: function() {
        var a = this.data.id;
        this.getbaseinfo(), this.getAbout(a);
    },
    onLoad: function(a) {
        var t = this, e = a.id, o = a.cid;
        t.setData({
            id: e || o
        });
        var i = 0;
        a.fxsid && (i = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getbaseinfo(), app.util(t.getinfos, i, t.data.uniacid);
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
                e.setData({
                    openid: a.data
                });
                var t = e.data.id;
                e.getAbout(t);
            }
        });
    },
    getbaseinfo: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageBase",
            data: {
                uniacid: t.data.uniacid,
                fxsid: t.data.fxsid,
                vs1: 1
            },
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
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageShowstore_W",
            data: {
                uniacid: t.data.uniacid,
                id: t.data.id
            },
            success: function(a) {
                console.log(a), t.setData({
                    aboutinfo: a.data.data,
                    lat: a.data.data.latitude,
                    lon: a.data.data.longitude,
                    address: a.data.data.address
                }), console.log(11111), console.log(t.data.goods), wx.setNavigationBarTitle({
                    title: t.data.aboutinfo.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            },
            fail: function(a) {
                console.log(a);
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
            name: a.data.aboutinfo.name,
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