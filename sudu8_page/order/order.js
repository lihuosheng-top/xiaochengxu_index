var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page_sign: "order",
        page: 1,
        morePro: !1,
        baseinfo: [],
        orderinfo: [],
        type: 9,
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
        this.getBase(), this.getList();
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "预约订单"
        }), a.type && t.setData({
            type: a.type
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
                }), t.getList();
            }
        });
    },
    getBase: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "dopageBaseMin",
            cachetime: "30",
            data: {
                vs1: 1,
                uniacid: t.data.uniacid
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
    getList: function(a) {
        var t = this;
        wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "dopageMyorder",
            data: {
                openid: wx.getStorageSync("openid"),
                type: t.data.type,
                is_more: 1,
                uniacid: t.data.uniacid
            },
            success: function(a) {
                console.log(a.data), 10 < a.data.data.allnum ? t.setData({
                    allnum: a.data.data.allnum,
                    morePro: !0
                }) : t.setData({
                    allnum: a.data.data.allnum,
                    morePro: !1
                }), t.setData({
                    orderinfo: a.data.data.list
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    chonxhq: function(a) {
        var t = this, e = a.currentTarget.dataset.id;
        console.log(e), t.setData({
            type: e,
            morePro: !1,
            page: 1
        }), wx.request({
            url: t.data.baseurl + "dopageMyorder",
            data: {
                openid: wx.getStorageSync("openid"),
                type: e,
                is_more: 1,
                uniacid: t.data.uniacid
            },
            success: function(a) {
                10 < a.data.data.allnum ? t.setData({
                    morePro: !0
                }) : t.setData({
                    morePro: !1
                }), t.setData({
                    orderinfo: a.data.data.list
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    showMore: function() {
        var t = this, a = t.data.type, e = t.data.page + 1;
        wx.request({
            url: t.data.baseurl + "dopageMyorder",
            data: {
                openid: wx.getStorageSync("openid"),
                page: e,
                type: a,
                is_more: 1,
                uniacid: t.data.uniacid
            },
            success: function(a) {
                "" != a.data.data.list ? t.setData({
                    orderinfo: t.data.orderinfo.concat(a.data.data.list),
                    page: e
                }) : t.setData({
                    morePro: !1
                });
            }
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
        var t = this;
        wx.openLocation({
            latitude: parseFloat(t.data.baseinfo.latitude),
            longitude: parseFloat(t.data.baseinfo.longitude),
            name: t.data.baseinfo.name,
            address: t.data.baseinfo.address,
            scale: 22
        });
    },
    refund: function(a) {
        var t = this, e = a.currentTarget.dataset.orderid;
        wx.showModal({
            title: "提醒",
            content: "您确定要退款吗？",
            success: function(a) {
                a.confirm && wx.request({
                    url: t.data.baseurl + "dopagedantuikuan",
                    data: {
                        order_id: e,
                        uniacid: t.data.uniacid
                    },
                    success: function(a) {
                        console.log(a), 1 == a.data.data.flag ? wx.showModal({
                            title: "很抱歉",
                            content: a.data.data.message,
                            showCancel: !1
                        }) : 0 == a.data.data.flag && wx.showModal({
                            title: "恭喜您",
                            content: a.data.data.message,
                            showCancel: !1,
                            success: function(a) {
                                wx.redirectTo({
                                    url: "/sudu8_page/order/order"
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    refund_lv: function(a) {
        var t = this, e = a.detail.formId, o = a.currentTarget.dataset.orderid, n = a.currentTarget.dataset.pid;
        wx.showModal({
            title: "提醒",
            content: "您确定要退款吗？",
            success: function(a) {
                a.confirm && wx.request({
                    url: t.data.baseurl + "dopagelvtuikuan",
                    data: {
                        formId: e,
                        order_id: o,
                        pid: n,
                        uniacid: t.data.uniacid
                    },
                    success: function(t) {
                        console.log(t), 0 == t.data.data.flag ? wx.showModal({
                            title: "提示",
                            content: t.data.data.message,
                            showCancel: !1,
                            success: function(a) {
                                wx.redirectTo({
                                    url: "/sudu8_page/order/order"
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
    toyuyue: function(a) {
        var t = a.currentTarget.dataset.orderid;
        wx.navigateTo({
            url: "/sudu8_page/order_lv_change/order_lv_change?id=" + t + "&tableis=0"
        });
    },
    toyuyue2: function(a) {
        var t = a.currentTarget.dataset.orderid;
        wx.navigateTo({
            url: "/sudu8_page/order_lv_change/order_lv_change?id=" + t + "&tableis=1"
        });
    },
    copy: function(a) {
        wx.setClipboardData({
            data: a.currentTarget.dataset.str,
            success: function(a) {
                wx.showToast({
                    title: "复制成功"
                });
            }
        });
    }
});