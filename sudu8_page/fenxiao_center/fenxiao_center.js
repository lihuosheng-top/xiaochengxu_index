var app = getApp();

Page({
    data: {
        page_sign: "fenxiao",
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        webflag: 0,
        page_signs: "/sudu8_page/fenxiao_center/fenxiao_center"
    },
    onPullDownRefresh: function() {
        this.fxzxdata();
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: "分销中心"
        });
        var t = 0;
        a.fxsid && (t = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), wx.request({
            url: e.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: e.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                e.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                });
            }
        }), app.util(e.getinfos, t, e.data.uniacid);
    },
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link, t = a.currentTarget.dataset.linktype;
        app.redirectto(e, t);
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var e = a.data;
                t.setData({
                    openid: e
                }), wx.request({
                    url: t.data.baseurl + "dopageglobaluserinfo",
                    data: {
                        uniacid: t.data.uniacid,
                        openid: e
                    },
                    success: function(a) {
                        var e = a.data.data;
                        e.nickname && e.avatar || t.setData({
                            isview: 1
                        }), t.setData({
                            globaluser: a.data.data
                        });
                    }
                }), t.fxzxdata();
            }
        });
    },
    fxzxdata: function() {
        var n = this, a = wx.getStorageSync("openid");
        wx.request({
            url: n.data.baseurl + "dopagefxszhongx",
            data: {
                uniacid: n.data.uniacid,
                openid: a,
                fxsid: n.data.fxsid
            },
            success: function(a) {
                var e = a.data.data.sq, t = a.data.data.user, i = a.data.data.guiz;
                e ? (1 == e.flag && wx.redirectTo({
                    url: "/sudu8_page/fenxiao_s/fenxiao_s?type=1"
                }), 3 == e.flag && wx.redirectTo({
                    url: "/sudu8_page/fenxiao/fenxiao"
                })) : (1 == t.fxs && 1 == i.fxs_sz && wx.redirectTo({
                    url: "/sudu8_page/fenxiao/fenxiao"
                }), 1 == t.fxs && 2 == i.fxs_sz && wx.redirectTo({
                    url: "/sudu8_page/fenxiao/fenxiao"
                }), 1 == t.fxs && 3 == i.fxs_sz && wx.redirectTo({
                    url: "/sudu8_page/fenxiao_s/fenxiao_s?type=4"
                }), 1 == t.fxs && 4 == i.fxs_sz && wx.redirectTo({
                    url: "/sudu8_page/fenxiao_s/fenxiao_s?type=3"
                })), n.setData({
                    usercenter: a.data.data
                });
            }
        });
    },
    my_team: function() {
        wx.navigateTo({
            url: "/sudu8_page/fenxiao_team/fenxiao_team"
        });
    },
    fenxiao_account: function() {
        wx.navigateTo({
            url: "/sudu8_page/fenxiao_account/fenxiao_account"
        });
    },
    account_tixian: function() {
        wx.navigateTo({
            url: "/sudu8_page/fenxiao_tixian/fenxiao_tixian"
        });
    },
    fenxiao_order: function() {
        wx.navigateTo({
            url: "/sudu8_page/fenxiao_order/fenxiao_order"
        });
    },
    tixian_record: function() {
        wx.navigateTo({
            url: "/sudu8_page/fenxiao_tixian_do/fenxiao_tixian_do"
        });
    },
    huoqusq: function() {
        var r = this, d = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(a) {
                var e = a.userInfo, t = e.nickName, i = e.avatarUrl, n = e.gender, o = e.province, s = e.city, u = e.country;
                wx.request({
                    url: r.data.baseurl + "doPageUseupdate",
                    data: {
                        uniacid: r.data.uniacid,
                        openid: d,
                        nickname: t,
                        avatarUrl: i,
                        gender: n,
                        province: o,
                        city: s,
                        country: u
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
    },
    chenggfh: function() {
        var a = wx.getStorageSync("golobeuser");
        this.setData({
            isview: 0,
            globaluser: a
        });
    },
    onShareAppMessage: function() {
        return {
            title: "分销中心"
        };
    }
});