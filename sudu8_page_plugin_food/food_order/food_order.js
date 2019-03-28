var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        gwc: "",
        allprice: "",
        xiansz: !1,
        chuydate: "请选择日期",
        chuytime: "请选择时间",
        address: "",
        xinxi: {
            username: "",
            usertel: "",
            address: "",
            userdate: "",
            usertime: "",
            userbeiz: ""
        },
        usname: 0,
        ustel: 0,
        usadd: 0,
        usdate: 0,
        ustime: 0,
        dikou_jf: 0,
        dikou_jf_val: 0,
        dikou_score: 0,
        dikou_score_val: 0,
        zz_pay_money: "a",
        zz_my_paymoney: 0,
        zz_my_paymoney2: 0,
        zbiao: 0,
        index: -1
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        var t = this;
        wx.getStorage({
            key: "arrkey",
            success: function(a) {
                t.setData({
                    index: a.data
                });
            }
        }), wx.getStorage({
            key: "gwcdata",
            success: function(a) {
                t.setData({
                    gwc: a.data
                });
            }
        }), wx.getStorage({
            key: "gwcprice",
            success: function(a) {
                t.setData({
                    allprice: a.data
                });
            }
        }), wx.getStorage({
            key: "mp_address",
            success: function(a) {
                t.setData({
                    address: a.data
                });
            }
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getIndex(), app.util(t.getinfos, e, t.data.uniacid);
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
                }), t.zhchange(), t.getSjbase();
            }
        });
    },
    zhchange: function() {
        var e = this, i = e.data.index;
        wx.request({
            url: e.data.baseurl + "doPageZhchange",
            data: {
                uniacid: e.data.uniacid
            },
            success: function(a) {
                -1 == i && (i = 0);
                var t = a.data.data.zhs[i];
                e.setData({
                    zho: a.data.data,
                    zhs: a.data.data.zhs,
                    zbiao: t
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    bindPickerChange: function(a) {
        var t = a.detail.value;
        if (0 == t) this.setData({
            index: a.detail.value,
            zbiao: "打包/拼桌"
        }); else {
            var e = this.data.zhs;
            this.setData({
                index: a.detail.value,
                zbiao: e[t]
            });
        }
    },
    getIndex: function() {
        var i = this;
        wx.request({
            url: i.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: i.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                if (a.data.data.video) var t = "show";
                if (a.data.data.c_b_bg) var e = "bg";
                i.setData({
                    baseinfo: a.data.data,
                    show_v: t,
                    c_b_bg1: e
                }), wx.setNavigationBarTitle({
                    title: i.data.baseinfo.name
                }), wx.setNavigationBarColor({
                    frontColor: i.data.baseinfo.base_tcolor,
                    backgroundColor: i.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getSjbase: function() {
        var f = this, a = wx.getStorageSync("openid");
        wx.request({
            url: f.data.baseurl + "doPageShangjbs",
            data: {
                openid: a,
                uniacid: f.data.uniacid
            },
            success: function(a) {
                var t = a.data.data.dk_money, e = a.data.data.dk_score, i = f.data.allprice, n = a.data.data.jf_gz, d = a.data.data.user_money, s = 0, o = 0, r = 0, c = 0;
                if (t <= i) {
                    o = e;
                    var u = i - (s = t);
                    d < u ? (r = u - d, c = d) : (c = u, r = 0);
                } else {
                    s = i, o = 1e3 * parseInt(i) / (1e3 * n.money) * (1e3 * n.score) / 1e3, c = r = 0;
                }
                0 < r && f.setData({
                    money_yhpay: 0
                });
                var l = i - s;
                f.setData({
                    shangjbs: a.data.data,
                    usname: a.data.data.usname,
                    ustel: a.data.data.ustel,
                    usadd: a.data.data.usadd,
                    usdate: a.data.data.usdate,
                    ustime: a.data.data.ustime,
                    dikou_jf: s,
                    dikou_jf_val: s,
                    dikou_score: o,
                    dikou_score_val: o,
                    zz_pay_money: r,
                    zz_my_paymoney: c,
                    zz_my_paymoney2: l
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    pay: function(a) {
        var e = this, t = wx.getStorageSync("openid"), i = e.data.allprice, n = e.data.gwc, d = e.data.address, s = e.data.xinxi, o = e.data.zbiao, r = a.detail.formId;
        if (e.setData({
            formId: r
        }), null == o) return wx.showModal({
            content: "请先选择桌号"
        }), !1;
        e.data.dikou_jf;
        var c = e.data.dikou_score, u = e.data.zz_my_paymoney, l = e.data.zz_pay_money;
        if (e.setData({
            money_yhpay: l
        }), 0 < l) {
            var f = e.data.usname, g = e.data.ustel, x = e.data.usadd, _ = e.data.usdate, y = e.data.ustime;
            if (0 == o) {
                return wx.showModal({
                    title: "提醒",
                    content: "您选择的是“打包/拼桌”，请确认",
                    success: function(a) {
                        if (a.confirm) {
                            if (2 == f && "" == s.username) return !1, wx.showModal({
                                title: "提醒",
                                content: "姓名为必填！",
                                showCancel: !1
                            }), !1;
                            if (2 == g && "" == s.usertel) return !1, wx.showModal({
                                title: "提醒",
                                content: "手机号为必填！",
                                showCancel: !1
                            }), !1;
                            if (!/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(s.usertel) && 2 == g) return wx.showModal({
                                title: "提醒",
                                content: "请输入有效的手机号码！",
                                showCancel: !1
                            }), !1;
                            if (2 == x && "" == s.address) return !1, wx.showModal({
                                title: "提醒",
                                content: "地址为必填！",
                                showCancel: !1
                            }), !1;
                            if (2 == _ && "" == s.userdate) return !1, wx.showModal({
                                title: "提醒",
                                content: "日期为必填！",
                                showCancel: !1
                            }), !1;
                            if (2 == y && "" == s.usertime) return !1, wx.showModal({
                                title: "提醒",
                                content: "时间为必填！",
                                showCancel: !1
                            }), !1;
                            e.setData({
                                xiansz: !0
                            }), wx.request({
                                url: e.data.baseurl + "doPageOrderpaymoney",
                                data: {
                                    uniacid: e.data.uniacid,
                                    openid: t,
                                    price: l,
                                    xinxi: JSON.stringify(s)
                                },
                                success: function(a) {
                                    if ("success" == a.data.message) {
                                        var t = a.data.data.order_id;
                                        e.setData({
                                            prepay_id: a.data.data.package
                                        }), wx.requestPayment({
                                            timeStamp: a.data.data.timeStamp,
                                            nonceStr: a.data.data.nonceStr,
                                            package: a.data.data.package,
                                            signType: "MD5",
                                            paySign: a.data.data.paySign,
                                            success: function(a) {
                                                e.changflag(t), e.sendMail_order(t), wx.showToast({
                                                    title: "支付成功",
                                                    icon: "success",
                                                    duration: 3e3,
                                                    success: function(a) {
                                                        wx.redirectTo({
                                                            url: "/sudu8_page_plugin_food/food_my/food_my"
                                                        });
                                                    }
                                                });
                                            },
                                            fail: function(a) {
                                                e.setData({
                                                    xiansz: !1
                                                });
                                            },
                                            complete: function(a) {
                                                e.setData({
                                                    xiansz: !1
                                                });
                                            }
                                        });
                                    }
                                    "error" == a.data.message && wx.showModal({
                                        title: "提醒",
                                        content: a.data.data.message,
                                        showCancel: !1
                                    });
                                }
                            });
                        } else if (a.cancel) ;
                    }
                }), !1;
            }
            if (2 == f && "" == s.username) return !1, wx.showModal({
                title: "提醒",
                content: "姓名为必填！",
                showCancel: !1
            }), !1;
            if (2 == g && "" == s.usertel) return !1, wx.showModal({
                title: "提醒",
                content: "手机号为必填！",
                showCancel: !1
            }), !1;
            if (!/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(s.usertel) && 2 == g) return wx.showModal({
                title: "提醒",
                content: "请输入有效的手机号码！",
                showCancel: !1
            }), !1;
            if (2 == x && "" == s.address) return !1, wx.showModal({
                title: "提醒",
                content: "地址为必填！",
                showCancel: !1
            }), !1;
            if (2 == _ && "" == s.userdate) return !1, wx.showModal({
                title: "提醒",
                content: "日期为必填！",
                showCancel: !1
            }), !1;
            if (2 == y && "" == s.usertime) return !1, wx.showModal({
                title: "提醒",
                content: "时间为必填！",
                showCancel: !1
            }), !1;
            e.setData({
                xiansz: !0
            }), wx.request({
                url: e.data.baseurl + "doPageOrderpaymoney",
                data: {
                    uniacid: e.data.uniacid,
                    openid: t,
                    price: l,
                    xinxi: JSON.stringify(s)
                },
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function(a) {
                    if ("success" == a.data.message) {
                        var t = a.data.data.order_id;
                        wx.requestPayment({
                            timeStamp: a.data.data.timeStamp,
                            nonceStr: a.data.data.nonceStr,
                            package: a.data.data.package,
                            signType: "MD5",
                            paySign: a.data.data.paySign,
                            success: function(a) {
                                e.changflag(t), e.sendMail_order(t), wx.showToast({
                                    title: "支付成功",
                                    icon: "success",
                                    duration: 3e3,
                                    success: function(a) {
                                        wx.redirectTo({
                                            url: "/sudu8_page_plugin_food/food_my/food_my"
                                        });
                                    }
                                });
                            },
                            fail: function(a) {
                                e.setData({
                                    xiansz: !1
                                });
                            },
                            complete: function(a) {
                                e.setData({
                                    xiansz: !1
                                });
                            }
                        });
                    }
                    "error" == a.data.message && wx.showModal({
                        title: "提醒",
                        content: a.data.data.message,
                        showCancel: !1
                    });
                }
            });
        } else {
            if (0 == o) return wx.showModal({
                title: "提醒",
                content: "您选择的是“打包/拼桌”，请确认",
                success: function(a) {
                    a.confirm && wx.showModal({
                        title: "提示",
                        content: "确认支付,费用将从余额直接扣除!",
                        cancelText: "取消支付",
                        confirmText: "确认支付",
                        success: function(a) {
                            if (a.cancel) return !1;
                            wx.request({
                                url: e.data.baseurl + "doPageZjkk",
                                data: {
                                    openid: t,
                                    price: i,
                                    money_mypay: u,
                                    jifen_score: c,
                                    gwc: JSON.stringify(n),
                                    address: d,
                                    xinxi: JSON.stringify(s),
                                    uniacid: e.data.uniacid,
                                    zh: o,
                                    formId: r
                                },
                                header: {
                                    "content-type": "application/json"
                                },
                                success: function(a) {
                                    console.log(a), e.sendMail_order(order_id), wx.redirectTo({
                                        url: "/sudu8_page_plugin_food/food_my/food_my"
                                    });
                                }
                            });
                        }
                    });
                }
            }), !1;
            wx.showModal({
                title: "提示",
                content: "确认支付,费用将从余额直接扣除!",
                cancelText: "取消支付",
                confirmText: "确认支付",
                success: function(a) {
                    if (a.cancel) return !1;
                    wx.request({
                        url: e.data.baseurl + "doPageZjkk",
                        data: {
                            openid: t,
                            price: i,
                            money_mypay: u,
                            jifen_score: c,
                            gwc: JSON.stringify(n),
                            address: d,
                            xinxi: JSON.stringify(s),
                            uniacid: e.data.uniacid,
                            zh: o,
                            formId: r
                        },
                        header: {
                            "content-type": "application/json"
                        },
                        success: function(a) {
                            e.sendMail_order(a.data.data), wx.redirectTo({
                                url: "/sudu8_page_plugin_food/food_my/food_my"
                            });
                        }
                    });
                }
            });
        }
    },
    changflag: function(a) {
        var t = this, e = wx.getStorageSync("openid"), i = t.data.allprice, n = t.data.gwc, d = t.data.address, s = t.data.xinxi, o = t.data.zbiao;
        t.data.dikou_jf, t.data.dikou_score, t.data.zz_my_paymoney, t.data.zz_pay_money;
        wx.request({
            url: t.data.baseurl + "doPageZhifdingd",
            data: {
                openid: e,
                price: i,
                gwc: JSON.stringify(n),
                order_id: a,
                address: d,
                xinxi: JSON.stringify(s),
                uniacid: t.data.uniacid,
                zh: o,
                formId: t.data.formId
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                console.log(a);
            }
        });
    },
    sendMail_order: function(a) {
        wx.request({
            url: this.data.baseurl + "doPagesendMail_foodorder",
            data: {
                order_id: a,
                uniacid: this.data.uniacid
            },
            success: function(a) {},
            fail: function(a) {
                console.log("sendMail_order_fail");
            }
        });
    },
    userNameInput: function(a) {
        var t = this.data.xinxi, e = a.detail.value;
        t.username = e, this.setData({
            xinxi: t
        });
    },
    userTelInput: function(a) {
        var t = this.data.xinxi, e = a.detail.value;
        t.usertel = e, this.setData({
            xinxi: t
        });
    },
    userAddInput: function(a) {
        var t = this.data.xinxi, e = a.detail.value;
        t.address = e, this.setData({
            xinxi: t
        });
    },
    bindDateChange: function(a) {
        var t = this.data.xinxi, e = a.detail.value;
        t.userdate = e, this.setData({
            xinxi: t,
            chuydate: e
        });
    },
    bindTimeChange: function(a) {
        var t = this.data.xinxi, e = a.detail.value;
        t.usertime = e, this.setData({
            xinxi: t,
            chuytime: e
        });
    },
    userTextInput: function(a) {
        var t = this.data.xinxi, e = a.detail.value;
        t.userbeiz = e, this.setData({
            xinxi: t
        });
    },
    switch1Change: function(a) {
        var t = this, e = (t.data.dikou_jf, t.data.dikou_jf_val), i = (t.data.dikou_score, 
        t.data.dikou_score_val), n = (t.data.zz_pay_money, t.data.shangjbs.user_money), d = t.data.allprice, s = t.data.zz_my_paymoney, o = t.data.zz_my_paymoney2, r = 0, c = 0, u = 0;
        a.detail.value ? (c = i, o = d - (r = e), n - e < d ? u = d - n - e : (u = 0, s = d)) : (r = 0, 
        n < (o = d) ? u = d - n : (u = 0, s = d)), t.setData({
            dikou_jf: r,
            dikou_score: c,
            zz_pay_money: u,
            zz_my_paymoney: s,
            zz_my_paymoney2: o
        });
    }
});