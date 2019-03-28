var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page: 1,
        morePro: !1,
        ProductsList: [],
        baseinfo: [],
        footer: {
            i_tel: app.globalData.i_tel,
            i_add: app.globalData.i_add,
            i_time: app.globalData.i_time,
            i_view: app.globalData.i_view,
            close: app.globalData.close,
            v_ico: app.globalData.v_ico
        },
        orderOrBusiness: "order",
        block: !1,
        logs: [],
        goodsH: 0,
        scrollToGoodsView: 0,
        toView: "",
        toViewType: "",
        GOODVIEWID: "catGood_",
        animation: !0,
        goodsNumArr: [ 0 ],
        shoppingCart: {},
        shoppingCartGoodsId: [],
        goodMap: {},
        chooseGoodArr: [],
        totalNum: 0,
        totalPay: 0,
        showShopCart: !1,
        fromClickScroll: !1,
        timeStart: "",
        timeEnd: "",
        hideCount: !0,
        count: 0,
        needAni: !1,
        hide_good_box: !0,
        url: "",
        protype: 1,
        minHeight: 180,
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
            page_signs: "/sudu8_page/listPic/listPic?cid=" + a.cid,
            cid: a.cid
        });
        var e = 0;
        a.fxsid && (e = a.fxsid, t.setData({
            fxsid: a.fxsid
        })), t.getBase(), app.util(t.getinfos, e, t.data.uniacid);
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
                    baseinfo: a.data.data,
                    slidecolor: a.data.data.base_color2
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
        var t = a.currentTarget.id.slice(1);
        t && (this.setData({
            cid: t,
            page: 1
        }), this.getList(t));
    },
    getList: function(a) {
        var u = this;
        null == a && (a = u.data.cid), wx.request({
            url: u.data.baseurl + "dopagelistPic",
            cachetime: "30",
            data: {
                cid: a,
                uniacid: u.data.uniacid
            },
            success: function(a) {
                if (console.log(a), 10 < a.data.data.num.length ? u.setData({
                    morePro: !0
                }) : u.setData({
                    morePro: !1
                }), u.setData({
                    cateinfo: a.data.data,
                    cate_list: a.data.data.list,
                    cateslide: a.data.data.cateslide
                }), wx.setNavigationBarTitle({
                    title: u.data.cateinfo.name
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), 
                2 == u.data.cateinfo.list_style_more) {
                    var t = u.data.options, e = wx.getStorageSync("systemInfo"), i = t;
                    u.busPos = {}, u.busPos.x = 45, u.busPos.y = app.globalData.hh - 56, u.setData({
                        mechine: i,
                        systemInfo: e,
                        goodsH: e.windowHeight - 55,
                        minHeight: 200,
                        goodsRh: e.windowHeight - 55 + 200
                    });
                    var o = {};
                    o.catList = a.data.data.newlist;
                    for (var s = [], d = 0; d < a.data.data.length; d++) for (var n = 0; n < a.data.data[d].goodsList.length; n++) s.push(a.data.data[d].goodsList[n]);
                    u.setData({
                        chessRoomDetail: o,
                        allpro: s
                    }), u.setData({
                        toView: u.GOODVIEWID + u.data.chessRoomDetail.catList[0].id,
                        catHighLightIndex: 0
                    });
                    for (var r = 0; r < u.data.chessRoomDetail.catList.length; r++) {
                        u.data.goodsNumArr.push(u.data.chessRoomDetail.catList[r].goodsList.length);
                        var l = u.data.chessRoomDetail.catList[r].goodsList;
                        if (0 < l.length) for (var c = 0; c < l.length; c++) u.data.goodMap[l[c].id] = l[c];
                    }
                    for (var g = [], h = 0; h < u.data.goodsNumArr.length; h++) 0 == h ? g.push(0) : g.push(98 * u.data.goodsNumArr[h] + g[h - 1]);
                    u.data.goodsNumArr = g;
                }
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    onReachBottom: function() {
        var t = this, e = t.data.page + 1, a = t.data.cid;
        wx.request({
            url: t.data.baseurl + "doPagelistPic",
            data: {
                cid: a,
                page: e,
                uniacid: t.data.uniacid
            },
            success: function(a) {
                "" != a.data.data.list ? t.setData({
                    cate_list: t.data.cate_list.concat(a.data.data.list),
                    page: e
                }) : t.setData({
                    morePro: !1
                });
            }
        });
    },
    swiperLoad: function(i) {
        var o = this;
        wx.getSystemInfo({
            success: function(a) {
                var t = i.detail.width / i.detail.height, e = a.windowWidth / t;
                o.data.heighthave || o.setData({
                    minHeight: e,
                    heighthave: 1
                });
            }
        });
    },
    openApp: function(a) {
        wx.navigateToMiniProgram({
            appId: a.currentTarget.dataset.id,
            path: a.currentTarget.dataset.path,
            success: function(a) {}
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
    },
    goodsViewScrollFn: function(a) {
        this.getIndexFromHArr(a.detail.scrollTop);
    },
    getIndexFromHArr: function(a) {
        for (var t = 0; t < this.data.goodsNumArr.length; t++) {
            var e = a - 40 * t;
            e >= this.data.goodsNumArr[t] && e < this.data.goodsNumArr[t + 1] && (this.data.fromClickScroll || this.setData({
                catHighLightIndex: t
            }));
        }
        this.setData({
            fromClickScroll: !1
        });
    },
    catClickFn: function(a) {
        var t = a.target.id.split("_")[1], e = a.target.id.split("_")[2];
        this.setData({
            fromClickScroll: !0
        }), this.setData({
            catHighLightIndex: t
        }), this.setData({
            toView: this.data.GOODVIEWID + e
        });
    },
    tabChange: function(a) {
        var t = a.currentTarget.dataset.id;
        this.setData({
            orderOrBusiness: t
        });
    },
    tiaozhuang: function(a) {
        var t = a.currentTarget.dataset.id, e = a.currentTarget.dataset.types, i = a.currentTarget.dataset.ismore, o = "";
        "showPro" == e ? (0 == i && (o = "/sudu8_page/showPro/showPro?id=" + t), 1 == i && (o = "/sudu8_page/showPro_lv/showPro_lv?id=" + t)) : o = "/sudu8_page/" + e + "/" + e + "?id=" + t, 
        wx.navigateTo({
            url: o
        });
    }
});