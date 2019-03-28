function _defineProperty(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var app = getApp(), QQMapWX = require("../../sudu8_page/resource/js/qqmap.js");

Page({
    data: _defineProperty({
        page_signs: "/sudu8_page/store/store",
        storelist: [],
        baseinfo: [],
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time,
            i_view: app.globalData.i_view,
            close: app.globalData.close,
            v_ico: app.globalData.v_ico
        },
        currentCity: "",
        searchtitle: "",
        title: "",
        city: "",
        storeShow: 0
    }, "storelist", [ 0 ]),
    onPullDownRefresh: function(a) {
        this.getBase(), this.getStoreConf();
    },
    onLoad: function(a) {
        var t = this, e = a.city;
        e && t.setData({
            city: e
        });
        var i = 0;
        a.fxsid && (i = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getBase(), app.util(t.getinfos, i, t.data.uniacid);
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
                }), t.getStoreConf();
            }
        });
    },
    getBase: function() {
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
    getStoreConf: function() {
        var n = this;
        wx.request({
            url: n.data.baseurl + "doPagestoreConf",
            data: {
                uniacid: n.data.uniacid
            },
            success: function(a) {
                if (a.data.data.mapkey) var t = a.data.data.mapkey; else t = "6DYBZ-GN6W3-45I3C-Y2A4Q-YRIAS-YFBP3";
                n.setData({
                    search: a.data.data.search,
                    title: a.data.data.title,
                    storeShow: a.data.data.flag
                }), wx.setNavigationBarTitle({
                    title: n.data.title + "展示"
                });
                var o = new QQMapWX({
                    key: t
                });
                0 == a.data.data.flag ? wx.getLocation({
                    type: "wgs84",
                    success: function(a) {
                        var t = a.latitude, e = a.longitude;
                        o.reverseGeocoder({
                            location: {
                                latitude: t,
                                longitude: e
                            },
                            success: function(a) {
                                n.setData({
                                    currentCity: a.result.address_component.city
                                });
                            }
                        }), n.getListAll(e, t);
                    },
                    fail: function() {
                        n.getListAll();
                    }
                }) : wx.getLocation({
                    type: "wgs84",
                    success: function(a) {
                        var e = a.latitude, i = a.longitude;
                        o.reverseGeocoder({
                            location: {
                                latitude: e,
                                longitude: i
                            },
                            success: function(a) {
                                var t = n.data.city;
                                t ? (n.setData({
                                    currentCity: t
                                }), n.getList(i, e, t)) : (n.setData({
                                    currentCity: a.result.address_component.city
                                }), n.getList(i, e, a.result.address_component.city));
                            }
                        });
                    }
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getList: function(a, t, e) {
        var i = this;
        wx.request({
            url: i.data.baseurl + "doPagestoreNew",
            data: {
                uniacid: i.data.uniacid,
                lon: a,
                lat: t,
                currentCity: e
            },
            success: function(a) {
                i.setData({
                    storelist: a.data.data,
                    storenum: a.data.data.length
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getListAll: function(a, t) {
        var e = this;
        wx.request({
            url: e.data.baseurl + "doPagestore",
            data: {
                lon: a,
                lat: t,
                uniacid: e.data.uniacid
            },
            success: function(a) {
                e.setData({
                    storelist: a.data.data.list,
                    storenum: a.data.data.num
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
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
        wx.openLocation({
            latitude: parseFloat(this.data.baseinfo.latitude),
            longitude: parseFloat(this.data.baseinfo.longitude),
            name: this.data.baseinfo.name,
            address: this.data.baseinfo.address,
            scale: 22
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.title + "展示 -" + this.data.baseinfo.name
        };
    },
    mycoupp: function() {
        wx.redirectTo({
            url: "/sudu8_page/mycoupon/mycoupon"
        });
    },
    serachInput: function(a) {
        this.setData({
            searchtitle: a.detail.value
        });
    },
    search: function() {
        var t = this, a = a, e = e, i = t.data.searchtitle;
        i ? wx.request({
            url: t.data.baseurl + "dopagestore",
            data: {
                uniacid: t.data.uniacid,
                lon: e,
                lat: a,
                keyword: i
            },
            success: function(a) {
                t.setData({
                    storelist: a.data.data.list,
                    storenum: a.data.data.num
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            },
            fail: function(a) {
                console.log(a);
            }
        }) : wx.showModal({
            title: "提醒",
            content: "请输入搜索关键字！",
            showCancel: !1
        });
    },
    gesinco: function() {
        this.setData({
            diplay: res.data.data.flag
        });
        var a = 0;
        1 == res.flag ? a++ : a--;
        for (a = 0; a < res.data.length; a++) res.data[a].cmd;
    }
});