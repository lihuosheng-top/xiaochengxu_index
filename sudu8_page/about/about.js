var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page_signs: "/sudu8_page/about/about",
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time
        },
        baseinfo: [],
        minHeight: 220,
        heighthave: 0
    },
    onPullDownRefresh: function() {
        this.getbaseinfo(), this.getAbout();
    },
    onLoad: function(a) {
        var t = this, e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getbaseinfo(), app.util(t.getinfos, e, t.data.uniacid);
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
                }), t.getAbout();
            }
        });
    },
    getbaseinfo: function() {
        var e = this;
        wx.request({
            url: e.data.baseurl + "doPageBase",
            data: {
                uniacid: e.data.uniacid,
                vs1: 1
            },
            cachetime: "30",
            success: function(a) {
                if (console.log(a), a.data.data.c_b_bg) var t = "bg";
                e.setData({
                    baseinfo: a.data.data,
                    c_b_bg1: t
                }), wx.setNavigationBarTitle({
                    title: e.data.baseinfo.aboutCN
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getAbout: function() {
        var e = this;
        wx.request({
            url: e.data.baseurl + "doPageAbout",
            data: {
                uniacid: e.data.uniacid
            },
            cachetime: "30",
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    aboutinfo: t,
                    content: WxParse.wxParse("content", "html", t.content, e, 0)
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    swiperLoad: function(i) {
        var o = this;
        wx.getSystemInfo({
            success: function(a) {
                var t = i.detail.width / i.detail.height, e = a.windowWidth / t;
                o.data.heighthave || o.setData({
                    minHeight: e,
                    heighthave: 1
                });
            }
        });
    },
    makePhoneCall: function(a) {
        var t = this.data.baseinfo.tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    makePhoneCallB: function(a) {
        var t = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    openMap: function(a) {
        var t = this;
        wx.openLocation({
            latitude: parseFloat(t.data.baseinfo.latitude),
            longitude: parseFloat(t.data.baseinfo.longitude),
            name: t.data.baseinfo.name,
            address: t.data.baseinfo.address,
            scale: 22
        });
    },
    onPreviewImage: function(a) {
        app.util.showImage(a);
    },
    onShareAppMessage: function() {
        return {
            title: this.data.baseinfo.aboutCN + "-" + this.data.baseinfo.name
        };
    }
});