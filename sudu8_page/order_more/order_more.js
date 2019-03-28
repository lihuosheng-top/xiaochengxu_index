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
        pd_val: [],
        zf_type: null,
        money: 0,
        zf_money: 0,
        isview: 0,
        again: 0,
        mraddress: ""
    },
    onPullDownRefresh: function() {
        this.getinfos(), this.refreshSessionkey();
    },
    onLoad: function(a) {
        var t = this;
        t.refreshSessionkey(), wx.setNavigationBarTitle({
            title: t.data.title
        }), a.again && t.setData({
            again: 1
        }), wx.getSystemInfo({
            success: function(a) {
                t.setData({
                    h: a.windowHeight
                });
            }
        });
        var e = a.addressid, d = a.orderid;
        t.setData({
            addressid: e,
            orderid: d
        });
        var n = 0;
        a.fxsid && (n = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                console.log(a), t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), app.util(t.getinfos, n, t.data.uniacid);
    },
    makePhoneCallC: function(a) {
        var t = a.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    getinfos: function() {
        var s = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var t = a.data, e = s.data.addressid, o = s.data.orderid;
                s.setData({
                    openid: t
                }), e ? s.getmraddresszd(e) : s.getmraddress(), wx.request({
                    url: s.data.baseurl + "dopageglobaluserinfo",
                    data: {
                        uniacid: s.data.uniacid,
                        openid: a.data
                    },
                    success: function(a) {
                        var t = a.data.data;
                        t.nickname && t.avatar || s.setData({
                            isview: 1
                        }), s.setData({
                            globaluser: a.data.data
                        });
                    }
                }), null != o && "undefined" != o ? wx.request({
                    url: s.data.baseurl + "dopageduoorderinfo",
                    data: {
                        uniacid: s.data.uniacid,
                        orderid: o
                    },
                    success: function(a) {
                        for (var t = a.data.data.jsondata, e = 0, d = 0; d < t.length; d++) {
                            var n = t[d].num, i = t[d].proinfo.price;
                            e += Math.round(1 * i * (1 * n) * 100) / 100;
                        }
                        s.setData({
                            jsdata: a.data.data.jsondata,
                            jsprice: e,
                            sfje: e,
                            px: 1,
                            orderid: o,
                            nav: a.data.data.nav,
                            mraddress: a.data.data.address_info
                        }), wx.request({
                            url: s.data.baseurl + "doPgaegetmoneyoff",
                            data: {
                                uniacid: s.data.uniacid
                            },
                            success: function(a) {
                                for (var t = a.data.data, e = "", d = 0; d < t.length; d++) d == t.length - 1 ? e += "满" + t[d].reach + "减" + t[d].del : e += "满" + t[d].reach + "减" + t[d].del + "，";
                                s.setData({
                                    moneyoff: t,
                                    moneyoffstr: t ? e : ""
                                }), s.getmyinfo();
                            }
                        });
                    }
                }) : wx.getStorage({
                    key: "jsdata",
                    success: function(a) {
                        for (var t = a.data, e = 0, d = 0; d < t.length; d++) {
                            var n = t[d].num, i = t[d].proinfo.price;
                            e += Math.round(1 * i * (1 * n) * 100) / 100;
                        }
                        s.setData({
                            jsdata: a.data,
                            jsprice: e,
                            sfje: e,
                            px: 0
                        }), wx.request({
                            url: s.data.baseurl + "doPgaegetmoneyoff",
                            data: {
                                uniacid: s.data.uniacid
                            },
                            success: function(a) {
                                for (var t = a.data.data, e = "", d = 0; d < t.length; d++) d == t.length - 1 ? e += "满" + t[d].reach + "减" + t[d].del : e += "满" + t[d].reach + "减" + t[d].del + "，";
                                s.setData({
                                    moneyoff: t,
                                    moneyoffstr: t ? e : ""
                                }), s.getmyinfo();
                            }
                        });
                    }
                });
            }
        });
    },
    huoqusq: function() {
        var r = this, c = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(a) {
                var t = a.userInfo, e = t.nickName, d = t.avatarUrl, n = t.gender, i = t.province, o = t.city, s = t.country;
                wx.request({
                    url: r.data.baseurl + "doPageUseupdate",
                    data: {
                        uniacid: r.data.uniacid,
                        openid: c,
                        nickname: e,
                        avatarUrl: d,
                        gender: n,
                        province: i,
                        city: o,
                        country: s
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        wx.setStorageSync("golobeuid", a.data.data.id), wx.setStorageSync("golobeuser", a.data.data), 
                        r.setData({
                            isview: 0
                        }), wx.navigateBack();
                    }
                });
            },
            fail: function() {
                app.selfinfoget(r.chenggfh, r.data.uniacid);
            }
        });
    },
    getmyinfo: function() {
        var d = this, e = wx.getStorageSync("openid"), n = (d.data.jsdata, d.data.sfje), i = d.data.moneyoff;
        wx.request({
            url: d.data.baseurl + "doPageMymoney",
            data: {
                uniacid: d.data.uniacid,
                openid: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                if (d.setData({
                    money: parseFloat(a.data.data.money),
                    score: parseFloat(a.data.data.score)
                }), wx.request({
                    url: d.data.baseurl + "doPagemycoupon",
                    data: {
                        uniacid: d.data.uniacid,
                        openid: e
                    },
                    success: function(a) {
                        console.log(a), d.setData({
                            couponlist: a.data.data
                        });
                    }
                }), console.log(i), i) for (var t = i.length - 1; 0 <= t; t--) if (n >= parseFloat(i[t].reach)) {
                    n -= parseFloat(i[t].del);
                    break;
                }
                console.log(n), wx.request({
                    url: d.data.baseurl + "dopageyunfeiget",
                    data: {
                        uniacid: d.data.uniacid
                    },
                    success: function(a) {
                        var t = a.data.data, e = 0;
                        e = n >= t.byou ? 0 : t.yfei, n = Math.round(100 * (1 * n + 1 * e)) / 100, console.log("asd" + d.data.money), 
                        d.setData({
                            datas: t,
                            yunfei: e,
                            sfje: n,
                            zf_type: d.data.money >= n ? 0 : 1,
                            zf_money: d.data.money >= n ? n : Math.round(100 * (n - d.data.money)) / 100,
                            pagedata: t.forms,
                            formdescs: t.formdescs
                        });
                    }
                });
            }
        });
    },
    switchChange: function(a) {
        for (var i = this, t = a.detail.value, e = wx.getStorageSync("openid"), d = i.data.jsdata, o = i.data.sfje, s = 0, n = [], r = 0; r < d.length; r++) {
            var c = {};
            c.num = d[r].num, c.pvid = d[r].pvid, n.push(c);
        }
        if (1 == t) wx.request({
            url: i.data.baseurl + "doPagesetgwcscore",
            data: {
                uniacid: i.data.uniacid,
                jsdata: JSON.stringify(n),
                openid: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                var t = a.data.data;
                s = t.moneycl;
                var e = t.gzmoney, d = t.gzscore;
                o < s && (s = parseInt(o));
                var n = s * d / e;
                o = Math.round(100 * (o - s)) / 100, i.setData({
                    sfje: o,
                    szmoney: s,
                    dkmoney: s,
                    dkscore: n,
                    zf_type: i.data.money >= o ? 0 : 1,
                    zf_money: i.data.money >= o ? o : Math.round(100 * (o - i.data.money)) / 100,
                    jifen_u: 1
                });
            }
        }); else {
            s = i.data.szmoney;
            o += s, i.setData({
                sfje: o,
                zf_type: i.data.money >= o ? 0 : 1,
                zf_money: i.data.money >= o ? o : Math.round(100 * (o - i.data.money)) / 100,
                szmoney: 0,
                dkmoney: 0,
                dkscore: 0,
                jifen_u: 0
            });
        }
    },
    nav: function(a) {
        var t = this, e = parseInt(a.detail.value), d = 0, n = t.data.yunfei;
        1 == e ? d -= n : d = n;
        a = {
            detail: {
                value: !1
            }
        };
        t.setData({
            ischecked: !1
        }), t.switchChange(a);
        var i = Math.round(100 * (t.data.sfje - d)) / 100;
        t.setData({
            nav: e,
            yfjian: 1 == e ? 0 : n,
            sfje: i,
            zf_type: t.data.money >= i ? 0 : 1,
            zf_money: t.data.money >= i ? i : Math.round(100 * (i - t.data.money)) / 100
        });
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
    qxyh: function() {
        var a, t = this, e = t.data.jqdjg;
        t.data.yhdq;
        "请选择" == e && (e = 0);
        var d = (100 * t.data.sfje + 100 * e) / 100;
        t.hideModal(), t.setData((_defineProperty(a = {
            jqdjg: 0,
            yhqid: 0,
            sfje: d,
            zf_type: t.data.money >= d ? 0 : 1,
            zf_money: t.data.money >= d ? d : Math.round(100 * (d - t.data.money)) / 100
        }, "jqdjg", "请选择"), _defineProperty(a, "yhdq", 0), a));
    },
    getmoney: function(a) {
        var t = this, e = a.currentTarget.id, d = a.currentTarget.dataset.index, n = d.coupon.pay_money, i = t.data.sfje;
        i = 1 * i + 1 * t.data.yhdq;
        var o = t.data.yhqid;
        if (0 == o || d.id != o) if (1 * i - parseFloat(t.data.yunfei) + parseFloat(t.data.yfjian) < 1 * n) wx.showModal({
            title: "提示",
            content: "价格未满" + n + "元，不可使用该优惠券！",
            showCancel: !1
        }); else {
            var s = Math.floor(100 * (1 * i - 1 * e)) / 100;
            s < 0 && (s = 0), t.setData({
                jqdjg: e,
                yhqid: d.id,
                sfje: s,
                zf_type: t.data.money >= s ? 0 : 1,
                zf_money: t.data.money >= s ? s : Math.round(100 * (s - t.data.money)) / 100,
                oldsfje: i,
                yhdq: e
            }), t.hideModal();
        }
    },
    submit: function(a) {
        var t = this, e = a.detail.formId;
        t.setData({
            formId: e
        });
        var d = t.data.datas, n = t.data.mraddress;
        if (0 < d.formset) {
            if (1 == t.data.nav && (null == n || !n)) return wx.showModal({
                title: "提示",
                content: "请先选择/设置收货地址！",
                showCancel: !1
            }), !1;
            t.formSubmit();
        } else {
            if (1 == t.data.nav && (null == n || !n)) return wx.showModal({
                title: "提示",
                content: "请先选择/设置收货地址！",
                showCancel: !1
            }), !1;
            t.doshend();
        }
    },
    doshend: function(a) {
        for (var e = this, t = e.data.jsdata, d = [], n = 0; n < t.length; n++) {
            var i = {};
            i.baseinfo = t[n].baseinfo.id, i.proinfo = t[n].proinfo.id, i.num = t[n].num, i.pvid = t[n].pvid, 
            i.one_bili = t[n].one_bili, i.two_bili = t[n].two_bili, i.three_bili = t[n].three_bili, 
            t[n].buy_type ? i.id = 0 : i.id = t[n].id, d.push(i);
        }
        var o = wx.getStorageSync("openid"), s = e.data.yhqid, r = e.data.sfje, c = e.data.nav, u = e.data.yunfei, l = e.data.yfjian, f = e.data.dkscore, g = (e.data.dkmoney, 
        e.data.mraddress), h = e.data.mjly;
        if (u -= l, console.log(g), console.log(c), !(1 != c || null != g && g)) return wx.showModal({
            title: "提示",
            content: "请先选择/设置收货地址！",
            showCancel: !1
        }), !1;
        if (2 == c) var p = ""; else p = g.id;
        var y = e.data.px;
        if (console.log(t), console.log(u), console.log(f), 0 == y) wx.request({
            url: e.data.baseurl + "dopagecreateorder",
            header: {
                "content-type": "application/json"
            },
            data: {
                uniacid: e.data.uniacid,
                types: "duo",
                openid: o,
                jsdata: JSON.stringify(d),
                couponid: s,
                price: r,
                dkscore: f,
                address: p,
                mjly: h,
                nav: c,
                formid: a,
                yunfei: u
            },
            success: function(a) {
                if (console.log(a), "1" == a.data.data.errcode) wx.showModal({
                    title: a.data.data.err,
                    content: "请重新下单",
                    showCancel: !1
                }); else if ("2" == a.data.data.errcode) wx.showModal({
                    title: a.data.data.err,
                    content: a.data.data.title + "还剩:" + a.data.data.kc
                }); else if ("4" == a.data.data.errcode) wx.showModal({
                    title: "提示",
                    content: "该商品已下架",
                    showCancel: !1,
                    success: function() {
                        wx.redirectTo({
                            url: "/sudu8_page/index/index"
                        });
                    }
                }); else if ("3" == a.data.data.errcode) {
                    var t = a.data.data.order_id;
                    e.setData({
                        orderid: t
                    }), console.log(111), console.log("orderid:" + t), r <= e.data.money ? e.pay1(t) : e.pay2(t);
                }
            }
        }); else {
            var m = e.data.orderid;
            wx.request({
                url: e.data.baseurl + "doPageduoorderchangegg",
                header: {
                    "content-type": "application/json"
                },
                data: {
                    uniacid: e.data.uniacid,
                    orderid: m,
                    couponid: s,
                    price: r,
                    dkscore: f,
                    openid: o,
                    address: p,
                    mjly: h,
                    nav: c
                },
                success: function(a) {
                    r <= e.data.money ? e.pay1(m) : e.pay2(m);
                }
            });
        }
    },
    mjly: function(a) {
        var t = a.detail.value;
        this.setData({
            mjly: t
        });
    },
    bindInputChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        d[e].val = t, this.setData({
            pagedata: d
        });
    },
    bindPickerChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata, n = d[e].tp_text[t];
        d[e].val = n, this.setData({
            pagedata: d
        });
    },
    bindDateChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        d[e].val = t, this.setData({
            pagedata: d
        });
    },
    bindTimeChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        d[e].val = t, this.setData({
            pagedata: d
        });
    },
    checkboxChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        d[e].val = t, this.setData({
            pagedata: d
        });
    },
    radioChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, d = this.data.pagedata;
        d[e].val = t, this.setData({
            pagedata: d
        });
    },
    formSubmit: function(a) {
        for (var e = this, t = (e.data.datas, !0), d = e.data.pagedata, n = 0; n < d.length; n++) {
            if (1 == d[n].ismust && "" == d[n].val) return t = !1, wx.showModal({
                title: "提醒",
                content: d[n].name + "为必填项！",
                showCancel: !1
            }), !1;
            if (5 == d[n].type && 0 < d[n].z_val.length) for (var i = 0; i < d[n].z_val.length; i++) {
                var o = d[n].z_val[i].substr(d[n].z_val[i].indexOf("/upimages"));
                d[n].z_val[i] = o;
            }
        }
        t && wx.request({
            url: e.data.baseurl + "doPageFormval",
            data: {
                uniacid: e.data.uniacid,
                id: 0,
                pagedata: JSON.stringify(d),
                types: "showOrder"
            },
            cachetime: "30",
            success: function(a) {
                var t = a.data.data.id;
                wx.showModal({
                    title: "提示",
                    content: a.data.data.con,
                    showCancel: !1,
                    success: function(a) {
                        e.doshend(t);
                    }
                });
            }
        });
    },
    choiceimg1111: function(a) {
        var i = this, t = 0, o = i.data.zhixin, s = a.currentTarget.dataset.index, r = i.data.pagedata, e = r[s].val, d = r[s].tp_text[0];
        e ? t = e.length : (t = 0, e = []);
        var n = d - t, c = i.data.baseurl + "wxupimg", u = i.data.pd_val;
        wx.chooseImage({
            count: n,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                o = !0, i.setData({
                    zhixin: o
                }), wx.showLoading({
                    title: "图片上传中"
                });
                var t = a.tempFilePaths;
                e = e.concat(t), r[s].val = e, i.setData({
                    pagedata: r
                });
                var d = 0, n = t.length;
                !function e() {
                    wx.uploadFile({
                        url: c,
                        filePath: t[d],
                        name: "file",
                        success: function(a) {
                            var t = a.data;
                            u.push(t), r[s].z_val = u, i.setData({
                                pagedata: r,
                                pd_val: u
                            }), ++d < n ? e() : (o = !1, i.setData({
                                zhixin: o
                            }), wx.hideLoading());
                        }
                    });
                }();
            }
        });
    },
    delimg: function(a) {
        var t = a.currentTarget.dataset.index, e = a.currentTarget.dataset.id, d = this.data.pagedata, n = d[t].val;
        n.splice(e, 1), 0 == n.length && (n = ""), d[t].val = n, this.setData({
            pagedata: d
        });
    },
    onPreviewImage: function(a) {
        app.util.showImage(a);
    },
    namexz: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.pagedata[t], d = [], n = 0; n < e.tp_text.length; n++) {
            var i = {};
            i.keys = e.tp_text[n], i.val = 1, d.push(i);
        }
        this.setData({
            ttcxs: 1,
            formindex: t,
            xx: d,
            xuanz: 0,
            lixuanz: -1
        }), this.riqi();
    },
    riqi: function() {
        for (var a = new Date(), t = new Date(a.getTime()), e = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(), d = this.data.xx, n = 0; n < d.length; n++) d[n].val = 1;
        this.setData({
            xx: d
        }), this.gettoday(e);
        var i = [], o = [], s = new Date();
        for (n = 0; n < 5; n++) {
            var r = new Date(s.getTime() + 24 * n * 3600 * 1e3), c = r.getFullYear(), u = r.getMonth() + 1, l = r.getDate(), f = u + "月" + l + "日", g = c + "-" + u + "-" + l;
            i.push(f), o.push(g);
        }
        this.setData({
            arrs: i,
            fallarrs: o,
            today: e
        });
    },
    xuanzd: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.fallarrs[t], d = this.data.xx, n = 0; n < d.length; n++) d[n].val = 1;
        this.setData({
            xuanz: t,
            today: e,
            lixuanz: -1,
            xx: d
        }), this.gettoday(e);
    },
    goux: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            lixuanz: t
        });
    },
    gettoday: function(a) {
        var n = this, t = n.data.id, e = n.data.formindex, i = n.data.xx;
        wx.request({
            url: n.data.baseurl + "doPageDuzhan",
            data: {
                uniacid: n.data.uniacid,
                id: t,
                types: "showArt",
                days: a,
                pagedatekey: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                for (var t = a.data.data, e = 0; e < t.length; e++) i[t[e]].val = 2;
                var d = 0;
                t.length == i.length && (d = 1), n.setData({
                    xx: i,
                    isover: d
                });
            }
        });
    },
    save: function() {
        var a = this, t = a.data.today, e = a.data.xx, d = a.data.lixuanz;
        if (-1 == d) return wx.showModal({
            title: "提现",
            content: "请选择预约的选项",
            showCancel: !1
        }), !1;
        var n = "已选择" + t + "，" + e[d].keys, i = a.data.pagedata, o = a.data.formindex;
        i[o].val = n, i[o].days = t, i[o].indexkey = o, i[o].xuanx = d, a.setData({
            ttcxs: 0,
            pagedata: i
        });
    },
    quxiao: function() {
        this.setData({
            ttcxs: 0
        });
    },
    weixinadd: function() {
        var o = this;
        wx.chooseAddress({
            success: function(a) {
                for (var t = a.provinceName + " " + a.cityName + " " + a.countyName + " " + a.detailInfo, e = a.userName, d = a.telNumber, n = o.data.pagedata, i = 0; i < n.length; i++) 0 == n[i].type && 2 == n[i].tp_text[0] && (n[i].val = e), 
                0 == n[i].type && 3 == n[i].tp_text[0] && (n[i].val = d), 0 == n[i].type && 4 == n[i].tp_text[0] && (n[i].val = t);
                o.setData({
                    myname: e,
                    mymobile: d,
                    myaddress: t,
                    pagedata: n
                });
            }
        });
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
            url: e.data.baseurl + "dopagebeforepay",
            data: {
                uniacid: e.data.uniacid,
                openid: a,
                price: d,
                order_id: t,
                types: "duo",
                formId: e.data.formId
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                console.log(a);
                -1 != [ 1, 2, 3, 4 ].indexOf(a.data.data.err) && wx.showModal({
                    title: "支付失败",
                    content: a.data.data.message,
                    showCancel: !1
                }), 0 == a.data.data.err && (console.log("调起支付"), wx.request({
                    url: e.data.baseurl + "doPagesavePrepayid",
                    data: {
                        uniacid: e.data.uniacid,
                        types: "duo",
                        order_id: t,
                        prepayid: a.data.data.package
                    },
                    success: function(a) {
                        console.log("prepayid"), console.log(a);
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
                            mask: !0,
                            duration: 3e3,
                            success: function(a) {
                                e.payover_fxs(t), wx.navigateBack({
                                    delta: 9
                                }), wx.navigateTo({
                                    url: "/sudu8_page/order_more_list/order_more_list"
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
    payover_fxs: function(a) {
        var t = wx.getStorageSync("openid"), e = wx.getStorageSync("fxsid");
        wx.request({
            url: this.data.baseurl + "doPagepayoverFxs",
            data: {
                uniacid: this.data.uniacid,
                openid: t,
                order_id: a,
                fxsid: e
            },
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    payover_do: function(a) {
        var t = wx.getStorageSync("openid"), e = this.data.sfje;
        wx.request({
            url: this.data.baseurl + "dopagepaynotify",
            data: {
                uniacid: this.data.uniacid,
                out_trade_no: a,
                openid: t,
                payprice: e,
                types: "duo",
                flag: 0,
                formId: this.data.formId
            },
            success: function(a) {
                console.log(a), "失败" == a.data.data.message ? wx.showToast({
                    title: "付款失败, 请刷新后重新付款！",
                    icon: "none",
                    mask: !0,
                    success: function() {
                        setTimeout(function() {
                            wx.navigateBack({
                                delta: 9
                            }), wx.navigateTo({
                                url: "/sudu8_page/order_more_list/order_more_list"
                            });
                        }, 1500);
                    }
                }) : wx.showToast({
                    title: "购买成功！",
                    icon: "success",
                    mask: !0,
                    success: function() {
                        setTimeout(function() {
                            wx.navigateBack({
                                delta: 9
                            }), wx.navigateTo({
                                url: "/sudu8_page/order_more_list/order_more_list"
                            });
                        }, 1500);
                    }
                });
            }
        });
    },
    refreshSessionkey: function() {
        var t = this;
        wx.login({
            success: function(a) {
                wx.request({
                    url: t.data.baseurl + "doPagegetNewSessionkey",
                    data: {
                        uniacid: t.data.uniacid,
                        code: a.code
                    },
                    success: function(a) {
                        console.log(a), t.setData({
                            newSessionKey: a.data.data
                        });
                    }
                });
            }
        });
    },
    getPhoneNumber1: function(a) {
        var d = this, t = a.detail.iv, e = a.detail.encryptedData;
        "getPhoneNumber:ok" == a.detail.errMsg ? wx.checkSession({
            success: function() {
                wx.request({
                    url: d.data.baseurl + "doPagejiemiNew",
                    data: {
                        uniacid: d.data.uniacid,
                        newSessionKey: d.data.newSessionKey,
                        iv: t,
                        encryptedData: e
                    },
                    success: function(a) {
                        if (a.data.data) {
                            for (var t = d.data.pagedata, e = 0; e < t.length; e++) 0 == t[e].type && 5 == t[e].tp_text[0] && (t[e].val = a.data.data);
                            console.log(t), d.setData({
                                wxmobile: a.data.data,
                                pagedata: t
                            });
                        } else wx.showModal({
                            title: "提示",
                            content: "sessionKey已过期，请下拉刷新！"
                        });
                    },
                    fail: function(a) {
                        console.log(a);
                    }
                });
            },
            fail: function() {
                wx.showModal({
                    title: "提示",
                    content: "sessionKey已过期，请下拉刷新！"
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "请先授权获取您的手机号！",
            showCancel: !1
        });
    }
});