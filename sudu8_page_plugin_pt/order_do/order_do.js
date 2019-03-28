var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        order: "",
        comment: "",
        dikou_jf: 0,
        dikou_jf_val: 0,
        true_price: 0,
        kouk: -1
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        var e = this, t = a.shareid;
        e.setData({
            shareid: t
        }), wx.setNavigationBarTitle({
            title: "支付订单"
        });
        var o = a.orderid, d = a.dkmoney, i = a.dkscore, n = a.yunfei;
        wx.request({
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
            },
            fail: function(a) {
                console.log(a);
            }
        }), e.setData({
            order: o,
            dkmoney: d,
            dkscore: i,
            yf: n
        }), e.getOrder();
        var r = 0;
        a.fxsid && (r = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), app.util(e.getinfos, r, e.data.uniacid);
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
                });
            }
        });
    },
    getOrder: function() {
        var d = this, a = d.data.order, e = wx.getStorageSync("openid"), i = d.data.true_price, n = d.data.kouk;
        wx.request({
            url: d.data.baseurl + "dopageptorderget",
            data: {
                uniacid: d.data.uniacid,
                order: a,
                openid: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                var e = a.data.data, t = e.mymoney, o = e.price;
                1 * t < 1 * o ? (i = (o - t).toFixed(2), n = 1) : (i = o, n = 0), d.setData({
                    comment: a.data.data,
                    kouk: n,
                    true_price: i,
                    mymoney: t,
                    couponid: e.coupon
                });
            }
        });
    },
    goback: function() {
        wx.navigateBack();
    },
    pay1: function(a) {
        var e = this, t = e.data.order;
        e.setData({
            formId: a.detail.formId
        }), e.payover_do(t);
    },
    pay3: function(a) {
        var e = this, t = wx.getStorageSync("openid"), o = e.data.true_price, d = e.data.order;
        e.setData({
            formId: a.detail.formId
        }), wx.request({
            url: e.data.baseurl + "doPageweixinpay",
            data: {
                uniacid: e.data.uniacid,
                openid: t,
                price: o,
                order_id: d
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                "success" == a.data.message && wx.requestPayment({
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
                                e.payover_do(d);
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
    payover_do: function(e) {
        var t = this, o = (t.data.comment, wx.getStorageSync("openid")), a = t.data.kouk, d = t.data.mymoney, i = t.data.true_price, n = t.data.couponid, r = (t.data.order, 
        t.data.shareid), s = t.data.dkscore;
        t.data.mymoney, t.data.true_price;
        if (0 == a) var c = i;
        if (1 == a) c = d;
        wx.showModal({
            title: "提示",
            content: "您的余额为" + d + "元，本次将扣除" + c + "元",
            cancelText: "取消支付",
            confirmText: "确认支付",
            success: function(a) {
                if (a.cancel) return !1;
                wx.request({
                    url: t.data.baseurl + "doPageptorderchange",
                    data: {
                        uniacid: t.data.uniacid,
                        order_id: e,
                        openid: o,
                        true_price: c,
                        dkscore: s,
                        couponid: n,
                        formid: t.data.formId,
                        shareid: r
                    },
                    success: function(a) {
                        console.log(a), console.log("pt" + a), t.sendMail_order(e), 0 == a.data.data ? wx.reLaunch({
                            url: "/sudu8_page_plugin_pt/orderlist/orderlist"
                        }) : wx.reLaunch({
                            url: "/sudu8_page_plugin_pt/pt/pt?shareid=" + a.data.data
                        });
                    }
                });
            }
        });
    },
    sendMail_order: function(a) {
        wx.request({
            url: this.data.baseurl + "doPagesendMail_order",
            data: {
                uniacid: this.data.uniacid,
                order_id: a
            },
            success: function(a) {},
            fail: function(a) {
                console.log("sendMail_order_fail");
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: "支付订单"
        };
    }
});