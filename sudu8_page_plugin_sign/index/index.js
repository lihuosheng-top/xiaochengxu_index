var choose_year = null, choose_month = null, app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        bg: "",
        userinfo: "",
        hasEmptyGrid: !1,
        showPicker: !1,
        jilu: "",
        isview: 0,
        page_signs: "/sudu8_page_plugin_sign/index/index",
        tongj: ""
    },
    onPullDownRefresh: function() {
        this.data.id;
        this.getsign();
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "积分签到"
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.checkvip(), t.getsign();
        var i = new Date(), n = i.getFullYear(), s = i.getMonth() + 1;
        this.calculateEmptyGrids(n, s), this.calculateDays(n, s), this.setData({
            cur_year: n,
            cur_month: s,
            weeks_ch: [ "日", "一", "二", "三", "四", "五", "六" ]
        }), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
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
        }), app.util(t.getinfos, e, t.data.uniacid);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    checkvip: function() {
        var t = this, a = wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPagecheckvip",
            data: {
                uniacid: t.data.uniacid,
                kwd: "sign",
                openid: a
            },
            success: function(a) {
                a.data.data || (t.setData({
                    needvip: !0
                }), wx.showModal({
                    title: "进入失败",
                    content: "使用本功能需先开通vip!",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                }));
            },
            fail: function(a) {
                console.log(a);
            }
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
    getThisMonthDays: function(a, t) {
        return new Date(a, t, 0).getDate();
    },
    getFirstDayOfWeek: function(a, t) {
        return new Date(Date.UTC(a, t - 1, 1)).getDay();
    },
    calculateEmptyGrids: function(a, t) {
        var e = this.getFirstDayOfWeek(a, t), i = [];
        if (0 < e) {
            for (var n = 0; n < e; n++) i.push(n);
            this.setData({
                hasEmptyGrid: !0,
                empytGrids: i
            });
        } else this.setData({
            hasEmptyGrid: !1,
            empytGrids: []
        });
    },
    calculateDays: function(a, t) {
        var e = this, i = (this.getThisMonthDays(a, t), wx.getStorageSync("openid"));
        wx.request({
            url: e.data.baseurl + "doPageMysign",
            data: {
                uniacid: e.data.uniacid,
                openid: i,
                year: a,
                month: t
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    days: t
                });
            }
        });
    },
    handleCalendar: function(a) {
        var t = a.currentTarget.dataset.handle, e = this.data.cur_year, i = this.data.cur_month;
        if ("prev" === t) {
            var n = i - 1, s = e;
            n < 1 && (s = e - 1, n = 12), this.calculateDays(s, n), this.calculateEmptyGrids(s, n), 
            this.setData({
                cur_year: s,
                cur_month: n
            });
        } else {
            var o = i + 1, c = e;
            12 < o && (c = e + 1, o = 1), this.calculateDays(c, o), this.calculateEmptyGrids(c, o), 
            this.setData({
                cur_year: c,
                cur_month: o
            });
        }
    },
    tapDayItem: function(a) {
        var t = a.currentTarget.dataset.idx, e = this.data.days;
        e[t].choosed = !e[t].choosed, this.setData({
            days: e
        });
    },
    chooseYearAndMonth: function() {
        for (var a = this.data.cur_year, t = this.data.cur_month, e = [], i = [], n = 1900; n <= 2100; n++) e.push(n);
        for (var s = 1; s <= 12; s++) i.push(s);
        var o = e.indexOf(a), c = i.indexOf(t);
        this.setData({
            picker_value: [ o, c ],
            picker_year: e,
            picker_month: i,
            showPicker: !0
        });
    },
    pickerChange: function(a) {
        var t = a.detail.value;
        choose_year = this.data.picker_year[t[0]], choose_month = this.data.picker_month[t[1]];
    },
    tapPickerBtn: function(a) {
        var t = {
            showPicker: !1
        };
        "confirm" === a.currentTarget.dataset.type && (t.cur_year = choose_year, t.cur_month = choose_month, 
        this.calculateEmptyGrids(choose_year, choose_month), this.calculateDays(choose_year, choose_month)), 
        this.setData(t);
    },
    getsign: function() {
        var e = this, a = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "doPageMysign",
            data: {
                uniacid: e.data.uniacid,
                openid: a
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    days: t
                });
            }
        }), wx.request({
            url: e.data.baseurl + "dopageglobaluserinfo",
            data: {
                uniacid: e.data.uniacid,
                openid: a
            },
            success: function(a) {
                var t = a.data.data;
                t.nickname && t.avatar || e.setData({
                    isview: 1
                }), e.setData({
                    userinfo: a.data.data
                });
            }
        }), wx.request({
            url: e.data.baseurl + "doPageMysignjl",
            data: {
                uniacid: e.data.uniacid,
                openid: a
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    jilu: t
                });
            }
        }), wx.request({
            url: e.data.baseurl + "doPagemysigntj",
            data: {
                uniacid: e.data.uniacid,
                openid: a
            },
            success: function(a) {
                var t = a.data.data;
                e.setData({
                    tongj: t
                });
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: "积分签到"
        };
    },
    huoqusq: function() {
        var r = this, d = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(a) {
                console.log(a);
                var t = a.userInfo, e = t.nickName, i = t.avatarUrl, n = t.gender, s = t.province, o = t.city, c = t.country;
                wx.request({
                    url: r.data.baseurl + "doPageUseupdate",
                    data: {
                        uniacid: r.data.uniacid,
                        openid: d,
                        nickname: e,
                        avatarUrl: i,
                        gender: n,
                        province: s,
                        city: o,
                        country: c
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        wx.setStorageSync("golobeuid", a.data.data.id), wx.setStorageSync("golobeuser", a.data.data), 
                        r.setData({
                            isview: 0,
                            globaluser: a.data.data
                        }), r.getsign();
                    }
                });
            },
            fail: function() {
                app.util.selfinfoget(r.chenggfh);
            }
        });
    },
    qiandao: function() {
        var a = wx.getStorageSync("openid");
        a ? wx.request({
            url: this.data.baseurl + "doPageQiandao",
            data: {
                uniacid: this.data.uniacid,
                openid: a
            },
            success: function(a) {
                1 == a.data.data ? wx.showModal({
                    title: "提醒",
                    content: "您今天已经签过到了！",
                    showCancel: !1
                }) : wx.showModal({
                    title: "提醒",
                    content: "签到成功！",
                    showCancel: !1,
                    success: function(a) {
                        wx.redirectTo({
                            url: "/sudu8_page_plugin_sign/index/index"
                        });
                    }
                });
            }
        }) : wx.showModal({
            title: "签到失败",
            content: "请先授权登录再签到",
            showCancel: !1,
            success: function(a) {
                wx.redirectTo({
                    url: "/sudu8_page_plugin_sign/index/index"
                });
            }
        });
    }
});