var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        id: "",
        sc: 0,
        bg: "",
        minHeight: 220,
        datas: "",
        content: "",
        jhsl: 1,
        dprice: "",
        yhje: 0,
        hjjg: "",
        sfje: "",
        order: "",
        my_num: "",
        xg_num: "",
        shengyu: "",
        userInfo: "",
        num: [],
        xz_num: [],
        proinfo: "",
        heighthave: 0
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        var t = this, e = a.id;
        t.setData({
            id: e
        });
        var i = 0;
        a.fxsid && (i = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                a.data.data;
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            }
        }), app.util(t.getinfos, i, t.data.uniacid);
    },
    collect: function(a) {
        var e = this;
        a.currentTarget.dataset.name;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                wx.getStorageSync("openid");
                wx.request({
                    url: e.data.baseurl + "doPageCollect",
                    data: {
                        uniacid: e.data.uniacid,
                        openid: e.data.openid,
                        types: "exchange",
                        id: e.data.id
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        var t = a.data.data;
                        "收藏成功" == t ? e.setData({
                            sc: 1
                        }) : e.setData({
                            sc: 0
                        }), wx.showToast({
                            title: t,
                            icon: "succes",
                            duration: 1e3,
                            mask: !0
                        });
                    }
                });
            },
            fail: function() {
                console.log("ffffff");
                wx.getStorageSync("appcode");
                wx.request({
                    url: e.data.baseurl + "doPageAppbase",
                    data: {
                        uniacid: e.data.uniacid,
                        code: e.data.code
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        a.data.data.openid;
                        wx.setStorage({
                            key: "openid",
                            data: a.data.data.openid,
                            success: function() {
                                wx.request({
                                    url: e.data.baseurl + "doPageCollect",
                                    data: {
                                        uniacid: e.data.uniacid,
                                        openid: e.data.openid,
                                        types: "exchange",
                                        id: e.data.id
                                    },
                                    header: {
                                        "content-type": "application/json"
                                    },
                                    success: function(a) {
                                        var t = a.data.data;
                                        "收藏成功" == t ? e.setData({
                                            sc: 1
                                        }) : e.setData({
                                            sc: 0
                                        }), wx.showToast({
                                            title: t,
                                            icon: "succes",
                                            duration: 1e3,
                                            mask: !0
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
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
                e.getShowPic(t);
            }
        });
    },
    getShowPic: function(a) {
        var t = this;
        wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPageScoreinfo",
            data: {
                uniacid: t.data.uniacid,
                id: a
            },
            success: function(a) {
                t.setData({
                    datas: a.data.data,
                    content: WxParse.wxParse("content", "html", a.data.data.product_txt, t, 5)
                }), wx.setNavigationBarTitle({
                    title: a.data.data.title
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    save: function(t) {
        var e = this, i = (e.data.jhsl, wx.getStorageSync("openid")), n = e.data.id;
        wx.showModal({
            title: "提示",
            content: "确定兑换此商品吗？",
            success: function(a) {
                if (a.confirm) wx.request({
                    url: e.data.baseurl + "doPageScoreorder",
                    data: {
                        uniacid: e.data.uniacid,
                        openid: i,
                        id: n,
                        formId: t.detail.formId
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        var t = a.data.data;
                        0 == t.flag ? wx.showModal({
                            title: "提醒",
                            content: t.msg,
                            showCancel: !1
                        }) : wx.showToast({
                            title: "兑换成功",
                            icon: "success",
                            duration: 1e3,
                            success: function() {
                                setTimeout(function() {
                                    wx.redirectTo({
                                        url: "/sudu8_page_plugin_exchange/order/order"
                                    });
                                }, 1e3);
                            }
                        });
                    }
                }); else if (a.cancel) ;
            }
        });
    },
    tabChange: function(a) {
        var t = a.currentTarget.dataset.id;
        this.setData({
            nowcon: t
        });
    },
    swiperLoad: function(i) {
        var n = this;
        wx.getSystemInfo({
            success: function(a) {
                var t = i.detail.width / i.detail.height, e = a.windowWidth / t;
                n.data.heighthave || n.setData({
                    minHeight: e,
                    heighthave: 1
                });
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.title
        };
    }
});