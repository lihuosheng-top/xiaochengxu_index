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
        my_gml: "",
        xg_num: "",
        shengyu: "",
        cdd: "",
        chuydate: "",
        chuytime: "",
        num: [],
        xz_num: [],
        couponprice: 0,
        jqdjg: "请选择",
        yhqid: "0",
        oldsfje: "",
        pagedata: {},
        hxmm: "",
        showhx: 0,
        orderFormDisable: !0,
        isChange: "",
        formchangeBtn: 1,
        dkscore: 0,
        dkmoney: 0,
        yhqmoney_s: 0,
        zf_type: "",
        tableis: 0,
        orderid: "",
        manjian_info: ""
    },
    changeOrderFormDisable: function() {
        this.setData({
            orderFormDisable: !1,
            isChange: "isChange",
            formchangeBtn: 3
        });
    },
    changeOrderFormConfirm: function() {
        var t = this;
        wx.showModal({
            title: "确定提交吗",
            content: "只有一次修改的机会哦",
            success: function(a) {
                a.confirm && wx.request({
                    url: t.data.baseurl + "doPageapplyModifyAppointInfo",
                    data: {
                        pro_name: t.data.pro_name,
                        pro_tel: t.data.pro_tel,
                        pro_address: t.data.pro_address,
                        chuydate: t.data.chuydate,
                        chuytime: t.data.chuytime,
                        order_id: t.data.order,
                        uniacid: t.data.uniacid
                    },
                    success: function(a) {
                        console.log(a), t.setData({
                            orderFormDisable: !0,
                            isChange: "",
                            formchangeBtn: 4
                        }), wx.showModal({
                            title: "提示",
                            content: "信息修改成功，请等待后台管理员审核！",
                            showCancel: !1
                        });
                    }
                });
            }
        });
    },
    changeOrderFormCancel: function() {
        this.setData({
            orderFormDisable: !0,
            isChange: "",
            formchangeBtn: 2
        });
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
    onPullDownRefresh: function() {
        var a = this.data.order;
        this.getOrder(a);
    },
    onLoad: function(a) {
        var t = this, e = a.id;
        t.setData({
            order: e
        }), a.tableis && t.setData({
            tableis: a.tableis
        }), 0 == a.tsid ? t.setData({
            tableis: 0
        }) : t.setData({
            tableis: 1
        });
        var d = 0;
        a.fxsid && (d = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            cachetime: "30",
            data: {
                vs1: 1,
                uniacid: t.data.uniacid
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
                var t = e.data.order;
                e.getOrder(t);
            }
        });
    },
    getOrder: function(a) {
        var r = this, t = wx.getStorageSync("openid");
        wx.request({
            url: r.data.baseurl + "doPagemycoupon",
            data: {
                openid: t,
                uniacid: r.data.uniacid
            },
            success: function(a) {
                r.setData({
                    couponlist: a.data.data
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), wx.request({
            url: r.data.baseurl + "doPageOrderinfo",
            data: {
                order: a,
                openid: t,
                uniacid: r.data.uniacid
            },
            cachetime: "30",
            success: function(a) {
                r.data.yhje;
                var t = a.data.data.yhInfo, e = a.data.data.order_id;
                0 != t && (0 < t.score.money ? r.setData({
                    ischecked: !0,
                    jifen_u: 1,
                    dkscore: t.score.msg.slice(0, t.score.msg.indexOf("积分")),
                    dkmoney: t.score.money
                }) : r.setData({
                    jifen_u: 0
                }), t.mj ? r.setData({
                    manjian_info: t.mj.msg
                }) : r.setData({
                    manjian_info: "无"
                }), t.yhq ? r.setData({
                    jqdjg: t.yhq.msg
                }) : r.setData({
                    jqdjg: "无"
                }));
                for (var d = a.data.data.more_type_x, o = [], n = {}, s = 0, i = 0; i < d.length; i++) n[i] = d[i][4], 
                o.push(n), s = (100 * s + 100 * d[i][4]) / 100;
                "3" == a.data.data.flag && "1" == a.data.data.pro_flag_ding ? r.setData({
                    formchangeBtn: 0
                }) : "1" != a.data.data.flag || 0 != a.data.data.can_modify || a.data.data.modify_info ? "1" != a.data.data.flag || 1 != a.data.data.can_modify || a.data.data.modify_info ? a.data.data.modify_info && 1 == a.data.data.modify_flag ? r.setData({
                    formchangeBtn: 4
                }) : a.data.data.modify_info && 2 == a.data.data.modify_flag ? r.setData({
                    formchangeBtn: 5
                }) : a.data.data.modify_info && 3 == a.data.data.modify_flag && r.setData({
                    formchangeBtn: 6
                }) : r.setData({
                    formchangeBtn: 2
                }) : r.setData({
                    formchangeBtn: 1
                }), r.setData({
                    id: a.data.data.pid,
                    datas: a.data.data,
                    dprice: a.data.data.price,
                    jhsl: a.data.data.num,
                    hjjg: a.data.data.price,
                    sfje: a.data.data.true_price,
                    pro_name: a.data.data.pro_user_name,
                    pro_tel: a.data.data.pro_user_tel,
                    pro_address: a.data.data.pro_user_add,
                    pro_txt: a.data.data.pro_user_txt,
                    my_num: a.data.data.my_num,
                    xg_num: a.data.data.pro_xz,
                    shengyu: a.data.data.pro_kc,
                    my_gml: a.data.data.my_num,
                    cdd: a.data.data.mcount,
                    chuydate: a.data.data.chuydate,
                    chuytime: a.data.data.chuytime,
                    modify_date_begin: a.data.data.modify_date_begin,
                    num: o,
                    chooseNum: s,
                    xz_num: a.data.data.more_type_num,
                    oldsfje: a.data.data.price,
                    yhqid: a.data.data.couponid,
                    pagedata: a.data.data.beizhu_val,
                    myscore: parseFloat(a.data.data.my_score),
                    mymoney: parseFloat(a.data.data.my_money),
                    zf_type: parseFloat(a.data.data.my_money) >= a.data.data.true_price ? 0 : 1,
                    orderid: e
                }), wx.setNavigationBarTitle({
                    title: r.data.datas.product
                }), wx.setStorageSync("isShowLoading", !1), 0 == a.data.data.flag && wx.request({
                    url: r.data.baseurl + "doPagegetmoneyoff",
                    data: {
                        uniacid: r.data.uniacid
                    },
                    success: function(a) {
                        for (var t = a.data.data, e = "", d = 0; d < t.length; d++) d == t.length - 1 ? e += "满" + t[d].reach + "减" + t[d].del : e += "满" + t[d].reach + "减" + t[d].del + "，";
                        r.data.sfje;
                        r.setData({
                            moneyoff: t,
                            moneyoffstr: t ? e : ""
                        });
                    }
                });
            }
        });
    },
    getmyinfo: function() {
        wx.getStorageSync("openid");
        var a = this.data.moneyoff, t = this.data.hjjg;
        if (a) for (var e = a.length - 1; 0 <= e; e--) if (t >= parseFloat(a[e].reach)) {
            t -= parseFloat(a[e].del);
            break;
        }
        this.setData({
            sfje: t,
            zf_type: this.data.mymoney >= t ? 0 : 1
        });
    },
    jian: function(a) {
        var t = this, e = t.data.yhje, d = a.currentTarget.dataset.testid, o = a.currentTarget.dataset.testkey, n = t.data.num[o][o], s = (t.data.duogg, 
        t.data.sfje), i = t.data.hjjg, r = t.data.oldsfje;
        if (--n < 0) n = 0; else {
            var c = Math.round(100 * r - 100 * d * n + 100 * d * (n - 1)) / 100;
            s = c - e, r = i = c;
            var u = t.data.num;
            u[o][o] = n, t.setData({
                num: u,
                sfje: s,
                hjjg: i,
                jqdjg: "请选择",
                oldsfje: r,
                yhqid: 0
            });
        }
        t.getmyinfo();
    },
    jia: function(a) {
        var t = this, e = (t.data.yhje, a.currentTarget.dataset.testid), d = a.currentTarget.dataset.testkey, o = t.data.num[d][d], n = (t.data.duogg, 
        t.data.oldsfje), s = t.data.hjjg;
        if (t.data.xz_num[d].shennum < ++o) return o--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        }), !1;
        var i = Math.round(100 * e * o + 100 * n - 100 * e * (o - 1)) / 100;
        s = n = i;
        var r = t.data.num;
        r[d][d] = o;
        var c = t.data.chooseNum + 1;
        t.setData({
            num: r,
            hjjg: s,
            jqdjg: "请选择",
            oldsfje: n,
            yhqid: 0,
            chooseNum: c,
            ischecked: !1,
            dkscore: 0,
            dkmoney: 0,
            jifen_u: 2
        }), t.getmyinfo();
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
    save: function() {
        var e = this, a = e.data.jhsl, t = e.data.shengyu;
        if (1 != e.data.tableis && t < a && -1 != t) return a--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        }), !1;
        for (var d = e.data.sfje, o = wx.getStorageSync("openid"), n = (e.data.duogg, e.data.num), s = (n[0], 
        []), i = {}, r = 0; r < n.length; r++) {
            var c = parseInt(n[r][r]);
            i[r] = c, s.push(i);
        }
        var u = e.data.chuydate, l = e.data.chuytime, h = (e.data.yhje, e.data.id), f = e.data.order, g = e.data.pro_name, p = e.data.pro_tel, m = e.data.pro_address, y = e.data.pro_txt, _ = (e.data.id, 
        e.data.yhqid), w = !0;
        if (0 == d) return w = !1, wx.showModal({
            title: "提醒",
            content: "请至少选择一个规格的商品！",
            showCancel: !1
        }), !1;
        if (!g && 2 == e.data.datas.pro_flag) return w = !1, wx.showModal({
            title: "提醒",
            content: "姓名为必填！",
            showCancel: !1
        }), !1;
        if (!p && 2 == e.data.datas.pro_flag_tel) return w = !1, wx.showModal({
            title: "提醒",
            content: "手机号为必填！",
            showCancel: !1
        }), !1;
        if (!/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(p) && 2 == e.data.datas.pro_flag_tel) return wx.showModal({
            title: "提醒",
            content: "请输入有效的手机号码！",
            showCancel: !1
        }), !1;
        if (!m && 2 == e.data.datas.pro_flag_add) return w = !1, wx.showModal({
            title: "提醒",
            content: "地址为必填！",
            showCancel: !1
        }), !1;
        if ("选择日期" == u && 2 == e.data.datas.pro_flag_data) return w = !1, wx.showModal({
            title: "提醒",
            content: "请选择日期！",
            showCancel: !1
        }), !1;
        if ("选择时间" == l && 2 == e.data.datas.pro_flag_time) return w = !1, wx.showModal({
            title: "提醒",
            content: "请选择时间！",
            showCancel: !1
        }), !1;
        var x = e.data.pagedata;
        for (r = 0; r < x.length; r++) if (1 == x[r].ismust && "" == x[r].val) return w = !1, 
        wx.showModal({
            title: "提醒",
            content: x[r].name + "为必填项！",
            showCancel: !1
        }), !1;
        if (console.log(d), console.log(e.data.hjjg), console.log(e.data.dkmoney), console.log(e.data.dkscore), 
        console.log(e.data.k), w) {
            var v = e.data.orderid;
            v ? d <= e.data.mymoney ? e.pay1(v) : e.pay2(v) : wx.request({
                url: e.data.baseurl + "doPagecreateorder",
                data: {
                    openid: o,
                    num: JSON.stringify(s),
                    id: h,
                    hjjg: e.data.hjjg,
                    zhifu: d,
                    order: f,
                    pro_name: g,
                    pro_tel: p,
                    pro_address: m,
                    pro_txt: y,
                    chuydate: u,
                    chuytime: l,
                    yhqid: _,
                    dkscore: e.data.dkscore,
                    dkmoney: e.data.dkmoney,
                    pagedata: JSON.stringify(x),
                    types: "yuyue",
                    uniacid: e.data.uniacid
                },
                header: {
                    "content-type": "application/json"
                },
                success: function(a) {
                    if ("1" == a.data.data.errcode) wx.showModal({
                        title: a.data.data.err,
                        content: "请重新下单",
                        showCancel: !1
                    }); else if ("3" == a.data.data.errcode) wx.showModal({
                        title: a.data.data.err,
                        content: "当前库存为" + a.data.data.kc + "件",
                        showCancel: !1
                    }); else {
                        var t = a.data.data;
                        e.setData({
                            orderid: t
                        }), d <= e.data.mymoney ? e.pay1(t) : e.pay2(t);
                    }
                }
            });
        }
    },
    pay1: function(t) {
        var e = this;
        wx.showModal({
            title: "请注意",
            content: "您将使用余额支付" + e.data.sfje + "元",
            success: function(a) {
                a.confirm && (e.payover_do(t), e.payover_fxs(t), wx.showLoading({
                    title: "下单中...",
                    mask: !0
                }));
            }
        });
    },
    pay2: function(t) {
        var e = this, a = wx.getStorageSync("openid"), d = e.data.sfje;
        wx.request({
            url: e.data.baseurl + "doPagebeforepay",
            data: {
                openid: a,
                price: d,
                order_id: t,
                types: "yuyue",
                formId: e.data.formId,
                uniacid: e.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                1 == a.data.data.errs && wx.showModal({
                    title: "支付失败",
                    content: a.data.data.return_msg,
                    showCancel: !1
                });
                -1 != [ 1, 2, 3, 4 ].indexOf(a.data.data.err) && wx.showModal({
                    title: "支付失败",
                    content: a.data.data.message,
                    showCancel: !1
                }), 0 == a.data.data.err && (console.log("调起支付"), console.log(t), wx.request({
                    url: e.data.baseurl + "doPagesavePrepayid",
                    data: {
                        types: "yuyue",
                        order_id: t,
                        prepayid: a.data.data.package,
                        uniacid: e.data.uniacid
                    },
                    success: function(a) {
                        console.log(a);
                    },
                    fail: function(a) {
                        console.log(a);
                    }
                }), wx.requestPayment({
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
                                e.payover_fxs(t), wx.showToast({
                                    title: "购买成功！",
                                    icon: "success",
                                    success: function() {
                                        setTimeout(function() {
                                            wx.navigateBack({
                                                delta: 9
                                            }), wx.navigateTo({
                                                url: "/sudu8_page/sudu8_page/order/order"
                                            });
                                        }, 1500);
                                    }
                                });
                            }
                        });
                    },
                    fail: function(a) {
                        console.log("fail");
                    },
                    complete: function(a) {
                        console.log("complete");
                    }
                }));
            }
        });
    },
    payover_do: function(a) {
        var t = wx.getStorageSync("openid"), e = this.data.sfje;
        wx.request({
            url: this.data.baseurl + "doPagepaynotify",
            data: {
                out_trade_no: a,
                openid: t,
                payprice: e,
                types: "yuyue",
                flag: 0,
                formId: this.data.formId,
                uniacid: this.data.uniacid
            },
            success: function(a) {
                console.log(a), wx.showToast({
                    title: "购买成功！",
                    icon: "success",
                    success: function() {
                        setTimeout(function() {
                            wx.navigateBack({
                                delta: 9
                            }), wx.navigateTo({
                                url: "/sudu8_page/order/order"
                            });
                        }, 1500);
                    }
                });
            }
        });
    },
    payover_fxs: function(a) {
        var t = wx.getStorageSync("openid"), e = wx.getStorageSync("fxsid");
        wx.request({
            url: this.data.baseurl + "doPagepayoverFxs",
            data: {
                openid: t,
                order_id: a,
                fxsid: e,
                types: "yuyue",
                uniacid: this.data.uniacid
            },
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    passd: function() {
        var t = this, e = t.data.order;
        wx.showModal({
            title: "提醒",
            content: "亲，您确定要删除该订单？",
            success: function(a) {
                a.confirm && wx.request({
                    url: t.data.baseurl + "doPagedpass",
                    data: {
                        order: e,
                        uniacid: t.data.uniacid
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        1 == a.data.data && wx.showToast({
                            title: "订单取消成功",
                            icon: "success",
                            duration: 2e3,
                            success: function() {
                                wx.redirectTo({
                                    url: "/sudu8_page/order/order?type=9"
                                });
                            }
                        });
                    }
                });
            }
        });
    },
    bindDateChange2: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            chuydate: a.detail.value
        });
    },
    bindTimeChange2: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            chuytime: a.detail.value
        });
    },
    getmoney: function(a) {
        var t = this, e = a.currentTarget.id, d = a.currentTarget.dataset.index, o = d.coupon.pay_money, n = t.data.hjjg, s = t.data.sfje;
        if (1 * n < 1 * o) wx.showModal({
            title: "提示",
            content: "价格未满" + o + "元，不可使用该优惠券！",
            showCancel: !1
        }); else {
            var i = (100 * s - 100 * e) / 100;
            t.setData({
                ischecked: !1
            }), t.switchChange({
                detail: {
                    value: !1
                }
            }), s = parseFloat(i.toPrecision(12)) + parseFloat(t.data.dkmoney), console.log(s), 
            s < 0 && (s = 0), t.setData({
                jqdjg: e,
                yhqid: d.id,
                sfje: s,
                oldsfje: n,
                yhqmoney_s: e,
                zf_type: t.data.mymoney >= s ? 0 : 1
            }), t.hideModal();
        }
    },
    qxyh: function() {
        var a = this.data.jqdjg;
        "请选择" == a && (a = 0);
        this.data.sfje;
        this.hideModal(), this.setData(_defineProperty({
            jqdjg: 0,
            yhqid: 0,
            sfje: huany
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
    },
    switchChange: function(a) {
        var n = this, t = a.detail.value, e = wx.getStorageSync("openid"), s = n.data.sfje, i = 0, d = "table" == n.data.type ? n.data.select_num : n.data.chooseNum;
        1 == t ? wx.request({
            url: n.data.baseurl + "doPagescoreDeduction",
            data: {
                id: n.data.id,
                num: d,
                openid: e,
                is_more: 1,
                uniacid: n.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                var t = a.data.data;
                i = t.moneycl, console.log(i);
                var e = t.gzmoney, d = t.gzscore;
                if (s < i && (i = parseInt(s)), 0 == i) var o = 0; else o = i * d / e;
                s = Math.round(100 * (s - i)) / 100, n.setData({
                    sfje: s,
                    dkmoney: i,
                    dkscore: o,
                    jifen_u: 1,
                    zf_type: n.data.mymoney >= s ? 0 : 1
                });
            }
        }) : (s = parseFloat(s) + parseFloat(n.data.dkmoney), n.setData({
            dkmoney: 0,
            dkscore: 0,
            jifen_u: 0,
            zf_type: n.data.mymoney >= s ? 0 : 1
        }));
    },
    bindInputChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        d[e].val = t, this.setData({
            pagedata: d
        });
    },
    bindPickerChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log();
        var o = d[e].tp_text[t];
        d[e].val = o, this.setData({
            pagedata: d
        });
    },
    bindDateChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log(d), d[e].val = t, this.setData({
            pagedata: d
        });
    },
    bindTimeChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log(d), d[e].val = t, this.setData({
            pagedata: d
        });
    },
    checkboxChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log(d), d[e].val = t, this.setData({
            pagedata: d
        });
    },
    radioChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        console.log(d), d[e].val = t, this.setData({
            pagedata: d
        });
    },
    hxmmInput: function(a) {
        this.setData({
            hxmm: a.detail.value
        });
    },
    hxmmpass: function() {
        var e = this, a = e.data.hxmm, d = e.data.datas;
        a ? wx.request({
            url: e.data.baseurl + "hxmm",
            data: {
                hxmm: a,
                order_id: d.order_id,
                types: "yuyue",
                uniacid: e.data.uniacid
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
                        d.flag = 2, e.setData({
                            datas: d,
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