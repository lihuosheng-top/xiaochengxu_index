var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        kuaidi: "",
        kuaidihao: ""
    },
    onLoad: function(a) {
        var o = this;
        a.kuaidi && o.setData({
            kuaidi: a.kuaidi
        }), a.kuaidihao && o.setData({
            kuaidihao: a.kuaidihao
        }), o.getBase();
    },
    getBase: function() {
        var o = this;
        wx.request({
            url: o.data.baseurl + "doPageBaseMin",
            cachetime: "30",
            data: {
                uniacid: o.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                o.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: o.data.baseinfo.base_tcolor,
                    backgroundColor: o.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});