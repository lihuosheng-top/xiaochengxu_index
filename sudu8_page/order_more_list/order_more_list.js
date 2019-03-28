var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page_signs: "order",
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
        type1: 10,
        flag: 10,
        showmask: !1,
        kuaidi: [ "选择快递", "圆通", "中通", "申通", "顺丰", "韵达", "天天", "百世", "EMS", "本人到店", "其他" ],
        index: 0
    },
    onPullDownRefresh: function() {
        this.data.page = 1, this.getList(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        this.getList();
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "我的订单"
        }), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                t.setData({
                    baseinfo: a.data.data,
                    baseColor: a.data.data.base_color
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            }
        }), a.flag && t.setData({
            flag: a.flag
        }), a.type1 && t.setData({
            type1: a.type1
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), app.util(t.getinfos, e, t.data.uniacid);
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
                }), t.getBase(), t.getList();
            }
        });
    },
    changflag: function(a) {
        var t = this;
        t.data.page = 1;
        var e = a.currentTarget.dataset.flag, o = a.currentTarget.dataset.nav;
        null != o && null != e ? t.setData({
            type1: o,
            flag: e
        }) : null == o && t.setData({
            flag: e
        }), t.getList();
    },
    getBase: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageBase",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            cachetime: "30",
            success: function(a) {
                console.log(a), console.log(1), t.setData({
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
    setorderover: function(a) {
        wx.getStorageSync("openid");
        wx.request({
            url: this.data.baseurl + "doPagesetorderover",
            data: {
                uniacid: this.data.uniacid,
                openid: wx.getStorageSync("openid")
            },
            success: function(a) {}
        });
    },
    getList: function(a) {
        var t = this, e = (wx.getStorageSync("openid"), t.data.page);
        wx.request({
            url: t.data.baseurl + "doPageduoorderlist",
            data: {
                page: e,
                uniacid: t.data.uniacid,
                flag: t.data.flag,
                type1: t.data.type1,
                openid: wx.getStorageSync("openid")
            },
            success: function(a) {
                console.log(a), t.setData({
                    page: e + 1,
                    orderinfo: 1 == e ? a.data.data : t.data.orderinfo.concat(a.data.data)
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    makePhoneCallB: function(a) {
        var t = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    qrshouh: function(a) {
        var t = this;
        console.log(a);
        var e = a.currentTarget.dataset.order, o = wx.getStorageSync("openid");
        wx.showModal({
            title: "提示",
            content: "确认收货吗？",
            success: function(a) {
                a.confirm && wx.request({
                    url: t.data.baseurl + "dopagenewquerenxc",
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
    hxshow: function(a) {
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
        this.setData({
            hxmm: a.detail.value
        });
    },
    hxmmpass: function() {
        var e = this, a = e.data.hxmm, t = e.data.order;
        console.log("fff" + e.data.hxmm), a ? (console.log("xxxx"), wx.request({
            url: e.data.baseurl + "hxmm",
            data: {
                hxmm: a,
                order_id: t,
                uniacid: e.data.uniacid,
                is_more: 2
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                console.log(a.data.data);
                var t = a.data.data;
                0 == t ? (wx.showModal({
                    title: "提示",
                    content: "核销密码不正确！",
                    showCancel: !1
                }), e.setData({
                    hxmm: ""
                })) : 1 == t ? wx.showToast({
                    title: "消费成功",
                    icon: "success",
                    duration: 2e3,
                    success: function(a) {
                        wx.redirectTo({
                            url: "/sudu8_page/order_more_list/order_more_list"
                        });
                    }
                }) : 2 == t && wx.showModal({
                    title: "提示",
                    content: "已核销!",
                    showCancel: !1
                });
            }
        })) : wx.showModal({
            title: "提示",
            content: "请输入核销密码！",
            showCancel: !1
        });
    },
    wlinfo: function(a) {
        var t = a.currentTarget.dataset.kuaidi, e = a.currentTarget.dataset.kuaidihao;
        wx.navigateTo({
            url: "/sudu8_page/logistics_state/logistics_state?kuaidi=" + t + "&kuaidihao=" + e
        });
    }
});