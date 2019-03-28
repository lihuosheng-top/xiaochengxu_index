var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        title: "收货地址",
        address_is: 1,
        moren: 0,
        choose: 0,
        id: 0,
        region: [ "北京市", "北京市", "东城区" ]
    },
    onPullDownRefresh: function() {
        this.myaddress();
    },
    onLoad: function(a) {
        var d = this, e = a.shareid;
        null != e && d.setData({
            shareid: e
        });
        var t = a.orderid;
        null != t & "undefined" != t && d.setData({
            orderid: t
        });
        var s = a.pid;
        null != s && d.setData({
            pid: s
        }), wx.setNavigationBarTitle({
            title: d.data.title
        }), wx.getSystemInfo({
            success: function(a) {
                var e = a.windowHeight, t = a.windowHeight - 59;
                d.setData({
                    h: t,
                    choose_h: e
                });
            }
        }), wx.request({
            url: d.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: d.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                if (a.data.data.video) ;
                if (a.data.data.c_b_bg) ;
                d.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarTitle({
                    title: d.data.baseinfo.name
                }), wx.setNavigationBarColor({
                    frontColor: d.data.baseinfo.base_tcolor,
                    backgroundColor: d.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
        var i = 0;
        a.fxsid && (i = a.fxsid, d.setData({
            fxsid: a.fxsid
        })), app.util(d.getinfos, i, d.data.uniacid);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                e.setData({
                    openid: a.data
                }), e.myaddress();
            }
        });
    },
    moren_set: function(a) {
        var e = this, t = (e.data.moren, a.currentTarget.dataset.id), d = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "doPagesetmoaddress",
            data: {
                openid: d,
                id: t
            },
            success: function(a) {
                e.myaddress();
            }
        });
    },
    choose_close: function() {
        this.setData({
            choose: 0
        });
    },
    add_address: function(a) {
        var e = this, t = a.currentTarget.dataset.id;
        e.setData({
            choose: 1,
            id: t
        });
        var d = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "doPagegetaddressinfo",
            data: {
                uniacid: e.data.uniacid,
                openid: d,
                id: t
            },
            success: function(a) {
                a.data.data && e.setData({
                    addressinfo: a.data.data,
                    region: a.data.data.region
                });
            }
        });
    },
    myaddress: function() {
        var e = this, a = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "doPagegetmyaddress",
            data: {
                uniacid: e.data.uniacid,
                openid: a
            },
            success: function(a) {
                e.setData({
                    myaddress: a.data.data
                });
            }
        });
    },
    wx_address: function() {
        var o = this, r = wx.getStorageSync("openid");
        wx.chooseAddress({
            success: function(a) {
                var e = a.provinceName + " " + a.cityName + " " + a.countyName, t = a.detailInfo, d = a.userName, s = a.telNumber, i = a.postalCode;
                wx.request({
                    url: o.data.baseurl + "doPagesetmyaddress",
                    data: {
                        uniacid: o.data.uniacid,
                        openid: r,
                        name: d,
                        mobile: s,
                        address: e,
                        more_address: t,
                        postalcode: i,
                        froms: "weixin"
                    },
                    success: function(a) {
                        o.myaddress();
                    }
                });
            }
        });
    },
    bindRegionChange: function(a) {
        console.log("picker发送选择改变，携带值为", a.detail.value), this.setData({
            region: a.detail.value
        });
    },
    formSubmit: function(a) {
        var e = this, t = e.data.id, d = a.detail.value, s = e.data.region, i = d.realname, o = d.mobile, r = d.postalcode, n = s[0] + " " + s[1] + " " + s[2], c = d.more_address, u = wx.getStorageSync("openid");
        wx.request({
            url: e.data.baseurl + "doPagesetmyaddress",
            data: {
                uniacid: e.data.uniacid,
                id: t,
                openid: u,
                name: i,
                mobile: o,
                address: n,
                more_address: c,
                postalcode: r,
                froms: "selfadd"
            },
            success: function(a) {
                wx.showToast({
                    title: "更新/新建成功",
                    icon: "success",
                    duration: 2e3
                }), e.setData({
                    id: 0
                }), e.choose_close(), e.myaddress();
            }
        });
    },
    deladdress: function(a) {
        var e = this, t = a.currentTarget.dataset.id;
        wx.request({
            url: e.data.baseurl + "doPagedelmyaddress",
            data: {
                uniacid: e.data.uniacid,
                id: t
            },
            success: function(a) {
                wx.showToast({
                    title: "删除成功",
                    icon: "success",
                    duration: 2e3
                }), e.myaddress();
            }
        });
    },
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link, t = a.currentTarget.dataset.linktype;
        app.redirectto(e, t);
    },
    xuanzaddress: function(a) {
        var e = a.currentTarget.dataset.id, t = getCurrentPages(), d = t[t.length - 2].route;
        wx.redirectTo({
            url: "/" + d + "?addressid=" + e + "&shareid=" + this.data.shareid + "&id=" + this.data.pid + "&orderid=" + this.data.orderid
        });
    }
});