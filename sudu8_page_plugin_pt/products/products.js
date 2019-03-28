var xunh, WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        imgUrls: [],
        indicatorDots: !0,
        autoplay: !0,
        interval: 3e3,
        duration: 1e3,
        circular: !0,
        num: 1,
        sc: 0,
        guige: 0,
        protab: 1,
        gwc: 1,
        gm: 0,
        foot: 1,
        nowcon: "con",
        is_comment: 0,
        comments: 2,
        share: 0,
        u_gwc: 0,
        xzarr: [],
        gwccount: 0,
        overtime: [],
        daojishi: [],
        heighthave: 0,
        isview: 0,
        vip_config: 0
    },
    onPullDownRefresh: function() {
        this.getinfos(), wx.stopPullDownRefresh();
    },
    onLoad: function(t) {
        var a = this, e = 0;
        t.fxsid && (e = t.fxsid, a.setData({
            fxsid: t.fxsid
        }));
        var i = t.id, o = t.shareid;
        o ? a.gwc_100() : o = 0, a.setData({
            id: i,
            shareid: o
        }), wx.request({
            url: a.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: a.data.uniacid,
                vs1: 1
            },
            success: function(t) {
                a.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: a.data.baseinfo.base_tcolor,
                    backgroundColor: a.data.baseinfo.base_color
                });
            }
        }), app.util(a.getinfos, e, a.data.uniacid);
    },
    redirectto: function(t) {
        var a = t.currentTarget.dataset.link, e = t.currentTarget.dataset.linktype;
        app.redirectto(a, e);
    },
    getinfo: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                wx.request({
                    url: e.data.baseurl + "doPageglobaluserinfo",
                    data: {
                        openid: t.data,
                        uniacid: e.data.uniacid
                    },
                    success: function(t) {
                        var a = t.data.data;
                        console.log(44444444444444), console.log(t), a.nickname && a.avatar || e.setData({
                            isview: 1
                        }), e.setData({
                            globaluser: t.data.data
                        });
                    }
                });
            }
        });
    },
    huoqusq: function() {
        var u = this, d = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(t) {
                console.log(t);
                var a = t.userInfo, e = a.nickName, i = a.avatarUrl, o = a.gender, n = a.province, s = a.city, r = a.country;
                wx.request({
                    url: u.data.baseurl + "doPageUseupdate",
                    data: {
                        uniacid: u.data.uniacid,
                        openid: d,
                        nickname: e,
                        avatarUrl: i,
                        gender: o,
                        province: n,
                        city: s,
                        country: r
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(t) {
                        wx.setStorageSync("golobeuid", t.data.data.id), wx.setStorageSync("golobeuser", t.data.data), 
                        u.setData({
                            isview: 0,
                            globaluser: t.data.data
                        });
                    }
                });
            },
            fail: function() {
                app.util.selfinfoget(u.chenggfh);
            }
        });
    },
    getinfos: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                a.setData({
                    openid: t.data
                }), a.getinfo(), a.getPro();
            }
        });
    },
    swiperLoad: function(i) {
        var o = this;
        wx.getSystemInfo({
            success: function(t) {
                var a = i.detail.width / i.detail.height, e = t.windowWidth / a;
                o.data.heighthave || o.setData({
                    minHeight: e,
                    heighthave: 1
                });
            }
        });
    },
    getPro: function() {
        var g = this, t = (g.data.fxsid, g.data.openid), a = g.data.id, e = g.data.baseurl + "dopageglobaluserinfo";
        wx.request({
            url: e,
            data: {
                uniacid: g.data.uniacid,
                openid: t
            },
            success: function(t) {
                g.setData({
                    globaluser: t.data.data
                }), wx.stopPullDownRefresh();
            }
        }), wx.request({
            url: g.data.baseurl + "doPagePtproductinfo",
            data: {
                uniacid: g.data.uniacid,
                id: a,
                openid: t
            },
            success: function(t) {
                wx.setNavigationBarTitle({
                    title: t.data.data.products.title
                });
                var a = t.data.data;
                console.log(a.pingtuan);
                var e = a.products, i = a.pingtuan, o = a.overtime, n = a.pingtcount;
                1 == e.show_pro && wx.showModal({
                    title: "提示",
                    content: "该商品已下架",
                    showCancel: !1,
                    success: function() {
                        wx.redirectTo({
                            url: "/sudu8_page_plugin_pt/index/index"
                        });
                    }
                }), 1 == a.collect ? g.setData({
                    sc: 1
                }) : g.setData({
                    sc: 0
                }), g.daojishi(), g.setData({
                    products: e,
                    pintuan: i,
                    imgUrls: e.imgtext,
                    guiz: a.guiz,
                    overtime: o,
                    pingtcount: n,
                    vip_config: e.vip_config
                }), WxParse.wxParse("content", "html", e.texts, g, 5);
                for (var s = a.grouparr, r = "", u = 0; u < s.length; u++) r += s[u] + "、";
                var d = r.substring(0, r.length - 1);
                g.setData({
                    strgrouparr: d,
                    grouparr: s
                });
                var c = a.grouparr_val;
                g.setData({
                    gzjson: c
                }), g.getproinfo();
            }
        });
    },
    daojishi: function() {
        for (var t = this, a = t.data.overtime, e = [], i = 0; i < a.length; i++) {
            var o, n, s, r, u = new Date().getTime(), d = 1e3 * parseInt(a[i]) - u;
            0 <= d && (o = Math.floor(d / 1e3 / 60 / 60 / 24), n = Math.floor(d / 1e3 / 60 / 60 % 24) < 10 ? "0" + Math.floor(d / 1e3 / 60 / 60 % 24) : Math.floor(d / 1e3 / 60 / 60 % 24), 
            s = Math.floor(d / 1e3 / 60 % 60) < 10 ? "0" + Math.floor(d / 1e3 / 60 % 60) : Math.floor(d / 1e3 / 60 % 60), 
            r = Math.floor(d / 1e3 % 60) < 10 ? "0" + Math.floor(d / 1e3 % 60) : Math.floor(d / 1e3 % 60)), 
            e[i] = o + "天" + n + ":" + s + ":" + r;
        }
        t.setData({
            daojishi: e
        }), xunh = setTimeout(function() {
            t.daojishi();
        }, 1e3);
    },
    onShareAppMessage: function() {
        var t = wx.getStorageSync("openid"), a = this.data.products, e = this.data.id, i = "";
        return i = 1 == this.data.globaluser.fxs ? "/sudu8_page_plugin_pt/products/products?id=" + e : "/sudu8_page_plugin_pt/products/products?id=" + e + "&fxsid=" + t, 
        {
            title: a.title,
            path: i
        };
    },
    share111: function() {
        this.setData({
            share: 1
        });
    },
    share_close: function() {
        this.setData({
            share: 0
        });
    },
    pinglun: function(t) {
        this.setData({
            pinglun_t: t.detail.value
        });
    },
    pinglun_sub: function() {
        var a = this, t = a.data.pinglun_t, e = a.data.id, i = wx.getStorageSync("openid");
        if ("" == t || null == t) return wx.showModal({
            content: "评论不能为空"
        }), !1;
        wx.request({
            url: a.data.baseurl + "Comment",
            cachetime: "30",
            data: {
                uniacid: a.data.uniacid,
                pinglun_t: t,
                id: e,
                openid: i
            },
            success: function(t) {
                1 == t.data.data.result && (wx.showToast({
                    title: "评价提交成功",
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.redirectTo({
                        url: "/sudu8_page_plugin_pt/products/products?id=" + a.data.id
                    });
                }, 2e3));
            }
        });
    },
    tabChange: function(t) {
        var a = t.currentTarget.dataset.id;
        this.setData({
            nowcon: a
        });
    },
    num_add: function() {
        var t = this.data.proinfo.kc, a = this.data.num;
        t < (a += 1) && (wx.showModal({
            title: "提醒",
            content: "您的购买数量超过了库存！",
            showCancel: !1
        }), a--), this.setData({
            num: a
        });
    },
    num_jian: function() {
        var t = this.data.num;
        1 == t ? this.setData({
            num: 1
        }) : (t -= 1, this.setData({
            num: t
        }));
    },
    gm: function() {
        wx.navigateTo({
            url: "/pages/order/order"
        });
    },
    gwc_close: function() {
        this.setData({
            gwc_block: 0
        });
    },
    gwc_block: function() {
        this.setData({
            gwc_block: 1
        });
    },
    gwc_100: function() {
        this.setData({
            gwc: 1,
            gm: 0,
            guige: 1,
            foot: 0
        });
    },
    gm_100: function() {
        this.setData({
            gwc: 0,
            gm: 1,
            guige: 1,
            foot: 0
        });
    },
    guige_block: function() {
        this.setData({
            guige: 1,
            gwc: 1,
            gm: 0
        });
    },
    guige_hidden: function() {
        this.setData({
            guige: 0,
            shareid: 0
        });
    },
    color_change: function(t) {},
    collect: function() {
        var t = this.data.sc;
        0 == t ? wx.showLoading({
            title: "收藏中"
        }) : wx.showLoading({
            title: "取消收藏中"
        }), this.collects(t);
    },
    collects: function(a) {
        var e = this;
        wx.request({
            url: e.data.baseurl + "doPageCollect",
            cachetime: "30",
            data: {
                uniacid: e.data.uniacid,
                id: e.data.id,
                openid: wx.getStorageSync("openid"),
                types: "pt"
            },
            success: function(t) {
                1 == a ? e.setData({
                    sc: 0
                }) : e.setData({
                    sc: 1
                }), setTimeout(function() {
                    wx.showToast({
                        title: t.data.data,
                        icon: "success",
                        duration: 2e3,
                        success: function() {
                            wx.hideLoading();
                        }
                    });
                }, 2e3);
            }
        });
    },
    changepro: function(t) {
        var a = t.currentTarget.dataset.id, e = (this.data.grouparr, t.currentTarget.dataset.index), i = this.data.gzjson;
        i[a].ck = e, this.setData({
            gzjson: i
        }), this.getproinfo();
    },
    getproinfo: function() {
        for (var e = this, t = e.data.gzjson, a = e.data.grouparr, i = e.data.id, o = "", n = 0; n < a.length; n++) {
            o += t[a[n]].val[t[a[n]].ck] + "/";
        }
        var s = o.substring(0, o.length - 1);
        wx.request({
            url: e.data.baseurl + "doPageptpinfo",
            data: {
                str: s,
                uniacid: e.data.uniacid,
                id: i
            },
            success: function(t) {
                var a = t.data.data;
                1 == a.baseinfo.show_pro && wx.showModal({
                    title: "提示",
                    content: "该商品已下架",
                    showCancel: !1,
                    success: function() {
                        wx.redirectTo({
                            url: "/sudu8_page_plugin_pt/index/index"
                        });
                    }
                }), e.setData({
                    proinfo: a.proinfo,
                    baseinfo2: a.baseinfo,
                    newstr: s
                });
            }
        });
    },
    gmget: function() {
        var t = this, a = t.data.proinfo, e = t.data.num, i = t.data.products, o = t.data.baseinfo2, n = t.data.gwc, s = t.data.shareid;
        if (1 == t.data.vip_config) return wx.showModal({
            title: "提醒",
            content: "该商品必须开通会员卡购买！",
            showCancel: !1,
            success: function() {
                wx.navigateTo({
                    url: "/sudu8_page/register/register?type=pt"
                });
            }
        }), !1;
        console.log("xxxxxx" + s);
        var r = t.data.guiz;
        if (0 == a.kc) return wx.showModal({
            title: "提醒",
            content: "您来晚了，已经卖完了！",
            showCancel: !1
        }), !1;
        for (var u = a.comment.split(","), d = "", c = 0; c < u.length; c++) {
            var g = c + 1;
            d += u[c] + ":" + a["type" + g] + ",";
        }
        d = d.substring(0, d.length - 1);
        if (a.ggz = d, 1 == n) var l = 1 * a.price * e; else l = 1 * a.dprice * e;
        var p = {};
        p.cid = o.cid, p.id = o.id, p.title = o.title, p.thumb = o.thumb, i.baseinfo2 = p, 
        i.proinfo = a, i.num = e, i.pvid = a.pid, i.one_bili = r.one_bili, i.two_bili = r.two_bili, 
        i.three_bili = r.three_bili, i.gmorpt = n;
        var h = [];
        h.push(i), wx.setStorage({
            key: "jsdata",
            data: h
        }), wx.setStorage({
            key: "jsprice",
            data: l
        }), clearInterval(xunh), wx.navigateTo({
            url: "/sudu8_page_plugin_pt/order/order?shareid=" + s + "&id=" + t.data.id
        });
    },
    lijct: function(t) {
        var a = this, e = t.currentTarget.dataset.index;
        console.log(">>>>>>" + e);
        var i = wx.getStorageSync("openid");
        console.log("****" + i), wx.request({
            url: a.data.baseurl + "doPagepdmytuanorcy",
            data: {
                uniacid: a.data.uniacid,
                shareid: e,
                openid: i
            },
            success: function(t) {
                1 == t.data.data ? (clearInterval(xunh), wx.navigateTo({
                    url: "/sudu8_page_plugin_pt/pt/pt?shareid=" + e
                })) : (a.gwc_100(), a.setData({
                    shareid: e
                }));
            }
        });
    }
});