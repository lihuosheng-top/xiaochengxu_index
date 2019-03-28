var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid
    },
    onLoad: function(a) {
        var o = this;
        a.id && (o.data.id = a.id), wx.setNavigationBarTitle({
            title: "奖品列表"
        }), wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: a.nav_color ? a.nav_color : "#FEA049"
        }), wx.request({
            url: o.data.baseurl + "doPagegetPrizeList",
            data: {
                uniacid: o.data.uniacid,
                id: a.id
            },
            success: function(a) {
                console.log(a), o.setData({
                    prizes: a.data.data
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});