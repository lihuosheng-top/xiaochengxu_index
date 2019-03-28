var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        banner: "",
        page_signs: "/sudu8_page/fenxiao/fenxiao",
        indicatorDots: !1,
        autoplay: !1,
        interval: 5e3,
        duration: 1e3,
        check: 0,
        xieyi_block: 0,
        input_name: "",
        input_tel: "",
        fxs_name: ""
    },
    onPullDownRefresh: function() {
        this.fxssq();
    },
    onLoad: function(a) {
        var e = this, t = 0;
        a.fxsid && (t = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), app.util(e.getinfos, t, e.data.uniacid), wx.request({
            url: e.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: e.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                e.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                }), e.fxssq();
            }
        });
    },
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link, t = a.currentTarget.dataset.linktype;
        app.redirectto(e, t);
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var e = a.data;
                t.setData({
                    openid: e
                });
            }
        });
    },
    fxssq: function() {
        var i = this, a = wx.getStorageSync("openid");
        wx.request({
            url: i.data.baseurl + "dopagesqcwfxsbase",
            data: {
                uniacid: i.data.uniacid,
                openid: a
            },
            success: function(a) {
                var e = a.data.data.sq;
                if (2 == a.data.data.userinfo.fxs) wx.redirectTo({
                    url: "/sudu8_page/fenxiao_center/fenxiao_center"
                }); else {
                    var t = a.data.data.gz;
                    wx.setNavigationBarTitle({
                        title: "申请成为" + t.fxs_name
                    });
                    var s = t.sq_thumb;
                    i.setData({
                        item: s,
                        fxs_name: t.fxs_name
                    }), 2 == t.fxs_sz && e && 1 == e.flag && wx.redirectTo({
                        url: "/sudu8_page/fenxiao_s/fenxiao_s?type=1"
                    }), 3 == t.fxs_sz && wx.redirectTo({
                        url: "/sudu8_page/fenxiao_s/fenxiao_s?type=4"
                    }), 4 == t.fxs_sz && wx.redirectTo({
                        url: "/sudu8_page/fenxiao_s/fenxiao_s?type=3"
                    });
                }
                i.setData({
                    content: WxParse.wxParse("content", "html", a.data.data.gz.fxs_xy, i, 0),
                    fxs: a.data.data.fxs
                });
            }
        });
    },
    sub: function() {
        var e = this, t = e.data.input_name, s = e.data.input_tel;
        return 0 == e.data.check ? (wx.showToast({
            title: "请先阅读协议",
            icon: "none"
        }), !1) : "" == t ? (wx.showToast({
            title: "请先输入姓名",
            icon: "none"
        }), !1) : s.length < 11 ? (wx.showToast({
            title: "请输入正确手机号",
            icon: "none"
        }), !1) : "" == s ? (wx.showToast({
            title: "请先输入手机号",
            icon: "none"
        }), !1) : void wx.getStorage({
            key: "openid",
            success: function(a) {
                wx.request({
                    url: e.data.baseurl + "dopagesqcwfxs",
                    data: {
                        uniacid: e.data.uniacid,
                        truename: t,
                        truetel: s,
                        openid: a.data
                    },
                    success: function(a) {
                        if (a.data.data < 3) {
                            var e = "";
                            -1 == a.data.data && (e = "恭喜您申请成功！"), 1 == a.data.data && (e = "您的申请正在审核中"), 2 == a.data.data && (e = "您已经是分销商了"), 
                            wx.showModal({
                                title: "提醒",
                                content: e,
                                showCancel: !1,
                                success: function() {
                                    wx.redirectTo({
                                        url: "/sudu8_page/fenxiao_center/fenxiao_center"
                                    });
                                }
                            });
                        } else wx.redirectTo({
                            url: "/sudu8_page/fenxiao_s/fenxiao_s?type=2"
                        });
                    }
                });
            }
        });
    },
    xieyi_close: function() {
        this.setData({
            xieyi_block: 0
        });
    },
    xieyi_hidden: function() {
        this.setData({
            xieyi_block: 1,
            check: 1
        });
    },
    check_change: function() {
        var a = this;
        0 == a.data.check ? a.setData({
            check: 1
        }) : a.setData({
            check: 0
        });
    },
    input_name: function(a) {
        this.setData({
            input_name: a.detail.value
        });
    },
    input_tel: function(a) {
        this.setData({
            input_tel: a.detail.value
        });
    }
});