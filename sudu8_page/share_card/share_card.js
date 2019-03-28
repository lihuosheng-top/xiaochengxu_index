var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        tximg: "",
        nnewm: "/sudu8_page/resource/img/u_food.png",
        pro: ""
    },
    onPullDownRefresh: function() {
        this.getinfos(), wx.showLoading({
            title: "二维码生成中2222"
        });
    },
    onLoad: function(t) {
        var e = this;
        wx.setNavigationBarTitle({
            title: "二维码生成"
        }), wx.showLoading({
            title: "二维码生成中"
        }), wx.getSystemInfo({
            success: function(t) {
                console.log(t), e.setData({
                    pwidth: t.screenWidth,
                    pheight: t.windowHeight,
                    wheight: t.windowHeight,
                    pixelRatio: t.pixelRatio
                });
            }
        });
        var a = t.id, i = t.type;
        e.setData({
            id: a,
            types: i
        });
        var o = 0;
        t.fxsid && (o = t.fxsid, e.setData({
            fxsid: t.fxsid
        })), e.getBase(), app.util(e.getinfos, o, e.data.uniacid);
    },
    getBase: function() {
        wx.request({
            url: this.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: this.data.uniacid,
                vs1: 1
            },
            cachetime: "30",
            success: function(t) {
                console.log(t.data), wx.setNavigationBarColor({
                    frontColor: t.data.data.base_tcolor,
                    backgroundColor: t.data.data.base_color
                });
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    getinfos: function() {
        var i = this;
        wx.showLoading({
            title: "二维码生成中"
        }), wx.getStorage({
            key: "openid",
            success: function(t) {
                var e = t.data;
                i.setData({
                    openid: e
                }), wx.request({
                    url: i.data.baseurl + "doPageglobaluserinfo",
                    data: {
                        openid: e,
                        uniacid: i.data.uniacid
                    },
                    success: function(t) {
                        wx.showLoading({
                            title: "二维码生成中"
                        }), i.setData({
                            globaluser: t.data.data
                        });
                    }
                });
                var a = i.data.id;
                i.data.types;
                a ? (i.setData({
                    id: a
                }), i.getproinfo(a), i.ewm(a, 2)) : (i.ewm(0, 1), i.setData({
                    id: 0
                }));
            }
        });
    },
    getproinfo: function(t) {
        var a = this, e = wx.getStorageSync("openid");
        a.data.types;
        wx.showLoading({
            title: "二维码生成中"
        }), wx.request({
            url: a.data.baseurl + "doPagestaffDetail",
            data: {
                id: t,
                openid: e,
                uniacid: a.data.uniacid
            },
            success: function(t) {
                wx.showLoading({
                    title: "二维码生成中"
                });
                var e = t.data.data;
                console.log(e), a.setData({
                    pro: e
                });
            }
        });
    },
    ewm: function(t, e) {
        var a = this;
        wx.showLoading({
            title: "二维码生成中"
        });
        var i = wx.getStorageSync("openid"), o = a.data.types;
        console.log(o), wx.request({
            url: a.data.baseurl + "doPagesharecard",
            data: {
                openid: i,
                id: t,
                types: e,
                frompage: o,
                uniacid: a.data.uniacid
            },
            success: function(t) {
                wx.showLoading({
                    title: "二维码生成中"
                }), console.log(t);
                var e = t.data.data;
                wx.getImageInfo({
                    src: e,
                    success: function(t) {
                        var e = t.path;
                        a.jibxx(e);
                    },
                    fail: function() {
                        wx.hideLoading(), wx.showModal({
                            title: "提示",
                            showCancel: !1,
                            content: "二维码生成失败，请稍后再试",
                            success: function(t) {}
                        });
                    }
                });
            }
        });
    },
    jibxx: function(o) {
        var s = this;
        if (wx.showLoading({
            title: "二维码生成中"
        }), 0 != s.data.id) {
            var i = s.data.pro.pic;
            console.log(i);
            var n = 1;
            wx.getImageInfo({
                src: "/sudu8_page/resource/img/callcardbg.png",
                success: function(t) {
                    wx.showLoading({
                        title: "二维码生成中"
                    });
                    t.path;
                    var e = t.width, a = t.height;
                    s.setData({
                        imgwidth: e,
                        imgheight: a
                    }), "" == i ? s.saveimg("/sudu8_page/resource/img/default_pic.png", o, n) : wx.getImageInfo({
                        src: i,
                        success: function(t) {
                            s.saveimg(t.path, o, n);
                        }
                    });
                },
                fail: function() {
                    wx.hideLoading(), wx.showModal({
                        title: "提示",
                        showCancel: !1,
                        content: "二维码生成失败1111111，请稍后再试",
                        success: function(t) {}
                    });
                }
            });
        } else {
            wx.showLoading({
                title: "二维码生成中"
            });
            n = 2;
            wx.request({
                url: s.data.baseurl + "doPageshareguiz",
                data: {
                    uniacid: s.data.uniacid
                },
                success: function(t) {
                    wx.showLoading({
                        title: "二维码生成中"
                    });
                    var e = t.data.data;
                    s.setData({
                        thumbimg: e
                    }), wx.getImageInfo({
                        src: e,
                        success: function(t) {
                            wx.showLoading({
                                title: "二维码生成中"
                            });
                            var e = t.width, a = t.height;
                            s.setData({
                                imgwidth: e,
                                imgheight: a
                            });
                            var i = t.path;
                            s.saveimg(i, o, n);
                        },
                        fail: function() {
                            wx.hideLoading(), wx.showModal({
                                title: "提示",
                                showCancel: !1,
                                content: "二维码生成失败！如开启远程附件，需设置https，并添加域名至小程序服务器域名downloadfile内！",
                                success: function(t) {}
                            });
                        }
                    });
                }
            });
        }
    },
    saveimg: function(t, e, a) {
        wx.showLoading({
            title: "二维码生成中"
        });
        var i = this, o = (i.data.baseinfo, wx.createCanvasContext("myCanvas")), s = i.data.imgwidth, n = i.data.imgheight, l = "/sudu8_page/resource/img/company.png", d = i.data.pro;
        console.log(s), console.log(n);
        var c = i.data.pwidth, g = (i.data.pheight, i.data.types, c * n / s);
        o.setFillStyle("#ffffff"), o.fillRect(0, 0, c, c + 140), console.log(t), o.drawImage(t, 20, 20, .6 * c, .6 * g), 
        o.drawImage("/sudu8_page/resource/img/callcardbg.png", c - 20 - .6 * c, 20, .6 * c, .6 * g), 
        i.drawRoundRect(o, 20, 20, c - 40, .6 * g, 12), i.setData({
            heigts: g + 50
        }), o.setShadow(0, 0, 50, "#ffffff"), o.setFillStyle("#232323"), o.setFontSize(23), 
        o.setTextAlign("left"), o.fillText(d.realname, .6 * c, .25 * g), o.setFillStyle("#838383"), 
        o.setFontSize(13), o.setTextAlign("left"), o.fillText(d.title + "-" + d.job, .58 * c, .32 * g), 
        o.drawImage("/sudu8_page/resource/img/phone1.png", .89 * c, .41 * g, 15, 15), o.setFillStyle("#838383"), 
        o.setFontSize(12), o.setTextAlign("right"), o.fillText(d.mobile, .86 * c, .44 * g), 
        null != d.email && "" != d.email ? (o.drawImage("/sudu8_page/resource/img/email.png", .89 * c, .49 * g, 15, 12), 
        o.setFillStyle("#838383"), o.setFontSize(12), o.setTextAlign("right"), o.fillText(d.email, .86 * c, .51 * g), 
        null != d.company && "" != d.company && (o.drawImage(l, .89 * c, .56 * g, 15, 15), 
        o.setFillStyle("#838383"), o.setFontSize(12), o.setTextAlign("right"), o.fillText(d.company, .86 * c, .59 * g))) : null != d.company && "" != d.company && (o.drawImage(l, .89 * c, .49 * g, 15, 15), 
        o.setFillStyle("#838383"), o.setFontSize(12), o.setTextAlign("right"), o.fillText(d.company, .86 * c, .52 * g)), 
        o.setFillStyle("#232323"), o.setFontSize(18), o.setTextAlign("left"), o.fillText("扫一扫右边的小程序码", 25, .85 * g), 
        o.setFillStyle("#666666"), o.setFontSize(16), o.setTextAlign("left"), o.fillText("查看具体信息吧", 25, .93 * g), 
        o.drawImage(e, c - 120, .75 * g, 100, 100), o.draw(), wx.hideLoading();
    },
    saveimgdo: function() {
        var e = this;
        console.log(123), wx.getSetting({
            success: function(t) {
                t.authSetting["scope.writePhotosAlbum"] ? e.dosave() : wx.authorize({
                    scope: "scope.writePhotosAlbum",
                    success: function() {
                        e.dosave();
                    },
                    fail: function() {
                        wx.openSetting();
                    }
                });
            }
        });
    },
    dosave: function() {
        var t = this.data.pwidth, e = this.data.heigts, a = this.data.pixelRatio;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: t,
            height: e,
            destWidth: t * a,
            destHeight: e * a,
            canvasId: "myCanvas",
            success: function(t) {
                wx.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function(t) {
                        wx.showModal({
                            title: "提醒",
                            content: "请转发您专属的分享图至好友、群。好友点击后，您将获得积分！",
                            showCancel: !1,
                            success: function(t) {
                                wx.navigateBack({
                                    delta: 1
                                });
                            }
                        });
                    },
                    fail: function(t) {
                        console.log("fail");
                    }
                });
            }
        });
    },
    drawRoundRect: function(t, e, a, i, o, s) {
        i < 2 * s && (s = i / 2), o < 2 * s && (s = o / 2), t.setFillStyle("rgba(238, 238, 238, 0)"), 
        t.setStrokeStyle("#f9f9f9"), t.setLineWidth(10), t.setShadow(10, 10, 60, "#e1e1e1"), 
        t.beginPath(), t.moveTo(e + s, a), t.arcTo(e + i, a, e + i, a + o, s), t.arcTo(e + i, a + o, e, a + o, s), 
        t.arcTo(e, a + o, e, a, s), t.arcTo(e, a, e + i, a, s), t.closePath(), t.fill(), 
        t.stroke();
    }
});