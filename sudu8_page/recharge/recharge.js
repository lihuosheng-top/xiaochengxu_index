var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page_signs: "/sudu8_page/recharge/recharge",
        baseinfo: [],
        userInfo: "",
        searchtitle: "",
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time,
            i_view: app.globalData.i_view,
            close: app.globalData.close,
            v_ico: app.globalData.v_ico
        },
        scopes: !1,
        money: 0,
        guiz: ""
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        wx.setNavigationBarTitle({
            title: "账户充值"
        });
        var e = this, t = 0;
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
                kwd: "recharge",
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
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                e.setData({
                    openid: a.data
                }), e.getGuiz();
            }
        });
    },
    getBase: function() {
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
    },
    getGuiz: function() {
        var e = this, a = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "doPageGuiz",
            data: {
                openid: a,
                uniacid: e.data.uniacid
            },
            success: function(a) {
                e.setData({
                    guiz: a.data.data
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    makePhoneCall: function(a) {
        var e = this.data.baseinfo.tel;
        wx.makePhoneCall({
            phoneNumber: e
        });
    },
    makePhoneCallB: function(a) {
        var e = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: e
        });
    },
    openMap: function(a) {
        var e = this;
        wx.openLocation({
            latitude: parseFloat(e.data.baseinfo.latitude),
            longitude: parseFloat(e.data.baseinfo.longitude),
            name: e.data.baseinfo.name,
            address: e.data.baseinfo.address,
            scale: 22
        });
    },
    setmoney: function(a) {
        var e = a.detail.value;
        this.setData({
            money: e
        });
    },
    setsubmit: function() {
        var e = this, a = e.data.money, t = wx.getStorageSync("openid"), i = !0;
        if (a <= 0) return wx.showModal({
            title: "提醒",
            content: "请输入正确的充值金额！",
            showCancel: !1
        }), i = !1;
        i && wx.request({
            url: e.data.baseurl + "doPageBalance",
            data: {
                openid: t,
                money: a,
                uniacid: e.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                e.setData({
                    order_id: a.data.data.order_id
                }), "success" == a.data.message && wx.requestPayment({
                    timeStamp: a.data.data.timeStamp,
                    nonceStr: a.data.data.nonceStr,
                    package: a.data.data.package,
                    signType: "MD5",
                    paySign: a.data.data.paySign,
                    success: function(a) {
                        wx.showToast({
                            title: "支付成功",
                            icon: "success",
                            duration: 3e3,
                            success: function(a) {
                                e.dosetmoney();
                            }
                        });
                    },
                    fail: function(a) {
                        console.log("fail");
                    },
                    complete: function(a) {
                        console.log("complete");
                    }
                }), "error" == a.data.message && wx.showModal({
                    title: "提醒",
                    content: a.data.data.message,
                    showCancel: !1
                });
            }
        });
    },
    dosetmoney: function() {
        var a = this.data.order_id, e = this.data.money, t = wx.getStorageSync("openid");
        wx.request({
            url: this.data.baseurl + "doPagePay_cz",
            data: {
                openid: t,
                money: e,
                order_id: a,
                uniacid: this.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                wx.redirectTo({
                    url: "/sudu8_page/usercenter/usercenter"
                });
            }
        });
    }
});