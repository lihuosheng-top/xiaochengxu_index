var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        staffs: "",
        list_style: 1,
        baseinfo: ""
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "员工名片列表"
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getBase(), app.util(t.getinfos, e, t.data.uniacid);
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                }), t.getinfo(), t.getstaffs();
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
    getinfo: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                wx.request({
                    url: e.data.baseurl + "dopageglobaluserinfo",
                    data: {
                        uniacid: e.data.uniacid,
                        openid: a.data
                    },
                    success: function(a) {
                        var t = a.data.data;
                        t.nickname && t.avatar || e.setData({
                            isview: 1
                        }), e.setData({
                            globaluser: a.data.data
                        });
                    }
                });
            }
        });
    },
    getstaffs: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPagegetStaffs",
            data: {
                uniacid: t.data.uniacid
            },
            success: function(a) {
                t.setData({
                    staffs: a.data.data
                });
            }
        });
    },
    getstaffset: function() {
        var t = this;
        wxrequest({
            url: t.data.baseurl + "doPagegetStaffset",
            success: function(a) {
                t.setData({
                    list_style: a.data.data.list_style
                });
            }
        });
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    staffcard: function(a) {
        var t = a.currentTarget.dataset.text;
        wx.navigateTo({
            url: "/sudu8_page/staff_card/staff_card?id=" + t
        });
    },
    sharestaffcard: function(a) {
        var t = a.currentTarget.dataset.text;
        wx.navigateTo({
            url: "/sudu8_page/staff_card/staff_card?id=" + t + "&share=1"
        });
    }
});