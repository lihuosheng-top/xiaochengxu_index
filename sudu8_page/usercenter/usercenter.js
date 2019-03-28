var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        member_card: "1",
        isview: 0,
        money: 0,
        score: 0,
        coupon: 0,
        vipset: 1,
        viptext: "6688",
        page_signs: "/sudu8_page/usercenter/usercenter",
        vipflag: 1
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "个人中心"
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getBase(), app.util(t.getinfos, e, t.data.uniacid);
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
                }), t.getinfo(), t.peizhi();
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
    getinfo: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                wx.request({
                    url: e.data.baseurl + "dopageglobaluserinfo",
                    data: {
                        uniacid: e.data.uniacid,
                        openid: a.data
                    },
                    success: function(a) {
                        var t = a.data.data;
                        t.nickname && t.avatar || e.setData({
                            isview: 1
                        }), e.setData({
                            globaluser: a.data.data
                        });
                    }
                }), wx.request({
                    url: e.data.baseurl + "doPageMymoney",
                    data: {
                        uniacid: e.data.uniacid,
                        openid: a.data
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        console.log(a), "2" != a.data.data.vipset || a.data.data.vipid ? a.data.data.vipid ? e.setData({
                            viptext: a.data.data.vipid.substr(12, 4),
                            isvip: !0
                        }) : (3 == a.data.data.vipflag ? e.setData({
                            vipflag: 3
                        }) : 2 == a.data.data.vipflag ? e.setData({
                            vipflag: 2
                        }) : 4 == a.data.data.vipflag && e.setData({
                            vipflag: 4
                        }), e.setData({
                            isvip: !1
                        })) : e.setData({
                            needVip: !0
                        }), e.setData({
                            userbg: a.data.data.userbg,
                            money: a.data.data.money,
                            score: a.data.data.score,
                            coupon: a.data.data.couponNum,
                            vipset: a.data.data.vipset,
                            cardname: a.data.data.cardname
                        });
                    }
                });
            }
        });
    },
    peizhi: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageupdatausersetnew",
            data: {
                uniacid: t.data.uniacid
            },
            success: function(a) {
                t.setData({
                    fxzzd: a.data.data.arrs,
                    myorder: a.data.data.myorder,
                    mysign: a.data.data.mysign
                });
            }
        });
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onShareAppMessage: function() {},
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
    huoqusq: function() {
        var r = this, u = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(a) {
                var t = a.userInfo, e = t.nickName, i = t.avatarUrl, n = t.gender, s = t.province, o = t.city, d = t.country;
                wx.request({
                    url: r.data.baseurl + "doPageUseupdate",
                    data: {
                        uniacid: r.data.uniacid,
                        openid: u,
                        nickname: e,
                        avatarUrl: i,
                        gender: n,
                        province: s,
                        city: o,
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
    },
    toRegisterVIP: function() {
        wx.navigateTo({
            url: "/sudu8_page/register/register"
        });
    },
    toSign: function() {
        wx.navigateTo({
            url: "/sudu8_page_plugin_sign/index/index"
        });
    },
    toRegisterSuccess: function() {
        wx.navigateTo({
            url: "/sudu8_page/register_success/register_success?fr=1"
        });
    },
    setVipText: function(a) {
        this.setData({
            viptext: a
        });
    }
});