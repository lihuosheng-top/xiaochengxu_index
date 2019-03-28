var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page_signs: "/sudu8_page/book/book",
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time
        },
        baseinfo: [],
        date_c: "",
        time_c: "",
        minHeight: 220,
        heighthave: 0
    },
    onPullDownRefresh: function() {
        this.getbaseinfo();
    },
    onLoad: function(a) {
        var t = this, e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getbaseinfo(), app.util(t.getinfos, e, t.data.uniacid);
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
                });
            }
        });
    },
    getbaseinfo: function() {
        var f = this;
        wx.request({
            url: f.data.baseurl + "doPageBase",
            data: {
                uniacid: f.data.uniacid,
                vs1: 1
            },
            cachetime: "30",
            success: function(a) {
                f.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: f.data.baseinfo.base_tcolor,
                    backgroundColor: f.data.baseinfo.base_color
                });
            },
            fail: function(a) {}
        }), wx.request({
            url: f.data.baseurl + "doPageFormsConfig",
            data: {
                uniacid: f.data.uniacid
            },
            cachetime: "30",
            success: function(a) {
                var t = a.data.data, e = a.data.data.single_v, o = a.data.data.checkbox_v, n = a.data.data.s2.s2v, i = a.data.data.c2.c2v, s = new Array(), d = new Array(), r = new Array(), l = new Array();
                s = e ? e.split(",") : "无", d = n ? n.split(",") : "无", r = o ? o.split(",") : "无", 
                l = i ? i.split(",") : "无", "pic" == t.forms_head && f.setData({
                    forms_head_con: WxParse.wxParse("forms_head_con", "html", t.forms_head_con, f, 0)
                }), f.setData({
                    formsConfig: t,
                    single_v: s,
                    checkbox_v: r,
                    single_v2: d,
                    checkbox_v2: l
                }), wx.setNavigationBarTitle({
                    title: f.data.formsConfig.forms_name
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    bindDateChange: function(a) {
        this.setData({
            date_c: a.detail.value
        });
    },
    bindTimeChange: function(a) {
        this.setData({
            time_c: a.detail.value
        });
    },
    formSubmit: function(a) {
        var t = this;
        if (0 == a.detail.value.name.length && 1 == t.data.formsConfig.name_must) return wx.showModal({
            title: "提示",
            content: "请输入" + t.data.formsConfig.name,
            showCancel: !1
        }), !1;
        if (1 == t.data.formsConfig.tel_use && 0 == a.detail.value.tel.length && 1 == t.data.formsConfig.tel_must) return wx.showModal({
            title: "提示",
            content: "请输入" + t.data.formsConfig.tel,
            showCancel: !1
        }), !1;
        if (1 == t.data.formsConfig.wechat_use && 0 == a.detail.value.wechat.length && 1 == t.data.formsConfig.wechat_must) return wx.showModal({
            title: "提示",
            content: "请输入" + t.data.formsConfig.wechat,
            showCancel: !1
        }), !1;
        if (1 == t.data.formsConfig.address_use && 0 == a.detail.value.address.length && 1 == t.data.formsConfig.address_must) return wx.showModal({
            title: "提示",
            content: "请输入" + t.data.formsConfig.address,
            showCancel: !1
        }), !1;
        if (1 == t.data.formsConfig.t5.t5u && 0 == a.detail.value.t5.length && 1 == t.data.formsConfig.t5.t5m) return wx.showModal({
            title: "提示",
            content: "请输入" + t.data.formsConfig.t5.t5n,
            showCancel: !1
        }), !1;
        if (1 == t.data.formsConfig.t6.t6u && 0 == a.detail.value.t6.length && 1 == t.data.formsConfig.t6.t6m) return wx.showModal({
            title: "提示",
            content: "请输入" + t.data.formsConfig.t6.t6n,
            showCancel: !1
        }), !1;
        if (1 == t.data.formsConfig.date_use && "" == a.detail.value.date && 1 == t.data.formsConfig.date_must) return wx.showModal({
            title: "提示",
            content: "请选择" + t.data.formsConfig.date,
            showCancel: !1
        }), !1;
        if (1 == t.data.formsConfig.time_use && "" == a.detail.value.time && 1 == t.data.formsConfig.time_must) return wx.showModal({
            title: "提示",
            content: "请选择" + t.data.formsConfig.time,
            showCancel: !1
        }), !1;
        if (1 == t.data.formsConfig.single_use && "" == a.detail.value.single && 1 == t.data.formsConfig.single_must) return wx.showModal({
            title: "提示",
            content: "请选择" + t.data.formsConfig.single_n,
            showCancel: !1
        }), !1;
        if (1 == t.data.formsConfig.s2.s2u && "" == a.detail.value.s2 && 1 == t.data.formsConfig.s2.s2m) return wx.showModal({
            title: "提示",
            content: "请选择" + t.data.formsConfig.s2.s2n,
            showCancel: !1
        }), !1;
        if (1 == t.data.formsConfig.checkbox_use) {
            if ("" == a.detail.value.checkbox && 1 == t.data.formsConfig.checkbox_must) return wx.showModal({
                title: "提示",
                content: "请选择" + t.data.formsConfig.checkbox_n,
                showCancel: !1
            }), !1;
            a.detail.value.checkbox = a.detail.value.checkbox.join(",");
        }
        if (1 == t.data.formsConfig.c2.c2u) {
            if ("" == a.detail.value.c2 && 1 == t.data.formsConfig.c2.c2m) return wx.showModal({
                title: "提示",
                content: "请选择" + t.data.formsConfig.c2.c2n,
                showCancel: !1
            }), !1;
            a.detail.value.c2 = a.detail.value.c2.join(",");
        }
        if (1 == t.data.formsConfig.content_use && 0 == a.detail.value.content.length && 1 == t.data.formsConfig.content_must) return wx.showModal({
            title: "提示",
            content: "请输入" + t.data.formsConfig.content_n,
            showCancel: !1
        }), !1;
        if (1 == t.data.formsConfig.con2.con2u && 0 == a.detail.value.con2.length && 1 == t.data.formsConfig.con2.con2m) return wx.showModal({
            title: "提示",
            content: "请输入" + t.data.formsConfig.con2.con2n,
            showCancel: !1
        }), !1;
        var e = a.detail.value;
        e.uniacid = t.data.uniacid;
        var o = a.detail.formId;
        e.formid = o, e.openid = wx.getStorageSync("openid");
        var n = new Date(), i = n.getMonth() + 1 + "" + n.getDate() + (3600 * n.getHours() + 60 * n.getMinutes() + n.getSeconds()), s = wx.getStorageSync("mypretime");
        s ? i - s > t.data.formsConfig.subtime && wx.setStorage({
            key: "mypretime",
            data: i,
            success: function(a) {
                console.log("ok_new");
            },
            fail: function(a) {
                console.log("err_new");
            }
        }) : wx.setStorage({
            key: "mypretime",
            data: i,
            success: function(a) {
                console.log("ok_first");
            },
            fail: function(a) {
                console.log("err_first");
            }
        }), wx.showToast({
            title: "数据提交中...",
            icon: "loading",
            duration: 5e3
        }), wx.request({
            url: t.data.baseurl + "doPageAddForms",
            cachetime: "30",
            data: e,
            method: "POST",
            success: function(a) {
                wx.showToast({
                    title: t.data.formsConfig.success,
                    icon: "success",
                    duration: 3e3,
                    success: function() {
                        setTimeout(function() {
                            wx.redirectTo({
                                url: "/sudu8_page/index/index"
                            });
                        }, 3e3);
                    }
                });
            },
            fail: function(a) {
                wx.showModal({
                    title: "提示",
                    content: "提交失败，请打电话联系商家！",
                    showCancel: !1
                });
            }
        });
    },
    swiperLoad: function(o) {
        var n = this;
        wx.getSystemInfo({
            success: function(a) {
                var t = o.detail.width / o.detail.height, e = a.windowWidth / t;
                n.data.heighthave || n.setData({
                    minHeight: e,
                    heighthave: 1
                });
            }
        });
    },
    makePhoneCall: function(a) {
        var t = this.data.baseinfo.tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    makePhoneCallB: function(a) {
        var t = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    openMap: function(a) {
        wx.openLocation({
            latitude: parseFloat(this.data.baseinfo.latitude),
            longitude: parseFloat(this.data.baseinfo.longitude),
            name: this.data.baseinfo.name,
            address: this.data.baseinfo.address,
            scale: 22
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.formsConfig.forms_name + "-" + this.data.baseinfo.name
        };
    }
});