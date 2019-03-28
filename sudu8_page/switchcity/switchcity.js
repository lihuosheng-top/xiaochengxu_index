var _Page;

function _defineProperty(t, e, i) {
    return e in t ? Object.defineProperty(t, e, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = i, t;
}

var city = require("../../sudu8_page/resource/js/city.js"), app = getApp();

Page((_defineProperty(_Page = {
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        searchLetter: [],
        showLetter: "",
        winHeight: 0,
        cityList: [],
        isShowLetter: !1,
        scrollTop: 0,
        scrollTopId: "",
        city: "上海市",
        hotcityList: [ {
            cityCode: 11e4,
            city: "北京市"
        }, {
            cityCode: 31e4,
            city: "上海市"
        }, {
            cityCode: 440100,
            city: "广州市"
        }, {
            cityCode: 440300,
            city: "深圳市"
        }, {
            cityCode: 330100,
            city: "杭州市"
        }, {
            cityCode: 320100,
            city: "南京市"
        }, {
            cityCode: 420100,
            city: "武汉市"
        }, {
            cityCode: 410100,
            city: "郑州市"
        }, {
            cityCode: 12e4,
            city: "天津市"
        }, {
            cityCode: 610100,
            city: "西安市"
        }, {
            cityCode: 510100,
            city: "成都市"
        }, {
            cityCode: 5e5,
            city: "重庆市"
        } ]
    },
    onPullDownRefresh: function() {
        this.getinfos();
    },
    onLoad: function(t) {
        for (var e = this, i = city.searchLetter, a = t.c, o = city.cityList(), r = wx.getSystemInfoSync().windowHeight, c = r / i.length, n = [], s = 0; s < i.length; s++) {
            var d = {};
            d.name = i[s], d.tHeight = s * c, d.bHeight = (s + 1) * c, n.push(d);
        }
        e.setData({
            winHeight: r,
            itemH: c,
            searchLetter: n,
            cityList: o,
            city: a
        });
        var u = 0;
        t.fxsid && (u = t.fxsid, e.setData({
            fxsid: t.fxsid
        })), app.util(e.getinfos, u, e.data.uniacid);
    },
    redirectto: function(t) {
        var e = t.currentTarget.dataset.link, i = t.currentTarget.dataset.linktype;
        app.redirectto(e, i);
    },
    getinfos: function() {
        var e = this;
        wx.getStorage({
            key: "openid",
            success: function(t) {
                e.setData({
                    openid: t.data
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        this.getBase();
    },
    onHide: function() {},
    onUnload: function() {}
}, "onPullDownRefresh", function() {}), _defineProperty(_Page, "onReachBottom", function() {}), 
_defineProperty(_Page, "getBase", function() {
    var e = this;
    wx.request({
        url: e.data.baseurl + "doPageBaseMin",
        data: {
            uniacid: e.data.uniacid,
            vs1: 1
        },
        cachetime: "30",
        success: function(t) {
            e.setData({
                baseinfo: t.data.data
            }), wx.setNavigationBarTitle({
                title: "切换城市"
            }), wx.setNavigationBarColor({
                frontColor: e.data.baseinfo.base_tcolor,
                backgroundColor: e.data.baseinfo.base_color
            });
        },
        fail: function(t) {
            console.log(t);
        }
    });
}), _defineProperty(_Page, "clickLetter", function(t) {
    var e = t.currentTarget.dataset.letter;
    this.setData({
        showLetter: e,
        isShowLetter: !0,
        scrollTopId: e
    });
    var i = this;
    setTimeout(function() {
        i.setData({
            isShowLetter: !1
        });
    }, 1e3);
}), _defineProperty(_Page, "bindCity", function(t) {
    this.setData({
        city: t.currentTarget.dataset.city
    }), wx.redirectTo({
        url: "/sudu8_page/store/store?city=" + t.currentTarget.dataset.city
    });
}), _defineProperty(_Page, "bindHotCity", function(t) {
    this.setData({
        city: t.currentTarget.dataset.city
    }), wx.redirectTo({
        url: "/sudu8_page/store/store?city=" + t.currentTarget.dataset.city
    });
}), _defineProperty(_Page, "hotCity", function() {
    this.setData({
        scrollTop: 0
    });
}), _Page));