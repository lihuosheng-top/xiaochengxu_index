var app = getApp();

Page({
    data: {
        page_signs: "/sudu8_page_plugin_pt/index/index",
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        imgUrls: [],
        indicatorDots: !0,
        autoplay: !0,
        interval: 5e3,
        duration: 1e3,
        styles: 4
    },
    onPullDownRefresh: function() {
        this.getpro(), wx.stopPullDownRefresh();
    },
    onLoad: function(a) {
        var t = this, e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.setData({
            msgList: [ {
                src: "/image/about1.jpg",
                title: "秒杀了"
            }, {
                src: "/image/about1.jpg",
                title: "秒杀了"
            }, {
                src: "/image/about1.jpg",
                title: "秒杀了"
            } ],
            msgList2: [ {
                title: "限时秒杀，过时即涨"
            }, {
                title: "更多好货，不在错过"
            }, {
                title: "开枪预约，不在错过"
            } ]
        }), wx.setNavigationBarTitle({
            title: "拼团首页"
        });
        var i = 3600;
        setInterval(function() {
            if (0 <= i) {
                var a = t.dateformat(i);
                t.setData({
                    sytime: a
                }), i--;
            }
        }, 1e3);
        var s = t.data.baseurl + "doPageBaseMin";
        wx.request({
            url: s,
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                }), t.getpro();
            },
            fail: function(a) {
                console.log(a);
            }
        }), app.util(t.getinfos, e, t.data.uniacid);
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
                });
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: "拼团商城"
        };
    },
    dateformat: function(a) {
        var t = Math.floor(a);
        if (86400 < t) var e = parseInt(t / 86400 / 24); else e = 0;
        e < 10 && (e = "0" + e);
        var i = Math.floor(t / 3600 % 24);
        i < 10 && (i = "0" + i);
        var s = Math.floor(t / 60 % 60);
        s < 10 && (s = "0" + s);
        var r = Math.floor(t % 60);
        return r < 10 && (r = "0" + r), this.setData({
            day: e,
            hr: i,
            min: s,
            sec: r
        }), i + "小时" + s + "分钟" + r + "秒";
    },
    getpro: function() {
        var i = this;
        wx.request({
            url: i.data.baseurl + "doPageptprolist",
            data: {
                uniacid: i.data.uniacid
            },
            success: function(a) {
                var t = a.data.data, e = (t.guiz, t.cate[0].id);
                console.log(e), i.sandcid(e);
            }
        });
    },
    sandcid: function(a) {
        var s = this;
        wx.request({
            url: s.data.baseurl + "doPageptprolist",
            data: {
                uniacid: s.data.uniacid,
                cate: a
            },
            success: function(a) {
                var t = a.data.data, e = t.guiz, i = t.cate[0].id;
                s.setData({
                    lists: t.lists,
                    styles: e.types,
                    cate: t.cate,
                    cid: i
                });
            }
        });
    },
    handleTap: function(a) {
        var i = a.currentTarget.dataset.id, s = this;
        wx.request({
            url: s.data.baseurl + "doPageptprolist",
            data: {
                uniacid: s.data.uniacid,
                cate: i
            },
            success: function(a) {
                var t = a.data.data, e = t.guiz;
                s.setData({
                    lists: t.lists,
                    styles: e.types,
                    cate: t.cate,
                    cid: i
                });
            }
        });
    }
});