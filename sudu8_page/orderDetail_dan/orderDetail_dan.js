var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        state: 1,
        orderFormDisable: !0,
        isChange: "",
        formchangeBtn: 2,
        showhx: 0
    },
    ContactMerchant: function() {
        var e = this;
        wx.showModal({
            title: "提示",
            content: "请联系商家咨询具体信息！",
            confirmText: "联系商家",
            success: function(a) {
                if (a.confirm) {
                    var t = e.data.baseinfo.tel;
                    wx.makePhoneCall({
                        phoneNumber: t
                    });
                }
            }
        });
    },
    bindDateChange2: function(a) {
        this.setData({
            chuydate: a.detail.value
        });
    },
    onLoad: function(a) {
        var t = this;
        a.orderid && t.setData({
            orderid: a.orderid
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getBase(), app.util(t.getinfos, e, t.data.uniacid);
    },
    getBase: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            cachetime: "30",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
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
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                }), t.getOrder();
            }
        });
    },
    getOrder: function() {
        var t = this, a = t.data.orderid;
        wx.request({
            url: t.data.baseurl + "doPagegetOrderDetail",
            data: {
                uniacid: t.data.uniacid,
                order_id: a
            },
            success: function(a) {
                console.log(a), t.setData({
                    datas: a.data.data
                });
            }
        });
    },
    copy: function(a) {
        wx.setClipboardData({
            data: a.currentTarget.dataset.ddh,
            success: function(a) {
                wx.showToast({
                    title: "复制成功"
                });
            }
        });
    },
    makephonecall: function() {
        this.data.datas.seller_tel && wx.makePhoneCall({
            phoneNumber: this.data.datas.seller_tel
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    tuikuan: function(a) {
        var t = this, e = a.detail.formId, o = a.currentTarget.dataset.order;
        wx.showModal({
            title: "提醒",
            content: "确定要退款吗？",
            success: function(a) {
                a.confirm && wx.request({
                    url: t.data.baseurl + "doPagemiaoshatk",
                    data: {
                        uniacid: t.data.uniacid,
                        formId: e,
                        order_id: o
                    },
                    success: function(t) {
                        console.log(t), 0 == t.data.data.flag ? wx.showModal({
                            title: "提示",
                            content: t.data.data.message,
                            showCancel: !1,
                            success: function(a) {
                                wx.redirectTo({
                                    url: "/sudu8_page/orderDetail_dan/orderDetail_dan?orderid=" + o
                                });
                            }
                        }) : wx.showModal({
                            title: "很抱歉",
                            content: t.data.data.message,
                            confirmText: "联系客服",
                            success: function(a) {
                                a.confirm && wx.makePhoneCall({
                                    phoneNumber: t.data.data.mobile
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    qrshouh: function(a) {
        var t = a.target.dataset.order, e = wx.getStorageSync("openid");
        wx.request({
            url: this.data.baseurl + "doPagedanshouhuo",
            data: {
                uniacid: this.data.uniacid,
                openid: e,
                orderid: t
            },
            success: function(a) {
                wx.redirectTo({
                    url: "/sudu8_page/orderDetail_dan/orderDetail_dan?orderid=" + t
                });
            }
        });
    },
    hxmmInput: function(a) {
        this.setData({
            hxmm: a.detail.value
        });
    },
    hxmmpass: function() {
        var e = this, a = e.data.hxmm, o = e.data.datas;
        a ? wx.request({
            url: e.data.baseurl + "hxmm",
            data: {
                hxmm: a,
                order_id: o.order_id,
                uniacid: e.data.uniacid,
                is_more: 0
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
                    title: "消费成功",
                    icon: "success",
                    duration: 2e3,
                    success: function(a) {
                        o.flag = 2, e.setData({
                            datas: o,
                            showhx: 0,
                            hxmm: ""
                        });
                        var t = e.data.order;
                        e.getOrder(t);
                    }
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "请输入核销密码！",
            showCancel: !1
        });
    },
    hxshow: function() {
        this.setData({
            showhx: 1
        });
    },
    hxhide: function() {
        this.setData({
            showhx: 0,
            hxmm: ""
        });
    }
});