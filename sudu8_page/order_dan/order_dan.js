var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        nav: 1,
        num: 1,
        jifen_u: 0,
        yunfei: 0,
        yfjian: 0,
        jqdjg: "请选择",
        yhqid: 0,
        yhdq: 0,
        dkmoney: 0,
        dkscore: 0,
        zf_type: null,
        pagedata: {},
        imgcount_xz: 0,
        pagedata_set: [],
        xuanz: 0,
        lixuanz: -1,
        ttcxs: 0,
        chooseNum: 0,
        thumb: "",
        id: 0,
        mymoney: 0,
        showhx: 0,
        isview: 0,
        pd_val: []
    },
    onLoad: function(a) {
        var t = this;
        a.id && (t.data.id = a.id), t.refreshSessionkey();
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
        }), app.util(t.getinfos, n, t.data.uniacid);
    },
    getinfos: function() {
        var n = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var e = a.data, t = n.data.addressid, d = n.data.orderid;
                n.setData({
                    openid: e
                }), t ? n.getmraddresszd(t) : n.getmraddress(), wx.request({
                    url: n.data.baseurl + "dopageglobaluserinfo",
                    data: {
                        uniacid: n.data.uniacid,
                        openid: a.data
                    },
                    success: function(a) {
                        var t = a.data.data;
                        t.nickname && t.avatar || n.setData({
                            isview: 1
                        }), n.setData({
                            globaluser: a.data.data
                        });
                    }
                }), wx.request({
                    url: n.data.baseurl + "doPageshowPro11",
                    data: {
                        uniacid: n.data.uniacid,
                        openid: e,
                        id: n.data.id,
                        orderid: d || ""
                    },
                    success: function(a) {
                        if (console.log(99999999999999), console.log(a), 0 == a.data.data.pro_xz) var t = 1; else t = a.data.data.pro_xz - a.data.data.my_num;
                        n.setData({
                            mymoney: parseFloat(a.data.data.userinfo.money),
                            myscore: parseFloat(a.data.data.userinfo.score),
                            thumb: a.data.data.thumb,
                            title: a.data.data.title,
                            datass: a.data.data,
                            dprice: a.data.data.price,
                            hjjg: a.data.data.order_num ? a.data.data.price * a.data.data.order_num : a.data.data.price,
                            my_num: a.data.data.my_num,
                            xg_num: a.data.data.pro_xz,
                            shengyu: a.data.data.pro_kc,
                            xg_buy: t,
                            num: a.data.data.order_num ? a.data.data.order_num : 1,
                            pagedata: a.data.data.forms,
                            nav: d && "2" == a.data.data.nav ? 2 : 1,
                            formdescs: a.data.data.formdescs
                        }), console.log("我的购买数" + n.data.my_num), wx.setNavigationBarTitle({
                            title: n.data.title
                        }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), 
                        wx.request({
                            url: n.data.baseurl + "doPagemycoupon",
                            data: {
                                uniacid: n.data.uniacid,
                                openid: e
                            },
                            success: function(a) {
                                console.log(a), n.setData({
                                    couponlist: a.data.data
                                });
                            }
                        }), wx.request({
                            url: n.data.baseurl + "doPagegetmoneyoff",
                            data: {
                                uniacid: n.data.uniacid
                            },
                            success: function(a) {
                                var t = a.data.data;
                                console.log(t);
                                for (var e = "", d = 0; d < t.length; d++) d == t.length - 1 ? e += "满" + t[d].reach + "减" + t[d].del : e += "满" + t[d].reach + "减" + t[d].del + "，";
                                n.setData({
                                    moneyoff: t,
                                    moneyoffstr: t ? e : ""
                                }), n.getmyinfo();
                            }
                        });
                    }
                });
            }
        });
    },
    getmyinfo: function() {
        var d = this, a = (wx.getStorageSync("openid"), d.data.moneyoff), n = d.data.hjjg;
        if (a) for (var t = a.length - 1; 0 <= t; t--) if (n >= parseFloat(a[t].reach)) {
            n -= parseFloat(a[t].del);
            break;
        }
        wx.request({
            url: d.data.baseurl + "doPageyunfeiget",
            data: {
                uniacid: d.data.uniacid
            },
            success: function(a) {
                console.log(a);
                var t = a.data.data, e = 0;
                e = n >= t.byou ? 0 : t.yfei, n = Math.round(100 * (1 * n + 1 * e)) / 100, d.setData({
                    datas: t,
                    yunfei: e,
                    sfje: n,
                    zf_type: d.data.mymoney >= n ? 0 : 1,
                    zf_money: d.data.mymoney >= n ? n : Math.round(100 * (n - d.data.mymoney)) / 100
                });
            }
        });
    },
    switchChange: function(a) {
        var i = this, t = a.detail.value, e = wx.getStorageSync("openid"), o = i.data.sfje, s = 0;
        if (1 == t) wx.request({
            url: i.data.baseurl + "doPagescoreDeduction",
            data: {
                id: i.data.id,
                num: i.data.num,
                openid: e,
                uniacid: i.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                var t = a.data;
                s = t.moneycl;
                var e = t.gzmoney, d = t.gzscore;
                o < s && (s = parseInt(o));
                var n = 0;
                0 != e && (n = s * d / e), o = Math.round(100 * (o - s)) / 100, i.setData({
                    sfje: o,
                    dkmoney: s,
                    dkscore: n,
                    zf_type: i.data.mymoney >= o ? 0 : 1,
                    zf_money: i.data.mymoney >= o ? o : Math.round(100 * (o - i.data.mymoney)) / 100,
                    jifen_u: 1
                });
            }
        }); else {
            console.log(i.data.dkmoney);
            s = i.data.dkmoney;
            o += s, i.setData({
                sfje: o,
                zf_type: i.data.mymoney >= o ? 0 : 1,
                zf_money: i.data.mymoney >= o ? o : Math.round(100 * (o - i.data.mymoney)) / 100,
                dkmoney: 0,
                dkscore: 0,
                jifen_u: 0
            });
        }
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.util.redirectto(t, e);
    },
    onShow: function() {},
    onShareAppMessage: function() {},
    nav: function(a) {
        var t = this, e = parseInt(a.detail.value), d = 0, n = t.data.yunfei;
        a = {
            detail: {
                value: !1
            }
        };
        t.setData({
            ischecked: !1
        }), t.switchChange(a), 1 == e ? d -= n : d = n;
        var i = Math.round(100 * (t.data.sfje - d)) / 100;
        t.setData({
            nav: e,
            yfjian: 1 == e ? 0 : n,
            sfje: i,
            zf_type: t.data.mymoney >= i ? 0 : 1,
            zf_money: t.data.mymoney >= i ? i : Math.round(100 * (i - t.data.mymoney)) / 100
        });
    },
    add_address: function() {
        wx.navigateTo({
            url: "/sudu8_page/address/address?shareid=" + this.data.shareid + "&pid=" + this.data.id + "&orderid=" + this.data.orderid
        });
    },
    getmraddress: function() {
        var e = this, a = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "doPagegetmraddress",
            data: {
                openid: a,
                uniacid: e.data.uniacid
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    mraddress: t
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
    getmraddresszd: function(a) {
        var e = this, t = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "doPagegetmraddresszd",
            data: {
                openid: t,
                id: a,
                uniacid: e.data.uniacid
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    mraddress: t
                });
            }
        });
    },
    jian: function() {
        var a = this.data.num;
        --a <= 0 && (a = 1);
        var t = 100 * this.data.dprice * a / 100;
        this.setData({
            num: a,
            hjjg: t,
            dkmoney: 0,
            dkscore: 0,
            jifen_u: 0,
            jqdjg: "请选择",
            yhqid: 0,
            yhdq: 0,
            ischecked: !1
        }), this.getmyinfo();
    },
    jia: function() {
        var a = this, t = a.data.num, e = a.data.my_num, d = a.data.xg_num, n = a.data.shengyu, i = a.data.dprice;
        n < ++t && -1 != n && (t--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        })), d < t + e && 0 != d && (1 < t && t--, wx.showModal({
            title: "提醒",
            content: "该商品为限购产品，您总购买数已超过限额！",
            showCancel: !1
        }));
        var o = 100 * i * t / 100;
        a.setData({
            num: t,
            hjjg: o,
            dkmoney: 0,
            dkscore: 0,
            jifen_u: 0,
            jqdjg: "请选择",
            yhqid: 0,
            yhdq: 0,
            ischecked: !1
        }), a.getmyinfo();
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
    qxyh: function() {
        var a = this;
        a.setData({
            ischecked: !1
        }), a.switchChange({
            detail: {
                value: !1
            }
        });
        var t = a.data.yhdq;
        console.log(111);
        var e = a.data.sfje;
        e = (100 * e + 100 * t) / 100, a.hideModal(), a.setData({
            jqdjg: "请选择",
            yhqid: 0,
            sfje: e,
            zf_type: a.data.mymoney >= e ? 0 : 1,
            zf_money: a.data.mymoney >= e ? e : Math.round(100 * (e - a.data.mymoney)) / 100,
            yhdq: 0
        });
    },
    getmoney: function(a) {
        var t = this;
        t.setData({
            ischecked: !1
        }), t.switchChange({
            detail: {
                value: !1
            }
        });
        var e = a.currentTarget.id, d = a.currentTarget.dataset.index, n = d.coupon.pay_money, i = t.data.sfje;
        i = 1 * i + 1 * t.data.yhdq;
        var o = t.data.yhqid;
        0 != o && d.id == o || (1 * i - parseFloat(t.data.yunfei) + parseFloat(t.data.yfjian) < 1 * n ? wx.showModal({
            title: "提示",
            content: "价格未满" + n + "元，不可使用该优惠券！",
            showCancel: !1
        }) : ((i = Math.floor(100 * (1 * i - 1 * e)) / 100) < 0 && (i = 0), t.setData({
            jqdjg: e,
            yhqid: d.id,
            sfje: i,
            zf_type: t.data.mymoney >= i ? 0 : 1,
            zf_money: t.data.mymoney >= i ? i : Math.round(100 * (i - t.data.mymoney)) / 100,
            yhdq: e
        }), t.hideModal()));
    },
    mjly: function(a) {
        var t = a.detail.value;
        this.setData({
            mjly: t
        }), console.log(t);
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
        for (var e = this, d = (e.data.datas, e.data.id), t = !0, n = e.data.pagedata, i = 0; i < n.length; i++) if (1 == n[i].ismust && "" == n[i].val) return t = !1, 
        wx.showModal({
            title: "提醒",
            content: n[i].name + "为必填项！",
            showCancel: !1
        }), !1;
        t && wx.request({
            url: e.data.baseurl + "doPageFormval",
            data: {
                id: d,
                pagedata: JSON.stringify(n),
                types: "showProDan",
                uniacid: e.data.uniacid
            },
            cachetime: "30",
            success: function(a) {
                var t = a.data.data.id;
                wx.showModal({
                    title: "提示",
                    content: a.data.data.con,
                    showCancel: !1,
                    success: function(a) {
                        e.sendMail_form(d, t), e.doshend(t);
                    }
                });
            }
        });
    },
    sendMail_form: function(a, t) {
        wx.request({
            url: this.data.baseurl + "doPagesendMail_form",
            data: {
                id: a,
                cid: t,
                uniacid: this.data.uniacid
            },
            success: function(a) {
                return !0;
            },
            fail: function(a) {
                console.log("sendMail_order_fail");
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
            var r = new Date(s.getTime() + 24 * n * 3600 * 1e3), c = r.getFullYear(), u = r.getMonth() + 1, l = r.getDate(), g = u + "月" + l + "日", h = c + "-" + u + "-" + l;
            i.push(g), o.push(h);
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
                id: t,
                types: "showArt",
                days: a,
                pagedatekey: e,
                uniacid: n.data.uniacid
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
    save_nb: function() {
        var a = this, t = a.data.today, e = a.data.xx, d = a.data.lixuanz;
        if (-1 == d) return wx.showModal({
            title: "提现",
            content: "请选择预约的选项",
            showCancel: !1
        }), !1;
        var n = "已选择" + t + "，" + e[d].keys.yval, i = a.data.pagedata, o = a.data.formindex;
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
                for (var t = a.provinceName + " " + a.cityName + " " + a.countyName + " " + a.detailInfo, e = a.userName, d = a.telNumber, n = o.data.pagedata, i = 0; i < n.length; i++) 0 == n[i].type && 2 == n[i].tp_text[0].yval && (n[i].val = e), 
                0 == n[i].type && 3 == n[i].tp_text[0].yval && (n[i].val = d), 0 == n[i].type && 4 == n[i].tp_text[0].yval && (n[i].val = t);
                o.setData({
                    myname: e,
                    mymobile: d,
                    myaddress: t,
                    pagedata: n
                });
            }
        });
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
        var e = this, t = wx.getStorageSync("openid"), d = e.data.yhqid, n = e.data.sfje, i = e.data.nav, o = e.data.yunfei, s = e.data.yfjian, r = e.data.dkscore, c = (e.data.dkmoney, 
        e.data.mraddress), u = e.data.mjly, l = e.data.orderid;
        if (o -= s, console.log(c), !(1 != i || null != c && c)) return wx.showModal({
            title: "提示",
            content: "请先选择/设置收货地址！",
            showCancel: !1
        }), !1;
        if (2 == i) var g = ""; else g = c.id;
        console.log(o), console.log(r), wx.request({
            url: e.data.baseurl + "doPagecreateorder",
            header: {
                "content-type": "application/json"
            },
            data: {
                pid: e.data.id,
                num: e.data.num,
                types: "miaosha",
                openid: t,
                couponid: d,
                price: n,
                dkscore: r,
                address: g,
                mjly: u,
                nav: i,
                formid: a,
                yunfei: o,
                orderid: l || "",
                uniacid: e.data.uniacid
            },
            success: function(a) {
                if (console.log(8888888888888), console.log(a), "1" == a.data.data.errcode) wx.showModal({
                    title: a.data.data.err,
                    content: "请重新下单",
                    showCancel: !1
                }); else if ("2" == a.data.data.errcode) wx.showModal({
                    title: a.data.data.err,
                    content: a.data.data.can_buy <= 0 ? "去逛逛其他商品吧~" : "您还可购买" + a.data.data.can_buy + "件"
                }); else if ("3" == a.data.data.errcode) wx.showModal({
                    title: a.data.data.err,
                    content: "当前库存为" + a.data.data.kc + "件"
                }); else if ("4" == a.data.data.errcode) wx.showModal({
                    title: "提示",
                    content: "该商品已下架",
                    showCancel: !1,
                    success: function() {
                        wx.redirectTo({
                            url: "/sudu8_page/index/index"
                        });
                    }
                }); else if ("-1" == a.data.data.errcode) {
                    var t = a.data.data.orderid;
                    e.setData({
                        orderid: t
                    }), console.log(n), console.log(e.data.mymoney), n <= e.data.mymoney ? e.pay1(t) : e.pay2(t);
                }
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
            url: e.data.baseurl + "doPagebeforepay",
            data: {
                openid: a,
                price: d,
                order_id: t,
                types: "miaosha",
                formId: e.data.formId,
                uniacid: e.data.uniacid
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
                        types: "miaosha",
                        order_id: t,
                        prepayid: a.data.data.package,
                        uniacid: e.data.uniacid
                    },
                    success: function(a) {
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
                                    mask: !0,
                                    success: function() {
                                        setTimeout(function() {
                                            wx.navigateBack({
                                                delta: 9
                                            }), wx.navigateTo({
                                                url: "/sudu8_page/orderlist_dan/orderlist_dan?type=9"
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
        var t = this, e = wx.getStorageSync("openid"), d = t.data.sfje;
        t.data.mymoney;
        wx.request({
            url: t.data.baseurl + "doPagepaynotify",
            data: {
                out_trade_no: a,
                openid: e,
                payprice: d,
                types: "miaosha",
                flag: 0,
                formId: t.data.formId,
                uniacid: t.data.uniacid
            },
            success: function(a) {
                console.log(a), "失败" == a.data.data.message ? wx.showToast({
                    title: "购买失败,请稍再试！",
                    icon: "none",
                    mask: !0,
                    success: function() {
                        setTimeout(function() {
                            wx.navigateBack({
                                delta: 9
                            }), wx.navigateTo({
                                url: "/sudu8_page/orderlist_dan/orderlist_dan?type=9"
                            });
                        }, 1500), wx.hideLoading();
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
                                url: "/sudu8_page/orderlist_dan/orderlist_dan?type=9"
                            });
                        }, 1500), wx.hideLoading();
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
                types: "miaosha",
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
    hexiao: function() {
        this.setData({
            showhx: 1
        });
    },
    hxhide: function() {
        this.setData({
            showhx: 0
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
                            for (var t = d.data.pagedata, e = 0; e < t.length; e++) 0 == t[e].type && 5 == t[e].tp_text[0].yval && (t[e].val = a.data.data);
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