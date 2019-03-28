var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        baseinfo: [],
        minHeight: 200
    },
    onPullDownRefresh: function() {
        this.getBase(), this.getList();
    },
    onLoad: function(a) {
        var t = this, e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.setData({
            page_sign: "listCate" + a.cid,
            cid: a.cid
        }), t.getBase(), app.util(t.getinfos, e, t.data.uniacid);
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
                }), t.getList();
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
    handleTap: function(a) {
        var t = a.currentTarget.id;
        t && (this.setData({
            cid: t,
            page: 1
        }), this.getList(t));
    },
    getList: function(a) {
        var t = this;
        a || (a = t.data.cid), wx.request({
            url: t.data.baseurl + "doPagelistCate",
            cachetime: "0",
            data: {
                cid: a,
                uniacid: t.data.uniacid
            },
            success: function(a) {
                console.log(a), t.setData({
                    cateinfo: a.data.data,
                    cateslide: a.data.data.cateslide
                }), wx.setNavigationBarTitle({
                    title: t.data.cateinfo.name
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    makePhoneCall: function(a) {
        var t = this.data.baseinfo.tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    makePhoneCallB: function(a) {
        var t = this.data.baseinfo.tel_b;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    openMap: function(a) {
        var t = this;
        wx.openLocation({
            latitude: parseFloat(t.data.baseinfo.latitude),
            longitude: parseFloat(t.data.baseinfo.longitude),
            name: t.data.baseinfo.name,
            address: t.data.baseinfo.address,
            scale: 22
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.cateinfo.name + "-" + this.data.baseinfo.name
        };
    }
});