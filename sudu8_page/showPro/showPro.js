var _data, _Page, _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
    return typeof a;
} : function(a) {
    return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
};

function _defineProperty(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page((_defineProperty(_Page = {
    data: (_data = {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        picList: [],
        interval: 5e3,
        duration: 1e3,
        currentSwiper: 0,
        clock: "",
        a: 1,
        sc: 0,
        content: "",
        con2: "",
        con3: "",
        shareHome: 0,
        fxsid: 0,
        shareShow: 0,
        shareScore: 0,
        shareNotice: 0,
        infinite: !1,
        current: 0,
        imgheights: []
    }, _defineProperty(_data, "currentSwiper", 0), _defineProperty(_data, "vip_config", 0), 
    _data),
    imageLoad: function(a) {
        var t = 750 / (a.detail.width / (t = a.detail.height)), e = this.data.imgheights;
        e[a.currentTarget.dataset.id] = t, this.setData({
            imgheights: e
        });
    },
    bindchange: function(a) {
        this.setData({
            current: a.detail.current
        });
    },
    onLoad: function(a) {
        var t = this, e = a.id;
        t.setData({
            id: e
        }), wx.showShareMenu({
            withShareTicket: !0
        });
        var i = 0;
        a.fxsid && (i = a.fxsid, t.setData({
            fxsid: a.fxsid,
            shareHome: 1
        })), a.userid && t.setData({
            userid: a.userid
        }), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            cachetime: "30",
            data: {
                vs1: 1,
                uniacid: t.data.uniacid
            },
            success: function(a) {
                a.data.data;
                t.setData({
                    baseinfo: a.data.data,
                    comm: a.data.data.commP,
                    comms: a.data.data.commPs
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            }
        }), app.util(t.getinfos, i);
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
                e.getShowPic(t), e.givepscore();
            }
        });
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.util.redirectto(t, e);
    },
    output: function(a) {
        var t = void 0;
        if (this.data.sto_id = a.sto_id, t = 0 < a.day ? a.day + "天" + a.hour + "小时" + a.min + "分钟" + a.sec + "秒" : a.hour + "小时" + a.min + "分钟" + a.sec + "秒", 
        0 == a.day && 0 == a.hour && 0 == a.min && 0 == a.sec) if (0 == this.data.start) {
            this.setData({
                start: 1
            });
            var e = new Date().getTime();
            that.countDown(this.output, 1e3 * this.data.sale_end_time - e);
        } else 1 == this.data.start && this.setData({
            start: 2
        }); else this.setData({
            clock: t
        });
    },
    getShowPic: function(t) {
        var e = this, a = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "doPageglobaluserinfo",
            data: {
                openid: a,
                uniacid: e.data.uniacid
            },
            success: function(a) {
                e.setData({
                    globaluser: a.data.data
                });
            }
        }), wx.request({
            url: e.data.baseurl + "doPageshowPro11",
            data: {
                types: "showPro",
                id: t,
                openid: a,
                uniacid: e.data.uniacid
            },
            success: function(a) {
                console.log(a.data), 1 == a.data.data.is_saletwo && wx.showModal({
                    title: "提示",
                    content: "该商品已下架",
                    showCancel: !1,
                    success: function() {
                        wx.redirectTo({
                            url: "/sudu8_page/index/index"
                        });
                    }
                }), 0 == a.data.data.is_flag && wx.showModal({
                    title: "提示",
                    content: "该商品已不存在,请选择其他商品",
                    showCancel: !1,
                    success: function() {
                        return wx.navigateBack({
                            delta: 1
                        }), !1;
                    }
                }), 0 == a.data.data.timetobegin && "0" == a.data.data.sale_end_time_copy ? e.setData({
                    infinite: !0
                }) : 0 == a.data.data.timetobegin && 0 == a.data.data.sale_end_time ? e.setData({
                    start: 2
                }) : 0 < a.data.data.timetobegin ? (e.setData({
                    start: 0
                }), e.countDown(e.output, a.data.data.timetobegin)) : 0 == a.data.data.timetobegin && 0 < a.data.data.sale_end_time && (e.setData({
                    start: 1
                }), e.countDown(e.output, 1e3 * a.data.data.sale_end_time)), e.setData({
                    id: t,
                    sale_end_time: a.data.data.sale_end_time_copy,
                    picList: a.data.data.text,
                    title: a.data.data.title,
                    datas: a.data.data,
                    my_num: a.data.data.my_num,
                    xg_num: a.data.data.pro_xz,
                    sc: a.data.data.collectcount,
                    commSelf: a.data.data.comment,
                    vip_config: a.data.data.vip_config
                }), a.data.data.product_txt && WxParse.wxParse("content", "html", a.data.data.product_txt, e, 5), 
                a.data.data.con2 && WxParse.wxParse("con2", "html", a.data.data.con2, e, 5), a.data.data.con3 && WxParse.wxParse("con3", "html", a.data.data.con3, e, 5), 
                wx.setNavigationBarTitle({
                    title: e.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        }), setTimeout(function() {
            if ("1" == e.data.comm && "0" != e.data.commSelf || "1" == e.data.commSelf) {
                var a = e.data.comms;
                e.setData({
                    commShow: 1
                }), wx.request({
                    url: e.data.baseurl + "doPagegetComment",
                    cachetime: "0",
                    data: {
                        id: t,
                        comms: a,
                        uniacid: e.data.uniacid
                    },
                    success: function(a) {
                        "" != a.data && e.setData({
                            comments: a.data.data,
                            is_comment: 1
                        });
                    }
                });
            }
        }, 500);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        for (var a = this, t = a.data.id, e = a.data.sto_id, i = e - 50; i <= e + 50; i++) clearTimeout(i);
        a.getShowPic(t);
    },
    onReachBottom: function() {},
    makePhoneCall: function(a) {
        var t = this.data.baseinfo.tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    onShareAppMessage: function() {
        var a = wx.getStorageSync("openid"), t = this.data.id, e = "";
        return e = 1 == this.data.globaluser.fxs ? "/sudu8_page/showPro/showPro?id=" + t + "&userid=" + a : "/sudu8_page/showPro/showPro?id=" + t + "&userid=" + a + "&fxsid=" + a, 
        {
            title: this.data.title,
            path: e,
            success: function(a) {}
        };
    },
    change: function(a) {
        var t = a.currentTarget.dataset.id;
        this.setData({
            a: t
        });
    },
    givepscore: function() {
        var a = this.data.id, t = this.data.userid, e = wx.getStorageSync("openid");
        t != e && 0 != t && wx.request({
            url: this.data.baseurl + "doPagegiveposcore",
            data: {
                id: a,
                types: "showPro",
                openid: e,
                fxsid: t,
                uniacid: this.data.uniacid
            },
            success: function(a) {}
        });
    },
    swiperChange: function(a) {
        this.setData({
            currentSwiper: a.detail.current
        });
    },
    share111: function() {
        this.setData({
            share: 1
        });
    },
    share_close: function() {
        this.setData({
            share: 0
        });
    },
    shareClo: function() {
        this.setData({
            shareShow: 0
        });
    },
    collect: function(a) {
        var e = this, i = a.currentTarget.dataset.name;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var t = wx.getStorageSync("openid");
                wx.request({
                    url: e.data.baseurl + "doPageCollect",
                    data: {
                        openid: t,
                        types: "showPro",
                        id: i,
                        uniacid: e.data.uniacid
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
                var a = wx.getStorageSync("appcode");
                wx.request({
                    url: e.data.baseurl + "doPageAppbase",
                    data: {
                        code: a,
                        uniacid: e.data.uniacid
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        var t = a.data.data.openid;
                        wx.setStorage({
                            key: "openid",
                            data: a.data.data.openid,
                            success: function() {
                                wx.request({
                                    url: e.data.baseurl + "doPageCollect",
                                    data: {
                                        openid: t,
                                        types: "showPro",
                                        id: i,
                                        uniacid: e.data.uniacid
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
    tobuy: function() {
        if (1 == this.data.vip_config) return wx.showModal({
            title: "提醒",
            content: "该商品必须开通会员卡购买！",
            showCancel: !1,
            success: function() {
                wx.navigateTo({
                    url: "/sudu8_page/register/register?type=miaosha"
                });
            }
        }), !1;
        wx.navigateTo({
            url: "/sudu8_page/order_dan/order_dan?id=" + this.data.datas.id
        });
    }
}, "swiperChange", function(a) {
    this.setData({
        currentSwiper: a.detail.current
    });
}), _defineProperty(_Page, "countDown", function(t, e) {
    var d = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0, i = this;
    "object" != (void 0 === e ? "undefined" : _typeof(e)) && (e = [ e ]);
    var r = function(a) {
        return a < 10 ? "0" + a : a;
    }, c = 0;
    if ("function" == typeof t && t(function(a) {
        for (var t = [], e = 0; e < a.length; e++) if (0 < a[e]) {
            var i = Math.floor(a[e] / 1e3), o = Math.floor(i / 3600), n = {};
            n.day = Math.floor(o / 24), n.hour = r(o % 24), n.min = r(Math.floor((i - 3600 * o) / 60)), 
            n.sec = r(i % 60), n.sto_id = d, t.push(n);
        } else {
            var s = {
                day: 0,
                hour: 0,
                min: 0,
                sec: 0
            };
            s.sto_id = d, t.push(s), c++;
        }
        return 1 == a.length ? t[0] : t;
    }(e)), c != e.length) d = setTimeout(function() {
        for (var a = 0; a < e.length; a++) e[a] -= 1e3;
        i.countDown(t, e, d);
    }, 1e3);
}), _defineProperty(_Page, "test111", function() {
    wx.redirectTo({
        url: "/sudu8_page/test/testlink",
        success: function(a) {},
        fail: function(a) {},
        complete: function(a) {}
    });
}), _Page));