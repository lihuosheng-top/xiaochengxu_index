var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
    return typeof a;
} : function(a) {
    return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a;
}, app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page: 1,
        morePro: !1,
        ProductsList: [],
        baseinfo: [],
        subcate: [],
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time,
            i_view: app.globalData.i_view,
            close: app.globalData.close,
            v_ico: app.globalData.v_ico
        },
        where: [],
        cids: 0,
        hid: 0,
        pid: [],
        avtcatas: [],
        tmp: 0,
        subShow: 0,
        heighthave: 0
    },
    onPullDownRefresh: function() {
        this.getBase(), this.getList(), this.setData({
            page: 1
        });
    },
    onLoad: function(a) {
        var t = this;
        t.setData({
            page_sign: "listCon" + a.cid,
            cid: a.cid,
            uid: a.cid
        });
        var i = 0;
        a.fxsid && (i = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getBase(), app.util(t.getinfos, i, t.data.uniacid);
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                t.setData({
                    openid: a.data
                }), t.getList(), t.getall();
            }
        });
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, i = a.currentTarget.dataset.linktype;
        app.redirectto(t, i);
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
        var t = a.target.dataset.index;
        if ("object" != _typeof(this.data.actcatas)) {
            if (this.data.actcatas = new Array(), null == _typeof(this.data.actcatas[t])) {
                this.data.actcatas[t] = 0;
                var i = this;
                this.setData({
                    actcata: i.data.actcatas
                });
            }
        } else if (null == _typeof(this.data.actcatas[t])) {
            this.data.actcatas[t] = 0;
            i = this;
            this.setData({
                actcata: i.data.actcatas
            });
        }
        if (this.data.cids == a.target.dataset.id && 1 == this.data.subShow) this.setData({
            cid: 0,
            page: 1,
            subShow: 1
        }), this.data.cids = 0; else {
            var e = a.currentTarget.id.slice(1);
            e && (this.setData({
                cid: e,
                page: 1,
                subShow: 1
            }), this.data.cids = e);
        }
    },
    getCate: function(a) {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPagegetcate",
            cachetime: "0",
            data: {
                uniacid: t.data.uniacid,
                cid: a
            },
            success: function(a) {
                t.setData({
                    subinfo: a.data
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getall: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPagechangelist",
            cachetime: "30",
            data: {
                uniacid: t.data.uniacid,
                multi_id: t.data.uid,
                all: 1
            },
            success: function(a) {
                t.setData({
                    cate_list: a.data.pro_list,
                    subinfo: ""
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    changelist: function(a) {
        for (var t = a.target.dataset.pid, i = this, e = !0, s = 0; s < this.data.pid.length; s++) i.data.pid[s] == t && (e = !1);
        var o = a.target.dataset.index, d = a.target.dataset.id, c = (i.data.topcate[o].sons, 
        i.data.actcatas);
        if ("object" != (void 0 === c ? "undefined" : _typeof(c)) && (i.data.actcatas = new Array()), 
        0 == this.data.actcatas.length && (this.data.actcatas[0] = 0, this.data.pid[0] = i.data.tmp), 
        3 == this.data.actcatas.length) for (s = 0; s < this.data.actcatas.length; s++) 0 == parseInt(this.data.actcatas[s]) && this.data.actcatas.splice(s, 1);
        this.data.actcatas[o] = d, 1 == e && (this.data.pid[o] = t), this.setData({
            actcata: i.data.actcatas
        });
        var n = this, l = a.target.dataset.id, r = n.data.actcatas.join(",");
        wx.request({
            url: n.data.baseurl + "doPagechangelist",
            cachetime: "0",
            data: {
                uniacid: n.data.uniacid,
                cid: r,
                pid: i.data.pid.join("-"),
                multi_id: n.data.uid,
                all: 2
            },
            success: function(a) {
                n.setData({
                    cate_list: a.data.pro_list,
                    hid: parseInt(l),
                    subShow: 0
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    getList: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPagelistArt_duo",
            cachetime: "30",
            data: {
                uniacid: t.data.uniacid,
                types: "showArt",
                multi_id: t.data.cid
            },
            success: function(a) {
                console.log(a), t.data.tmp = a.data.topcate[0].id, t.setData({
                    hid: t.data.hid,
                    cid: t.data.cids,
                    cateinfo: a.data.cate,
                    topcate: a.data.topcate,
                    cate_list: a.data.pro_list
                }), wx.setNavigationBarTitle({
                    title: a.data.cate.name
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    onReachBottom: function() {
        var t = this, i = t.data.page + 1, a = t.data.cid;
        wx.request({
            url: t.data.baseurl + "doPagelistPic",
            data: {
                uniacid: t.data.uniacid,
                cid: a,
                page: i
            },
            success: function(a) {
                "" != a.data.data.list ? t.setData({
                    cate_list: t.data.cate_list.concat(a.data.data.list),
                    page: i
                }) : t.setData({
                    morePro: !1
                });
            }
        });
    },
    swiperLoad: function(e) {
        var s = this;
        wx.getSystemInfo({
            success: function(a) {
                var t = e.detail.width / e.detail.height, i = a.windowWidth / t;
                s.data.heighthave || s.setData({
                    minHeight: i,
                    heighthave: 1
                });
            }
        });
    },
    openApp: function(a) {
        wx.navigateToMiniProgram({
            appId: a.currentTarget.dataset.id,
            path: a.currentTarget.dataset.path,
            success: function(a) {
                console.log("ok");
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
        wx.openLocation({
            latitude: parseFloat(this.data.baseinfo.latitude),
            longitude: parseFloat(this.data.baseinfo.longitude),
            name: this.data.baseinfo.name,
            address: this.data.baseinfo.address,
            scale: 22
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.cateinfo.name + "-" + this.data.baseinfo.name
        };
    }
});