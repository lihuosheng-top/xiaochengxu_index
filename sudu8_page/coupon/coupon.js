var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page_signs: "/sudu8_page/coupon/coupon",
        couponlist: [],
        baseinfo: [],
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time,
            i_view: app.globalData.i_view,
            close: app.globalData.close,
            v_ico: app.globalData.v_ico
        }
    },
    onPullDownRefresh: function() {
        this.getBase(), this.getList(), this.couset();
    },
    onLoad: function(a) {
        var t = this, e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getBase(), app.util(t.getinfos, e, t.data.uniacid);
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                }), t.getList(), t.couset();
            }
        });
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
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
                }), wx.setNavigationBarTitle({
                    title: "领取优惠券"
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
    getList: function(a) {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageCoupon",
            data: {
                openid: t.data.openid,
                uniacid: t.data.uniacid
            },
            success: function(a) {
                t.setData({
                    couponlist: a.data.data
                }), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getit: function(i) {
        var o = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var t = a.data;
                if (t) {
                    var e = i;
                    wx.request({
                        url: o.data.baseurl + "doPagegetcoupon",
                        data: {
                            id: e,
                            openid: t,
                            uniacid: o.data.uniacid
                        },
                        success: function(a) {
                            1 == a.data.data && (wx.showToast({
                                title: "领取成功",
                                icon: "success",
                                duration: 2e3
                            }), setTimeout(function() {
                                o.getList();
                            }, 500)), 2 == a.data.data && (wx.showToast({
                                title: "领取失败",
                                icon: "loading",
                                duration: 4e3
                            }), setTimeout(function() {
                                o.getList();
                            }, 500));
                        },
                        fail: function(a) {
                            console.log(a);
                        }
                    });
                } else o.getList();
            }
        });
    },
    getit_zj: function(a) {
        var e = this, i = a.currentTarget.id;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var t = a.data;
                t ? wx.request({
                    url: e.data.baseurl + "doPagegetcoupon",
                    data: {
                        id: i,
                        openid: t,
                        uniacid: e.data.uniacid
                    },
                    success: function(a) {
                        1 == a.data.data && (wx.showToast({
                            title: "领取成功",
                            icon: "success",
                            duration: 2e3
                        }), setTimeout(function() {
                            e.getList();
                        }, 500)), 2 == a.data.data && (wx.showToast({
                            title: "领取失败",
                            icon: "loading",
                            duration: 4e3
                        }), setTimeout(function() {
                            e.getList();
                        }, 500));
                    },
                    fail: function(a) {
                        console.log(a);
                    }
                }) : e.getList();
            }
        });
    },
    openApp: function(a) {
        wx.navigateToMiniProgram({
            appId: a.currentTarget.dataset.id,
            path: a.currentTarget.dataset.path,
            success: function(a) {}
        });
    },
    mycoupp: function() {
        wx.redirectTo({
            url: "/sudu8_page/mycoupon/mycoupon"
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
            title: this.data.cateinfo.name + "-" + this.data.baseinfo.name
        };
    },
    getPhoneNumber: function(e) {
        var i = this;
        "getPhoneNumber:ok" == e.detail.errMsg ? wx.login({
            success: function(a) {
                wx.request({
                    url: i.data.baseurl + "doPagejiemi",
                    data: {
                        uniacid: i.data.uniacid,
                        encryptedData: e.detail.encryptedData,
                        iv: e.detail.iv,
                        code: a.code
                    },
                    success: function(a) {
                        var t = a.data.data;
                        wx.request({
                            url: i.data.baseurl + "doPagemobilesetuser",
                            data: {
                                uniacid: i.data.uniacid,
                                openid: i.data.openid,
                                mobile: t
                            },
                            success: function(a) {
                                var t = e.currentTarget.id;
                                i.getit(t), i.setData({
                                    shouj: 2
                                });
                            }
                        });
                    }
                });
            }
        }) : wx.showModal({
            title: "提现",
            content: "领取优惠券时，请先授权获取您的手机号！",
            showCancel: !1
        });
    },
    couset: function() {
        var e = this;
        wx.request({
            url: e.data.baseurl + "doPagecouponset",
            data: {
                uniacid: e.data.uniacid
            },
            success: function(a) {
                var t = 1;
                t = a.data.data ? a.data.data.flag : 1, e.setData({
                    kaiq: t
                });
            }
        }), wx.request({
            url: e.data.baseurl + "dopageglobaluserinfo",
            data: {
                uniacid: e.data.uniacid,
                openid: e.data.openid
            },
            success: function(a) {
                var t = 1;
                t = a.data.data.mobile ? 2 : 1, e.setData({
                    shouj: t
                });
            }
        });
    }
});