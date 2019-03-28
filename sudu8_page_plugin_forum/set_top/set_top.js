var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        fid: 0,
        rid: 0,
        stick_money: 0,
        stick_days: 0,
        userMoney: 0,
        returnpage: 2,
        allmoney: 0
    },
    onLoad: function(a) {
        var t = this, e = a.fid, n = a.rid, i = a.returnpage;
        t.setData({
            fid: e,
            rid: n,
            returnpage: i
        }), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarTitle({
                    title: "置顶"
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), t.getForumSet(), t.getUserMoney();
    },
    onReady: function() {},
    getForumSet: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageForumSet",
            data: {
                uniacid: t.data.uniacid
            },
            success: function(a) {
                t.setData({
                    stick_money: a.data.data.stick_money
                });
            },
            fail: function(a) {}
        });
    },
    getStickDays: function(a) {
        var t = a.detail.value, e = this.data.stick_money * t;
        e = e.toFixed(2), this.setData({
            stick_days: t,
            allmoney: e
        });
    },
    getUserMoney: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageGetUserMoney",
            data: {
                uniacid: t.data.uniacid,
                openid: wx.getStorageSync("openid")
            },
            success: function(a) {
                t.setData({
                    userMoney: a.data.data
                });
            },
            fail: function(a) {}
        });
    },
    formSubmit: function(a) {
        var t = this, e = t.data.stick_days;
        if (0 == e) return wx.showModal({
            title: "提示",
            content: "请输入置顶天数",
            showCancel: !1
        }), !1;
        var n = t.data.stick_money, i = a.detail.formId, o = t.data.userMoney;
        0 < n ? wx.request({
            url: t.data.baseurl + "doPageForumOrder",
            data: {
                uniacid: t.data.uniacid,
                release_money: 0,
                stick_days: e,
                stick_money: n,
                openid: wx.getStorageSync("openid"),
                formId: i
            },
            success: function(a) {
                if (1 == a.data.data.type) wx.showModal({
                    title: "请注意",
                    content: "您的余额为" + o + "元，本次将扣除" + e * n + "元",
                    success: function(a) {
                        a.confirm && t.setStick();
                    }
                }); else {
                    if ("success" == a.data.data.message) {
                        a.data.data.order_id;
                        t.setData({
                            prepay_id: a.data.data.package
                        }), wx.requestPayment({
                            timeStamp: a.data.data.timeStamp,
                            nonceStr: a.data.data.nonceStr,
                            package: a.data.data.package,
                            signType: "MD5",
                            paySign: a.data.data.paySign,
                            success: function(a) {
                                0 < t.data.userMoney ? wx.request({
                                    url: t.data.baseurl + "doPageUpdateUserMoney",
                                    data: {
                                        uniacid: t.data.uniacid,
                                        openid: wx.getStorageSync("openid")
                                    },
                                    success: function(a) {
                                        1 == a.data.data && wx.showToast({
                                            title: "支付成功",
                                            icon: "success",
                                            duration: 3e3,
                                            success: function(a) {
                                                t.setStick();
                                            }
                                        });
                                    }
                                }) : wx.showToast({
                                    title: "支付成功",
                                    icon: "success",
                                    duration: 3e3,
                                    success: function(a) {
                                        t.setStick();
                                    }
                                });
                            },
                            fail: function(a) {},
                            complete: function(a) {}
                        });
                    }
                    "error" == a.data.data.message && wx.showModal({
                        title: "提醒",
                        content: a.data.data.message,
                        showCancel: !1
                    });
                }
            },
            fail: function(a) {}
        }) : t.setStick();
    },
    setStick: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageSetStick",
            data: {
                uniacid: t.data.uniacid,
                rid: t.data.rid,
                stick_money: t.data.stick_money,
                stick_days: t.data.stick_days
            },
            success: function(a) {
                console.log(a), 1 == a.data.data ? wx.showModal({
                    title: "提示",
                    content: "置顶成功",
                    showCancel: !1,
                    success: function(a) {
                        wx.navigateBack({
                            delta: t.data.returnpage
                        });
                    }
                }) : wx.showModal({
                    title: "提示",
                    content: "置顶失败",
                    showCancel: !1
                });
            },
            fail: function(a) {}
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});