var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        data: [],
        page_signs: "/sudu8_page_plugin_forum/index/index"
    },
    onPullDownRefresh: function() {
        this.getbaseinfo(), this.getfunc(), wx.stopPullDownRefresh();
    },
    onShow: function() {
        this.getfunc();
    },
    onLoad: function() {
        wx.setNavigationBarTitle({
            title: "同城首页"
        }), this.getbaseinfo();
    },
    getbaseinfo: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageBaseMin",
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
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, n = a.currentTarget.dataset.linktype;
        app.redirectto(t, n);
    },
    getfunc: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageForumfunc",
            data: {
                uniacid: t.data.uniacid
            },
            success: function(a) {
                console.log(a), t.setData({
                    data: a.data.data
                });
            },
            fail: function(a) {}
        });
    },
    onReady: function() {},
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});