var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        allprice: 0,
        allxuanz: 0,
        page_signs: "/sudu8_page/gwc/gwc"
    },
    onPullDownRefresh: function() {
        this.getmygwc();
    },
    onLoad: function(a) {
        var e = this;
        wx.getSystemInfo({
            success: function(a) {
                var t = a.windowHeight - 100;
                e.setData({
                    h: a.windowHeight,
                    list_h: t
                });
            }
        });
        var t = 0;
        a.fxsid && (t = a.fxsid, e.setData({
            fxsid: a.fxsid
        })), wx.request({
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
            }
        }), app.util(e.getinfos, t, e.data.uniacid);
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
                }), t.getmygwc();
            }
        });
    },
    getmygwc: function() {
        var e = this;
        wx.setNavigationBarTitle({
            title: "购物车"
        });
        var a = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "doPagegetmygwc",
            data: {
                uniacid: e.data.uniacid,
                openid: a
            },
            success: function(a) {
                var t = a.data.data;
                console.log(t), e.setData({
                    mygwc: t
                }), e.allxuanz();
            }
        });
    },
    xuanz: function(a) {
        var t = this, e = a.currentTarget.dataset.index, n = (a.currentTarget.dataset.id, 
        a.currentTarget.dataset.num, a.currentTarget.dataset.price), i = t.data.mygwc, r = t.data.allprice;
        0 == i[e].ck ? (i[e].ck = 1, r += n) : (i[e].ck = 0, r -= n, t.setData({
            allxuanz: 0
        })), t.setData({
            mygwc: i,
            allprice: r
        });
    },
    allxuanz: function() {
        var a = this, t = a.data.allxuanz, e = a.data.mygwc, n = a.data.allprice;
        if (1 == t) for (var i = t = 0; i < e.length; i++) n -= e[i].num * e[i].proinfo.price, 
        e[i].ck = 0; else {
            t = 1;
            for (i = n = 0; i < e.length; i++) n += e[i].num * e[i].proinfo.price, e[i].ck = 1;
        }
        a.setData({
            allxuanz: t,
            allprice: n,
            mygwc: e
        });
    },
    addbtn: function(a) {
        var n = this, t = a.currentTarget.dataset.index, i = n.data.mygwc, e = i[t].num, r = i[t].proinfo.kc, c = i[t].id;
        r < ++e && (wx.showModal({
            title: "提醒",
            content: "您的购买数量超过了库存！",
            showCancel: !1
        }), e--), i[t].num = e, wx.request({
            url: n.data.baseurl + "doPageduogwcchange",
            data: {
                uniacid: n.data.uniacid,
                id: c,
                num: e
            },
            success: function(a) {
                for (var t = 0, e = 0; e < i.length; e++) t += i[e].num * i[e].proinfo.price;
                n.setData({
                    mygwc: i,
                    allprice: t
                });
            }
        });
    },
    delbtn: function(a) {
        var n = this, t = a.currentTarget.dataset.index, i = n.data.mygwc, e = i[t].num, r = (i[t].proinfo.kc, 
        i[t].id);
        0 == --e && e++, i[t].num = e, wx.request({
            url: n.data.baseurl + "doPageduogwcchange",
            data: {
                uniacid: n.data.uniacid,
                id: r,
                num: e
            },
            success: function(a) {
                for (var t = 0, e = 0; e < i.length; e++) t += i[e].num * i[e].proinfo.price;
                n.setData({
                    mygwc: i,
                    allprice: t
                });
            }
        });
    },
    deldata: function(a) {
        var n = this, t = a.currentTarget.dataset.id, i = a.currentTarget.dataset.index, r = n.data.mygwc;
        wx.showModal({
            title: "提醒",
            content: "您确定要删除该商品？",
            success: function(a) {
                a.confirm && wx.request({
                    url: n.data.baseurl + "doPagedelmygwc",
                    data: {
                        uniacid: n.data.uniacid,
                        id: t
                    },
                    success: function(a) {
                        r.splice(i, 1);
                        for (var t = 0, e = 0; e < r.length; e++) t += r[e].num * r[e].proinfo.price;
                        n.setData({
                            mygwc: r,
                            allprice: t
                        });
                    }
                });
            }
        });
    },
    jiesuan: function(a) {
        var t = this.data.mygwc, e = this.data.allprice;
        if (0 == e) return wx.showModal({
            title: "提醒",
            content: "请先选择结算的商品！",
            showCancel: !1
        }), !1;
        for (var n = [], i = 0; i < t.length; i++) 1 == t[i].ck && n.push(t[i]);
        wx.setStorage({
            key: "jsdata",
            data: n
        }), wx.setStorage({
            key: "jsprice",
            data: e
        }), wx.navigateTo({
            url: "/sudu8_page/order_more/order_more"
        });
    }
});