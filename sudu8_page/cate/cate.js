var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        baseinfo: [],
        index: 0,
        page_signs: "/sudu8_page/cate/cate",
        curNav: 0
    },
    onLoad: function() {
        var t = this;
        wx.getSystemInfo({
            success: function(a) {
                t.setData({
                    h: a.windowHeight - 55 + "px"
                });
            }
        }), t.getBase(), t.getAllCate(), wx.setNavigationBarTitle({
            title: "商品分类"
        });
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    getBase: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            cachetime: "30",
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
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    catelists: function(a) {
        wx.navigateTo({
            url: "" + a.currentTarget.dataset.url
        });
    },
    getAllCate: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "dopageallCatep",
            cachetime: "30",
            data: {
                uniacid: t.data.uniacid
            },
            success: function(a) {
                t.setData({
                    catelist: a.data.data.list,
                    cateson: a.data.data.son
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    switchRightTab: function(a) {
        var t = this, e = a.target.dataset.id, i = parseInt(a.target.dataset.index);
        wx.request({
            url: t.data.baseurl + "dopagegetcateson",
            cachetime: "30",
            data: {
                uniacid: t.data.uniacid,
                id: e
            },
            success: function(a) {
                t.setData({
                    cateson: a.data.data
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), this.setData({
            curNav: i,
            index: i
        });
    }
});