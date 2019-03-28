var _Page;

function _defineProperty(a, t, e) {
    return t in a ? Object.defineProperty(a, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[t] = e, a;
}

var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp(), innerAudioContext = wx.createInnerAudioContext();

Page((_defineProperty(_Page = {
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        staffinfo: "",
        style: 0,
        hide_info: 0,
        id: 0,
        isview: 0,
        voice: "",
        autovoice: 0,
        music: "",
        musicAutoPlay: "",
        musicTitle: "",
        musicpay: 0,
        audioplay: 1,
        duration: "",
        curTimeVal: "",
        durationDay: "播放获取",
        curTimeValDay: "00:00",
        st: "",
        sy: "",
        status: 0,
        tabbar_t: 0,
        iszan: 0,
        zans: "",
        zan: 0,
        page_signs: "index",
        baseinfo: "",
        share: 0,
        staffset: "",
        pic: "",
        share_open: ""
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "员工名片"
        }), a.scene ? t.setData({
            id: a.scene
        }) : t.setData({
            id: a.id
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.data.fxsid = e), 1 == a.share && t.share111(), t.getBase(), 
        app.util(t.getinfos, e, t.data.uniacid), a.shareopenid && a.shareopenid != wx.getStorageSync("openid") ? wx.request({
            url: t.data.baseurl + "dopagesharecardSuccess",
            data: {
                id: t.data.id,
                shareopenid: a.shareopenid,
                openid: wx.getStorageSync("openid"),
                uniacid: t.data.uniacid
            },
            success: function(a) {
                t.addvisit(), console.log(a);
            }
        }) : t.addvisit();
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                }), t.getinfo();
            }
        });
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
    getinfo: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                wx.request({
                    url: e.data.baseurl + "dopageglobaluserinfo",
                    data: {
                        uniacid: e.data.uniacid,
                        openid: a.data
                    },
                    success: function(a) {
                        var t = a.data.data;
                        t.nickname && t.avatar || e.setData({
                            isview: 1
                        }), e.setData({
                            globaluser: a.data.data
                        });
                    }
                });
            }
        });
    },
    addvisit: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "dopageaddVisit",
            data: {
                id: t.data.id,
                openid: wx.getStorageSync("openid"),
                uniacid: t.data.uniacid
            },
            success: function(a) {
                t.getStaffInfo(), t.getStaffset();
            }
        });
    },
    getStaffInfo: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "dopagegetStaffInfo",
            data: {
                id: t.data.id,
                openid: wx.getStorageSync("openid"),
                uniacid: t.data.uniacid
            },
            success: function(a) {
                a.data.data.staffinfo ? ("" == a.data.data.userinfo.nickname && t.setData({
                    isview: 1
                }), t.setData({
                    staffinfo: a.data.data.staffinfo,
                    zan: a.data.data.staffinfo.zan,
                    voice: a.data.data.staffinfo.voice
                }), "" != t.data.voice && t.setData({
                    autovoice: a.data.data.staffinfo.autovoice
                }), "" == a.data.data.staffinfo.pic ? t.setData({
                    pic: "/sudu8_page/resource/img/default_pic.png"
                }) : t.setData({
                    pic: a.data.data.staffinfo.pic
                }), 1 == a.data.data.haszan ? t.setData({
                    zans: 1,
                    iszan: 1
                }) : t.setData({
                    zans: "",
                    iszan: 0
                }), "" == a.data.data.staffinfo.descp || null == a.data.data.staffinfo.descp ? WxParse.wxParse("descp", "html", "暂无个人简介", t, 0) : WxParse.wxParse("descp", "html", a.data.data.staffinfo.descp, t, 0), 
                0 == t.data.autovoice ? t.setData({
                    st: 10,
                    sy: "",
                    status: 0
                }) : (t.setData({
                    st: 2,
                    sy: "music-on",
                    status: 1
                }), t.audioPlay())) : wx.showModal({
                    title: "提示",
                    content: "该员工信息已被删除!",
                    success: function(a) {
                        a.confirm ? wx.navigateBack({
                            delta: 1
                        }) : a.cancel && wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        });
    },
    getStaffset: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "dopagegetStaffset",
            data: {
                uniacid: t.data.uniacid
            },
            success: function(a) {
                t.setData({
                    style: a.data.data.card_style,
                    tabbar_t: a.data.data.tabbar_t,
                    baseinfo: a.data.data.baseInfo,
                    staffset: a.data.data,
                    uniacid: t.data.uniacid
                }), console.log(t.data.tabbar_t);
            }
        });
    },
    redirectto: function(a) {
        console.log(8888);
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    onReady: function() {
        this.audioCtx = wx.createAudioContext("myAudio");
    },
    onShow: function() {},
    onHide: function() {
        this.getStaffInfo(), this.getStaffset();
    },
    onUnload: function() {
        this.audioPause(), this.getStaffset();
    },
    onPullDownRefresh: function() {
        this.getStaffInfo(), this.getStaffset();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var a = wx.getStorageSync("openid");
        return {
            title: "微信小程序名片",
            path: "/sudu8_page/staff_card/staff_card?id=" + this.data.id + "&shareopenid=" + a
        };
    },
    callphone: function(a) {
        var t = a.currentTarget.dataset.text;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    copy: function(a) {
        var t = a.currentTarget.dataset.text;
        wx.setClipboardData({
            data: t,
            success: function(a) {
                wx.getClipboardData({
                    success: function(a) {}
                });
            }
        });
    },
    addPhoneContact: function(a) {
        var e = this, t = a.currentTarget.dataset.text, n = a.currentTarget.dataset.mobile, i = a.currentTarget.dataset.wxnumber;
        null != i && "" != i || (i = n);
        var o = a.currentTarget.dataset.email, s = a.currentTarget.dataset.company, d = wx.getStorageSync("openid"), r = a.currentTarget.dataset.province, c = a.currentTarget.dataset.city, u = a.currentTarget.dataset.address;
        wx.addPhoneContact({
            firstName: t,
            mobilePhoneNumber: n,
            weChatNumber: i,
            email: o,
            organization: s,
            addressState: r,
            addressCity: c,
            addressStreet: u,
            success: function() {
                wx.request({
                    url: e.data.baseurl + "dopagesavecard",
                    data: {
                        id: e.data.id,
                        openid: d,
                        uniacid: e.data.uniacid
                    },
                    success: function(a) {
                        console.log(a);
                        var t = a.data.data;
                        0 == t ? wx.showModal({
                            title: "提示",
                            content: "保存成功, 增加积分与抽奖次数!",
                            confirmText: "去抽奖",
                            success: function(a) {
                                a.confirm ? e.prizes() : a.cancel && console.log("用户点击取消");
                            }
                        }) : 1 == t ? wx.showModal({
                            title: "提示",
                            content: "保存成功, 但积分增加与抽奖次数都已达到达每日上限!",
                            confirmText: "去抽奖",
                            success: function(a) {
                                a.confirm ? e.prizes() : a.cancel && console.log("用户点击取消");
                            }
                        }) : 2 == t ? wx.showModal({
                            title: "提示",
                            content: "保存成功, 积分增加已达到每日上限,继续保存可增加抽奖次数!",
                            confirmText: "去抽奖",
                            success: function(a) {
                                a.confirm ? e.prizes() : a.cancel && console.log("用户点击取消");
                            }
                        }) : 3 == t ? wx.showModal({
                            title: "提示",
                            content: "保存成功, 抽奖次数已达到每日上限,继续保存可增加积分!!",
                            confirmText: "去抽奖",
                            success: function(a) {
                                a.confirm ? e.prizes() : a.cancel && console.log("用户点击取消");
                            }
                        }) : 10 == t ? wx.showModal({
                            title: "提示",
                            content: "该员工已保存过了!",
                            confirmText: "去抽奖",
                            success: function(a) {
                                a.confirm ? e.prizes() : a.cancel && console.log("用户点击取消");
                            }
                        }) : 11 == t ? wx.showModal({
                            title: "提示",
                            content: "您已成功保存该员工!",
                            confirmText: "去抽奖",
                            success: function(a) {
                                a.confirm ? e.prizes() : a.cancel && console.log("用户点击取消");
                            }
                        }) : 12 == t && wx.showModal({
                            title: "提示",
                            content: "保存成功!",
                            success: function(a) {
                                a.confirm || a.cancel && console.log("用户点击取消");
                            }
                        });
                    }
                });
            }
        });
    }
}, "getinfos", function() {
    var t = this;
    wx.getStorage({
        key: "openid",
        success: function(a) {
            t.setData({
                openid: a.data
            });
        }
    });
}), _defineProperty(_Page, "huoqusq", function() {
    var r = this, c = wx.getStorageSync("openid");
    wx.getUserInfo({
        success: function(a) {
            var t = a.userInfo, e = t.nickName, n = t.avatarUrl, i = t.gender, o = t.province, s = t.city, d = t.country;
            wx.request({
                url: r.data.baseurl + "doPageUseupdate",
                data: {
                    uniacid: r.data.uniacid,
                    openid: c,
                    nickname: e,
                    avatarUrl: n,
                    gender: i,
                    province: o,
                    city: s,
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
                    });
                }
            });
        },
        fail: function() {
            app.selfinfoget(r.chenggfh, r.data.uniacid);
        }
    });
}), _defineProperty(_Page, "playvoice", function(a) {
    var t = this, e = a.currentTarget.dataset.text;
    "" == t.data.voice ? wx.showModal({
        title: "提示",
        content: "该员工还没有语音简介"
    }) : 0 == e ? (t.audioPlay(), t.setData({
        status: 1,
        st: 2,
        sy: "music-on",
        autovoice: 1
    })) : 1 == e && (t.audioPause(), t.setData({
        status: 0,
        st: 10,
        sy: "",
        autovoice: 0
    }));
}), _defineProperty(_Page, "prizes", function() {
    wx.request({
        url: this.data.baseurl + "doPagetoPrizes",
        data: {
            uniacid: this.data.uniacid
        },
        success: function(a) {
            var t = a.data.data;
            -1 != t ? wx.navigateTo({
                url: "/sudu8_page_plugin_shake/index/index?id=" + t
            }) : wx.showModal({
                title: "提示",
                content: "当前小程序没有抽奖活动!"
            });
        }
    });
}), _defineProperty(_Page, "zan", function(a) {
    var t = this, e = a.currentTarget.dataset.text;
    wx.request({
        url: t.data.baseurl + "doPagestaffzan",
        data: {
            id: t.data.id,
            iszan: e,
            openid: wx.getStorageSync("openid"),
            uniacid: t.data.uniacid
        },
        success: function(a) {
            1 == a.data.data.result ? (t.setData({
                iszan: 1,
                zans: 1,
                zan: a.data.data.zan
            }), wx.showToast({
                title: "点赞成功"
            })) : (t.setData({
                iszan: 0,
                zans: "",
                zan: a.data.data.zan
            }), wx.showToast({
                title: "取消赞成功"
            }));
        }
    });
}), _defineProperty(_Page, "share111", function() {
    this.setData({
        share: 1
    });
}), _defineProperty(_Page, "share_close", function() {
    this.setData({
        share: 0
    });
}), _defineProperty(_Page, "audioPlay", function() {
    var d = this;
    "" == d.data.voice ? wx.showModal({
        title: "提示",
        content: "该员工还没有语音简介"
    }) : (d.setData({
        autovoice: 1,
        st: 2,
        sy: "music-on",
        status: 1
    }), innerAudioContext.src = d.data.voice, innerAudioContext.play(), innerAudioContext.onPlay(function(a) {
        innerAudioContext.onTimeUpdate(function(a) {
            var t = innerAudioContext.duration, e = parseInt(t / 60);
            e < 10 && (e = "0" + e);
            var n = parseInt(t - 60 * e);
            n < 10 && (n = "0" + n);
            var i = innerAudioContext.currentTime, o = parseInt(i / 60);
            o < 10 && (o = "0" + o);
            var s = parseInt(i - 60 * o);
            s < 10 && (s = "0" + s), d.setData({
                duration: 100 * innerAudioContext.duration.toFixed(2),
                curTimeVal: 100 * innerAudioContext.currentTime.toFixed(2),
                durationDay: e + ":" + n,
                curTimeValDay: o + ":" + s
            });
        }), innerAudioContext.onEnded(function() {
            d.setStopState(d), d.setData({
                autovoice: 0,
                st: 10,
                sy: "",
                status: 0
            });
        });
    }));
}), _defineProperty(_Page, "audioPause", function() {
    this.setData({
        autovoice: 0,
        st: 10,
        sy: "",
        status: 0
    }), innerAudioContext.pause();
}), _defineProperty(_Page, "slideBar", function(a) {
    var t = a.detail.value;
    this.setData({
        curTimeVal: t / 100
    }), innerAudioContext.seek(this.data.curTimeVal);
}), _defineProperty(_Page, "updateTime", function(d) {
    innerAudioContext.onTimeUpdate(function(a) {
        var t = innerAudioContext.duration, e = parseInt(t / 60);
        e < 10 && (e = "0" + e, console.log(11111111));
        var n = parseInt(t - 60 * e);
        n < 10 && (n = "0" + n, console.log(22222222));
        var i = innerAudioContext.currentTime, o = parseInt(i / 60);
        o < 10 && (o = "0" + o, console.log(33333333333));
        var s = parseInt(i - 60 * o);
        s < 10 && (s = "0" + s, console.log(4444444)), d.setData({
            duration: 100 * innerAudioContext.duration.toFixed(2),
            curTimeVal: 100 * innerAudioContext.currentTime.toFixed(2),
            durationDay: e + ":" + n,
            curTimeValDay: o + ":" + s
        });
    }), innerAudioContext.duration.toFixed(2) - innerAudioContext.currentTime.toFixed(2) <= 0 && (d.setStopState(d), 
    console.log(2345)), innerAudioContext.onEnded(function() {
        d.setStopState(d);
    });
}), _defineProperty(_Page, "setStopState", function(a) {
    a.setData({
        curTimeVal: 0
    }), innerAudioContext.stop();
}), _defineProperty(_Page, "hide_info", function() {
    var a = this.data.hide_info;
    a = 0 == a ? 1 : 0, this.setData({
        hide_info: a
    });
}), _Page));