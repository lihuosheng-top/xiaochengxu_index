var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        imgUrls: [],
        num: 1,
        indicatorDots: !0,
        autoplay: !0,
        interval: 3e3,
        duration: 1e3,
        circular: !0,
        sc: 0,
        guige: 0,
        protab: 1,
        foot: 1,
        nowcon: "con",
        is_comment: 0,
        comments: 2,
        share: 0,
        u_gwc: 0,
        xzarr: [],
        gwccount: 0,
        products: [ {
            xsl: 0
        } ],
        fxsid: 0,
        heighthave: 0,
        minHeight: 220,
        shareHome: 0,
        vip_config: 0
    },
    onPullDownRefresh: function() {
        var t = this;
        t.data.id;
        t.getPro(), t.gwcdata();
    },
    onLoad: function(t) {
        var a = this, e = t.id;
        a.setData({
            id: e
        });
        var i = "oYyHv0KNnyZ0MV_gOI4MpU17caV4";
        i = i, a.setData({
            fxsid: i,
            shareHome: 1
        }), console.log(55555), console.log(i), t.userid && a.setData({
            userid: t.userid
        }), wx.request({
            url: a.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: a.data.uniacid,
                vs1: 1
            },
            success: function(t) {
                a.setData({
                    commbase: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: a.data.commbase.base_tcolor,
                    backgroundColor: a.data.commbase.base_color
                });
            }
        }), app.util(a.getinfos, i, a.data.uniacid);
    },
    redirectto: function(t) {
        var a = t.currentTarget.dataset.link, e = t.currentTarget.dataset.linktype;
        app.redirectto(a, e);
    },
    getinfos: function() {
        var a = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                a.setData({
                    openid: t.data
                }), a.getPro(), a.gwcdata(), a.givepscore();
            }
        });
    },
    getPro: function() {
        var r = this, t = r.data.fxsid, a = r.data.openid, e = r.data.id;
        wx.request({
            url: r.data.baseurl + "dopageglobaluserinfo",
            data: {
                uniacid: r.data.uniacid,
                openid: a
            },
            success: function(t) {
                r.setData({
                    globaluser: t.data.data
                }), wx.stopPullDownRefresh();
            }
        }), wx.request({
            url: r.data.baseurl + "dopageduoproducts",
            data: {
                uniacid: r.data.uniacid,
                id: e,
                fxsid: t,
                openid: a
            },
            success: function(t) {
                var a = t.data.data, e = a.products;
                wx.setNavigationBarTitle({
                    title: e.title
                }), 1 == e.is_sale && wx.showModal({
                    title: "提示",
                    content: "该商品已下架,请选择其他商品",
                    showCancel: !1,
                    success: function() {
                        wx.redirectTo({
                            url: "/sudu8_page/index/index"
                        });
                    }
                }), r.setData({
                    vip_config: a.vip_config,
                    products: e,
                    imgUrls: e.imgtext,
                    guiz: a.guiz
                }), e.texts && WxParse.wxParse("content", "html", e.texts, r, 5);
                for (var i = a.grouparr, s = "", o = 0; o < i.length; o++) s += i[o] + "、";
                var n = s.substring(0, s.length - 1);
                r.setData({
                    strgrouparr: n,
                    grouparr: i
                });
                var d = a.grouparr_val;
                r.setData({
                    gzjson: d
                }), 1 == a.shouc ? r.setData({
                    sc: 0
                }) : r.setData({
                    sc: 1
                }), r.getproinfo(), r.gwcdata();
            }
        });
    },
    swiperLoad: function(i) {
        var s = this;
        wx.getSystemInfo({
            success: function(t) {
                var a = i.detail.width / i.detail.height, e = t.windowWidth / a;
                s.data.heighthave || s.setData({
                    minHeight: e,
                    heighthave: 1
                });
            }
        });
    },
    onShareAppMessage: function() {
        var t = this, a = wx.getStorageSync("openid"), e = t.data.products, i = t.data.id, s = "";
        return s = 1 == t.data.globaluser.fxs ? "/sudu8_page/showProMore/showProMore?id=" + i + "&userid=" + a : "/sudu8_page/showProMore/showProMore?id=" + i + "&userid=" + a + "&fxsid=" + a, 
        {
            title: e.title,
            path: s,
            imageUrl: t.data.products.shareimg
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
    poster: function() {
        wx.navigateTo({
            url: "/sudu8_page/poster/poster"
        });
    },
    pinglun: function(t) {
        this.setData({
            pinglun_t: t.detail.value
        });
    },
    pinglun_sub: function() {
        var t = this.data.pinglun_t, a = this.data.id, e = wx.getStorageSync("openid");
        if ("" == t || null == t) return wx.showModal({
            content: "评论不能为空"
        }), !1;
        wx.request({
            url: this.data.baseurl + "Comment",
            cachetime: "0",
            data: {
                uniacid: this.data.uniacid,
                pinglun_t: t,
                id: a,
                openid: e
            },
            success: function(t) {
                1 == t.data.data.result && (wx.showToast({
                    title: "评价提交成功",
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.redirectTo({
                        url: "/sudu8_page/showArt/showArt?id=" + a
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
        1 == this.data.products.is_sale && wx.showModal({
            title: "提示",
            content: "该商品已下架,请选择其他商品",
            showCancel: !1,
            success: function() {
                wx.redirectTo({
                    url: "/sudu8_page/index/index"
                });
            }
        }), this.setData({
            gwc: 1,
            gm: 0,
            guige: 1,
            foot: 0
        });
    },
    gm_100: function() {
        1 == this.data.products.is_sale && wx.showModal({
            title: "提示",
            content: "该商品已下架,请选择其他商品",
            showCancel: !1,
            success: function() {
                wx.redirectTo({
                    url: "/sudu8_page/index/index"
                });
            }
        }), this.setData({
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
            guige: 0
        });
    },
    color_change: function(t) {},
    collect: function() {
        var e = this, t = e.data.sc, a = e.data.id, i = wx.getStorageSync("openid");
        1 == e.data.baseinfo.is_sale && wx.showModal({
            title: "提示",
            content: "该商品已下架,请选择其他商品",
            showCancel: !1,
            success: function() {
                wx.redirectTo({
                    url: "/sudu8_page/index/index"
                });
            }
        }), 0 == t ? (wx.showLoading({
            title: "收藏中"
        }), wx.request({
            url: e.data.baseurl + "doPageCollect",
            data: {
                uniacid: e.data.uniacid,
                openid: i,
                types: "showProMore",
                id: a
            },
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                var a = t.data.data;
                "收藏成功" == a ? e.setData({
                    sc: 1
                }) : e.setData({
                    sc: 0
                }), wx.showToast({
                    title: a,
                    icon: "succes",
                    duration: 1e3,
                    mask: !0
                });
            }
        })) : (wx.showLoading({
            title: "取消收藏中"
        }), wx.request({
            url: e.data.baseurl + "doPageCollect",
            data: {
                uniacid: e.data.uniacid,
                openid: i,
                types: "showProMore",
                id: a
            },
            header: {
                "content-type": "application/json"
            },
            success: function(t) {
                var a = t.data.data;
                "取消收藏成功" == a ? e.setData({
                    sc: 0
                }) : e.setData({
                    sc: 1
                }), wx.showToast({
                    title: a,
                    icon: "succes",
                    duration: 1e3,
                    mask: !0
                });
            }
        })), setTimeout(function() {
            wx.hideLoading();
        }, 1e3);
    },
    changepro: function(t) {
        var a = t.currentTarget.dataset.id, e = (this.data.grouparr, t.currentTarget.dataset.index), i = this.data.gzjson;
        i[a].ck = e, this.setData({
            gzjson: i
        }), this.getproinfo();
    },
    getproinfo: function() {
        for (var e = this, t = e.data.gzjson, a = e.data.grouparr, i = "", s = "", o = e.data.id, n = 0; n < a.length; n++) {
            var d = t[a[n]].val, r = t[a[n]].ck;
            i += d[r] + "######", s += d[r] + ",";
        }
        var c = i.substring(0, i.length - 6);
        s = s.substring(0, s.length - 1);
        wx.request({
            url: e.data.baseurl + "dopageduoproductsinfo",
            data: {
                uniacid: e.data.uniacid,
                str: c,
                id: o
            },
            success: function(t) {
                var a = t.data.data;
                console.log(t.data.data), e.setData({
                    proinfo: a.proinfo,
                    baseinfo: a.baseinfo,
                    newstr: s
                }), 1 == a.baseinfo.is_sale && wx.showModal({
                    title: "提示",
                    content: "该商品已下架,请选择其他商品",
                    showCancel: !1,
                    success: function() {
                        wx.redirectTo({
                            url: "/sudu8_page/index/index"
                        });
                    }
                });
            }
        });
    },
    gwcget: function() {
        var a = this, t = a.data.proinfo, e = a.data.num, i = wx.getStorageSync("openid"), s = a.data.vip_config;
        return 1 == a.data.baseinfo.is_sale && wx.showModal({
            title: "提示",
            content: "该商品已下架,请选择其他商品",
            showCancel: !1,
            success: function() {
                wx.redirectTo({
                    url: "/sudu8_page/index/index"
                });
            }
        }), 1 == s ? (wx.showModal({
            title: "提醒",
            content: "该商品必须开通会员卡购买！",
            showCancel: !1,
            success: function() {
                wx.navigateTo({
                    url: "/sudu8_page/register/register?type=duo"
                });
            }
        }), !1) : 0 == t.kc ? (wx.showModal({
            title: "提醒",
            content: "您来晚了，已经卖完了！",
            showCancel: !1
        }), !1) : void wx.request({
            url: a.data.baseurl + "dopagegwcadd",
            data: {
                uniacid: a.data.uniacid,
                openid: i,
                id: t.id,
                prokc: e
            },
            success: function(t) {
                wx.showToast({
                    title: "加入成功",
                    icon: "success",
                    duration: 2e3,
                    success: function() {
                        a.guige_hidden(), a.gwcdata();
                    }
                });
            }
        });
    },
    gmget: function() {
        var t = this, a = t.data.proinfo, e = t.data.num, i = t.data.products, s = t.data.baseinfo, o = t.data.guiz, n = t.data.vip_config;
        if (1 == (s = t.data.baseinfo).is_sale && wx.showModal({
            title: "提示",
            content: "该商品已下架,请选择其他商品",
            showCancel: !1,
            success: function() {
                wx.redirectTo({
                    url: "/sudu8_page/index/index"
                });
            }
        }), 1 == n) return wx.showModal({
            title: "提醒",
            content: "该商品必须开通会员卡购买！",
            showCancel: !1,
            success: function() {
                wx.navigateTo({
                    url: "/sudu8_page/register/register?type=duo"
                });
            }
        }), !1;
        if (0 == a.kc) return wx.showModal({
            title: "提醒",
            content: "您来晚了，已经卖完了！",
            showCancel: !1
        }), !1;
        for (var d = a.comment.split(","), r = "", c = 0; c < d.length; c++) {
            var u = c + 1;
            r += d[c] + ":" + a["type" + u] + ",";
        }
        r = r.substring(0, r.length - 1);
        a.ggz = r;
        var g = 1 * a.price * e, l = {};
        l.cid = s.cid, l.id = s.id, l.title = s.title, l.thumb = s.thumb, i.baseinfo = l, 
        i.proinfo = a, i.num = e, i.pvid = a.pid, i.one_bili = o.one_bili, i.two_bili = o.two_bili, 
        i.three_bili = o.three_bili;
        var h = [];
        h.push(i), wx.setStorage({
            key: "jsdata",
            data: h
        }), wx.setStorage({
            key: "jsprice",
            data: g
        }), wx.navigateTo({
            url: "/sudu8_page/order_more/order_more"
        });
    },
    gwcdata: function() {
        var a = this, t = wx.getStorageSync("openid");
        wx.request({
            url: a.data.baseurl + "doPagegwcdata",
            data: {
                uniacid: a.data.uniacid,
                openid: t
            },
            success: function(t) {
                a.setData({
                    gwccount: t.data.data
                });
            }
        });
    },
    givepscore: function() {
        var t = this.data.id, a = this.data.userid, e = wx.getStorageSync("openid");
        a != e && 0 != a && "" != a && null != a && wx.request({
            url: this.data.baseurl + "doPagegiveposcore",
            data: {
                uniacid: this.data.uniacid,
                id: t,
                types: "showProMore",
                openid: e,
                fxsid: a
            },
            success: function(t) {}
        });
    }
});