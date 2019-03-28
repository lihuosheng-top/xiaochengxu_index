var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        order: "",
        comment: "",
        true_price: "",
        my_money: "",
        true_money: -1,
        dikou_jf: 0,
        dikou_jf_val: 0
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: "支付订单"
        });
        var t = a.order;
        e.setData({
            order: t
        });
        var o = 0;
        a.fxsid && (o = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), e.showbase(), app.util(e.getinfos, o, e.data.uniacid);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                e.setData({
                    openid: a.data
                }), e.getOrder();
            }
        });
    },
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link, t = a.currentTarget.dataset.linktype;
        app.redirectto(e, t);
    },
    showbase: function() {
        var e = this;
        wx.request({
            url: e.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: e.data.uniacid,
                vs1: 1
            },
            cachetime: "30",
            success: function(a) {
                a.data.data;
                e.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                });
            }
        });
    },
    getOrder: function() {
        var o = this, a = o.data.order, d = o.data.my_money, i = o.data.true_money;
        wx.request({
            url: o.data.baseurl + "doPageOrderinfo",
            data: {
                order: a,
                uniacid: o.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                a.data.data.jf_money;
                var e = a.data.data.dikou_jf;
                if (1 == a.data.data.is_score) var t = 1e3 * a.data.data.true_price - 1e3 * e; else t = 1e3 * a.data.data.true_price;
                d = 1e3 * a.data.data.my_money, i = t <= d ? 0 : t - d, o.setData({
                    comment: a.data.data,
                    true_price: t / 1e3,
                    my_money: d / 1e3,
                    true_money: i / 1e3,
                    dikou_jf: a.data.data.dikou_jf,
                    dikou_jf_val: a.data.data.dikou_jf,
                    cid: a.data.data.pid,
                    orderid: a.data.data.id,
                    is_more: a.data.data.is_more
                });
            }
        });
    },
    goback: function() {
        wx.navigateBack();
    },
    sendMail_form: function() {
        var a = this;
        wx.request({
            url: a.data.baseurl + "dopagesendMail_form2",
            data: {
                orderid: a.data.orderid,
                cid: a.data.cid,
                uniacid: a.data.uniacid
            },
            success: function(a) {},
            fail: function(a) {
                console.log("sendMail_order_fail");
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
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log("sendMail_order_fail");
            }
        });
    },
    pay0: function(a) {
        var e = this;
        e.setData({
            formId: a.detail.formId
        });
        var t = e.data.comment.order_id;
        e.payover_do(t), e.sendMail_order(t), "0" != e.data.is_more && e.sendMail_form();
    },
    pay1: function(a) {
        var t = this, e = t.data.true_price, o = t.data.my_money;
        t.setData({
            formId: a.detail.formId
        }), wx.showModal({
            title: "请注意",
            content: "您的余额为" + o + "元，本次将扣除" + e + "元",
            success: function(a) {
                if (a.confirm) {
                    var e = t.data.comment.order_id;
                    t.payover_do(e), t.sendMail_order(e), "0" != t.data.is_more && t.sendMail_form();
                }
            }
        });
    },
    pay: function(a) {
        var e = this;
        e.setData({
            formId: a.detail.formId
        });
        var t = wx.getStorageSync("openid"), o = e.data.comment.true_price;
        if (e.data.true_money) o = e.data.true_money;
        var d = e.data.comment.order_id;
        wx.request({
            url: e.data.baseurl + "doPageweixinpay",
            data: {
                openid: t,
                price: o,
                order_id: d,
                uniacid: e.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                console.log(a), "success" == a.data.message && wx.requestPayment({
                    timeStamp: a.data.data.timeStamp,
                    nonceStr: a.data.data.nonceStr,
                    package: a.data.data.package,
                    signType: "MD5",
                    paySign: a.data.data.paySign,
                    success: function(a) {
                        console.log(a), wx.showToast({
                            title: "支付成功",
                            icon: "success",
                            duration: 3e3,
                            success: function(a) {
                                e.payover_do(d), e.sendMail_order(d), "0" != e.data.is_more && e.sendMail_form();
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
    payover_do: function(a) {
        var e = this, t = e.data.comment, o = e.data.true_price, d = e.data.my_money, i = e.data.true_money, r = e.data.dikou_jf;
        r = 1 == t.is_score ? r : 0;
        var n = 0;
        n = 0 == i ? o : d, wx.request({
            url: e.data.baseurl + "doPageorderpayover",
            data: {
                order_id: a,
                my_pay_money: n,
                jf_score: r,
                uniacid: e.data.uniacid,
                openid: wx.getStorageSync("openid"),
                formId: e.data.formId
            },
            success: function(a) {
                1 == a.data.data && wx.reLaunch({
                    url: "/sudu8_page/order/order?type=9"
                });
            },
            fail: function(a) {
                console.log("fail");
            },
            complete: function(a) {
                console.log("complete");
            }
        });
    },
    switch1Change: function(a) {
        var e = this, t = (e.data.dikou_jf, e.data.dikou_jf_val), o = 0, d = 0;
        d = 0 == (o = a.detail.value ? t : 0) ? -t : t;
        var i = e.data.true_money, r = e.data.true_price;
        0 == i ? r = (1e3 * r - 1e3 * d) / 1e3 : i = (1e3 * i - 1e3 * d) / 1e3, e.setData({
            dikou_jf: o,
            true_money: i,
            true_price: r
        });
    }
});