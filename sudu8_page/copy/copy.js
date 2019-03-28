var _Page;

function _defineProperty(a, e, t) {
    return e in a ? Object.defineProperty(a, e, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[e] = t, a;
}

var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page((_defineProperty(_Page = {
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        baseinfo: [],
        page_signs: "/sudu8_page/copy/copy"
    },
    onLoad: function(a) {
        var e = a.id;
        this.setData({
            id: e
        });
    },
    onPullDownRefresh: function() {
        this.getbaseinfo();
    }
}, "onLoad", function(a) {
    var e = this, t = 0;
    a.fxsid && (t = a.fxsid, e.setData({
        fxsid: a.fxsid
    })), e.getbaseinfo(), app.util(e.getinfos, t, e.data.uniacid);
}), _defineProperty(_Page, "redirectto", function(a) {
    var e = a.currentTarget.dataset.link, t = a.currentTarget.dataset.linktype;
    app.redirectto(e, t);
}), _defineProperty(_Page, "getinfos", function() {
    var e = this;
    wx.getStorage({
        key: "openid",
        success: function(a) {
            e.setData({
                openid: a.data
            });
        }
    });
}), _defineProperty(_Page, "getbaseinfo", function() {
    var e = this;
    wx.request({
        url: e.data.baseurl + "doPageBaseMin",
        data: {
            uniacid: e.data.uniacid,
            vs1: 1
        },
        cachetime: "30",
        success: function(a) {
            e.setData({
                base_tcolor: a.data.data.base_tcolor,
                base_color: a.data.data.base_color,
                copyname: a.data.data.copyright,
                copytel: a.data.data.tel_b
            }), wx.setNavigationBarTitle({
                title: e.data.copyname
            }), wx.setNavigationBarColor({
                frontColor: e.data.base_tcolor,
                backgroundColor: e.data.base_color
            });
        },
        fail: function(a) {
            console.log(a);
        }
    }), wx.request({
        url: e.data.baseurl + "doPageCopycon",
        cachetime: "30",
        data: {
            id: e.data.id,
            uniacid: e.data.uniacid
        },
        success: function(a) {
            e.setData({
                copycon: WxParse.wxParse("copycon", "html", a.data.data.copycon, e, 0)
            });
        },
        fail: function(a) {
            console.log(a);
        }
    });
}), _defineProperty(_Page, "onShareAppMessage", function() {
    return {
        title: this.data.copyname
    };
}), _Page));