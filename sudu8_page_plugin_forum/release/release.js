var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        release_money: 0,
        stick_money: 0,
        stick_days: 7,
        release_img: [],
        cons: "",
        fid: 0,
        rid: 0,
        funcAll: [],
        funcTitleArr: [],
        index: 0,
        userMoney: 0,
        success_rid: 0,
        address: "",
        tel: "",
        stick: 2,
        update: 0,
        cons_len: 0
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: "发布信息"
        }), wx.request({
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
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), e.huoqusq();
        var t = a.fid;
        0 < t && e.setData({
            fid: t
        });
        var s = a.rid;
        0 < s && (e.setData({
            rid: s
        }), e.getReleaseInfo());
    },
    getInputTel: function(a) {
        var e = a.detail.value;
        this.setData({
            telphone: e
        });
    },
    getReleaseInfo: function() {
        var e = this;
        wx.request({
            url: e.data.baseurl + "doPageGetForumCon",
            data: {
                rid: e.data.rid,
                uniacid: e.data.uniacid,
                types: 1
            },
            success: function(a) {
                e.setData({
                    cons: a.data.data.content,
                    release_img: a.data.data.img,
                    release_money: 0,
                    fid: a.data.data.fid,
                    telphone: a.data.data.telphone,
                    address: a.data.data.address,
                    stick: a.data.data.stick,
                    update: 1
                });
            }
        });
    },
    getlocation: function() {
        var e = this;
        wx.chooseLocation({
            success: function(a) {
                console.log(a), e.setData({
                    address: a.name
                });
            },
            fail: function() {
                wx.getSetting({
                    success: function(a) {
                        a.authSetting["scope.userLocation"] || wx.showModal({
                            title: "请授权获取当前位置",
                            content: "获取位置需要授权此功能",
                            showCancel: !1,
                            success: function(a) {
                                a.confirm && wx.openSetting({
                                    success: function(a) {
                                        !0 === a.authSetting["scope.userLocation"] ? wx.showToast({
                                            title: "授权成功",
                                            icon: "success",
                                            duration: 1e3
                                        }) : wx.showToast({
                                            title: "授权失败",
                                            icon: "success",
                                            duration: 1e3,
                                            success: function() {
                                                e.getlocation();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    },
                    fail: function(a) {
                        wx.showToast({
                            title: "调用授权窗口失败",
                            icon: "success",
                            duration: 1e3
                        });
                    }
                });
            }
        });
    },
    huoqusq: function() {
        var c = this, u = wx.getStorageSync("openid");
        c.setData({
            openid: u
        }), wx.getUserInfo({
            success: function(a) {
                var e = a.userInfo, t = e.nickName, s = e.avatarUrl, n = e.gender, i = e.province, o = e.city, d = e.country;
                wx.request({
                    url: c.data.baseurl + "doPageUseupdate",
                    data: {
                        uniacid: c.data.uniacid,
                        openid: u,
                        nickname: t,
                        avatarUrl: s,
                        gender: n,
                        province: i,
                        city: o,
                        country: d
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        wx.setStorageSync("golobeuid", a.data.data.id), wx.setStorageSync("golobeuser", a.data.data), 
                        console.log(a), c.setData({
                            isview: 0,
                            userMoney: a.data.data.money
                        });
                    }
                }), c.getforumset(), c.getfuncall();
            },
            fail: function() {
                c.setData({
                    isview: 1
                });
            }
        });
    },
    getfuncall: function() {
        var n = this;
        wx.request({
            url: n.data.baseurl + "doPageGetFuncAll",
            data: {
                uniacid: n.data.uniacid
            },
            success: function(a) {
                if (0 < a.data.data.funcAll.length) {
                    var e = a.data.data.funcAll;
                    n.setData({
                        funcAll: e,
                        funcTitleArr: a.data.data.funcTitleArr
                    });
                    var t = n.data.fid;
                    if (console.log(t), 0 < t) {
                        console.log(e);
                        for (var s = 0; s < e.length; s++) t == e[s].id && (console.log(s), n.setData({
                            index: s
                        }));
                        n.setData({
                            fid: t
                        });
                    } else n.setData({
                        fid: a.data.data.funcAll[0].id
                    });
                }
                console.log(a.data.data.funcTitleArr);
            },
            fail: function(a) {}
        });
    },
    bindPickerChange: function(a) {
        var e = a.detail.value, t = this.data.funcAll[e].id;
        this.setData({
            fid: t,
            index: e
        });
    },
    releasePay: function(a) {
        var e = this;
        if ("" == e.data.cons) return wx.showModal({
            title: "提示",
            showCancel: !1,
            content: "发布信息不能为空"
        }), !1;
        var t = a.detail.formId, s = e.data.release_money, n = e.data.userMoney, i = e.data.update;
        0 < s && 0 == i ? wx.request({
            url: e.data.baseurl + "doPageForumOrder",
            data: {
                uniacid: e.data.uniacid,
                release_money: s,
                openid: e.data.openid,
                formId: t
            },
            success: function(a) {
                if (1 == a.data.data.type) wx.showModal({
                    title: "请注意",
                    content: "您的余额为" + n + "元，本次将扣除" + s + "元",
                    success: function(a) {
                        a.confirm && e.releaseSub();
                    }
                }); else {
                    if ("success" == a.data.data.message) {
                        a.data.data.order_id;
                        e.setData({
                            prepay_id: a.data.data.package
                        }), wx.requestPayment({
                            timeStamp: a.data.data.timeStamp,
                            nonceStr: a.data.data.nonceStr,
                            package: a.data.data.package,
                            signType: "MD5",
                            paySign: a.data.data.paySign,
                            success: function(a) {
                                0 < e.data.userMoney ? wx.request({
                                    url: e.data.baseurl + "doPageUpdateUserMoney",
                                    data: {
                                        uniacid: e.data.uniacid,
                                        openid: e.data.openid
                                    },
                                    success: function(a) {
                                        1 == a.data.data && wx.showToast({
                                            title: "支付成功",
                                            icon: "success",
                                            duration: 3e3,
                                            success: function(a) {
                                                e.releaseSub();
                                            }
                                        });
                                    }
                                }) : wx.showToast({
                                    title: "支付成功",
                                    icon: "success",
                                    duration: 3e3,
                                    success: function(a) {
                                        e.releaseSub();
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
        }) : e.releaseSub();
    },
    releaseSub: function() {
        var t = this, a = t.data.cons, e = t.data.release_money, s = t.data.release_img;
        0 == s.length && (s = ""), wx.request({
            url: t.data.baseurl + "doPageReleaseSub",
            data: {
                uniacid: t.data.uniacid,
                openid: t.data.openid,
                fid: t.data.fid,
                rid: t.data.rid,
                cons: a,
                release_money: e,
                release_img: JSON.stringify(s),
                address: t.data.address,
                telphone: t.data.telphone
            },
            success: function(a) {
                var e = a.data.data;
                0 < e ? wx.showModal({
                    title: "提示",
                    showCancel: !1,
                    content: "发布成功",
                    success: function() {
                        if (1 == t.data.stick) {
                            t.data.fid;
                            wx.navigateBack({
                                delta: 1
                            });
                        } else t.setData({
                            success_rid: e
                        });
                    }
                }) : wx.showToast({
                    title: "发布失败"
                });
            },
            fail: function(a) {}
        });
    },
    goReleaseLists: function() {
        this.data.fid;
        wx.navigateBack({
            delta: 1
        });
    },
    go_set_top: function() {
        var a = this.data.fid, e = this.data.success_rid;
        wx.redirectTo({
            url: "/sudu8_page_plugin_forum/set_top/set_top?fid=" + a + "&rid=" + e + "&returnpage=2"
        });
    },
    delimg: function(a) {
        var e = a.currentTarget.dataset.index, t = this.data.release_img;
        t.splice(e, 1), this.setData({
            release_img: t
        });
    },
    getforumset: function() {
        var e = this;
        wx.request({
            url: e.data.baseurl + "doPageForumSet",
            data: {
                uniacid: e.data.uniacid
            },
            success: function(a) {
                e.setData({
                    release_money: a.data.data.release_money,
                    stick_money: a.data.data.stick_money
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getcons: function(a) {
        var e = a.detail.value, t = e.length;
        this.setData({
            cons: e,
            cons_len: t
        });
    },
    chooseImg: function() {
        var i = this, o = i.data.zhixin, d = i.data.release_img;
        d || (d = []);
        var c = i.data.baseurl + "wxupimg";
        wx.chooseImage({
            count: 9,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                o = !0, i.setData({
                    zhixin: o
                }), wx.showLoading({
                    title: "图片上传中"
                });
                var e = a.tempFilePaths, s = 0, n = e.length;
                !function t() {
                    wx.uploadFile({
                        url: c,
                        filePath: e[s],
                        name: "file",
                        success: function(a) {
                            var e = a.data;
                            d.push(e), i.setData({
                                release_img: d
                            }), ++s < n ? t() : (o = !1, i.setData({
                                zhixin: o
                            }), wx.hideLoading());
                        }
                    });
                }(), console.log(i.data.release_img);
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    select: function() {
        var a = this.data.select;
        a = 2 == a ? 1 : 2, this.setData({
            select: a
        });
    },
    bindManual: function(a) {
        var e = a.detail.value;
        this.setData({
            stick_days: e
        });
    }
});