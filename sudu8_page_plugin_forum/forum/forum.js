var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        funcAll: [],
        data: [],
        fid: 0,
        releaseAll: [],
        isview: 0,
        rid: 0,
        pageType: 0,
        page: 1
    },
    onShow: function() {
        this.setData({
            page: 1
        }), this.getlist();
    },
    onPullDownRefresh: function() {
        this.setData({
            page: 1
        }), this.getlist(), wx.stopPullDownRefresh();
    },
    onLoad: function(a) {
        var e = this;
        wx.setNavigationBarTitle({
            title: "发布列表页"
        });
        var t = a.fid;
        0 < a.fid && e.setData({
            fid: t
        }), wx.request({
            url: e.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: e.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                e.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: e.data.baseinfo.base_tcolor,
                    backgroundColor: e.data.baseinfo.base_color
                });
            },
            fail: function(a) {
                console.log(a);
            }
        }), app.util(e.getinfos, 0, e.data.uniacid);
    },
    redirectto: function(a) {
        var e = a.currentTarget.dataset.link, t = a.currentTarget.dataset.linktype;
        app.redirectto(e, t);
    },
    getinfos: function() {
        var t = this;
        wx.getStorage({
            key: "openid",
            success: function(a) {
                wx.request({
                    url: t.data.baseurl + "dopageglobaluserinfo",
                    data: {
                        uniacid: t.data.uniacid,
                        openid: a.data
                    },
                    success: function(a) {
                        var e = a.data.data;
                        e.nickname && e.avatar || t.setData({
                            isview: 1
                        }), t.setData({
                            globaluser: a.data.data
                        });
                    }
                });
                var e = a.data;
                t.setData({
                    openid: e
                });
            },
            fail: function(a) {
                t.setData({
                    isview: 1
                });
            }
        });
    },
    huoqusq: function() {
        var l = this, r = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(a) {
                var e = a.userInfo, t = e.nickName, i = e.avatarUrl, n = e.gender, o = e.province, s = e.city, d = e.country;
                wx.request({
                    url: l.data.baseurl + "doPageUseupdate",
                    data: {
                        uniacid: l.data.uniacid,
                        openid: r,
                        nickname: t,
                        avatarUrl: i,
                        gender: n,
                        province: o,
                        city: s,
                        country: d
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        wx.setStorageSync("golobeuid", a.data.data.id), wx.setStorageSync("golobeuser", a.data.data), 
                        l.setData({
                            isview: 0,
                            globaluser: a.data.data
                        });
                    }
                });
            }
        });
    },
    changeLikes: function(a) {
        var t = this, i = a.currentTarget.dataset.index, e = a.currentTarget.dataset.rid;
        wx.request({
            url: t.data.baseurl + "doPageForumLikes",
            data: {
                uniacid: t.data.uniacid,
                openid: wx.getStorageSync("openid"),
                rid: e,
                vs: 1
            },
            success: function(a) {
                var e = t.data.releaseAll;
                wx.getStorageSync("golobeuser").nickname;
                1 == a.data.data.is_like ? (wx.showToast({
                    title: "点赞成功"
                }), e[i].is_like = 1) : 2 == a.data.data.is_like && (wx.showToast({
                    title: "取赞成功"
                }), e[i].is_like = 2), e[i].likes = a.data.data.num, e[i].likesAll = a.data.data.likesAll, 
                t.setData({
                    releaseAll: e
                });
            },
            fail: function(a) {}
        });
    },
    changeCollection: function(a) {
        var t = this, i = a.currentTarget.dataset.index, e = a.currentTarget.dataset.rid;
        wx.request({
            url: t.data.baseurl + "doPageForumCollection",
            data: {
                uniacid: t.data.uniacid,
                openid: t.data.openid,
                rid: e,
                vs: 1
            },
            success: function(a) {
                var e = t.data.releaseAll;
                1 == a.data.data.is_collect ? (wx.showToast({
                    title: "收藏成功"
                }), e[i].is_collect = 1) : 2 == a.data.data.is_collect && (wx.showToast({
                    title: "取收成功"
                }), e[i].is_collect = 2), e[i].collection = a.data.data.num, t.setData({
                    releaseAll: e
                });
            },
            fail: function(a) {}
        });
    },
    onReady: function() {},
    getlist: function(a) {
        var e = this;
        if (null == a) var t = e.data.fid; else {
            t = a.currentTarget.dataset.id;
            e.setData({
                fid: t
            });
        }
        wx.request({
            url: e.data.baseurl + "doPageReleaseAll",
            data: {
                uniacid: e.data.uniacid,
                fid: t,
                page: e.data.page,
                openid: wx.getStorageSync("openid")
            },
            success: function(a) {
                "" != a.data && (2 == a.data.data.is ? wx.showModal({
                    title: "提示",
                    content: "该分类不存在或不启用",
                    showCancel: !1,
                    success: function(a) {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                }) : e.setData({
                    releaseAll: a.data.data.releaseAll,
                    funcAll: a.data.data.funcAll,
                    pageType: a.data.data.pageType
                }));
            }
        });
    },
    onReachBottom: function() {
        var e = this, t = e.data.page + 1, a = e.data.fid;
        wx.request({
            url: e.data.baseurl + "doPageReleaseAll",
            data: {
                uniacid: e.data.uniacid,
                fid: a,
                page: t,
                openid: e.data.openid
            },
            success: function(a) {
                e.setData({
                    releaseAll: e.data.releaseAll.concat(a.data.data.releaseAll),
                    page: t
                });
            }
        });
    },
    goRelease: function() {
        wx.navigateTo({
            url: "/sudu8_page_plugin_forum/release/release?fid=" + this.data.fid
        });
    },
    goCollect: function() {
        wx.navigateTo({
            url: "/sudu8_page_plugin_forum/collect/collect"
        });
    },
    goContent: function(a) {
        var e = a.currentTarget.dataset.rid;
        wx.navigateTo({
            url: "/sudu8_page_plugin_forum/forum_page/forum_page?rid=" + e
        });
    },
    makephone: function(a) {
        var e = a.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: e
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onShareAppMessage: function() {}
});