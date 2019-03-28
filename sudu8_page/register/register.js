var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        a: "1",
        phoneNumber: "",
        date: null,
        region: null,
        addressDetail: "",
        name: null,
        page_signs: "/sudu8_page/register/register",
        formset: 0,
        pagedata: [],
        beizhu: "",
        pagetype: "",
        formdescs: ""
    },
    onLoad: function(a) {
        var t = this;
        t.refreshSessionkey(), console.log(a), null != a.type && t.setData({
            pagetype: a.type
        }), a.from && (t.data.from = a.from), wx.setNavigationBarTitle({
            title: "开卡"
        }), t.getBase(), t.getUserinfo(), t.registerForm();
    },
    registerForm: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageRegisterFrom",
            data: {
                uniacid: t.data.uniacid,
                openid: wx.getStorageSync("openid")
            },
            success: function(a) {
                return 1 == a.data.data.flag ? t.setData({
                    formset: 1,
                    pagedata: a.data.data.form,
                    beizhu: a.data.data.beizhu,
                    formdescs: a.data.data.formdescs
                }) : t.setData({
                    formset: 0,
                    beizhu: a.data.data.beizhu
                }), !1;
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
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
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
    getUserinfo: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                wx.request({
                    url: t.data.baseurl + "doPageMymoney",
                    data: {
                        uniacid: t.data.uniacid,
                        openid: a.data
                    },
                    success: function(a) {
                        t.setData({
                            userbg: a.data.data.userbg,
                            cardname: a.data.data.cardname
                        });
                    }
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.refreshSessionkey(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    wxdz1: function() {
        var t = this;
        t.setData({
            a: "2"
        }), wx.chooseAddress({
            success: function(a) {
                console.log(a), t.setData({
                    name: a.userName,
                    region: a.provinceName + "-" + a.countyName + "-" + a.cityName,
                    addressDetail: a.detailInfo
                });
            },
            fail: function() {
                wx.showModal({
                    title: "授权失败",
                    content: "请重新授权",
                    success: function(a) {
                        a.confirm && wx.openSetting({
                            success: function() {
                                wx.getSetting({
                                    success: function(a) {
                                        a.authSetting["scope.address"] ? wx.chooseAddress({
                                            success: function(a) {
                                                t.setData({
                                                    name: a.userName,
                                                    region: a.provinceName + "-" + a.countyName + "-" + a.cityName,
                                                    addressDetail: a.detailInfo
                                                });
                                            }
                                        }) : t.wxdz2();
                                    }
                                });
                            }
                        }), a.cancel && t.wxdz2();
                    }
                });
            }
        });
    },
    wxdz2: function() {
        this.setData({
            a: "1"
        });
    },
    getPhoneNumber: function(a) {
        var n = this, t = a.detail.iv, e = a.detail.encryptedData;
        console.log(a), "getPhoneNumber:ok" == a.detail.errMsg ? wx.checkSession({
            success: function() {
                wx.request({
                    url: n.data.baseurl + "doPagejiemiNew",
                    data: {
                        uniacid: n.data.uniacid,
                        newSessionKey: n.data.newSessionKey,
                        iv: t,
                        encryptedData: e
                    },
                    success: function(a) {
                        if (console.log(a.data), a.data.data) {
                            for (var t = n.data.pagedata, e = 0; e < t.length; e++) 0 == t[e].type && 5 == t[e].tp_text[0].yval && (t[e].val = a.data.data);
                            console.log(t), n.setData({
                                phoneNumber: a.data.data,
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
    },
    bindInputChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata;
        n[e].val = t, this.setData({
            pagedata: n
        });
    },
    bindPickerChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata;
        console.log();
        var s = n[e].tp_text[t];
        n[e].val = s, this.setData({
            pagedata: n
        });
    },
    bindDateChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata;
        console.log(n), n[e].val = t, this.setData({
            pagedata: n
        });
    },
    bindTimeChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata;
        console.log(n), n[e].val = t, this.setData({
            pagedata: n
        });
    },
    checkboxChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata;
        console.log(n), n[e].val = t, this.setData({
            pagedata: n
        });
    },
    radioChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, n = this.data.pagedata;
        console.log(n), n[e].val = t, this.setData({
            pagedata: n
        });
    },
    choiceimg1111: function(a) {
        var o = this, t = 0, i = o.data.zhixin, d = a.currentTarget.dataset.index, r = o.data.pagedata, e = r[d].val, n = r[d].tp_text[0];
        e ? t = e.length : (t = 0, e = []);
        var s = n - t, c = r[d].z_val ? r[d].z_val : [];
        wx.chooseImage({
            count: s,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                i = !0, o.setData({
                    zhixin: i
                }), wx.showLoading({
                    title: "图片上传中"
                });
                var t = a.tempFilePaths;
                e = e.concat(t), r[d].val = e, o.setData({
                    pagedata: r
                });
                var n = 0, s = t.length;
                !function e() {
                    wx.uploadFile({
                        url: o.data.baseurl + "wxupimg",
                        filePath: t[n],
                        name: "file",
                        success: function(a) {
                            var t = a.data;
                            c.push(t), r[d].z_val = c, o.setData({
                                pagedata: r
                            }), ++n < s ? e() : (i = !1, o.setData({
                                zhixin: i
                            }), wx.hideLoading());
                        }
                    });
                }();
            }
        });
    },
    delimg: function(a) {
        var t = a.currentTarget.dataset.index, e = a.currentTarget.dataset.id, n = this.data.pagedata, s = n[t].val;
        s.splice(e, 1), 0 == s.length && (s = ""), n[t].val = s, this.setData({
            pagedata: n
        });
    },
    namexz: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.pagedata[t], n = [], s = 0; s < e.tp_text.length; s++) {
            var o = {};
            o.keys = e.tp_text[s], o.val = 1, n.push(o);
        }
        console.log(n), this.setData({
            ttcxs: 1,
            formindex: t,
            xx: n,
            xuanz: 0,
            lixuanz: -1
        }), this.riqi();
    },
    riqi: function() {
        for (var a = new Date(), t = new Date(a.getTime()), e = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(), n = this.data.xx, s = 0; s < n.length; s++) n[s].val = 1;
        this.setData({
            xx: n
        }), this.gettoday(e);
        var o = [], i = [], d = new Date();
        for (s = 0; s < 5; s++) {
            var r = new Date(d.getTime() + 24 * s * 3600 * 1e3), c = r.getFullYear(), l = r.getMonth() + 1, u = r.getDate(), g = l + "月" + u + "日", h = c + "-" + l + "-" + u;
            o.push(g), i.push(h);
        }
        this.setData({
            arrs: o,
            fallarrs: i,
            today: e
        });
    },
    xuanzd: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.fallarrs[t], n = this.data.xx, s = 0; s < n.length; s++) n[s].val = 1;
        this.setData({
            xuanz: t,
            today: e,
            lixuanz: -1,
            xx: n
        }), this.gettoday(e);
    },
    goux: function(a) {
        var t = a.currentTarget.dataset.index;
        console.log(t), this.setData({
            lixuanz: t
        });
    },
    gettoday: function(a) {
        var s = this, t = s.data.id, e = s.data.formindex, o = s.data.xx;
        wx.request({
            url: s.data.baseurl + "doPageDuzhan",
            data: {
                uniacid: s.data.uniacid,
                id: t,
                types: "showPro_lv_buy",
                days: a,
                pagedatekey: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                for (var t = a.data.data, e = 0; e < t.length; e++) o[t[e]].val = 2;
                var n = 0;
                t.length == o.length && (n = 1), s.setData({
                    xx: o,
                    isover: n
                });
            }
        });
    },
    weixinadd: function() {
        var i = this;
        wx.chooseAddress({
            success: function(a) {
                for (var t = a.provinceName + " " + a.cityName + " " + a.countyName + " " + a.detailInfo, e = a.userName, n = a.telNumber, s = i.data.pagedata, o = 0; o < s.length; o++) 0 == s[o].type && 2 == s[o].tp_text[0].yval && (s[o].val = e), 
                0 == s[o].type && 3 == s[o].tp_text[0].yval && (s[o].val = n), 0 == s[o].type && 4 == s[o].tp_text[0].yval && (s[o].val = t);
                console.log(s), i.setData({
                    myname: e,
                    mymobile: n,
                    myaddress: t,
                    pagedata: s
                });
            }
        });
    },
    save_nb: function() {
        var a = this, t = a.data.today, e = a.data.xx, n = a.data.lixuanz;
        if (-1 == n) return wx.showModal({
            title: "提现",
            content: "请选择预约的选项",
            showCancel: !1
        }), !1;
        var s = "已选择" + t + "，" + e[n].keys.yval, o = a.data.pagedata, i = a.data.formindex;
        o[i].val = s, o[i].days = t, o[i].indexkey = i, o[i].xuanx = n, console.log(o), 
        a.setData({
            ttcxs: 0,
            pagedata: o
        });
    },
    quxiao: function() {
        this.setData({
            ttcxs: 0
        });
    },
    changeName: function(a) {
        this.setData({
            name: a.detail.value
        });
    },
    changeDate: function(a) {
        this.setData({
            date: a.detail.value
        });
    },
    changeRegion: function(a) {
        this.setData({
            region: a.detail.value.join("-")
        });
    },
    changeDetail: function(a) {
        this.setData({
            addressDetail: a.detail.value
        });
    },
    confirmRegister: function(a) {
        var t = this, e = a.detail.formId;
        if (t.data.phoneNumber) if (t.data.name) if (t.data.date) if (t.data.region) if (t.data.addressDetail) {
            var n = t.data.pagedata;
            console.log(n.length);
            for (var s = 0; s < n.length; s++) if (console.log(n[s].ismust), console.log(n[s].val), 
            1 == n[s].ismust && "" == n[s].val) return wx.showModal({
                title: "提醒",
                content: n[s].name + "为必填项！",
                showCancel: !1
            }), !1;
            wx.getStorage({
                key: "openid",
                success: function(a) {
                    wx.request({
                        url: t.data.baseurl + "doPageregisterVIP",
                        data: {
                            uniacid: t.data.uniacid,
                            openid: a.data,
                            name: t.data.name,
                            phoneNumber: t.data.phoneNumber,
                            date: t.data.date,
                            region: t.data.region,
                            addressDetail: t.data.addressDetail,
                            formId: e,
                            cardname: t.data.cardname,
                            pagedata: JSON.stringify(n)
                        },
                        cachetime: "30",
                        success: function(a) {
                            3 == a.data.data ? wx.showModal({
                                title: "提示",
                                content: "申请成功",
                                showCancel: !1,
                                success: function(a) {
                                    t.data.pagetype ? wx.redirectTo({
                                        url: "/sudu8_page/register_success/register_success"
                                    }) : wx.navigateBack({
                                        delta: 1
                                    });
                                }
                            }) : 1 == a.data ? wx.showModal({
                                title: "提示",
                                content: "申请成功，请等待审核！",
                                showCancel: !1,
                                success: function(a) {
                                    wx.redirectTo({
                                        url: "/sudu8_page/usercenter/usercenter"
                                    });
                                }
                            }) : wx.showModal({
                                title: "提示",
                                content: "申请失败",
                                showCancel: !1
                            });
                        },
                        fail: function(a) {
                            console.log(a);
                        }
                    });
                }
            });
        } else wx.showModal({
            title: "详细地址不可为空！",
            content: "请重新输入",
            showCancel: !1
        }); else wx.showModal({
            title: "地区不可为空！",
            content: "请重新输入",
            showCancel: !1
        }); else wx.showModal({
            title: "生日不可为空！",
            content: "请重新输入",
            showCancel: !1
        }); else wx.showModal({
            title: "姓名不可为空！",
            content: "请重新输入",
            showCancel: !1
        }); else wx.showModal({
            title: "手机号不可为空！",
            content: "请重新输入",
            showCancel: !1
        });
    }
});