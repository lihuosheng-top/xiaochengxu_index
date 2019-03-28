var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page_signs: "/sudu8_page/mycoupon/mycoupon",
        couponlist: [],
        baseinfo: [],
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time,
            i_view: app.globalData.i_view,
            close: app.globalData.close,
            v_ico: app.globalData.v_ico
        },
        youhqid: 0,
        hxmm: "",
        showhx: 0
    },
    onPullDownRefresh: function() {
        this.getBase(), this.getList();
    },
    onLoad: function(a) {
        var t = this, e = 0;
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
                }), t.getList();
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
                }), wx.setNavigationBarTitle({
                    title: "我的优惠券"
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
        var t = this, e = wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPagemycoupon",
            data: {
                openid: e,
                flag: 1,
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
    swiperLoad: function(a) {
        var t = wx.getSystemInfoSync(), e = a.detail.width / a.detail.height, o = t.windowWidth / e;
        this.setData({
            minHeight: o
        });
    },
    openApp: function(a) {
        wx.navigateToMiniProgram({
            appId: a.currentTarget.dataset.id,
            path: a.currentTarget.dataset.path,
            success: function(a) {}
        });
    },
    makePhoneCall: function(a) {
        var t = this.data.baseinfo.tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    ycoupp: function() {
        wx.redirectTo({
            url: "/sudu8_page/coupon/coupon"
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
    hxmmInput: function(a) {
        this.setData({
            hxmm: a.detail.value
        });
    },
    hxmmpass: function() {
        var a = this, t = a.data.hxmm, e = a.data.youhqid;
        t ? wx.request({
            url: a.data.baseurl + "Hxyhq",
            data: {
                hxmm: t,
                youhqid: e,
                uniacid: a.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                0 == a.data.data ? wx.showModal({
                    title: "提示",
                    content: "核销密码不正确！",
                    showCancel: !1
                }) : wx.showToast({
                    title: "成功",
                    icon: "success",
                    duration: 2e3,
                    success: function(a) {
                        wx.redirectTo({
                            url: "/sudu8_page/mycoupon/mycoupon"
                        });
                    }
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "核销密码必填！",
            showCancel: !1
        });
    },
    hxshow: function(a) {
        var t = a.currentTarget.id;
        this.setData({
            showhx: 1,
            youhqid: t
        });
    },
    hxhide: function() {
        this.setData({
            showhx: 0
        });
    }
});