function _defineProperty(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        id: "",
        bg: "",
        couponlist: [],
        picList: [],
        datas: "",
        comment: "",
        jhsl: 1,
        dprice: "",
        yhje: 0,
        hjjg: "",
        sfje: "",
        order: "",
        pro_name: "",
        pro_tel: "",
        pro_address: "",
        pro_txt: "",
        my_num: "",
        xg_num: "",
        shengyu: "",
        userInfo: "",
        chuydate: "",
        chuytime: "",
        couponprice: 0,
        jqdjg: "请选择",
        yhqid: "0"
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        var t = this, e = a.id;
        t.setData({
            id: e
        }), console.log("id"), console.log(t.data.id);
        var o = 0;
        a.fxsid && (o = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            cachetime: "30",
            success: function(a) {
                a.data.data;
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            }
        }), app.util(t.getinfos, o, t.data.uniacid);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                e.setData({
                    openid: a.data
                });
                var t = e.data.id;
                e.getShowPic(t);
            }
        });
    },
    getShowPic: function(a) {
        var e = this, t = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "doPagemycoupon",
            data: {
                uniacid: e.data.uniacid,
                openid: t,
                flag: 0
            },
            success: function(a) {
                console.log(a), e.setData({
                    couponlist: a.data.data
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), wx.request({
            url: e.data.baseurl + "doPageshowPro_W",
            data: {
                uniacid: e.data.uniacid,
                id: e.data.id,
                openid: e.data.openid
            },
            cachetime: "30",
            success: function(a) {
                var t = e.data.yhje;
                console.log(11111), console.log(a), e.setData({
                    picList: a.data.data.images,
                    title: a.data.data.title,
                    datas: a.data.data,
                    hjjg: a.data.data.sellprice,
                    dprice: a.data.data.sellprice,
                    sfje: a.data.data.sellprice - t,
                    shengyu: a.data.data.storage
                }), console.log(1234), console.log(e.data.datas), wx.setNavigationBarTitle({
                    title: e.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    jian: function() {
        var a = this, t = a.data.jhsl;
        --t <= 0 && (t = 1);
        var e = 100 * a.data.dprice * t / 100, o = e - a.data.yhje;
        a.setData({
            jhsl: t,
            hjjg: e,
            sfje: o,
            jqdjg: "请选择",
            yhqid: 0
        });
    },
    jia: function() {
        var a = this, t = a.data.jhsl, e = a.data.my_num, o = a.data.xg_num, i = a.data.shengyu, d = a.data.dprice, n = a.data.yhje;
        i < ++t && -1 != i && (t--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        })), o < t + e && 0 != o && (1 == t ? t = 1 : t -= 1, wx.showModal({
            title: "提醒",
            content: "该商品为限购产品，您总购买数已超过限额！",
            showCancel: !1
        }));
        var s = 100 * d * t / 100, r = s - n;
        a.setData({
            jhsl: t,
            hjjg: s,
            sfje: r,
            jqdjg: "请选择",
            yhqid: 0
        });
    },
    userNameInput: function(a) {
        this.setData({
            pro_name: a.detail.value
        });
    },
    userTelInput: function(a) {
        this.setData({
            pro_tel: a.detail.value
        });
    },
    userAddInput: function(a) {
        this.setData({
            pro_address: a.detail.value
        });
    },
    userTextInput: function(a) {
        this.setData({
            pro_txt: a.detail.value
        });
    },
    save: function(a) {
        var e = this, t = e.data.jhsl, o = e.data.shengyu;
        if (o < t && -1 != o) return t--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        }), !1;
        var i = e.data.sfje, d = wx.getStorageSync("openid"), n = e.data.jhsl, s = e.data.dprice, r = e.data.yhje, c = e.data.id, l = e.data.order, u = e.data.pro_name, h = e.data.pro_tel, g = e.data.pro_address, p = e.data.pro_txt, f = (e.data.id, 
        e.data.yhqid), w = (a.detail.formId, !0);
        if (!u) return w = !1, wx.showModal({
            title: "提醒",
            content: "姓名为必填！",
            showCancel: !1
        }), !1;
        return h ? /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(h) ? g ? void (w && (console.log("tahtda"), 
        console.log(s), wx.request({
            url: e.data.baseurl + "doPageDingd_W",
            data: {
                uniacid: e.data.uniacid,
                openid: d,
                id: c,
                price: s,
                count: n,
                youhui: r,
                zhifu: i,
                order: l,
                pro_name: u,
                pro_tel: h,
                pro_address: g,
                pro_txt: p,
                yhqid: f
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                console.log("cuowu"), console.log(a);
                var t = a.data.data.order_id;
                return 0 == a.data.data.success && 0 == a.data.data.syl ? (wx.showModal({
                    title: "提醒",
                    content: "很遗憾！商品售完了！",
                    showCancel: !1,
                    success: function() {
                        wx.reLaunch({
                            url: "../goods_detail/goods_detail?id=" + c
                        });
                    }
                }), !1) : 0 == a.data.data.success && 0 < a.data.data.syl ? (wx.showModal({
                    title: "提醒",
                    content: "很遗憾！商品只剩下" + a.data.data.syl + "个",
                    showCancel: !1,
                    success: function() {
                        wx.reLaunch({
                            url: "../goods_detail/goods_detail?id=" + c
                        });
                    }
                }), !1) : void (1 == a.data.data.success && (console.log(a.data.data.order_id), 
                console.log("res.orderid"), e.setData({
                    order_id: a.data.data.order_id
                }), wx.showModal({
                    title: "提醒",
                    content: "您将支付" + i + "元",
                    success: function(a) {
                        a.confirm && wx.request({
                            url: e.data.baseurl + "doPagezhifu_W",
                            data: {
                                uniacid: e.data.uniacid,
                                openid: d,
                                money: i,
                                types: 1,
                                order_id: t
                            },
                            header: {
                                "content-type": "application/json"
                            },
                            success: function(a) {
                                console.log(a), a.data.data.order_id && wx.requestPayment({
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
                                                console.log("ok"), wx.request({
                                                    url: e.data.baseurl + "doPagezhifuSuccess_W",
                                                    data: {
                                                        uniacid: e.data.uniacid,
                                                        order_id: e.data.order_id
                                                    },
                                                    success: function(a) {
                                                        console.log(a);
                                                    }
                                                }), wx.redirectTo({
                                                    url: "/sudu8_page/order_more_list/order_more_list"
                                                });
                                            },
                                            fail: function(a) {
                                                wx.showToast({
                                                    icon: "loading",
                                                    title: "支付失败！",
                                                    duration: 2e3
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                })));
            }
        }))) : (w = !1, wx.showModal({
            title: "提醒",
            content: "地址为必填！",
            showCancel: !1
        }), !1) : (wx.showModal({
            title: "提醒",
            content: "请输入有效的手机号码！",
            showCancel: !1
        }), !1) : (w = !1, wx.showModal({
            title: "提醒",
            content: "手机号为必填！",
            showCancel: !1
        }), !1);
    },
    bindDateChange: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            chuydate: a.detail.value
        });
    },
    bindTimeChange: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            chuytime: a.detail.value
        });
    },
    getmoney: function(a) {
        var t = a.currentTarget.id, e = a.currentTarget.dataset.index, o = e.coupon.pay_money, i = this.data.hjjg;
        if (1 * i < 1 * o) wx.showModal({
            title: "提示",
            content: "价格未满" + o + "元，不可使用该优惠券！",
            showCancel: !1
        }); else {
            var d = parseFloat(((100 * i - 100 * t) / 100).toPrecision(12));
            d < 0 && (d = 0), this.setData({
                jqdjg: t,
                yhqid: e.id,
                sfje: d
            }), this.hideModal();
        }
    },
    qxyh: function() {
        var a = this.data.jqdjg;
        "请选择" == a && (a = 0);
        var t = (100 * this.data.sfje + 100 * a) / 100;
        this.hideModal(), this.setData(_defineProperty({
            jqdjg: 0,
            yhqid: 0,
            sfje: t
        }, "jqdjg", "请选择"));
    },
    showModal: function() {
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