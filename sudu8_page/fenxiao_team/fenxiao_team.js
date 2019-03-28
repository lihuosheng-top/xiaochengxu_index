var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        nav: 1,
        page_signs: "/sudu8_page/fenxiao_team/fenxiao_team"
    },
    onPullDownRefresh: function() {
        this.getmor();
    },
    onLoad: function(a) {
        var i = this;
        wx.setNavigationBarTitle({
            title: "我的团队"
        });
        var t = 0;
        a.fxsid && (t = a.fxsid, i.setData({
            fxsid: a.fxsid
        })), wx.request({
            url: i.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: i.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                if (a.data.data.video) var t = "show";
                if (a.data.data.c_b_bg) var e = "bg";
                i.setData({
                    baseinfo: a.data.data,
                    show_v: t,
                    c_b_bg1: e
                }), wx.setNavigationBarColor({
                    frontColor: i.data.baseinfo.base_tcolor,
                    backgroundColor: i.data.baseinfo.base_color
                });
            }
        }), app.util(i.getinfos, t, i.data.uniacid);
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                var t = a.data;
                e.setData({
                    openid: t
                }), e.getmor();
            }
        });
    },
    getmor: function() {
        var t = this, a = wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPagemyteam",
            data: {
                uniacid: t.data.uniacid,
                openid: a
            },
            success: function(a) {
                t.setData({
                    myfans: a.data.data.user,
                    counts: a.data.data.user.length,
                    fxcj: a.data.data.cj
                });
            }
        });
    },
    nav: function(a) {
        var t = this, e = a.currentTarget.dataset.id;
        t.setData({
            nav: a.currentTarget.dataset.id
        });
        var i = wx.getStorageSync("openid");
        wx.request({
            url: t.data.baseurl + "doPagemyteam",
            data: {
                uniacid: t.data.uniacid,
                types: e,
                openid: i
            },
            success: function(a) {
                t.setData({
                    myfans: a.data.data.user,
                    counts: a.data.data.user.length,
                    fxcj: a.data.data.cj
                });
            }
        });
    }
});