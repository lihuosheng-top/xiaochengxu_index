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
        },
        nav: [ {
            id: 9,
            text: "全部"
        }, {
            id: 0,
            text: "待付款"
        }, {
            id: 1,
            text: "待消费",
            nav: 2
        }, {
            id: 11,
            text: "待发货",
            nav: 1
        }, {
            id: 4,
            text: "已发货"
        }, {
            id: 2,
            text: "已完成"
        }, {
            id: -1,
            text: "已过期"
        }, {
            id: 6,
            text: "售后"
        }, {
            id: 5,
            text: "商家已取消"
        } ]
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "秒杀订单"
        }), a.type && t.setData({
            type: a.type
        });
        var e = 0;
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
                }), t.getList();
            }
        });
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
    getList: function(a) {
        var t = this;
        wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPageMyorder",
            data: {
                uniacid: t.data.uniacid,
                openid: wx.getStorageSync("openid"),
                type: t.data.type,
                is_more: 0
            },
            success: function(a) {
                console.log(a.data), t.setData({
                    allnum: a.data.data.allnum,
                    orderinfo: a.data.data.list
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    chonxhq: function(a) {
        var t = this, e = a.currentTarget.dataset.id, o = a.currentTarget.dataset.nav || "";
        console.log(o), t.setData({
            type: e,
            morePro: !1,
            page: 1
        }), 11 == e && (e = 1), wx.request({
            url: t.data.baseurl + "doPageMyorder",
            data: {
                uniacid: t.data.uniacid,
                openid: wx.getStorageSync("openid"),
                type: e,
                nav: o,
                is_more: 0
            },
            success: function(a) {
                t.setData({
                    orderinfo: a.data.data.list
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var a = this;
        a.data.page = 1, a.getBase(), a.getList(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var t = this, a = t.data.type, e = t.data.page + 1;
        wx.request({
            url: t.data.baseurl + "doPageMyorder",
            data: {
                uniacid: t.data.uniacid,
                openid: wx.getStorageSync("openid"),
                page: e,
                type: a,
                is_more: 0
            },
            success: function(a) {
                "" != a.data.data.list && t.setData({
                    orderinfo: t.data.orderinfo.concat(a.data.data.list),
                    page: e
                });
            }
        });
    },
    onShareAppMessage: function() {},
    choose_nav: function(a) {
        var t = a.currentTarget.dataset.id;
        this.setData({
            a: t
        });
    },
    makePhoneCallB: function(a) {
        var t = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    qrshouh: function(a) {
        var t = this, e = a.currentTarget.dataset.order, o = wx.getStorageSync("openid");
        wx.showModal({
            title: "提示",
            content: "确认收货吗？",
            success: function(a) {
                a.confirm && wx.request({
                    url: t.data.baseurl + "doPagedanshouhuo",
                    data: {
                        uniacid: t.data.uniacid,
                        openid: o,
                        orderid: e
                    },
                    success: function(a) {
                        wx.showToast({
                            title: "收货成功！",
                            success: function(a) {
                                setTimeout(function() {
                                    t.data.page = 1, t.getList();
                                }, 1500);
                            }
                        });
                    }
                });
            }
        });
    },
    wlinfo: function(a) {
        var t = a.currentTarget.dataset.kuaidi, e = a.currentTarget.dataset.kuaidihao;
        wx.navigateTo({
            url: "/sudu8_page/logistics_state/logistics_state?kuaidi=" + t + "&kuaidihao=" + e
        });
    },
    orderinfo: function(a) {
        var t = a.currentTarget.dataset.order;
        wx.navigateTo({
            url: "/sudu8_page/orderDetail_dan/orderDetail_dan?orderid=" + t
        });
    },
    lijipay: function(a) {
        var t = a.currentTarget.dataset.order, e = a.currentTarget.dataset.pid;
        console.log(888888888), console.log(e), wx.navigateTo({
            url: "/sudu8_page/order_dan/order_dan?orderid=" + t + "&id=" + e
        });
    },
    orderagain: function(a) {
        var t = a.currentTarget.dataset.pid;
        wx.navigateTo({
            url: "/sudu8_page/showPro/showPro?id=" + t
        });
    }
});