var app = getApp();

function getOpenid(p) {
    var d = app.globalData.baseurl;
    wx.getStorage({
        key: "openid",
        success: function(e) {
            console.log("have openid");
            var s = wx.getStorageSync("openid");
            wx.getUserInfo({
                success: function(e) {
                    var n = e.userInfo, a = n.nickName, o = n.avatarUrl, t = n.gender, c = n.province, i = n.city, r = n.country;
                    wx.request({
                        url: d + "doPageUseupdate",
                        data: {
                            uniacid: p,
                            openid: s,
                            nickname: a,
                            avatarUrl: o,
                            gender: t,
                            province: c,
                            city: i,
                            country: r
                        },
                        header: {
                            "content-type": "application/json"
                        },
                        success: function(e) {}
                    });
                }
            });
        },
        fail: function(e) {
            console.log("no openid");
            var n = wx.getStorageSync("appcode");
            wx.request({
                url: d + "doPageAppbase",
                data: {
                    code: n,
                    uniacid: p
                },
                header: {
                    "content-type": "application/json"
                },
                success: function(e) {
                    console.log("w openid"), console.log(e), wx.setStorageSync("openid", e.data.data.openid);
                    var s = e.data.data.openid;
                    wx.getUserInfo({
                        success: function(e) {
                            var n = e.userInfo, a = n.nickName, o = n.avatarUrl, t = n.gender, c = n.province, i = n.city, r = n.country;
                            wx.request({
                                url: d + "doPageUseupdate",
                                data: {
                                    uniacid: p,
                                    openid: s,
                                    nickname: a,
                                    avatarUrl: o,
                                    gender: t,
                                    province: c,
                                    city: i,
                                    country: r
                                },
                                header: {
                                    "content-type": "application/json"
                                },
                                success: function(e) {
                                    console.log("huoqu tijiaotouxiang");
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

module.exports.getOpenid = getOpenid;