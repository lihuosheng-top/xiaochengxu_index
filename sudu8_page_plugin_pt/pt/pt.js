var xunh, app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        imgUrls: [],
        indicatorDots: !0,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3,
        hx: 0
    },
    onPullDownRefresh: function() {
        this.getinfos(), this.getpingt(), wx.stopPullDownRefresh();
    },
    onLoad: function(a) {
        var t = this, e = a.shareid;
        console.log("mmmmmm" + e), t.setData({
            shareid: e
        }), t.getpingt(), wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarTitle({
                    title: t.data.baseinfo.name
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
        var o = 0;
        a.fxsid && (o = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), app.util(t.getinfos, o, t.data.uniacid), t.getpingt();
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    ptorder: function() {
        wx.navigateTo({
            url: "/sudu8_page_plugin_pt/orderlist/orderlist"
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
    daojishi: function() {
        var a, t, e, o, i, s = this, n = s.data.overtime, d = new Date().getTime(), r = 1e3 * parseInt(n) - d;
        0 == r && clearInterval(xunh), 0 <= r ? (t = Math.floor(r / 1e3 / 60 / 60 / 24), 
        e = Math.floor(r / 1e3 / 60 / 60 % 24) < 10 ? "0" + Math.floor(r / 1e3 / 60 / 60 % 24) : Math.floor(r / 1e3 / 60 / 60 % 24), 
        o = Math.floor(r / 1e3 / 60 % 60) < 10 ? "0" + Math.floor(r / 1e3 / 60 % 60) : Math.floor(r / 1e3 / 60 % 60), 
        i = Math.floor(r / 1e3 % 60) < 10 ? "0" + Math.floor(r / 1e3 % 60) : Math.floor(r / 1e3 % 60)) : i = o = e = t = 0, 
        a = t + "天" + e + ":" + o + ":" + i, s.setData({
            daojishi: a
        }), xunh = setTimeout(function() {
            s.daojishi();
        }, 1e3);
    },
    getpingt: function() {
        var c = this, a = c.data.shareid;
        wx.request({
            url: c.data.baseurl + "doPagepingtuan",
            data: {
                shareid: a,
                uniacid: c.data.uniacid,
                openid: wx.getStorageSync("openid")
            },
            success: function(a) {
                var t = a.data.data.products, e = a.data.data.lists, o = a.data.data.share, i = a.data.data.products.pt_min, s = a.data.data.products.pt_max, n = e.length;
                console.log(e.length);
                var d = a.data.data.hx;
                if (1 == d) {
                    var r = a.data.data.hxinfo;
                    c.setData({
                        hxinfo: r
                    });
                }
                for (var u = {
                    infoimg: "/sudu8_page/resource/img/pe.png"
                }, l = [], h = 0; h < o.pt_max; h++) e[h] ? l.push(e[h]) : l.push(u);
                c.setData({
                    products: t,
                    share: o,
                    lists: l,
                    min: i,
                    max: s,
                    now: n,
                    overtime: a.data.data.overtime,
                    labels: a.data.data.labels,
                    hxinfo: r,
                    hx: d
                }), c.daojishi();
            }
        });
    },
    onShareAppMessage: function() {
        var a = this.data.shareid, t = this.data.products, e = "/sudu8_page_plugin_pt/products/products?shareid=" + a + "&id=" + t.id;
        return {
            title: t.title,
            path: e
        };
    },
    hxmmInput: function(a) {
        this.setData({
            hxmm: a.detail.value
        });
    },
    hxmmpass: function() {
        var t = this, a = t.data.hxmm, e = t.data.datas;
        a ? (console.log(e), wx.request({
            url: t.data.baseurl + "hxmm",
            data: {
                hxmm: a,
                order_id: t.data.shareid,
                uniacid: t.data.uniacid,
                is_more: 3,
                openid: wx.getStorageSync("openid")
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                0 == a.data.data ? wx.showModal({
                    title: "提示",
                    content: "核销密码不正确！",
                    showCancel: !1
                }) : wx.showToast({
                    title: "消费成功",
                    icon: "success",
                    duration: 2e3,
                    success: function(a) {
                        t.setData({
                            datas: e,
                            showhx: 0
                        }), wx.navigateTo({
                            url: "/sudu8_page_plugin_pt/pt/pt?shareid=" + t.data.shareid
                        });
                    }
                });
            }
        })) : wx.showModal({
            title: "提示",
            content: "请输入核销密码！",
            showCancel: !1
        });
    },
    hxshow: function() {
        this.setData({
            showhx: 1
        });
    },
    hxhide: function() {
        this.setData({
            showhx: 0
        });
    }
});