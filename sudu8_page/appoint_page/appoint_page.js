var week = require("../resource/js/date_week.js"), app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        id: 0,
        date_: "",
        date: "",
        table: [],
        NowSelect: [],
        otherSelect: [],
        NowSelectStr: "",
        weekday: [ "", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天" ]
    },
    onLoad: function(a) {
        var t = this, e = a.id, o = a.tableid;
        if (t.setData({
            tableid: o,
            id: e
        }), console.log(88888888), console.log(a), a.appoint_date) {
            var r = new Date(a.appoint_date).getDay();
            r = a.appoint_date + " (" + t.data.weekday[r] + ")";
        }
        var s = a.startdate ? a.startdate : week.getDates(1)[0].year + "-" + week.getDates(1)[0].month + "-" + week.getDates(1)[0].day;
        t.setData({
            start: a.startdate ? a.startdate : s,
            date_: a.appoint_date ? a.appoint_date : s,
            date: a.appoint_date ? r : s + " (" + week.getDates(1)[0].week + ")"
        }), a.NowSelectStr && t.setData({
            NowSelectStr: a.NowSelectStr
        }), t.getbase(), t.proTable(), t.getSelected();
    },
    getbase: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageBaseMin",
            cachetime: "30",
            data: {
                vs1: 1,
                uniacid: t.data.uniacid
            },
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
    proTable: function() {
        var d = this;
        wx.request({
            url: d.data.baseurl + "doPageproTable",
            data: {
                tableid: d.data.tableid,
                uniacid: d.data.uniacid
            },
            success: function(a) {
                console.log(a);
                var t = a.data.data;
                if (d.setData({
                    table: t
                }), "" != d.data.NowSelectStr) {
                    for (var e = d.data.NowSelectStr.split(","), o = [], r = [], s = 0; s < e.length; s++) o = e[s].split("a"), 
                    r[s] = {}, r[s].row = t.rowstr[parseInt(o[0]) - 1], r[s].column = t.columnstr[parseInt(o[1]) - 1];
                    d.setData({
                        selected: r,
                        NowSelect: e
                    });
                }
                wx.setNavigationBarTitle({
                    title: a.data.data.name
                });
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    selectThis: function(a) {
        var t = this, e = a.currentTarget.dataset.num, o = t.data.NowSelect;
        o.push(e);
        for (var r = [], s = [], d = 0; d < o.length; d++) r = o[d].split("a"), s[d] = {}, 
        s[d].row = t.data.table.rowstr[parseInt(r[0]) - 1], s[d].column = t.data.table.columnstr[parseInt(r[1]) - 1];
        var l = o.join(",");
        t.setData({
            selected: s,
            NowSelect: o,
            NowSelectStr: l
        });
    },
    removeThis: function(a) {
        for (var t = this, e = a.currentTarget.dataset.num, o = t.data.NowSelect, r = 0; r < o.length; r++) o[r] == e && o.splice(r, 1);
        for (var s = [], d = [], l = 0; l < o.length; l++) s = o[l].split("a"), d[l] = {}, 
        d[l].row = t.data.table.rowstr[parseInt(s[0]) - 1], d[l].column = t.data.table.columnstr[parseInt(s[1]) - 1];
        var n = o.join(",");
        t.setData({
            selected: d,
            NowSelect: o,
            NowSelectStr: n
        });
    },
    bindDateChange: function(a) {
        for (var t = [], e = 0; e < 1; e++) {
            var o = week.dateLater(a.detail.value, e);
            t.push(o);
        }
        return this.setData({
            date_: a.detail.value,
            date: t[0].year + "-" + t[0].month + "-" + t[0].day + " (" + t[0].week + ")"
        }), this.getSelected(), t;
    },
    getSelected: function() {
        var e = this;
        console.log(e.data.date_), console.log(e.data.id), wx.request({
            url: e.data.baseurl + "doPagegetSelected",
            data: {
                date: e.data.date_,
                id: e.data.id,
                uniacid: e.data.uniacid
            },
            success: function(a) {
                var t = a.data.data.split(",");
                console.log(t), e.setData({
                    otherSelect: t
                });
            }
        });
    }
});