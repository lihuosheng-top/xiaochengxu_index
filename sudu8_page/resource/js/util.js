var _App;

function _defineProperty(e, n, t) {
    return n in e ? Object.defineProperty(e, n, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[n] = t, e;
}

var Dconfig = require("/config.js"), url = Dconfig.url, uniacid = Dconfig.uniacid;

App((_defineProperty(_App = {
    onLaunch: function() {
        var o = this;
        wx.login({
            success: function(e) {
                wx.setStorageSync("appcode", e.code);
            }
        }), wx.getSystemInfo({
            success: function(e) {
                wx.setStorageSync("systemInfo", e);
                var n = e.windowWidth, t = e.windowHeight;
                o.globalData.ww = n, o.globalData.hh = t;
            }
        });
    },
    onShow: function() {
        console.log(getCurrentPages());
    },
    onHide: function() {
        console.log(getCurrentPages());
    },
    onError: function(e) {
        console.log(e);
    },
    bezier: function(e, n) {
        for (var t, o, i, a = [], c = 0; c <= n; c++) {
            for (i = e.slice(0), o = []; t = i.shift(); ) if (i.length) o.push(s([ t, i[0] ], c / n)); else {
                if (!(1 < o.length)) break;
                i = o, o = [];
            }
            a.push(o[0]);
        }
        function s(e, n) {
            var t, o, i, a, c, s, u, r;
            return t = e[0], a = (o = e[1]).x - t.x, c = o.y - t.y, i = Math.pow(Math.pow(a, 2) + Math.pow(c, 2), .5), 
            s = c / a, u = Math.atan(s), r = i * n, {
                x: t.x + r * Math.cos(u),
                y: t.y + r * Math.sin(u)
            };
        }
        return {
            bezier_points: a
        };
    },
    util: function(o) {
        function e(e, n, t) {
            return o.apply(this, arguments);
        }
        return e.toString = function() {
            return o.toString();
        }, e;
    }(function(t, n, o) {
        var i = this;
        wx.getStorage({
            key: "openid",
            success: function(e) {
                i.fxsbindagain(n, e.data), wx.request({
                    url: url + "dopageglobaluserinfo",
                    data: {
                        openid: e.data,
                        uniacid: o
                    },
                    success: function(e) {
                        var n = e.data.data;
                        n.nickname && n.avatar ? "function" == typeof t && t() : wx.navigateTo({
                            url: "/sudu8_page/authorization/authorization"
                        });
                    }
                });
            },
            fail: function() {
                wx.login({
                    success: function(e) {
                        wx.request({
                            url: url + "doPageAppbase",
                            data: {
                                code: e.code,
                                uniacid: o
                            },
                            cachetime: 0,
                            success: function(e) {
                                2 == e.data.data.res ? wx.showModal({
                                    title: "提醒",
                                    content: "获取用户信息失败，请检查appid和appsecret是否正确！",
                                    showCancel: !1
                                }) : (wx.setStorageSync("openid", e.data.data.openid), e.data.data.openid, wx.navigateTo({
                                    url: "/sudu8_page/authorization/authorization"
                                }));
                            }
                        });
                    },
                    fail: function() {
                        wx.showModal({
                            title: "获取信息失败",
                            content: "请允许授权以便为您提供给服务",
                            success: function(e) {
                                e.confirm && util.getUserInfo();
                            }
                        });
                    }
                });
            }
        });
    }),
    fxsbindagain: function(e, n) {
        var t = this;
        0 != e && e != n ? (t.fxsbind(e, n), wx.setStorageSync("fxsid", e)) : wx.getStorage({
            key: "fxsid",
            success: function(e) {
                0 != e.data && t.fxsbind(e.data, n);
            },
            fail: function() {
                wx.setStorageSync("fxsid", 0);
            }
        });
    },
    fxsbind: function(e, n) {
        wx.request({
            url: url + "doPagebindfxs",
            data: {
                openid: n,
                fxsid: e,
                uniacid: uniacid
            },
            success: function(e) {}
        });
    },
    selfinfoget: function(i, a) {
        wx.getStorage({
            key: "golobeuser",
            success: function(e) {
                console.log(e);
            },
            fail: function() {
                wx.getSetting({
                    success: function(e) {
                        e.authSetting["scope.userInfo"], wx.showModal({
                            title: "提示",
                            content: "必须授权登录后才能操作,是否重新授权登录？",
                            showCancel: !1,
                            success: function(e) {
                                wx.openSetting({
                                    success: function(e) {
                                        e.authSetting["scope.userInfo"] ? (console.log(222), wx.getUserInfo({
                                            success: function(e) {
                                                var n = e.userInfo, t = wx.getStorageSync("openid"), o = url + "doPageUseupdate";
                                                wx.request({
                                                    url: o,
                                                    data: {
                                                        uniacid: a,
                                                        openid: t,
                                                        nickname: n.nickName,
                                                        avatarUrl: n.avatarUrl,
                                                        gender: n.gender,
                                                        province: n.province,
                                                        city: n.city,
                                                        country: n.country
                                                    },
                                                    header: {
                                                        "content-type": "application/json"
                                                    },
                                                    success: function(e) {
                                                        wx.setStorageSync("golobeuid", e.data.data.id), wx.setStorageSync("golobeuser", e.data.data), 
                                                        "function" == typeof i && i();
                                                    }
                                                });
                                            }
                                        })) : (console.log(333), util.selfinfoget());
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}, "fxsbindagain", function(e, n) {
    var t = this;
    0 != e && e != n ? (t.fxsbind(e, n), wx.setStorageSync("fxsid", e)) : wx.getStorage({
        key: "fxsid",
        success: function(e) {
            0 != e.data && t.fxsbind(e.data, n);
        },
        fail: function() {
            wx.setStorageSync("fxsid", 0);
        }
    });
}), _defineProperty(_App, "fxsbind", function(e, n) {
    wx.request({
        url: url + "doPagebindfxs",
        data: {
            openid: n,
            fxsid: e,
            uniacid: uniacid
        },
        success: function(e) {}
    });
}), _defineProperty(_App, "getopenid", function() {
    var o = this;
    wx.getStorage({
        key: "golobeuser",
        fail: function() {
            wx.getStorage({
                key: "golobaluserinfo",
                fail: function() {
                    wx.login({
                        success: function(e) {
                            var n = e.code;
                            wx.request({
                                url: url + "doPageAppbase",
                                data: {
                                    uniacid: uniacid,
                                    code: n
                                },
                                header: {
                                    "content-type": "application/json"
                                },
                                success: function(e) {
                                    wx.setStorageSync("openid", e.data.data.openid);
                                    e.data.data.openid;
                                    wx.showLoading({
                                        title: "正在登录",
                                        mask: !0
                                    }), wx.getUserInfo({
                                        success: function(e) {
                                            wx.hideLoading();
                                            var n = e.userInfo;
                                            wx.setStorageSync("golobaluserinfo", n), o.updateuserinfo(n);
                                        },
                                        fail: function(e) {
                                            var n = getCurrentPages(), t = n[n.length - 1];
                                            wx.hideLoading(), wx.getSetting({
                                                success: function(e) {
                                                    e.authSetting["scope.userInfo"];
                                                    wx.showModal({
                                                        title: "提示",
                                                        content: "必须授权登录后才能操作,是否重新授权登录？",
                                                        showCancel: !1,
                                                        success: function(e) {
                                                            wx.openSetting({
                                                                success: function(e) {
                                                                    e.authSetting["scope.userInfo"] ? wx.getUserInfo({
                                                                        success: function(e) {
                                                                            var n = e.userInfo;
                                                                            wx.setStorageSync("golobaluserinfo", n), o.updateuserinfo(n);
                                                                        }
                                                                    }) : wx.redirectTo({
                                                                        url: "/" + t.route
                                                                    });
                                                                },
                                                                fail: function(e) {}
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}), _defineProperty(_App, "updateuserinfo", function(e) {
    var n = wx.getStorageSync("openid"), t = getCurrentPages(), o = t[t.length - 1];
    console.log(o.route), wx.request({
        url: url + "doPageUseupdate",
        data: {
            openid: n,
            nickname: e.nickName,
            avatarUrl: e.avatarUrl,
            gender: e.gender,
            province: e.province,
            city: e.city,
            country: e.country,
            uniacid: uniacid
        },
        header: {
            "content-type": "application/json"
        },
        success: function(e) {
            wx.setStorageSync("golobeuid", e.data.id), wx.setStorageSync("golobeuser", e.data), 
            wx.reLaunch({
                url: "/" + o.route
            });
        }
    });
}), _defineProperty(_App, "tabBar", {
    color: "#123",
    selectedColor: "#1ba9ba",
    borderStyle: "#1ba9ba",
    backgroundColor: "#fff",
    list: [ {
        pagePath: "/we7/pages/index/index",
        iconPath: "/we7/resource/icon/home.png",
        selectedIconPath: "/we7/resource/icon/homeselect.png",
        text: "首页"
    }, {
        pagePath: "/we7/pages/user/index/index",
        iconPath: "/we7/resource/icon/user.png",
        selectedIconPath: "/we7/resource/icon/userselect.png",
        text: "我的"
    } ]
}), _defineProperty(_App, "globalData", {
    userInfo: null,
    baseurl: url,
    uniacid: uniacid,
    i_tel: "../../sudu8_page/resource/img/i_tel.png",
    i_add: "../../sudu8_page/resource/img/i_add.png",
    i_time: "../../sudu8_page/resource/img/i_time.png",
    close: "../../sudu8_page/resource/img/c.png",
    v_ico: "../../sudu8_page/resource/img/p.png",
    i_view: "../../sudu8_page/resource/img/i_view.png"
}), _App));