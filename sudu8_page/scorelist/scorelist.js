var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page_signs: "/sudu8_page/scorelist/scorelist",
        baseinfo: [],
        userInfo: "",
        searchtitle: "",
        scopes: !1,
        money: 0,
        score: 0,
        isview: 0,
        page: 1,
        xz: 1
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "积分明细"
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        }));
        var s = a.type;
        null != s && t.setData({
            xz: s
        }), t.getBase(), app.util(t.getinfos, e, t.data.uniacid);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                e.setData({
                    openid: a.data
                }), e.getinfo();
                var t = e.data.xz;
                1 == t && e.getscore(), 2 == t && e.getmoney();
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
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    getinfo: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                wx.request({
                    url: t.data.baseurl + "dopageglobaluserinfo",
                    data: {
                        uniacid: t.data.uniacid,
                        openid: a.data
                    },
                    success: function(a) {
                        t.setData({
                            globaluser: a.data.data
                        });
                    }
                });
            }
        });
    },
    getscore: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                wx.request({
                    url: t.data.baseurl + "doPagegetmyscorelist",
                    data: {
                        openid: a.data,
                        page: t.data.page,
                        uniacid: t.data.uniacid
                    },
                    success: function(a) {
                        t.setData({
                            scorelists: a.data.data.lists
                        });
                    }
                });
            }
        });
    },
    getmoney: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                wx.request({
                    url: t.data.baseurl + "doPagegetmymoneylist",
                    data: {
                        openid: a.data,
                        page: t.data.page,
                        uniacid: t.data.uniacid
                    },
                    success: function(a) {
                        t.setData({
                            scorelists: a.data.data.lists
                        });
                    }
                });
            }
        });
    },
    onReachBottom: function() {
        var t = this, e = t.data.page + 1, a = wx.getStorageSync("openid");
        1 == t.data.xz ? wx.request({
            url: t.data.baseurl + "doPagegetmyscorelist",
            data: {
                uniacid: t.data.uniacid,
                openid: a,
                page: e
            },
            success: function(a) {
                1 == a.data.data.isover && t.setData({
                    scorelists: t.data.scorelists.concat(a.data.data.lists),
                    page: e
                });
            }
        }) : wx.request({
            url: t.data.baseurl + "doPagegetmymoneylist",
            data: {
                uniacid: t.data.uniacid,
                openid: a,
                page: e
            },
            success: function(a) {
                1 == a.data.data.isover && t.setData({
                    scorelists: t.data.scorelists.concat(a.data.data.lists),
                    page: e
                });
            }
        });
    },
    qieh: function(a) {
        var t = this, e = a.target.dataset.id;
        t.data.xz != e && (t.setData({
            xz: e,
            page: 1
        }), 1 == e ? (t.getscore(), wx.setNavigationBarTitle({
            title: "积分明细"
        })) : (t.getmoney(), wx.setNavigationBarTitle({
            title: "消费流水"
        })));
    }
});