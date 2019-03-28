var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page_signs: "/sudu8_page/shoppay/shoppay",
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
        yue: 0,
        guiz: "",
        weixpay: 0,
        paymoney: 0,
        jifen_u: 0,
        jfscore: 0,
        jfmoney: 0,
        jqdjg: "请选择",
        yhq_hidden: 0,
        yhqmoney: 0,
        yhq_id: 0
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        wx.setNavigationBarTitle({
            title: "店内支付"
        });
        var e = this, t = 0;
        a.fxsid && (t = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), wx.getSystemInfo({
            success: function(a) {
                e.setData({
                    h: a.windowHeight
                });
            }
        }), e.getBase(), app.util(e.getinfos, t, e.data.uniacid);
    },
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link, t = a.currentTarget.dataset.linktype;
        app.redirectto(e, t);
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
            url: e.data.baseurl + "doPageBase",
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
                console.log(123), console.log(a), e.setData({
                    scoreconf: a.data.data.conf,
                    yhq: a.data.data.coupon,
                    guiz: a.data.data.user,
                    yue: a.data.data.user.money,
                    score: a.data.data.user.score,
                    score_shoppay: a.data.data.conf.score_shoppay
                }), console.log(222), console.log(guiz);
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
    chongz: function() {
        wx.redirectTo({
            url: "/sudu8_page/recharge/recharge"
        });
    },
    switchChange: function(a) {
        var e = this, t = a.detail.value, o = (1e3 * e.data.paymoney - 1e3 * e.data.yhqmoney) / 1e3;
        if (1 == t) {
            e.data.money;
            var n = e.data.weixpay, i = e.data.yue, s = e.data.score_shoppay, d = e.data.score, c = e.data.scoreconf;
            if (parseInt(s) >= parseInt(c.score) && parseInt(d) >= parseInt(c.score)) {
                if (parseInt(d) >= parseInt(s)) var r = parseInt(s / c.score * 1); else r = parseInt(d / c.score * 1);
                if (o <= r) e.setData({
                    weixpay: 0,
                    money: 0,
                    jfmoney: o,
                    jfscore: o * c.score,
                    jifen_u: 1
                }); else {
                    var u = r * c.score;
                    n = (n = (1e3 * o - 1e3 * i - 1e3 * r) / 1e3) < 0 ? 0 : n, e.setData({
                        money: (1e3 * o - 1e3 * n - 1e3 * r) / 1e3,
                        weixpay: n,
                        jfmoney: r,
                        jfscore: u,
                        jifen_u: 1
                    });
                }
            } else {
                n = (n = (1e3 * o - 1e3 * i) / 1e3) < 0 ? 0 : n, e.setData({
                    money: (1e3 * o - 1e3 * n) / 1e3,
                    weixpay: n,
                    jfmoney: 0,
                    jfscore: 0,
                    jifen_u: 1
                });
            }
        } else {
            n = (n = (1e3 * o - 1e3 * (i = e.data.yue)) / 1e3) < 0 ? 0 : n, e.setData({
                money: (1e3 * o - 1e3 * n) / 1e3,
                weixpay: n,
                jfscore: 0,
                jfmoney: 0,
                jifen_u: 0
            });
        }
    },
    setsubmit: function() {
        var e = this, t = wx.getStorageSync("openid"), o = e.data.paymoney, n = e.data.weixpay, i = e.data.money, s = e.data.jfscore, d = (e.data.yhqmoney, 
        e.data.yhq_id), a = e.data.jfmoney;
        if (!o && 0 == a || o <= 0 && 0 == a) return wx.showModal({
            title: "提醒",
            content: "请输入正确的消费金额！",
            showCancel: !1
        }), !1;
        0 == n ? wx.showModal({
            title: "提示",
            content: "确认支付,费用将从余额直接扣除!",
            cancelText: "取消支付",
            confirmText: "确认支付",
            success: function(a) {
                if (a.cancel) return !1;
                wx.request({
                    url: e.data.baseurl + "doPageShoppay_duo",
                    data: {
                        uniacid: e.data.uniacid,
                        openid: t,
                        ordermoeny: o,
                        yuemoney: o,
                        money: 0,
                        order_id: "",
                        jfscore: s,
                        yhq_id: d
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        wx.showToast({
                            title: "支付成功",
                            icon: "success",
                            duration: 3e3,
                            success: function() {
                                setTimeout(function() {
                                    wx.redirectTo({
                                        url: "/sudu8_page/shoppay/shoppay"
                                    });
                                }, 3e3);
                            }
                        });
                    }
                });
            }
        }) : wx.request({
            url: e.data.baseurl + "doPageBalance",
            data: {
                uniacid: e.data.uniacid,
                openid: t,
                ordermoeny: o,
                yuemoney: i,
                money: n
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
                                e.dosetmoney(e.data.order_id, i, n);
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
    dosetmoney: function(a, e, t) {
        var o = wx.getStorageSync("openid");
        wx.request({
            url: that.data.baseurl + "doPagedosetmoney",
            data: {
                uniacid: that.data.uniacid,
                openid: o,
                orderid: 1001,
                yemoney: e,
                wxmoney: t
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {}
        });
    },
    setmoney: function(a) {
        var e = a.detail.value, t = a.detail.value;
        if ("" == e) return this.setData({
            money: 0,
            weixpay: 0,
            jfmoney: 0,
            jfscore: 0,
            paymoney: 0,
            jifen_u: 0,
            yhq_id: 0,
            yhqmoney: 0,
            yhqid: 0,
            jqdjg: "请选择"
        }), !1;
        var o = this.data.yue, n = this.data.jfmoney, i = (1e3 * e - 1e3 * o - 1e3 * n) / 1e3;
        i = i < 0 ? 0 : i, this.setData({
            money: (1e3 * e - 1e3 * i - 1e3 * n) / 1e3,
            weixpay: i,
            paymoney: t
        });
    },
    getmoney: function(a) {
        var e = this, t = e.data.paymoney, o = e.data.jfmoney, n = (a.currentTarget.id, 
        a.currentTarget.dataset.index), i = (1e3 * t - 1e3 * o) / 1e3, s = n.pay_money, d = n.ids;
        if (i < s) return wx.showModal({
            title: "提示",
            content: "需支付金额未满" + s + "元，不可使用该优惠券！",
            showCancel: !1
        }), !1;
        var c = n.price, r = (1e3 * i - 1e3 * e.data.yue - 1e3 * c) / 1e3;
        r = r < 0 ? 0 : r, e.hideModal(), e.setData({
            money: (1e3 * i - 1e3 * r - 1e3 * c) / 1e3,
            weixpay: r,
            yhq_id: d,
            yhqmoney: c,
            jqdjg: n.title
        });
    },
    qxyh: function() {
        var a = this, e = (1e3 * a.data.paymoney - 1e3 * a.data.jfmoney) / 1e3, t = (1e3 * e - 1e3 * a.data.yue) / 1e3;
        t = t < 0 ? 0 : t, a.hideModal(), a.setData({
            money: (1e3 * e - 1e3 * t) / 1e3,
            weixpay: t,
            yhq_id: 0,
            yhqmoney: 0,
            jqdjg: "请选择"
        });
    },
    showModal: function() {
        if (0 == this.data.paymoney) return wx.showModal({
            title: "提醒",
            content: "请先输入消费金额"
        }), !1;
        var a = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        (this.animation = a).translateY(300).step(), this.setData({
            animationData: a.export(),
            showModalStatus: !0
        }), setTimeout(function() {
            a.translateY(0).step(), this.setData({
                animationData: a.export()
            });
        }.bind(this), 200);
    },
    hideModal: function() {
        var a = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        (this.animation = a).translateY(300).step(), this.setData({
            animationData: a.export()
        }), setTimeout(function() {
            a.translateY(0).step(), this.setData({
                animationData: a.export(),
                showModalStatus: !1
            });
        }.bind(this), 200);
    }
});