var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js");

function count_down(a, t) {
    var e = date_format(t);
    a.setData({
        day: e[0],
        hour: e[1],
        min: e[2],
        sec: e[3]
    }), t <= 0 ? a.setData({
        clock: "已经截止"
    }) : setTimeout(function() {
        count_down(a, t -= 1e3);
    }, 1e3);
}

function date_format(a) {
    var t = Math.floor(a / 1e3), e = Math.floor(t / 3600), i = Math.floor(e / 24), s = fill_zero_prefix(e % 24), n = fill_zero_prefix(Math.floor((t - 3600 * e) / 60)), o = fill_zero_prefix(t - 3600 * e - 60 * n), d = (fill_zero_prefix(Math.floor(a % 1e3 / 10)), 
    new Array());
    return d[0] = i, d[1] = s, d[2] = n, d[3] = o, d;
}

function fill_zero_prefix(a) {
    return a < 10 ? "0" + a : a;
}

var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        last_index: 0,
        amplification_index: 0,
        roll_flag: !0,
        max_number: 8,
        speed: 300,
        finalindex: 0,
        myInterval: "",
        max_speed: 40,
        minturns: 12,
        runs_now: 0,
        flag: !1,
        is_button: !1,
        isShow: !1,
        need_fillinfo: !1,
        is_show: !0,
        times: 1,
        close: 0,
        prize_text: "",
        prize_img: "",
        sj_mb: 0,
        hr: "",
        min: "",
        sec: "",
        share_open: ""
    },
    onLoad: function(a) {
        var t = this;
        a.id && (t.data.id = a.id), a.times && (console.log(a.times), t.data.times = a.times);
        var e = 0;
        a.fxsid && (e = a.fxsid, t.data.fxsid = e), app.util(t.getinfos, e, t.data.uniacid), 
        a.openid && wx.request({
            url: t.data.baseurl + "dopageshareSuccess",
            data: {
                uniacid: t.data.uniacid,
                id: t.data.id,
                openid: a.openid
            },
            success: function(a) {
                console.log(a);
            }
        }), t.showThreeLucky(a.id), t.getPrizes(a.id), t.getConfig(a.id), t.getBase();
    },
    getBase: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            cachetime: "30",
            success: function(a) {
                console.log(a.data), wx.setNavigationBarColor({
                    frontColor: a.data.data.base_tcolor,
                    backgroundColor: a.data.data.base_color
                }), t.setData({
                    share_open: a.data.data.share_open
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    huoqusq: function() {
        var r = this, c = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(a) {
                var t = a.userInfo, e = t.nickName, i = t.avatarUrl, s = t.gender, n = t.province, o = t.city, d = t.country;
                wx.request({
                    url: r.data.baseurl + "doPageUseupdate",
                    data: {
                        uniacid: r.data.uniacid,
                        openid: c,
                        nickname: e,
                        avatarUrl: i,
                        gender: s,
                        province: n,
                        city: o,
                        country: d
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        wx.setStorageSync("golobeuid", a.data.data.id), wx.setStorageSync("golobeuser", a.data.data), 
                        r.setData({
                            isview: 0,
                            globaluser: a.data.data
                        }), console.log(r.data.activity.id), r.getConfig(r.data.activity.id);
                    }
                });
            },
            fail: function() {
                app.selfinfoget(r.chenggfh, r.data.uniacid);
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
    getConfig: function(a) {
        var t = this, e = wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "dopagegetConfig",
            data: {
                uniacid: t.data.uniacid,
                openid: e,
                id: a
            },
            success: function(a) {
                console.log(a), 0 == a.data.data.flag && t.showModal("进入失败", "活动未开启"), 1 == a.data.data.flag && t.showModal("进入失败", "活动尚未开始！"), 
                2 == a.data.data.flag && t.showModal("进入失败", "活动已结束！"), "" == a.data.data.userinfo.nickname && t.setData({
                    isview: 1
                }), wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: a.data.data.nav_color ? a.data.data.nav_color : "#FEA049"
                }), t.setData({
                    is_button: "1" == a.data.data.base.means,
                    remain_times: parseInt(a.data.data.base.every_join) + a.data.data.share_num * parseInt(a.data.data.base.share_add) - a.data.data.record_num + a.data.data.prizescount,
                    base: a.data.data.base,
                    activity: a.data.data
                }), 1 == t.data.times && (count_down(t, a.data.data.remaintime), WxParse.wxParse("rule", "html", a.data.data.descp, t, 0), 
                "0" == t.data.base.fill_time && (1 == t.data.activity.is_vip ? t.setData({
                    userinfo_name: t.data.activity.userinfo.realname,
                    userinfo_mobile: t.data.activity.userinfo.mobile,
                    userinfo_address: t.data.activity.userinfo.address,
                    close: 8,
                    checkout: !0
                }) : "0" == t.data.base.users_type && 1 == t.data.activity.fill_info && t.setData({
                    userinfo_name: t.data.activity.userinfo.realname,
                    userinfo_mobile: t.data.activity.userinfo.mobile,
                    userinfo_address: t.data.activity.userinfo.address,
                    close: 8,
                    checkout: !0
                })));
            }
        });
    },
    showModal: function(a, t) {
        wx.showModal({
            title: a,
            content: t,
            showCancel: !1,
            success: function(a) {
                a.confirm && wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    getPrizes: function(a) {
        var t = this;
        wx.request({
            url: t.data.baseurl + "dopagegetPrizes",
            data: {
                uniacid: t.data.uniacid,
                id: a
            },
            success: function(a) {
                console.log(a), t.setData({
                    prizes: a.data.data
                });
            }
        });
    },
    onShow: function() {
        var t = this;
        0 == t.data.is_button && (t.data.isShow = !0, console.log("33333"), wx.onAccelerometerChange(function(a) {
            t.data.isShow && 1 < a.x && 1 < a.y && t.startrolling();
        }));
    },
    onHide: function() {
        this.data.isShow = !1;
    },
    startrolling: function() {
        var t = this, a = !1;
        if (t.setData({
            close: 0,
            sj_mb: 1
        }), console.log(t.data.activity), t.data.activity.record_num >= parseInt(t.data.base.every_join) + t.data.activity.share_num * parseInt(t.data.base.share_add)) this.setData({
            close: 2
        }); else if ("1" == t.data.base.just_one && 1 <= t.data.activity.win_num) wx.showModal({
            title: "很抱歉",
            content: "您已中过奖",
            showCancel: !1
        }); else if (t.data.activity.user_jifen < parseInt(t.data.base.jifen)) this.setData({
            close: 1
        }); else if (0 == t.data.activity.is_vip ? "1" == t.data.base.users_type ? wx.showModal({
            title: "很抱歉",
            content: "参与活动需要开通会员",
            success: function(a) {
                a.confirm && wx.navigateTo({
                    url: "/sudu8_page/register/register?from=lottery"
                }), a.cancel && wx.navigateBack({
                    delta: 1
                });
            }
        }) : "0" == t.data.base.fill_time && 0 == t.data.activity.fill_info ? wx.showModal({
            title: "提示",
            content: "抽奖需要您的信息",
            cancelText: "填信息",
            confirmText: "开会员",
            success: function(a) {
                a.confirm && (t.setData({
                    sj_mb: 0
                }), wx.navigateTo({
                    url: "/sudu8_page/register/register?from=lottery"
                })), a.cancel && t.setData({
                    close: 8
                });
            }
        }) : a = !0 : a = !0, a) {
            var e = t.data.activity;
            e.user_jifen -= t.data.base.jifen, t.setData({
                activity: e,
                isShow: !1
            });
            var i = wx.getStorageSync("openid");
            wx.request({
                url: t.data.baseurl + "dopagedrawLottery",
                data: {
                    uniacid: t.data.uniacid,
                    id: t.data.id,
                    openid: i
                },
                success: function(a) {
                    console.log(a.data.data), a.data.data.flag ? t.data.finalindex = a.data.data.index : t.data.finalindex = a.data.data.empty, 
                    t.data.flag = a.data.data.flag;
                }
            }), t.data.runs_now = 0, t.data.roll_flag && (t.data.roll_flag = !1, t.setData({
                is_rolling: !0,
                last_index: 0,
                amplification_index: 0,
                max_number: 8,
                speed: 300,
                finalindex: 0,
                myInterval: "",
                max_speed: 40,
                minturns: 12,
                runs_now: 0,
                flag: !1
            }), t.rolling());
        }
    },
    rolling: function(a) {
        var t = this;
        t.data.myInterval = setTimeout(function() {
            t.rolling();
        }, t.data.speed), t.data.runs_now++, t.data.amplification_index++;
        var e = t.data.minturns * t.data.max_number + t.data.finalindex - t.data.last_index;
        t.data.runs_now <= e / 3 * 2 ? (t.data.speed -= 30, t.data.speed <= t.data.max_speed && (t.data.speed = t.data.max_speed)) : t.data.runs_now >= e ? (t.setData({
            is_rolling: !1,
            times: 2
        }), t.getConfig(t.data.id), clearInterval(t.data.myInterval), t.data.roll_flag = !0, 
        console.log(t.data.amplification_index), t.data.flag && t.data.prizes[t.data.finalindex] ? setTimeout(function() {
            "1" == t.data.base.fill_time ? 0 == t.data.activity.is_vip && 0 == t.data.activity.fill_info ? wx.showModal({
                title: "中奖啦！！",
                content: "恭喜您获得" + t.data.prizes[t.data.finalindex].detail,
                cancelText: "填信息",
                confirmText: "开会员",
                success: function(a) {
                    a.confirm && (t.setData({
                        sj_mb: 0
                    }), wx.redirectTo({
                        url: "/sudu8_page/register/register?from=lottery"
                    })), a.cancel && t.setData({
                        close: 8
                    });
                }
            }) : wx.showModal({
                title: "中奖啦！！",
                content: "恭喜您获得" + t.data.prizes[t.data.finalindex].detail,
                showCancel: !1,
                success: function(a) {
                    a.confirm && (t.data.activity.is_vip, t.setData({
                        userinfo_name: t.data.activity.userinfo.realname,
                        userinfo_mobile: t.data.activity.userinfo.mobile,
                        userinfo_address: t.data.activity.userinfo.address,
                        close: 8,
                        checkout: !0
                    }));
                }
            }) : (t.data.prizes[t.data.finalindex].detail, t.setData({
                close: 6,
                prize_text: t.data.prizes[t.data.finalindex].detail,
                prize_img: t.data.prizes[t.data.finalindex].thumb
            })), t.showThreeLucky(t.data.id);
        }, 800) : setTimeout(function() {
            t.setData({
                close: 5
            });
        }, 800), t.data.is_button || t.setData({
            isShow: !0
        })) : e - t.data.runs_now <= 10 ? t.data.speed += 20 : (t.data.speed += 10, 100 <= t.data.speed && (t.data.speed = 100)), 
        t.data.amplification_index > t.data.max_number && (t.data.amplification_index = 1), 
        t.setData(t.data);
    },
    onPullDownRefresh: function() {
        this.data.times = 1, this.getConfig(this.data.id);
    },
    onShareAppMessage: function() {
        var e = this, t = wx.getStorageSync("openid");
        if ("1" == e.data.base.share_type) var a = "/sudu8_page_plugin_shake/index/index?id=" + e.data.id; else a = "/sudu8_page_plugin_shake/index/index?id=" + e.data.id + "&openid=" + t;
        return {
            title: e.data.activity.title,
            path: a,
            success: function(a) {
                e.data.activity.share_num >= parseInt(e.data.base.everyday_share) ? wx.showModal({
                    title: "注意",
                    content: "分享获赠次数已达每日上限！",
                    showCancel: !1
                }) : e.data.activity.total_share_num >= parseInt(e.data.base.total_share) ? wx.showModal({
                    title: "注意",
                    content: "分享获赠次数已达本次活动上限！",
                    showCancel: !1
                }) : (wx.request({
                    url: e.data.baseurl + "dopageaddsharenum",
                    data: {
                        uniacid: e.data.uniacid,
                        id: e.data.id
                    },
                    success: function(a) {
                        console.log(a);
                        var t = e.data.activity;
                        t.share += 1, e.setData({
                            activity: t
                        });
                    }
                }), "1" == e.data.base.share_type ? wx.request({
                    url: e.data.baseurl + "dopageshareSuccess",
                    data: {
                        uniacid: e.data.uniacid,
                        id: e.data.id,
                        openid: t
                    },
                    success: function(a) {
                        if (console.log(a), a.data.data) {
                            var t = e.data.activity;
                            t.share_num += 1, t.total_share_num += 1, e.setData({
                                activity: t
                            }), wx.showModal({
                                title: "分享成功！",
                                content: "恭喜您获得" + e.data.base.share_add + "次抽奖机会！",
                                showCancel: !1,
                                success: function() {
                                    e.setData({
                                        close: 0,
                                        sj_mb: 0
                                    });
                                }
                            });
                        }
                    }
                }) : wx.showModal({
                    title: "分享成功！",
                    content: "分享被点进您可获得" + e.data.base.share_add + "次抽奖机会！",
                    showCancel: !1,
                    success: function() {
                        e.setData({
                            close: 0,
                            sj_mb: 0
                        });
                    }
                }));
            }
        };
    },
    changeName: function(a) {
        this.setData({
            userinfo_name: a.detail.value
        });
    },
    changeMobile: function(a) {
        this.setData({
            userinfo_mobile: a.detail.value
        });
    },
    changeAddress: function(a) {
        this.setData({
            userinfo_address: a.detail.value
        });
    },
    changeUserinfo: function() {
        var t = this, a = wx.getStorageSync("openid");
        t.data.userinfo_name ? t.data.userinfo_mobile ? t.data.userinfo_address ? wx.request({
            url: t.data.baseurl + "dopagechangeUserinfo",
            data: {
                uniacid: t.data.uniacid,
                openid: a,
                name: t.data.userinfo_name,
                mobile: t.data.userinfo_mobile,
                address: t.data.userinfo_address
            },
            success: function(a) {
                console.log(a), 1 == t.data.activity.fill_info ? t.setData({
                    close: 0
                }) : wx.showToast({
                    title: "提交成功！",
                    icon: "success",
                    success: function() {
                        setTimeout(function() {
                            var a = t.data.activity;
                            a.fill_info = !0, t.setData({
                                close: 0,
                                activity: a
                            });
                        }, 1500);
                    }
                });
            }
        }) : wx.showModal({
            title: "地址不能为空",
            content: "请重新填写",
            showCancel: !1
        }) : wx.showModal({
            title: "手机号不能为空",
            content: "请重新填写",
            showCancel: !1
        }) : wx.showModal({
            title: "姓名不能为空",
            content: "请重新填写",
            showCancel: !1
        });
    },
    checkUserinfo: function() {
        this.setData({
            close: 0
        });
    },
    toRegisterSuccess: function() {
        wx.navigateTo({
            url: "/sudu8_page/register_success/register_success?from=lottery"
        });
    },
    setUserinfo: function(a, t, e) {
        this.setData({
            userinfo_name: a,
            userinfo_mobile: t,
            userinfo_address: e
        });
    },
    setTrueIsvip: function() {
        var a = this.data.activity;
        a.is_vip = !0, this.setData({
            activity: a
        });
    },
    close: function() {
        this.setData({
            close: 0,
            sj_mb: 0
        });
    },
    share: function() {
        this.setData({
            close: 3
        });
    },
    look_regular: function() {
        this.setData({
            close: 7
        });
    },
    chooseAdress: function() {
        var t = this;
        wx.chooseAddress({
            success: function(a) {
                console.log(a), t.setData({
                    userinfo_name: a.userName,
                    userinfo_mobile: a.telNumber,
                    userinfo_address: a.provinceName + a.cityName + a.countyName + a.detailInfo
                });
            },
            fail: function() {
                wx.showModal({
                    title: "提示",
                    content: "一键获取需要您的授权",
                    showCancel: !1
                });
            }
        });
    },
    showThreeLucky: function(a) {
        var t = this;
        wx.request({
            url: t.data.baseurl + "dopageshowThreeLucky",
            data: {
                uniacid: t.data.uniacid,
                id: a
            },
            success: function(a) {
                console.log(a), t.setData({
                    threeRecord: a.data.data
                });
            }
        });
    },
    toPrizelist: function() {
        wx.navigateTo({
            url: "../prize/prize?id=" + this.data.id + "&nav_color=" + this.data.activity.nav_color
        });
    },
    toRecordlist: function() {
        wx.navigateTo({
            url: "../win_prize/win_prize?id=" + this.data.id + "&nav_color=" + this.data.activity.nav_color
        });
    },
    toGetscore: function() {
        wx.navigateTo({
            url: "/sudu8_page/integral_collect/integral_collect"
        });
    }
});