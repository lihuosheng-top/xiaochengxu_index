var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        page: 1,
        minHeight: 180,
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
            page_signs: "/sudu8_page/listPro/listPro?cid=" + a.cid,
            cid: a.cid,
            options: a
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
            cachetime: "0",
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
        var t = a.currentTarget.id.slice(1);
        t && (this.setData({
            cid: t,
            page: 1
        }), this.getList(t));
    },
    getList: function(a) {
        var u = this;
        null == a && (a = u.data.cid), wx.request({
            url: u.data.baseurl + "doPagelistPic",
            cachetime: "0",
            data: {
                cid: a,
                uniacid: u.data.uniacid
            },
            success: function(a) {
                if (10 < a.data.data.num.length ? u.setData({
                    morePro: !0
                }) : u.setData({
                    morePro: !1
                }), u.setData({
                    cateinfo: a.data.data,
                    cate_list: a.data.data.list,
                    cateslide: a.data.data.cateslide
                }), wx.setNavigationBarTitle({
                    title: u.data.cateinfo.this.name
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), 
                2 == u.data.cateinfo.list_style_more) {
                    var t = u.data.options, e = wx.getStorageSync("systemInfo"), o = t;
                    u.busPos = {}, u.busPos.x = 45, u.busPos.y = app.globalData.hh - 56, u.setData({
                        mechine: o,
                        systemInfo: e,
                        goodsH: e.windowHeight - 55
                    });
                    var i = {};
                    i.catList = a.data.data.newlist;
                    for (var s = [], d = 0; d < a.data.data.length; d++) for (var n = 0; n < a.data.data[d].goodsList.length; n++) s.push(a.data.data[d].goodsList[n]);
                    u.setData({
                        chessRoomDetail: i,
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
    swiperLoad: function(o) {
        var i = this;
        wx.getSystemInfo({
            success: function(a) {
                var t = o.detail.width / o.detail.height, e = a.windowWidth / t;
                i.data.heighthave || i.setData({
                    minHeight: e,
                    heighthave: 1
                });
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
        console.log(a);
        var t = a.currentTarget.dataset.id, e = a.currentTarget.dataset.types, o = a.currentTarget.dataset.ismore, i = "";
        "showPro" == e ? (0 == o && (i = "/sudu8_page/showPro/showPro?id=" + t), 1 == o && (i = "/sudu8_page/showPro_lv/showPro_lv?id=" + t)) : i = "/sudu8_page/" + e + "/" + e + "?id=" + t, 
        wx.navigateTo({
            url: i
        });
    }
});