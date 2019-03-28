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
        title: "订单提交",
        yhq_hidden: 0,
        yhq: [ "不使用优惠券", "满100减10", "满200减30", "满500减100" ],
        yhq_i: 0,
        yhq_tishi: 1,
        yhq_u: 0,
        nav: 1,
        jqdjg: "请选择",
        jifen_u: 0,
        yhqid: 0,
        yhdq: 0,
        sfje: 0,
        szmoney: 0,
        dkmoney: 0,
        dkscore: 0,
        mjly: "",
        px: 0,
        yunfei: 0,
        yfjian: 0,
        ischecked: !1
    },
    onPullDownRefresh: function() {
        this.getinfos(), wx.stopPullDownRefresh();
    },
    onLoad: function(a) {
        console.log(a);
        var s = this, r = a.shareid;
        r || (r = 0), console.log(r), s.setData({
            shareid: r
        });
        var t = a.id;
        null != t && s.setData({
            id: t
        }), wx.setNavigationBarTitle({
            title: s.data.title
        }), wx.getSystemInfo({
            success: function(a) {
                s.setData({
                    h: a.windowHeight
                });
            }
        });
        var e = a.addressid;
        console.log(e), e ? s.getmraddresszd(e) : s.getmraddress();
        var d = 0;
        a.fxsid && (d = a.fxsid, s.setData({
            fxsid: a.fxsid
        })), wx.request({
            url: s.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: s.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                s.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: s.data.baseinfo.base_tcolor,
                    backgroundColor: s.data.baseinfo.base_color
                });
            }
        });
        var c = a.orderid;
        if (c && "undefined" != c && null != c) {
            var n = wx.getStorageSync("openid");
            wx.request({
                url: s.data.baseurl + "dopageptorderinfo",
                data: {
                    uniacid: s.data.uniacid,
                    orderid: c,
                    openid: n
                },
                success: function(a) {
                    for (var t = a.data.jsondata, e = 0, d = 0, n = 0; n < t.length; n++) {
                        var i = t[n].num;
                        if (1 == (d = t[n].gmorpt)) var o = t[n].proinfo.price; else o = t[n].proinfo.dprice;
                        e += 1 * o * (1 * i);
                    }
                    s.setData({
                        jsdata: a.data.jsondata,
                        jsprice: Math.round(100 * e) / 100,
                        sfje: e,
                        px: 1,
                        orderid: c,
                        gwc: d
                    }), s.tuanzyh();
                }
            });
        } else wx.getStorage({
            key: "jsdata",
            success: function(a) {
                for (var t = a.data, e = 0, d = 0, n = 0; n < t.length; n++) {
                    var i = t[n].num;
                    if (1 == (d = t[n].gmorpt)) var o = t[n].proinfo.price; else o = t[n].proinfo.dprice;
                    0 == d && 0 != r && s.setData({
                        shareid: 0
                    }), e += 1 * o * (1 * i);
                }
                s.setData({
                    jsdata: a.data,
                    jsprice: Math.round(100 * e) / 100,
                    sfje: e,
                    px: 0,
                    gwc: d
                }), s.tuanzyh();
            }
        });
        app.util(s.getinfos, d, s.data.uniacid);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    getkuaidi: function() {
        var d = this, n = (d.data.jsdata[0].pvid, d.data.yunfei), i = d.data.sfje, o = Math.round(100 * (1 * i + 1 * n)) / 100;
        wx.request({
            url: d.data.baseurl + "doPageGetKuaiDi",
            data: {
                id: d.data.id,
                uniacid: d.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                if (0 == a.data.data) {
                    var t = d.data.money >= o ? o : Math.round(100 * (o - d.data.money)) / 100;
                    d.setData({
                        nav: 1,
                        yunfei: n,
                        newsfje: t,
                        sj_price: i,
                        zg_type: d.data.money >= o ? 0 : 1
                    });
                } else {
                    t = d.data.money >= i ? i : Math.round(100 * (i - d.data.money)) / 100;
                    d.setData({
                        nav: 2,
                        yunfei: 0,
                        newsfje: t,
                        sj_price: i,
                        zg_type: d.data.money >= i ? 0 : 1
                    });
                }
                var e = d.data.couponlist;
                d.setMaxCoupon(e), d.payments();
            }
        });
    },
    payments: function() {
        var a = this, t = a.data.newsfje, e = a.data.money;
        if (0 == a.data.zg_type) var d = t, n = 0; else d = e, n = t;
        a.setData({
            yue_price: d,
            wx_price: n
        });
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                });
            }
        });
    },
    switchChange: function(a) {
        for (var o = this, t = a.detail.value, e = wx.getStorageSync("openid"), d = o.data.jsdata, s = o.data.sfje, r = o.data.yunfei, c = 0, n = [], i = 0; i < d.length; i++) {
            var u = {};
            u.num = d[i].num, u.pvid = d[i].pvid, n.push(u);
        }
        if (1 == t) wx.request({
            url: o.data.baseurl + "dopageptsetgwcscore",
            data: {
                jsdata: n,
                openid: e,
                uniacid: o.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                var t = a.data;
                c = t.moneycl;
                var e = t.gzmoney, d = t.gzscore;
                s < c && (c = parseInt(s));
                var n = c * d / e;
                if (s = Math.round(100 * (s - c)) / 100, 1 == o.data.nav) var i = o.data.money >= Math.round(100 * (1 * s + 1 * r)) / 100 ? 0 : 1; else i = o.data.money >= s ? 0 : 1;
                o.setData({
                    newsfje: o.data.money >= s ? s : Math.round(100 * (s - o.data.money)) / 100,
                    zg_type: i,
                    sfje: s,
                    szmoney: c,
                    dkmoney: c,
                    dkscore: n,
                    jifen_u: 1
                }), o.payments();
            }
        }); else {
            c = o.data.szmoney;
            if (s = Math.round(100 * (s + c)) / 100, 1 == o.data.nav) var l = o.data.money >= Math.round(100 * (1 * s + 1 * r)) / 100 ? 0 : 1; else l = o.data.money >= s ? 0 : 1;
            o.setData({
                newsfje: o.data.money >= s ? s : Math.round(100 * (s - o.data.money)) / 100,
                zg_type: l,
                sfje: s,
                szmoney: 0,
                dkmoney: 0,
                dkscore: 0,
                jifen_u: 0
            }), o.payments();
        }
    },
    add_address: function() {
        wx.navigateTo({
            url: "/sudu8_page/address/address?shareid=" + this.data.shareid + "&pid=" + this.data.id + "&orderid=" + this.data.orderid
        });
    },
    yhq_sub: function() {
        var a = this.data.yhq_i;
        this.setData({
            yhq_r: a,
            yhq_hidden: 0,
            yhq_tishi: 0
        });
    },
    yhq_block: function() {
        this.setData({
            yhq_hidden: 1
        });
    },
    yhq_choose: function(a) {
        var t = a.currentTarget.dataset.i;
        this.setData({
            yhq_i: t
        });
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
    },
    getmraddress: function() {
        var e = this, a = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "dopagegetmraddress",
            data: {
                uniacid: e.data.uniacid,
                openid: a
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    mraddress: t
                });
            }
        });
    },
    getmraddresszd: function(a) {
        var e = this, t = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "dopagegetmraddresszd",
            data: {
                uniacid: e.data.uniacid,
                openid: t,
                id: a
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    mraddress: t
                });
            }
        });
    },
    getmyinfo: function() {
        var d = this, t = wx.getStorageSync("openid");
        d.data.jsdata, d.data.sfje;
        wx.request({
            url: d.data.baseurl + "doPagebase",
            data: {
                uniacid: d.data.uniacid
            },
            success: function(a) {
                d.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: d.data.baseinfo.base_tcolor,
                    backgroundColor: d.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), wx.request({
            url: d.data.baseurl + "doPageMymoney",
            data: {
                uniacid: d.data.uniacid,
                openid: t
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                d.setData({
                    money: parseFloat(a.data.data.money),
                    score: parseFloat(a.data.data.score)
                }), wx.request({
                    url: d.data.baseurl + "doPagemycoupon",
                    data: {
                        uniacid: d.data.uniacid,
                        openid: t
                    },
                    success: function(a) {
                        d.setData({
                            couponlist: a.data.data
                        });
                    }
                }), wx.request({
                    url: d.data.baseurl + "dopageyunfeiget",
                    data: {
                        uniacid: d.data.uniacid
                    },
                    success: function(a) {
                        var t = a.data.data, e = 0;
                        e = d.data.sfje >= t.byou ? 0 : t.yfei, d.setData({
                            yunfei: e
                        }), d.getkuaidi();
                    }
                });
            }
        });
    },
    setMaxCoupon: function(a) {
        for (var t = a, e = new Array(), d = "", n = 0; n < t.length; n++) parseFloat(t[n].coupon.pay_money) <= parseFloat(this.data.jsprice) && e.push(t[n]);
        if ("" != e) for (var i = parseFloat(e[0].coupon.price), o = 0; o < e.length; o++) parseFloat(e[o].coupon.price) >= i && (d = e[o]);
        if ("" != d) {
            var s = {}, r = {
                dataset: s
            }, c = {
                currentTarget: r
            };
            r.id = d.coupon.price, s.index = d, this.getmoney(c);
        }
    },
    qxyh: function() {
        var a, t = this, e = t.data.jqdjg;
        t.data.yhdq;
        "请选择" == e && (e = 0);
        var d = t.data.sfje, n = Math.round(100 * (1 * d + 1 * e)) / 100, i = t.data.yunfei, o = t.data.money >= n ? n : Math.round(100 * (n - t.data.money)) / 100;
        o = 1 == t.data.nav ? Math.round(100 * (1 * o + 1 * i)) / 100 : o, t.hideModal(), 
        t.setData((_defineProperty(a = {
            jqdjg: 0,
            yhqid: 0,
            sfje: n,
            newsfje: o,
            zg_type: t.data.money >= n ? 0 : 1
        }, "jqdjg", "请选择"), _defineProperty(a, "yhdq", 0), a)), t.payments();
    },
    getmoney: function(a) {
        var t = this;
        this.setData({
            ischecked: !1,
            jifen_u: 0
        });
        var e = a.currentTarget.id, d = a.currentTarget.dataset.index, n = d.coupon.pay_money, i = t.data.sj_price, o = (t.data.yhdq, 
        t.data.yhqid);
        if (0 == o || d.id != o) {
            if (1 * i < 1 * n) wx.showModal({
                title: "提示",
                content: "价格未满" + n + "元，不可使用该优惠券！",
                showCancel: !1
            }); else {
                var s = Math.round(100 * (1 * i - 1 * e)) / 100;
                s < 0 && (s = 0);
                var r = t.data.yunfei, c = t.data.money >= s ? s : Math.round(100 * (s - t.data.money)) / 100;
                c = 1 == t.data.nav ? Math.round(100 * (1 * c + 1 * r)) / 100 : c, t.setData({
                    jqdjg: e,
                    yhqid: d.id,
                    sfje: s,
                    zg_type: t.data.money >= s ? 0 : 1,
                    newsfje: c,
                    oldsfje: i,
                    yhdq: e
                }), t.hideModal();
            }
            t.payments();
        }
        d.id;
    },
    submit: function(a) {
        var e = this, t = a.detail.formId;
        e.setData({
            formId: t
        });
        for (var d = wx.getStorageSync("openid"), n = e.data.jsdata, i = n[0].pvid, o = [], s = 0; s < n.length; s++) {
            var r = {};
            r.baseinfo = n[s].baseinfo2.id, r.proinfo = n[s].proinfo.id, r.num = n[s].num, r.pvid = n[s].pvid, 
            r.one_bili = n[s].one_bili, r.two_bili = n[s].two_bili, r.three_bili = n[s].three_bili, 
            r.id = n[s].id, r.proval_ggz = n[s].proinfo.ggz, r.proval_price = n[s].proinfo.price, 
            r.proval_dprice = n[s].proinfo.dprice, o.push(r);
        }
        d = wx.getStorageSync("openid");
        var c = e.data.yhqid, u = e.data.newsfje, l = (e.data.money, e.data.nav), p = e.data.yunfei, f = e.data.yfjian;
        p = p || 0;
        var h = e.data.shareid;
        console.log("mmm" + e.data.shareid);
        var y = e.data.dkscore, g = (e.data.dkmoney, e.data.gwc);
        p -= f;
        var w = e.data.mraddress, m = e.data.mjly;
        if ((null == w || 0 == w) && 1 == l) return wx.showModal({
            title: "提醒",
            content: "请先选择/设置地址！",
            showCancel: !1
        }), !1;
        if ((null == w || 0 == w) && 2 == l) return wx.showModal({
            title: "提醒",
            content: "请先选择/设置地址,方便店家联系你！",
            showCancel: !1
        }), !1;
        var v = w.id, x = e.data.px;
        if (console.log("xxxx" + h), 0 == x) console.log("xxxx" + h), wx.request({
            url: e.data.baseurl + "dopageptsetorder",
            header: {
                "content-type": "application/json"
            },
            data: {
                uniacid: e.data.uniacid,
                openid: d,
                jsdata: o,
                couponid: c,
                price: u,
                dkscore: y,
                address: v,
                mjly: m,
                nav: l,
                gwc: g,
                shareid: h,
                pvid: i
            },
            success: function(a) {
                if (console.log(a.data), 2 == a.data) wx.showModal({
                    title: "提醒",
                    content: "你是拼团发起人，不能参团",
                    showCancel: !1,
                    success: function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }); else if (3 == a.data) wx.showModal({
                    title: "提醒",
                    content: "你已参团，不能再次参团",
                    showCancel: !1,
                    success: function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }); else if (5 == a.data) wx.showModal({
                    title: "提醒",
                    content: "此商品您有拼团订单未成功，无法再次开团",
                    showCancel: !1,
                    success: function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }); else if (4 == a.data) wx.showModal({
                    title: "提醒",
                    content: "该团已满，无法参团",
                    showCancel: !1,
                    success: function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }); else if (6 == a.data) wx.showModal({
                    title: "提示",
                    content: "该商品已下架",
                    showCancel: !1,
                    success: function() {
                        wx.redirectTo({
                            url: "/sudu8_page_plugin_pt/index/index"
                        });
                    }
                }); else {
                    var t = a.data;
                    e.setData({
                        orderid: t
                    }), 0 == e.data.zg_type ? e.pay1(t) : e.pay2(t);
                }
            }
        }); else {
            var _ = e.data.orderid;
            console.log("%%%%" + _);
            g = e.data.gwc, d = wx.getStorageSync("openid");
            wx.request({
                url: e.data.baseurl + "doPageptduoorderchangegg",
                header: {
                    "content-type": "application/json"
                },
                data: {
                    uniacid: e.data.uniacid,
                    orderid: _,
                    shareid: h,
                    couponid: c,
                    price: u,
                    dkscore: y,
                    address: w.id,
                    mjly: m,
                    nav: l,
                    gwc: g,
                    openid: d,
                    pvid: i
                },
                success: function(a) {
                    5 == a.data ? wx.showModal({
                        title: "提醒",
                        content: "此商品您有拼团订单未成功，无法再次开团",
                        showCancel: !1,
                        success: function() {
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    }) : 6 == a.data ? wx.showModal({
                        title: "提醒",
                        content: "您已参加此团，无法再次参团",
                        showCancel: !1,
                        success: function() {
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    }) : 0 == e.data.zg_type ? e.pay1(_) : e.pay2(_);
                }
            });
        }
    },
    pay1: function(a) {
        var t = this, e = a;
        t.setData({
            formId: t.data.formId
        }), wx.showModal({
            title: "请注意",
            content: "您将使用余额支付" + t.data.newsfje + "元",
            success: function(a) {
                a.confirm && (t.payover_do(e), wx.showLoading({
                    title: "下单中...",
                    mask: !0
                }));
            }
        });
    },
    pay2: function(a) {
        var t = this, e = wx.getStorageSync("openid"), d = t.data.newsfje, n = a;
        t.setData({
            formId: t.data.formId
        }), wx.request({
            url: t.data.baseurl + "doPageweixinpay",
            data: {
                uniacid: t.data.uniacid,
                openid: e,
                price: d,
                order_id: n
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
                            mask: !0,
                            duration: 3e3,
                            success: function(a) {
                                t.payover_do(n);
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
    payover_do: function(t) {
        var e = this, a = (e.data.comment, wx.getStorageSync("openid")), d = e.data.yhqid, n = (e.data.order_id, 
        e.data.shareid), i = e.data.dkscore, o = e.data.zg_type, s = e.data.money, r = e.data.sfje, c = e.data.yue_price, u = e.data.wx_price;
        if (0 == o) var l = r;
        if (1 == o) l = s;
        console.log(t + "***" + a), wx.request({
            url: e.data.baseurl + "doPageptorderchange",
            data: {
                uniacid: e.data.uniacid,
                order_id: t,
                openid: a,
                true_price: l,
                dkscore: i,
                couponid: d,
                shareid: n,
                formid: e.data.formId,
                yue_price: c,
                wx_price: u
            },
            success: function(a) {
                e.sendMail_order(t), 0 == a.data.data ? wx.reLaunch({
                    url: "/sudu8_page_plugin_pt/orderlist/orderlist"
                }) : wx.reLaunch({
                    url: "/sudu8_page_plugin_pt/pt/pt?shareid=" + a.data.data
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
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log("sendMail_order_fail");
            }
        });
    },
    mjly: function(a) {
        var t = a.detail.value;
        this.setData({
            mjly: t
        });
    },
    mend: function() {},
    makePhoneCallC: function(a) {
        var t = a.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    tuanzyh: function() {
        var s = this, a = s.data.jsdata[0].pvid;
        wx.request({
            url: s.data.baseurl + "doPagepttuanzyh",
            header: {
                "content-type": "application/json"
            },
            data: {
                uniacid: s.data.uniacid,
                id: a
            },
            success: function(a) {
                var t = a.data.data.tz_yh, e = s.data.gwc, d = s.data.sfje, n = s.data.shareid, i = d, o = 0;
                1 == e && 0 == n && (d = (d * t / 10).toFixed(2), o = Math.round(100 * (1 * i - 1 * d)) / 100, 
                s.setData({
                    tz_bl: t,
                    sfje: d,
                    youhl: o
                })), s.getmyinfo();
            }
        });
    }
});