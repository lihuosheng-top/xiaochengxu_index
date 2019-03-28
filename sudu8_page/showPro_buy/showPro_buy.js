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
        });
        var d = 0;
        a.fxsid && (d = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            cachetime: "30",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                a.data.data;
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            }
        }), app.util(t.getinfos, d, t.data.uniacid);
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
        var d = this, t = wx.getStorageSync("openid");
        wx.request({
            url: d.data.baseurl + "doPagemycoupon",
            data: {
                openid: t,
                flag: 0,
                uniacid: d.data.uniacid
            },
            success: function(a) {
                d.setData({
                    couponlist: a.data.data
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), wx.request({
            url: d.data.baseurl + "doPageshowPro",
            data: {
                id: a,
                openid: t,
                uniacid: d.data.uniacid
            },
            cachetime: "30",
            success: function(a) {
                var t = d.data.yhje;
                if (0 == a.data.data.pro_xz) e = 1; else var e = a.data.data.pro_xz - a.data.data.my_num;
                d.setData({
                    bg: a.data.data.text[0],
                    picList: a.data.data.text,
                    title: a.data.data.title,
                    datas: a.data.data,
                    hjjg: a.data.data.price,
                    dprice: a.data.data.price,
                    sfje: a.data.data.price - t,
                    my_num: a.data.data.my_num,
                    xg_num: a.data.data.pro_xz,
                    shengyu: a.data.data.pro_kc,
                    xg_buy: e
                }), wx.setNavigationBarTitle({
                    title: d.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    jian: function() {
        var a = this, t = a.data.jhsl;
        --t <= 0 && (t = 1);
        var e = 100 * a.data.dprice * t / 100, d = e - a.data.yhje;
        a.setData({
            jhsl: t,
            hjjg: e,
            sfje: d,
            jqdjg: "请选择",
            yhqid: 0
        });
    },
    jia: function() {
        var a = this, t = a.data.jhsl, e = a.data.my_num, d = a.data.xg_num, i = a.data.shengyu, o = a.data.dprice, n = a.data.yhje;
        i < ++t && -1 != i && (t--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        })), d < t + e && 0 != d && (1 == t ? t = 1 : t -= 1, wx.showModal({
            title: "提醒",
            content: "该商品为限购产品，您总购买数已超过限额！",
            showCancel: !1
        }));
        var s = 100 * o * t / 100, r = s - n;
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
        var t = this, e = t.data.jhsl, d = t.data.shengyu;
        if (d < e && -1 != d) return e--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        }), !1;
        var i = t.data.sfje, o = wx.getStorageSync("openid"), n = t.data.jhsl, s = t.data.dprice, r = t.data.yhje, c = t.data.id, u = t.data.order, l = t.data.pro_name, h = t.data.pro_tel, p = t.data.pro_address, f = t.data.pro_txt, g = (t.data.id, 
        t.data.yhqid), w = (a.detail.formId, !0);
        if (!l && 2 == t.data.datas.pro_flag) return w = !1, wx.showModal({
            title: "提醒",
            content: "姓名为必填！",
            showCancel: !1
        }), !1;
        return h || 2 != t.data.datas.pro_flag_tel ? /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(h) || 2 != t.data.datas.pro_flag_tel ? p || 2 != t.data.datas.pro_flag_add ? void (w && wx.request({
            url: t.data.baseurl + "doPageDingd",
            data: {
                openid: o,
                id: c,
                price: s,
                count: n,
                youhui: r,
                zhifu: i,
                order: u,
                pro_name: l,
                pro_tel: h,
                pro_address: p,
                pro_txt: f,
                yhqid: g,
                uniacid: t.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                return 0 == a.data.data.success && 0 == a.data.data.syl ? (wx.showModal({
                    title: "提醒",
                    content: "很遗憾！商品售完了！",
                    showCancel: !1,
                    success: function() {
                        wx.reLaunch({
                            url: "../showPro/showPro?id=" + a.data.data.id
                        });
                    }
                }), !1) : 0 == a.data.data.success && 0 < a.data.data.syl ? (wx.showModal({
                    title: "提醒",
                    content: "很遗憾！商品只剩下" + a.data.data.syl + "个",
                    showCancel: !1,
                    success: function() {
                        wx.reLaunch({
                            url: "../showPro/showPro?id=" + a.data.data.id
                        });
                    }
                }), !1) : void (1 == a.data.data.success && (t.setData({
                    order: a.data.data
                }), wx.reLaunch({
                    url: "../show_Pro_d/show_Pro_d?order=" + a.data.data.order_id
                })));
            }
        })) : (w = !1, wx.showModal({
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
        this.setData({
            chuydate: a.detail.value
        });
    },
    bindTimeChange: function(a) {
        this.setData({
            chuytime: a.detail.value
        });
    },
    getmoney: function(a) {
        var t = a.currentTarget.id, e = a.currentTarget.dataset.index, d = e.coupon.pay_money, i = this.data.hjjg;
        if (1 * i < 1 * d) wx.showModal({
            title: "提示",
            content: "价格未满" + d + "元，不可使用该优惠券！",
            showCancel: !1
        }); else {
            var o = parseFloat(((100 * i - 100 * t) / 100).toPrecision(12));
            o < 0 && (o = 0), this.setData({
                jqdjg: t,
                yhqid: e.id,
                sfje: o
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