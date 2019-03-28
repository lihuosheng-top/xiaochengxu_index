var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
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
        protype: 1
    },
    onLoad: function(t) {
        var a = this;
        if (this.setData({
            options: t
        }), !(e = t.scene)) {
            var e = 0;
            wx.setStorage({
                key: "zid",
                data: e
            });
        }
        0 < e && (this.setData({
            mid: e
        }), this.getzh(e)), a.getIndex(), app.util(this.getinfos, 0, a.data.uniacid), a.getSjbase(t);
    },
    getinfos: function() {
        var a = this;
        a.data.options;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                a.setData({
                    openid: t.data
                });
            }
        });
    },
    redirectto: function(t) {
        var a = t.currentTarget.dataset.link, e = t.currentTarget.dataset.linktype;
        app.redirectto(a, e);
    },
    getzh: function(t) {
        var e = this;
        wx.request({
            url: e.data.baseurl + "doPageGetzh",
            data: {
                uniacid: e.data.uniacid,
                zid: t
            },
            success: function(t) {
                e.setData({
                    tnum: t.data.data.zh.tnum,
                    zhm: t.data.data.zh.title + t.data.data.zh.tnum
                });
                var a = t.data.data.keys;
                wx.setStorageSync("arrkey", a), wx.setStorageSync("zid", t.data.data.zh.tnum);
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    getIndex: function() {
        var i = this;
        wx.request({
            url: i.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: i.data.uniacid,
                vs1: 1
            },
            success: function(t) {
                if (t.data.data.video) var a = "show";
                if (t.data.data.c_b_bg) var e = "bg";
                i.setData({
                    baseinfo: t.data.data,
                    show_v: a,
                    c_b_bg1: e
                }), wx.setNavigationBarColor({
                    frontColor: i.data.baseinfo.base_tcolor,
                    backgroundColor: i.data.baseinfo.base_color
                });
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    goodsViewScrollFn: function(t) {
        this.getIndexFromHArr(t.detail.scrollTop);
    },
    getIndexFromHArr: function(t) {
        for (var a = 0; a < this.data.goodsNumArr.length; a++) {
            var e = t - 40 * a;
            e >= this.data.goodsNumArr[a] && e < this.data.goodsNumArr[a + 1] && (this.data.fromClickScroll || this.setData({
                catHighLightIndex: a
            }));
        }
        this.setData({
            fromClickScroll: !1
        });
    },
    catClickFn: function(t) {
        var a = t.target.id.split("_")[1], e = t.target.id.split("_")[2];
        this.setData({
            fromClickScroll: !0
        }), this.setData({
            catHighLightIndex: a
        }), this.setData({
            toView: this.data.GOODVIEWID + e
        });
    },
    addGoodToCartFn: function(t) {
        var a = this, e = t.target.id.split("_")[1], i = a.data.allpro, o = a.data.protype;
        if (1 == o) for (var s = 0; s < i.length; s++) if (i[s].id == e) var r = (n = i[s]).title;
        if (2 == o) {
            var n;
            r = (n = a.data.xgg.target.dataset.index).title + "[" + a.data.strval + "]";
        }
        var d = a.data.gwcdata;
        if (d) {
            for (var c = 0, u = 0, l = 0; l < d.length; l++) if (d[l].title == r && n.id == d[l].id) {
                c = 1, u = l;
                break;
            }
            if (0 == c) (h = {}).id = n.id, h.price = n.price, h.title = r, h.num = 1, d.push(h); else d[u].num += 1;
        } else {
            var h;
            d = [], (h = {}).id = n.id, h.price = n.price, h.title = r, h.num = 1, d.push(h);
        }
        a.setData({
            gwcdata: d
        }), this._resetTotalNum();
    },
    touchOnGoods: function(t) {
        clearInterval(this.timer), this.finger = {};
        var a = {};
        this.finger.x = t.touches[0].clientX, this.finger.y = t.touches[0].clientY, this.finger.y < this.busPos.y ? a.y = this.finger.y - 150 : a.y = this.busPos.y - 150, 
        a.x = Math.abs(this.finger.x - this.busPos.x) / 2, this.finger.x > this.busPos.x ? a.x = (this.finger.x - this.busPos.x) / 2 + this.busPos.x : a.x = (this.busPos.x - this.finger.x) / 2 + this.finger.x, 
        this.linePos = app.bezier([ this.busPos, a, this.finger ], 30), this.startAnimation(t);
    },
    startAnimation: function(t) {
        var a = 0, e = this, i = e.linePos.bezier_points;
        this.setData({
            hide_good_box: !1,
            bus_x: e.finger.x,
            bus_y: e.finger.y
        });
        var o = i.length;
        a = o, this.timer = setInterval(function() {
            a--, e.setData({
                bus_x: i[a].x,
                bus_y: i[a].y
            }), a < 1 && (clearInterval(e.timer), e.addGoodToCartFn(t), e.setData({
                hide_good_box: !0
            }));
        }, 22);
    },
    decreaseGoodToCartFn: function(t) {
        var a = t.target.id, e = this.data.gwcdata;
        e[a].num--, 0 == e[a].num && e.splice(a, 1), this.setData({
            gwcdata: e
        }), this._resetTotalNum();
    },
    _resetTotalNum: function() {
        var t = this.data.gwcdata, a = 0, e = 0;
        if (t) for (var i = 0; i < t.length; i++) a += t[i].num, e += t[i].num * t[i].price;
        this.setData({
            totalNum: a,
            totalPay: e.toFixed(2),
            chooseGoodArr: t
        });
    },
    showShopCartFn: function(t) {
        0 < this.data.totalPay && this.setData({
            showShopCart: !this.data.showShopCart
        });
    },
    goPayFn: function(t) {
        this.data.mid;
        0 < this.data.totalPay && (wx.setStorage({
            key: "gwcdata",
            data: this.data.chooseGoodArr
        }), wx.setStorage({
            key: "gwcprice",
            data: this.data.totalPay
        }), wx.navigateTo({
            url: "/sudu8_page_plugin_food/food_order/food_order"
        }));
    },
    tabChange: function(t) {
        var a = t.currentTarget.dataset.id;
        this.setData({
            orderOrBusiness: a
        });
    },
    getSjbase: function(h) {
        var g = this;
        wx.request({
            url: g.data.baseurl + "doPageShangjbs",
            data: {
                uniacid: g.data.uniacid
            },
            success: function(t) {
                g.setData({
                    shangjbs: t.data.data
                }), wx.setNavigationBarTitle({
                    title: t.data.data.names
                });
            },
            fail: function(t) {
                console.log(t);
            }
        }), wx.request({
            url: g.data.baseurl + "doPageDingcai",
            data: {
                uniacid: g.data.uniacid
            },
            success: function(t) {
                var a = wx.getStorageSync("systemInfo"), e = h;
                g.busPos = {}, g.busPos.x = 45, g.busPos.y = app.globalData.hh - 56, g.setData({
                    mechine: e,
                    systemInfo: a,
                    goodsH: a.windowHeight - 153 - 48
                });
                var i = {};
                i.catList = t.data.data;
                for (var o = [], s = 0; s < t.data.data.length; s++) for (var r = 0; r < t.data.data[s].goodsList.length; r++) o.push(t.data.data[s].goodsList[r]);
                g.setData({
                    chessRoomDetail: i,
                    allpro: o
                }), g.setData({
                    toView: g.GOODVIEWID + g.data.chessRoomDetail.catList[0].id,
                    catHighLightIndex: 0
                });
                for (var n = 0; n < g.data.chessRoomDetail.catList.length; n++) {
                    g.data.goodsNumArr.push(g.data.chessRoomDetail.catList[n].goodsList.length);
                    var d = g.data.chessRoomDetail.catList[n].goodsList;
                    if (0 < d.length) for (var c = 0; c < d.length; c++) g.data.goodMap[d[c].id] = d[c];
                }
                for (var u = [], l = 0; l < g.data.goodsNumArr.length; l++) 0 == l ? u.push(0) : u.push(98 * g.data.goodsNumArr[l] + u[l - 1]);
                g.data.goodsNumArr = u;
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    huoqusq: function() {
        var d = this, c = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(t) {
                var a = t.userInfo, e = a.nickName, i = a.avatarUrl, o = a.gender, s = a.province, r = a.city, n = a.country;
                wx.request({
                    url: d.data.baseurl + "doPageUseupdate",
                    data: {
                        uniacid: d.data.uniacid,
                        openid: c,
                        nickname: e,
                        avatarUrl: i,
                        gender: o,
                        province: s,
                        city: r,
                        country: n
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(t) {
                        wx.setStorageSync("golobeuid", t.data.data.id), wx.setStorageSync("golobeuser", t.data.data), 
                        d.setData({
                            isview: 0,
                            globaluser: t.data.data
                        });
                    }
                });
            },
            fail: function() {
                app.selfinfoget(d.chenggfh, d.data.uniacid);
            }
        });
    },
    chenggfh: function() {
        var t = wx.getStorageSync("golobeuser");
        this.setData({
            isview: 0,
            globaluser: t
        });
    },
    add: function(t) {
        for (var a = t.target.dataset.index, e = a.labels, i = 0; i < e.length; i++) e[i].xuanz = e[i].val[0];
        this.setData({
            block: !0,
            type_title: a.otitle,
            type_arr: a.labels,
            lables: e,
            xgg: t
        });
    },
    radioChange: function(t) {
        var a = t.currentTarget.dataset.id, e = t.detail.value, i = this.data.lables;
        i[a].xuanz = i[a].val[e], this.setData({
            lables: i
        });
    },
    proadd: function(t) {
        this.setData({
            protype: 1
        }), this.touchOnGoods(t);
    },
    submit: function() {
        for (var t = this.data.xgg, a = this.data.lables, e = "", i = 0; i < a.length; i++) i == a.length - 1 ? e += a[i].xuanz : e += a[i].xuanz + ",";
        this.setData({
            block: !1,
            strval: e,
            protype: 2
        }), this.touchOnGoods(t);
    },
    makephone: function(t) {
        wx.makePhoneCall({
            phoneNumber: t.currentTarget.dataset.tel
        });
    }
});