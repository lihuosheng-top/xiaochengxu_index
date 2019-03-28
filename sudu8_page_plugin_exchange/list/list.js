var _Page;

function _defineProperty(a, e, t) {
    return e in a ? Object.defineProperty(a, e, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[e] = t, a;
}

var app = getApp();

Page((_defineProperty(_Page = {
    data: {
        page_signs: "/sudu8_page_plugin_exchange/list/list",
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page: 1,
        morePro: !1,
        ProductsList: [],
        baseinfo: [],
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time,
            i_view: app.globalData.i_view,
            close: app.globalData.close,
            v_ico: app.globalData.v_ico
        },
        cid: 0,
        cate: ""
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        var e = this;
        e.setData({
            cid: a.cid
        });
        var t = 0;
        a.fxsid && (t = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), e.checkvip(), e.getBase(), app.util(e.getinfos, t, e.data.uniacid);
    },
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link, t = a.currentTarget.dataset.linktype;
        app.redirectto(e, t);
    },
    checkvip: function() {
        var e = this, a = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "doPagecheckvip",
            data: {
                uniacid: e.data.uniacid,
                kwd: "exchange",
                openid: a
            },
            success: function(a) {
                a.data.data || (e.setData({
                    needvip: !0
                }), wx.showModal({
                    title: "进入失败",
                    content: "使用本功能需先开通vip!",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                }));
            },
            fail: function(a) {
                console.log(a);
            }
        });
    }
}, "onPullDownRefresh", function() {
    this.getBase(), this.getList(), this.getCate(), this.getinfo();
}), _defineProperty(_Page, "getinfos", function() {
    var e = this;
    wx.getStorage({
        key: "openid",
        success: function(a) {
            e.setData({
                openid: a.data
            }), e.getList(), e.getCate(), e.getinfo();
        }
    });
}), _defineProperty(_Page, "getBase", function() {
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
                baseinfo: a.data.data
            }), wx.setNavigationBarColor({
                frontColor: e.data.baseinfo.base_tcolor,
                backgroundColor: e.data.baseinfo.base_color
            });
        },
        fail: function(a) {
            console.log(a);
        }
    });
}), _defineProperty(_Page, "getinfo", function() {
    var t = this;
    wx.getStorage({
        key: "openid",
        success: function(a) {
            var e = t.data.baseurl + "dopageglobaluserinfo";
            wx.request({
                url: e,
                data: {
                    uniacid: t.data.uniacid,
                    openid: a.data
                },
                success: function(a) {
                    var e = a.data.data;
                    e.nickname && e.avatar || t.setData({
                        isview: 1
                    }), t.setData({
                        globaluser: a.data.data
                    });
                }
            });
        }
    });
}), _defineProperty(_Page, "handleTap", function(a) {
    var e = this, t = a.currentTarget.id.slice(1);
    e.data.cid;
    t && (e.setData({
        cid: t,
        page: 1
    }), e.getList(t));
}), _defineProperty(_Page, "getCate", function() {
    var e = this;
    wx.request({
        url: e.data.baseurl + "doPageScorecate",
        data: {
            uniacid: e.data.uniacid
        },
        success: function(a) {
            e.setData({
                cate: a.data.data
            });
        },
        fail: function(a) {
            console.log(a);
        }
    });
}), _defineProperty(_Page, "getList", function(e) {
    var t = this;
    null == e && (e = 0), wx.request({
        url: t.data.baseurl + "doPageScorepro",
        cachetime: "30",
        data: {
            uniacid: t.data.uniacid,
            cid: e
        },
        success: function(a) {
            t.setData({
                cate_list: a.data.data,
                cid: e
            }), wx.setNavigationBarTitle({
                title: "积分商城"
            }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
        },
        fail: function(a) {
            console.log(a);
        }
    });
}), _defineProperty(_Page, "onReachBottom", function() {
    var e = this, t = e.data.page + 1, a = e.data.cid;
    wx.request({
        url: e.data.baseurl + "doPageScorepro",
        data: {
            uniacid: e.data.uniacid,
            cid: a,
            page: t
        },
        success: function(a) {
            "" != a.data.data ? e.setData({
                cate_list: e.data.cate_list.concat(a.data.data),
                page: t
            }) : e.setData({
                morePro: !1
            });
        }
    });
}), _defineProperty(_Page, "makePhoneCall", function(a) {
    var e = this.data.baseinfo.tel;
    wx.makePhoneCall({
        phoneNumber: e
    });
}), _defineProperty(_Page, "makePhoneCallB", function(a) {
    var e = this.data.baseinfo.tel_b;
    wx.makePhoneCall({
        phoneNumber: e
    });
}), _defineProperty(_Page, "openMap", function(a) {
    wx.openLocation({
        latitude: parseFloat(this.data.baseinfo.latitude),
        longitude: parseFloat(this.data.baseinfo.longitude),
        name: this.data.baseinfo.name,
        address: this.data.baseinfo.address,
        scale: 22
    });
}), _defineProperty(_Page, "onShareAppMessage", function() {
    return {
        title: this.data.cateinfo.name + "-" + this.data.baseinfo.name
    };
}), _defineProperty(_Page, "huoqusq", function() {
    var r = this, c = wx.getStorageSync("openid");
    wx.getUserInfo({
        success: function(a) {
            var e = a.userInfo, t = e.nickName, i = e.avatarUrl, n = e.gender, o = e.province, s = e.city, d = e.country;
            wx.request({
                url: r.data.baseurl + "doPageUseupdate",
                data: {
                    uniacid: r.data.uniacid,
                    openid: c,
                    nickname: t,
                    avatarUrl: i,
                    gender: n,
                    province: o,
                    city: s,
                    country: d
                },
                header: {
                    "content-type": "application/json"
                },
                success: function(a) {
                    wx.setStorageSync("golobeuid", a.data.data.id), wx.setStorageSync("golobeuser", a.data.data), 
                    r.setData({
                        isview: 0,
                        globaluser: a.data.data
                    });
                }
            });
        },
        fail: function() {
            app.selfinfoget(r.chenggfh, r.data.uniacid);
        }
    });
}), _defineProperty(_Page, "chenggfh", function() {
    var a = wx.getStorageSync("golobeuser");
    this.setData({
        isview: 0,
        globaluser: a
    });
}), _Page));