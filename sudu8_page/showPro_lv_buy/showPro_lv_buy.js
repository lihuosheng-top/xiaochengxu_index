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
        sfje: 0,
        order: "",
        pro_name: "",
        pro_tel: "",
        pro_address: "",
        pro_txt: "",
        my_num: "",
        xg_num: "",
        shengyu: "",
        userInfo: "",
        chuydate: "选择日期",
        chuytime: "选择时间",
        num: [],
        duogg: [],
        xz_num: [],
        couponprice: 0,
        jqdjg: "请选择",
        yhqid: "0",
        oldsfje: "",
        pagedata: {},
        imgcount_xz: 0,
        pagedata_set: [],
        zhixin: !1,
        xuanz: 0,
        lixuanz: -1,
        ttcxs: 0,
        chooseNum: 0,
        myscore: 0,
        jifen_u: 2,
        zf_money: 0,
        dkmoney: 0,
        type: "",
        testKey: "",
        testKeys: "",
        order_id: "",
        pd_val: []
    },
    onPullDownRefresh: function() {
        this.refreshSessionkey(), this.getinfos(), wx.stopPullDownRefresh();
    },
    onLoad: function(a) {
        var t = this;
        t.refreshSessionkey();
        var e = a.id;
        null != a.testPrice && t.setData({
            testPrice: a.testPrice
        }), null != a.testKey && t.setData({
            testKey: a.testKey
        }), null != a.testKeys && t.setData({
            testKeys: a.testKeys
        }), t.setData({
            id: e,
            order_id: a.order_id
        }), "table" == a.type && (t.setData({
            type: a.type,
            NowSelectStr: a.NowSelectStr,
            appoint_date: a.appoint_date
        }), console.log(8888888), console.log(a.appoint_date));
        var o = 0;
        a.fxsid && (o = a.fxsid, t.setData({
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
        }), app.util(t.getinfos, o);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        wx.redirectto(t, e);
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
        var h = this, t = wx.getStorageSync("openid");
        wx.request({
            url: h.data.baseurl + "doPagemycoupon",
            data: {
                openid: t,
                flag: 0,
                uniacid: h.data.uniacid
            },
            success: function(a) {
                h.setData({
                    couponlist: a.data.data
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), wx.request({
            url: h.data.baseurl + "doPageshowPro",
            data: {
                id: a,
                openid: t,
                uniacid: h.data.uniacid
            },
            cachetime: "30",
            success: function(a) {
                var t = a.data.data.userinfo.money, e = a.data.data.userinfo.score;
                a.data.data.price;
                if ("table" != h.data.type) {
                    var o = h.data.yhje;
                    if (0 == a.data.data.pro_xz) d = 1; else var d = a.data.data.pro_xz - a.data.data.my_num;
                    for (var n = a.data.data.more_type_x, s = [], i = {}, r = 0, c = 0; c < n.length; c++) i[c] = 0, 
                    s.push(i), r += 0 * n[c][1];
                    if (h.setData({
                        bg: a.data.data.text[0],
                        picList: a.data.data.text,
                        title: a.data.data.title,
                        datas: a.data.data,
                        duogg: n,
                        hjjg: r,
                        zf_money: r,
                        dprice: r,
                        sfje: r - o,
                        myscore: parseFloat(a.data.data.userinfo.score),
                        mymoney: parseFloat(a.data.data.userinfo.money),
                        xz_num: a.data.data.more_type_num,
                        num: s,
                        xg_num: a.data.data.pro_xz,
                        shengyu: a.data.data.pro_kc,
                        xg_buy: d,
                        pagedata: a.data.data.forms,
                        formdescs: a.data.data.formdescs
                    }), "" != h.data.testKey && h.jia(), 1 == h.data.testKeys && 0 < n.length) for (c = 0; c < n.length; c++) console.log(c), 
                    h.setData({
                        testPrice: n[c][1],
                        testKey: c
                    }), h.jia();
                } else {
                    o = h.data.yhje;
                    var l, u, g = h.data.NowSelectStr.split(","), f = g.length;
                    for (c = 0; c < f; c++) l = g[c].split("a"), u = a.data.data.table.rowstr[l[0] - 1] + "，", 
                    u += a.data.data.table.columnstr[l[1] - 1], g[c] = u;
                    h.setData({
                        myscore: e,
                        mymoney: t,
                        select_arr: g,
                        bg: a.data.data.text[0],
                        title: a.data.data.title,
                        datas: a.data.data,
                        hjjg: a.data.data.price * f,
                        zf_money: a.data.data.price * f,
                        dprice: a.data.data.price,
                        select_num: f,
                        sfje: Math.floor(100 * (a.data.data.price * f - o)) / 100,
                        pagedata: a.data.data.forms,
                        formdescs: a.data.data.formdescs
                    });
                }
                wx.setNavigationBarTitle({
                    title: h.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), 
                wx.request({
                    url: h.data.baseurl + "doPagegetmoneyoff",
                    data: {
                        uniacid: h.data.uniacid
                    },
                    success: function(a) {
                        for (var t = a.data.data, e = "", o = 0; o < t.length; o++) o == t.length - 1 ? e += "满" + t[o].reach + "减" + t[o].del : e += "满" + t[o].reach + "减" + t[o].del + "，";
                        h.data.sfje;
                        h.setData({
                            moneyoff: t,
                            moneyoffstr: t ? e : ""
                        }), h.getmyinfo();
                    }
                });
            }
        });
    },
    getmyinfo: function() {
        var a = this, t = (wx.getStorageSync("openid"), a.data.moneyoff), e = a.data.hjjg;
        if (t) for (var o = t.length - 1; 0 <= o; o--) if (e >= parseFloat(t[o].reach)) {
            e -= parseFloat(t[o].del);
            break;
        }
        a.setData({
            sfje: e,
            zf_type: a.data.mymoney >= e ? 0 : 1,
            zf_money: a.data.mymoney >= e ? e : Math.round(100 * (e - a.data.mymoney)) / 100
        });
    },
    jian: function(a) {
        var t = this, e = (t.data.yhje, a.currentTarget.dataset.testid), o = a.currentTarget.dataset.testkey, d = t.data.num[o][o], n = (t.data.duogg, 
        t.data.sfje), s = t.data.oldsfje, i = t.data.hjjg;
        if (--d < 0) d = 0; else {
            var r = Math.round(100 * s - 100 * e * d + 100 * e * (d - 1)) / 100;
            s = i = n = r;
            var c = t.data.num;
            c[o][o] = d;
            var l = t.data.chooseNum - 1;
            t.setData({
                num: c,
                sfje: n,
                hjjg: i,
                jqdjg: "请选择",
                oldsfje: s,
                yhqid: 0,
                chooseNum: l,
                ischecked: !1,
                dkscore: 0,
                dkmoney: 0,
                jifen_u: 2
            }), t.getmyinfo();
        }
    },
    jia: function(a) {
        var t = this;
        t.data.yhje;
        if (null == a) {
            if ("" !== (o = t.data.testKey)) var e = t.data.testPrice;
        } else {
            e = a.currentTarget.dataset.testid;
            var o = a.currentTarget.dataset.testkey;
        }
        var d = t.data.num[o][o], n = (t.data.duogg, t.data.sfje, t.data.oldsfje), s = t.data.hjjg;
        if (t.data.xz_num[o].shennum < ++d) return d--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        }), !1;
        var i = Math.round(100 * e * d + 100 * n - 100 * e * (d - 1)) / 100;
        s = n = i;
        var r = t.data.num;
        t.data.datas;
        r[o][o] = d;
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
    submit: function() {
        var e = this, a = e.data.jhsl, t = e.data.shengyu, o = e.data.type;
        if (t < a && -1 != t && "table" != o) return a--, wx.showModal({
            title: "提醒",
            content: "库存量不足！",
            showCancel: !1
        }), !1;
        var d = e.data.sfje, n = wx.getStorageSync("openid"), s = (e.data.duogg, e.data.num), i = e.data.chuydate, r = e.data.chuytime, c = (e.data.yhje, 
        e.data.id), l = e.data.order, u = e.data.pro_name, g = e.data.pro_tel, f = e.data.pro_address, h = e.data.pro_txt, p = (e.data.id, 
        e.data.yhqid), y = !0, m = e.data.hjjg;
        if (0 == ("table" == o ? e.data.select_num : e.data.chooseNum)) return y = !1, wx.showModal({
            title: "提醒",
            content: "您至少要选择1个产品或服务",
            showCancel: !1
        }), !1;
        if (!u && 2 == e.data.datas.pro_flag) return y = !1, wx.showModal({
            title: "提醒",
            content: "姓名为必填！",
            showCancel: !1
        }), !1;
        if (!g && 2 == e.data.datas.pro_flag_tel) return y = !1, wx.showModal({
            title: "提醒",
            content: "手机号为必填！",
            showCancel: !1
        }), !1;
        if (!/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(g) && 2 == e.data.datas.pro_flag_tel) return wx.showModal({
            title: "提醒",
            content: "请输入有效的手机号码！",
            showCancel: !1
        }), !1;
        if (!f && 2 == e.data.datas.pro_flag_add) return y = !1, wx.showModal({
            title: "提醒",
            content: "地址为必填！",
            showCancel: !1
        }), !1;
        if ("0" == e.data.datas.tableis) {
            if ("选择日期" == i && 2 == e.data.datas.pro_flag_data) return y = !1, wx.showModal({
                title: "提醒",
                content: "请选择日期！",
                showCancel: !1
            }), !1;
            if ("选择时间" == r && 2 == e.data.datas.pro_flag_time) return y = !1, wx.showModal({
                title: "提醒",
                content: "请选择时间！",
                showCancel: !1
            }), !1;
        }
        var x = e.data.pagedata;
        console.log(x);
        for (var v = 0; v < x.length; v++) if (1 == x[v].ismust && "" == x[v].val && 16 != x[v].type) return y = !1, 
        wx.showModal({
            title: "提醒",
            content: x[v].name + "为必填项！",
            showCancel: !1
        }), !1;
        y && wx.request({
            url: e.data.baseurl + "doPagecreateorder",
            data: {
                types: "yuyue",
                openid: n,
                num: JSON.stringify(s[0]),
                id: c,
                hjjg: m,
                zhifu: d,
                zf_money: e.data.zf_money,
                zf_type: e.data.zf_type,
                order: l,
                pro_name: u,
                pro_tel: g,
                pro_address: f,
                pro_txt: h,
                chuydate: i,
                chuytime: r,
                yhqid: p,
                type: "table" == e.data.type ? "table" : "",
                NowSelectStr: e.data.NowSelectStr,
                appoint_date: e.data.appoint_date,
                dkscore: e.data.dkscore,
                dkmoney: e.data.dkmoney,
                pagedata: JSON.stringify(x),
                uniacid: e.data.uniacid
            },
            header: {
                "content-type": "application/x-www-form-urlencoded"
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
                    var t = a.data.data.orderid;
                    e.setData({
                        orderid: t
                    }), d <= e.data.mymoney ? e.pay1(t) : e.pay2(t);
                }
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
        var t = this, e = a.currentTarget.id, o = a.currentTarget.dataset.index, d = o.coupon.pay_money, n = t.data.hjjg;
        if (1 * n < 1 * d) wx.showModal({
            title: "提示",
            content: "价格未满" + d + "元，不可使用该优惠券！",
            showCancel: !1
        }); else {
            var s = (100 * t.data.sfje - 100 * parseFloat(e) + 100 * t.data.dkmoney) / 100;
            t.setData({
                ischecked: !1
            }), t.switchChange({
                detail: {
                    value: !1
                }
            });
            var i = parseFloat(s.toPrecision(12));
            i < 0 && (i = 0), t.setData({
                jqdjg: e,
                yhqid: o.id,
                sfje: i,
                oldsfje: n,
                zf_type: parseFloat(t.data.mymoney) >= parseFloat(i) ? 0 : 1,
                zf_money: parseFloat(t.data.mymoney) >= parseFloat(i) ? parseFloat(i) : Math.round(100 * (parseFloat(i) - parseFloat(t.data.mymoney))) / 100
            });
        }
        t.hideModal();
    },
    qxyh: function() {
        var a = this.data.jqdjg;
        "请选择" == a && (a = 0);
        var t = this.data.sfje, e = Math.round(100 * t + 100 * a) / 100;
        this.hideModal(), this.setData(_defineProperty({
            jqdjg: 0,
            yhqid: 0,
            sfje: e
        }, "jqdjg", "请选择"));
    },
    showModal: function() {
        var a = this, t = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        (this.animation = t).translateY(300).step(), this.setData({
            animationData: t.export(),
            showModalStatus: !0
        }), setTimeout(function() {
            t.translateY(0).step(), this.setData({
                animationData: t.export()
            });
        }.bind(this), 200);
        var e = a.data.jqdjg;
        if (0 < e) {
            var o = (100 * parseFloat(a.data.sfje) + 100 * parseFloat(e)) / 100;
            a.setData({
                jqdjg: 0,
                sfje: o,
                zf_type: a.data.mymoney >= o ? 0 : 1,
                zf_money: a.data.mymoney >= o ? o : Math.round(100 * (o - a.data.mymoney)) / 100
            });
        }
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
    bindInputChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, o = this.data.pagedata;
        o[e].val = t, this.setData({
            pagedata: o
        });
    },
    bindPickerChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, o = this.data.pagedata;
        console.log();
        var d = o[e].tp_text[t];
        o[e].val = d, this.setData({
            pagedata: o
        });
    },
    bindDateChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, o = this.data.pagedata;
        o[e].val = t, this.setData({
            pagedata: o
        });
    },
    bindTimeChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, o = this.data.pagedata;
        console.log(o), o[e].val = t, this.setData({
            pagedata: o
        });
    },
    checkboxChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, o = this.data.pagedata;
        console.log(o), o[e].val = t, this.setData({
            pagedata: o
        });
    },
    radioChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, o = this.data.pagedata;
        console.log(o), o[e].val = t, this.setData({
            pagedata: o
        });
    },
    choiceimg1111: function(a) {
        var n = this, t = 0, s = n.data.zhixin, i = a.currentTarget.dataset.index, r = n.data.pagedata, e = r[i].val, o = r[i].tp_text[0];
        e ? t = e.length : (t = 0, e = []);
        var d = o - t, c = n.data.baseurl + "wxupimg", l = n.data.pd_val;
        wx.chooseImage({
            count: d,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                s = !0, n.setData({
                    zhixin: s
                }), wx.showLoading({
                    title: "图片上传中"
                });
                var t = a.tempFilePaths;
                e = e.concat(t), r[i].val = e, n.setData({
                    pagedata: r
                });
                var o = 0, d = t.length;
                !function e() {
                    wx.uploadFile({
                        url: c,
                        filePath: t[o],
                        name: "file",
                        success: function(a) {
                            var t = a.data;
                            l.push(t), r[i].z_val = l, n.setData({
                                pagedata: r,
                                pd_val: l
                            }), ++o < d ? e() : (s = !1, n.setData({
                                zhixin: s
                            }), wx.hideLoading());
                        }
                    });
                }();
            }
        });
    },
    delimg: function(a) {
        var t = a.currentTarget.dataset.index, e = a.currentTarget.dataset.id, o = this.data.pagedata, d = o[t].val;
        d.splice(e, 1), 0 == d.length && (d = ""), o[t].val = d, this.setData({
            pagedata: o
        });
    },
    namexz: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.pagedata[t], o = [], d = 0; d < e.tp_text.length; d++) {
            var n = {};
            n.keys = e.tp_text[d], n.val = 1, o.push(n);
        }
        this.setData({
            ttcxs: 1,
            formindex: t,
            xx: o,
            xuanz: 0,
            lixuanz: -1
        }), this.riqi();
    },
    riqi: function() {
        for (var a = new Date(), t = new Date(a.getTime()), e = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(), o = this.data.xx, d = 0; d < o.length; d++) o[d].val = 1;
        this.setData({
            xx: o
        }), this.gettoday(e);
        var n = [], s = [], i = new Date();
        for (d = 0; d < 5; d++) {
            var r = new Date(i.getTime() + 24 * d * 3600 * 1e3), c = r.getFullYear(), l = r.getMonth() + 1, u = r.getDate(), g = l + "月" + u + "日", f = c + "-" + l + "-" + u;
            n.push(g), s.push(f);
        }
        this.setData({
            arrs: n,
            fallarrs: s,
            today: e
        });
    },
    xuanzd: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.fallarrs[t], o = this.data.xx, d = 0; d < o.length; d++) o[d].val = 1;
        this.setData({
            xuanz: t,
            today: e,
            lixuanz: -1,
            xx: o
        }), this.gettoday(e);
    },
    goux: function(a) {
        var t = a.currentTarget.dataset.index;
        console.log(t), this.setData({
            lixuanz: t
        });
    },
    gettoday: function(a) {
        var d = this, t = d.data.id, e = d.data.formindex, n = d.data.xx;
        wx.request({
            url: d.data.baseurl + "doPageDuzhan",
            data: {
                id: t,
                types: "showPro_lv_buy",
                days: a,
                pagedatekey: e,
                uniacid: d.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                for (var t = a.data.data, e = 0; e < t.length; e++) n[t[e]].val = 2;
                var o = 0;
                t.length == n.length && (o = 1), d.setData({
                    xx: n,
                    isover: o
                });
            }
        });
    },
    save_nb: function() {
        var a = this, t = a.data.today, e = a.data.xx, o = a.data.lixuanz;
        if (-1 == o) return wx.showModal({
            title: "提现",
            content: "请选择预约的选项",
            showCancel: !1
        }), !1;
        var d = "已选择" + t + "，" + e[o].keys.yval, n = a.data.pagedata, s = a.data.formindex;
        n[s].val = d, n[s].days = t, n[s].indexkey = s, n[s].xuanx = o, console.log(n), 
        a.setData({
            ttcxs: 0,
            pagedata: n
        });
    },
    quxiao: function() {
        this.setData({
            ttcxs: 0
        });
    },
    weixinadd: function() {
        var s = this;
        wx.chooseAddress({
            success: function(a) {
                for (var t = a.provinceName + " " + a.cityName + " " + a.countyName + " " + a.detailInfo, e = a.userName, o = a.telNumber, d = s.data.pagedata, n = 0; n < d.length; n++) 0 == d[n].type && 2 == d[n].tp_text[0].yval && (d[n].val = e), 
                0 == d[n].type && 3 == d[n].tp_text[0].yval && (d[n].val = o), 0 == d[n].type && 4 == d[n].tp_text[0].yval && (d[n].val = t);
                console.log(d), s.setData({
                    myname: e,
                    mymobile: o,
                    myaddress: t,
                    pagedata: d
                });
            },
            fail: function(a) {
                wx.getSetting({
                    success: function(a) {
                        a.authSetting["scope.address"] ? console.log("失败") : wx.openSetting({
                            success: function(a) {}
                        });
                    }
                });
            }
        });
    },
    switchChange: function(a) {
        var n = this, t = a.detail.value, e = wx.getStorageSync("openid"), s = n.data.sfje, i = 0, o = "table" == n.data.type ? n.data.select_num : n.data.chooseNum;
        if (1 == t) wx.request({
            url: n.data.baseurl + "doPagescoreDeduction",
            data: {
                id: n.data.id,
                num: o,
                openid: e,
                is_more: 1,
                uniacid: n.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                var t = a.data;
                i = t.moneycl;
                var e = t.gzmoney, o = t.gzscore;
                if (s < i && (i = parseInt(s)), 0 == i) var d = 0; else d = i * o / e;
                s = Math.round(100 * (s - i)) / 100, n.setData({
                    sfje: s,
                    dkmoney: i,
                    dkscore: d,
                    jifen_u: 1,
                    zf_type: n.data.mymoney >= s ? 0 : 1,
                    zf_money: n.data.mymoney >= s ? s : Math.round(100 * (s - n.data.mymoney)) / 100
                });
            }
        }); else {
            var d = n.data.zf_money;
            i = n.data.dkmoney;
            d = Math.round((1e3 * d + 1e3 * i) / 1e3), s = d, n.setData({
                dkmoney: 0,
                dkscore: 0,
                jifen_u: 0,
                zf_money: d,
                sfje: s
            });
        }
    },
    pay1: function(t) {
        var e = this;
        wx.showModal({
            title: "请注意",
            content: "您将使用余额支付" + e.data.sfje + "元",
            success: function(a) {
                a.confirm ? (e.payover_do(t), e.payover_fxs(t), wx.showLoading({
                    title: "下单中...",
                    mask: !0
                }), setTimeout(function() {
                    wx.hideLoading();
                }, 3e3)) : wx.navigateTo({
                    url: "/sudu8_page/order/order"
                });
            },
            fail: function(a) {
                wx.navigateTo({
                    url: "/sudu8_page/order/order"
                });
            }
        });
    },
    pay2: function(t) {
        var e = this, a = wx.getStorageSync("openid"), o = e.data.sfje, d = e.data.zf_money, n = e.data.hjjg;
        wx.request({
            url: e.data.baseurl + "doPagebeforepay",
            data: {
                openid: a,
                price: n,
                pay_price: d,
                true_price: o,
                order_id: t,
                types: "yuyue",
                formId: e.data.formId,
                uniacid: e.data.uniacid
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                console.log(a.data.data.err);
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
                            mask: !0,
                            duration: 3e3,
                            success: function(a) {
                                wx.showToast({
                                    title: "购买成功！",
                                    icon: "success",
                                    success: function() {
                                        setTimeout(function() {
                                            wx.navigateTo({
                                                url: "/sudu8_page/order/order"
                                            });
                                        }, 1500);
                                    }
                                });
                            }
                        });
                    },
                    fail: function(a) {
                        wx.navigateTo({
                            url: "/sudu8_page/order/order"
                        });
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
                    mask: !0,
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
    getPhoneNumber: function(a) {
        var o = this, t = a.detail.iv, e = a.detail.encryptedData;
        "getPhoneNumber:ok" == a.detail.errMsg ? wx.checkSession({
            success: function() {
                wx.request({
                    url: o.data.baseurl + "doPagejiemiNew",
                    data: {
                        uniacid: o.data.uniacid,
                        newSessionKey: o.data.newSessionKey,
                        iv: t,
                        encryptedData: e
                    },
                    success: function(a) {
                        if (a.data.data) {
                            for (var t = o.data.pagedata, e = 0; e < t.length; e++) 0 == t[e].type && 5 == t[e].tp_text[0].yval && (t[e].val = a.data.data);
                            console.log(t), o.setData({
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