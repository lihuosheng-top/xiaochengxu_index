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
        var o = this;
        wx.setNavigationBarTitle({
            title: "支付订单"
        });
        var e = a.orderid, t = a.dkmoney, d = a.dkscore, i = a.yunfei;
        this.setData({
            order: e,
            dkmoney: t,
            dkscore: d,
            yf: i
        });
        var n = 0;
        a.fxsid && (n = a.fxsid, o.setData({
            fxsid: a.fxsid
        })), wx.request({
            url: o.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: o.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                if (a.data.data.video) var e = "show";
                if (a.data.data.c_b_bg) var t = "bg";
                o.setData({
                    baseinfo: a.data.data,
                    show_v: e,
                    c_b_bg1: t
                }), wx.setNavigationBarTitle({
                    title: o.data.baseinfo.name
                }), wx.setNavigationBarColor({
                    frontColor: o.data.baseinfo.base_tcolor,
                    backgroundColor: o.data.baseinfo.base_color
                }), 1 == a.data.data.form_index && o.indexForm();
            },
            fail: function(a) {
                console.log(a);
            }
        }), app.util(o.getinfos, n, o.data.uniacid);
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
                }), t.getOrder();
            }
        });
    },
    getOrder: function() {
        var d = this, a = d.data.order, e = wx.getStorageSync("openid"), i = d.data.true_price, n = d.data.kouk;
        wx.request({
            url: d.data.baseurl + "doPageduoorderget",
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
                1 * t < 1 * o ? (i = o - t, n = 1) : (i = o, n = 0), d.setData({
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
        }), wx.showModal({
            title: "提醒",
            content: "确认支付,您将使用余额直接支付!",
            success: function(a) {
                a.confirm && e.payover_do(t);
            }
        });
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
        var t = this, a = (t.data.comment, wx.getStorageSync("openid")), o = (t.data.kouk, 
        t.data.mymoney, t.data.true_price), d = t.data.couponid, i = (t.data.order, t.data.dkscore), n = (t.data.mymoney, 
        t.data.true_price, wx.getStorageSync("fxsid"));
        wx.request({
            url: t.data.baseurl + "doPageduoorderchange",
            data: {
                uniacid: t.data.uniacid,
                order_id: e,
                openid: a,
                true_price: o,
                dkscore: i,
                couponid: d,
                fxsid: n,
                formid: t.data.formId
            },
            success: function(a) {
                t.sendMail_order(e), wx.reLaunch({
                    url: "/sudu8_page/order_more_list/order_more_list"
                });
            }
        });
    },
    sendMail_order: function(a) {
        wx.request({
            url: this.data.baseurl + "doPagesendMail_order_gwc",
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
    }
});