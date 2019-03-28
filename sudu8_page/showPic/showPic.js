var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        bg: "",
        picList: [],
        btn: -1,
        showbg: 0,
        shareShow: 0,
        shareScore: 0,
        shareNotice: 0,
        fxsid: 0,
        shareHome: 0
    },
    onPullDownRefresh: function() {
        var a = this.data.id;
        this.getShowPic(a);
    },
    onLoad: function(a) {
        var t = this, e = a.id;
        t.setData({
            id: e
        }), wx.showShareMenu({
            withShareTicket: !0
        });
        var i = 0;
        a.fxsid && (i = a.fxsid, t.setData({
            fxsid: a.fxsid,
            shareHome: 1
        })), a.userid && t.setData({
            userid: a.userid
        }), wx.request({
            url: t.data.baseurl + "doPageBase",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                a.data.data;
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                });
            }
        }), app.util(t.getinfos, i, t.data.uniacid);
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
                e.setData({
                    openid: a.data
                });
                var t = e.data.id;
                e.getShowPic(t), e.givepscore();
            }
        });
    },
    getShowPic: function(a) {
        var t = this, e = t.data.openid;
        wx.request({
            url: t.data.baseurl + "dopageglobaluserinfo",
            data: {
                openid: e,
                uniacid: t.data.uniacid
            },
            success: function(a) {
                t.setData({
                    globaluser: a.data.data
                });
            }
        }), wx.request({
            url: t.data.baseurl + "dopageshowPic",
            data: {
                id: a,
                uniacid: t.data.uniacid
            },
            cachetime: "30",
            success: function(a) {
                t.setData({
                    bg: a.data.data.text[0],
                    picList: a.data.data.text,
                    title: a.data.data.title,
                    desc: a.data.data.desc,
                    btn: a.data.data.btn.pic_page_btn,
                    showbg: a.data.data.btn.pic_page_bg
                }), wx.setNavigationBarTitle({
                    title: t.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    changeSwiper: function(a) {
        var t = a.detail.current;
        this.setData({
            bg: this.data.picList[t]
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
    wxParseImgTap: function(a) {
        var t = a.target.dataset.src;
        wx.previewImage({
            current: t,
            urls: this.data.picList
        });
    },
    shareClo: function() {
        this.setData({
            shareShow: 0
        });
    },
    onShareAppMessage: function() {
        var t = this, e = 1, i = wx.getStorageSync("openid"), s = t.data.id, a = "";
        return a = 1 == t.data.globaluser.fxs ? "/sudu8_page/showPic/showPic?id=" + s + "&userid=" + i : "/sudu8_page/showPic/showPic?id=" + s + "&userid=" + i + "&fxsid=" + i, 
        {
            title: t.data.title,
            path: a,
            success: function(a) {
                void 0 !== a.shareTickets ? a.shareTickets[0] && (e = 2) : e = 1, app.util.request({
                    url: "entry/wxapp/sharejf",
                    data: {
                        openid: i,
                        types: e,
                        id: s
                    },
                    success: function(a) {
                        console.log(a.data.data.score), t.setData({
                            shareScore: a.data.data.score,
                            shareShow: 1,
                            shareNotice: a.data.data.notice
                        });
                    }
                });
            }
        };
    },
    share111: function() {
        this.setData({
            share: 1
        });
    },
    share_close: function() {
        this.setData({
            share: 0
        });
    },
    givepscore: function() {
        var a = this.data.id, t = this.data.userid, e = wx.getStorageSync("openid");
        t != e && 0 != t && "" != t && null != t && wx.request({
            url: this.data.baseurl + "doPagegiveposcore",
            data: {
                id: a,
                types: "showPic",
                openid: e,
                fxsid: t,
                uniacid: this.data.uniacid
            },
            success: function(a) {}
        });
    }
});