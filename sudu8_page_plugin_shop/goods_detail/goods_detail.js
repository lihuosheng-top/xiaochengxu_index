var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        minHeight: 220,
        bg: "",
        picList: [],
        datas: "",
        sc: 0,
        nowcon: "con",
        is_comment: 0,
        comm: 0,
        commSelf: 0,
        comments: [],
        commShow: 0,
        shareShow: 0,
        shareScore: 0,
        shareNotice: 0,
        content: "",
        con2: "",
        con3: "",
        fxsid: 0,
        heighthave: 0,
        shareHome: 0,
        tel: ""
    },
    onPullDownRefresh: function() {
        var a = this, t = a.data.id;
        a.getShowPic(t), a.givepscore();
    },
    onLoad: function(a) {
        var t = this, e = a.id;
        t.setData({
            id: e
        }), wx.showShareMenu({
            withShareTicket: !0
        });
        var o = 0;
        a.fxsid && (o = a.fxsid, t.setData({
            fxsid: a.fxsid,
            shareHome: 1
        }));
        var i = "";
        a.tel && (i = a.tel, t.setData({
            tel: i
        })), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            cachetime: "30",
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
        }), app.util(t.getinfos, o, t.data.uniacid);
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
                e.getShowPic(t), e.givepscore();
            }
        });
    },
    follow: function(a) {
        var t = this;
        a.currentTarget.dataset.id;
        wx.request({
            url: t.data.baseurl + "doPagecommentFollow",
            cachetime: "0",
            data: {
                uniacid: t.data.uniacid,
                id: t.data.id
            },
            success: function(a) {
                1 == a.data.data.result && wx.showToast({
                    title: "点赞成功",
                    icon: "success",
                    duration: 1e3
                });
            }
        });
    },
    pinglun: function(a) {
        this.setData({
            pinglun_t: a.detail.value
        });
    },
    pinglun_sub: function() {
        var a = this, t = a.data.pinglun_t, e = a.data.id;
        wx.getStorageSync("openid");
        if ("" == t || null == t) return wx.showModal({
            content: "评论不能为空"
        }), !1;
        wx.request({
            url: a.data.baseurl + "doPageComment",
            cachetime: "30",
            data: {
                uniacid: a.data.uniacid,
                pinglun_t: a.data.pinglun_t,
                id: a.data.id,
                openid: a.data.openid
            },
            success: function(a) {
                console.log(a), 1 == a.data.data.result && (wx.showToast({
                    title: "评价提交成功",
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.redirectTo({
                        url: "/sudu8_page_plugin_shop/goods_detail/goods_detail?id=" + e
                    });
                }, 2e3));
            }
        });
    },
    getShowPic: function(a) {
        var t = this;
        wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPageglobaluserinfo",
            data: {
                uniacid: t.data.uniacid,
                openid: t.data.openid
            },
            success: function(a) {
                t.setData({
                    globaluser: a.data.data
                });
            }
        }), wx.request({
            url: t.data.baseurl + "doPageshowPro_W",
            data: {
                uniacid: t.data.uniacid,
                id: t.data.id,
                openid: t.data.openid
            },
            cachetime: "30",
            success: function(a) {
                console.log(a.data.data), t.setData({
                    picList: a.data.data.images,
                    title: a.data.data.title,
                    datas: a.data.data,
                    sc: a.data.data.collectcount
                }), console.log(111111), console.log(t.data.datas), a.data.data.descp && WxParse.wxParse("content", "html", a.data.data.descp, t, 5), 
                a.data.data.con2 && WxParse.wxParse("con2", "html", a.data.data.con2, t, 5), a.data.data.con3 && WxParse.wxParse("con3", "html", a.data.data.con3, t, 5), 
                wx.setNavigationBarTitle({
                    title: t.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        }), setTimeout(function() {
            if ("1" == t.data.comm && "0" != t.data.commSelf || "1" == t.data.commSelf) {
                t.data.comms;
                t.setData({
                    commShow: 1
                }), wx.request({
                    url: t.data.baseurl + "doPagegetComment",
                    cachetime: "0",
                    data: {
                        uniacid: t.data.uniacid,
                        id: t.data.id,
                        comms: t.data.comms
                    },
                    success: function(a) {
                        "" != a.data && t.setData({
                            comments: a.data.data,
                            is_comment: 1
                        });
                    }
                });
            }
        }, 500);
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
                        types: "shopsPro",
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
                                        types: "showPro",
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
    tabChange: function(a) {
        var t = a.currentTarget.dataset.id;
        this.setData({
            nowcon: t
        });
    },
    swiperLoad: function(o) {
        var i = this;
        wx.getSystemInfo({
            success: function(a) {
                var t = o.detail.width / o.detail.height, e = a.windowWidth / t;
                i.data.heighthave || i.setData({
                    minHeight: e,
                    heighthave: 1
                });
            }
        });
    },
    makePhoneCall: function(a) {
        var t = a.currentTarget.dataset.tel;
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
    shareClo: function() {
        this.setData({
            shareShow: 0
        });
    },
    onShareAppMessage: function() {
        var a = wx.getStorageSync("openid"), t = this.data.id, e = "";
        return e = 1 == this.data.globaluser.fxs ? "/sudu8_page_plugin_shop/goods_detial/goods_detial?id=" + t : "/sudu8_page_plugin_shop/goods_detial/goods_detial?id=" + t + "&fxsid=" + a, 
        {
            title: this.data.title,
            path: e,
            success: function(a) {
                console.log("分享成功"), console.log(a);
            }
        };
    },
    givepscore: function() {
        var a = this, t = (a.data.id, a.data.fxsid);
        t != wx.getStorageSync("openid") && 0 != t && wx.request({
            url: a.data.baseurl + "doPagegiveposcore",
            data: {
                uniacid: a.data.uniacid,
                id: a.data.id,
                types: a.data.types,
                openid: a.data.openid,
                fxsid: a.fxsid
            },
            success: function(a) {}
        });
    }
});