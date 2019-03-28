var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        state: 1,
        orderFormDisable: !0,
        isChange: "",
        formchangeBtn: 2,
        kuaidi: [ "选择快递", "圆通", "中通", "申通", "顺丰", "韵达", "天天", "EMS", "百世", "本人到店", "其他" ]
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
            url: t.data.baseurl + "doPagegetduoOrderDetail",
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
                    url: t.data.baseurl + "doPageduotk",
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
                                    url: "/sudu8_page/orderDetail/orderDetail?orderid=" + o
                                });
                            }
                        }) : wx.showModal({
                            title: "很抱歉",
                            content: t.data.data.message,
                            confirmText: "联系客服",
                            success: function(a) {
                                a.confirm && wx.makePhoneCall({
                                    phoneNumber: t.data.mobile
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    tuihuo: function(a) {
        this.setData({
            showmask: !0,
            order_tuihuo: a.currentTarget.dataset.order
        });
    },
    bindPickerChange: function(a) {
        this.setData({
            index: a.detail.value
        });
    },
    changekdh: function(a) {
        this.setData({
            kdh: a.detail.value
        });
    },
    cancelkdinfo: function() {
        this.setData({
            showmask: !1
        });
    },
    changekdinfo: function() {
        var a = this;
        0 == a.data.index ? wx.showModal({
            title: "提交失败",
            content: "必须选择快递",
            showCancel: !1
        }) : a.data.kdh ? wx.request({
            url: a.data.baseurl + "doPagenewtuihuo",
            data: {
                uniacid: a.data.uniacid,
                order_id: a.data.order_tuihuo,
                kuaidi: a.data.kuaidi[a.data.index],
                kuaidihao: a.data.kdh
            },
            success: function(a) {
                console.log(a), wx.showToast({
                    title: "已申请退货",
                    icon: "success",
                    success: function() {
                        setTimeout(function() {
                            wx.redirectTo({
                                url: "/sudu8_page/order_more_list/order_more_list"
                            });
                        }, 1500);
                    }
                });
            }
        }) : wx.showModal({
            title: "提交失败",
            content: "快递号/信息必填",
            showCancel: !1
        });
    },
    qrshouh: function(a) {
        var t = a.target.dataset.order, e = wx.getStorageSync("openid");
        wx.request({
            url: this.data.baseurl + "dopagenewquerenxc",
            data: {
                uniacid: this.data.uniacid,
                openid: e,
                orderid: t
            },
            success: function(a) {
                wx.redirectTo({
                    url: "/sudu8_page/orderDetail/orderDetail?orderid=" + t
                });
            }
        });
    },
    hxshow: function(a) {
        console.log("123456");
        this.setData({
            showhx: 1,
            order: a.currentTarget.dataset.order
        });
    },
    hxhide: function() {
        this.setData({
            showhx: 0,
            hxmm: ""
        });
    },
    hxmmInput: function(a) {
        console.log("23456"), this.setData({
            hxmm: a.detail.value
        });
    },
    hxmmpass: function() {
        var a = this, t = a.data.hxmm, e = a.data.order;
        console.log("fff" + a.data.hxmm), t ? (console.log("xxxx"), wx.request({
            url: a.data.baseurl + "hxmm",
            data: {
                hxmm: t,
                order_id: e,
                uniacid: a.data.uniacid,
                is_more: 2
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                console.log(a.data.data), 0 == a.data.data ? wx.showModal({
                    title: "提示",
                    content: "核销密码不正确！",
                    showCancel: !1
                }) : wx.showToast({
                    title: "消费成功",
                    icon: "success",
                    duration: 2e3,
                    success: function(a) {
                        wx.redirectTo({
                            url: "/sudu8_page/order_more_list/order_more_list"
                        });
                    }
                });
            }
        })) : wx.showModal({
            title: "提示",
            content: "请输入核销密码！",
            showCancel: !1
        });
    }
});