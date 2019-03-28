var app = getApp();

Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        tximg: "",
        nnewm: "/sudu8_page/resource/img/u_food.png"
    },
    onPullDownRefresh: function() {
        this.getinfos(), wx.showLoading({
            title: "二维码生成中"
        });
    },
    onLoad: function(t) {
        var a = this;
        wx.setNavigationBarTitle({
            title: "二维码生成"
        }), wx.showLoading({
            title: "二维码生成中"
        }), wx.getSystemInfo({
            success: function(t) {
                a.setData({
                    pwidth: t.screenWidth,
                    pheight: t.windowHeight,
                    wheight: t.windowHeight,
                    pixelRatio: t.pixelRatio
                });
            }
        }), wx.request({
            url: a.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: a.data.uniacid,
                vs1: 1
            },
            success: function(t) {
                wx.showLoading({
                    title: "二维码生成中"
                }), a.setData({
                    baseinfo: t.data.data
                }), wx.setNavigationBarColor({
                    frontColor: a.data.baseinfo.base_tcolor,
                    backgroundColor: a.data.baseinfo.base_color
                });
            }
        });
        var e = t.id, i = t.type;
        a.setData({
            id: e,
            types: i
        });
        var o = 0;
        t.fxsid && (o = t.fxsid, a.setData({
            fxsid: t.fxsid
        })), app.util(a.getinfos, o, a.data.uniacid);
    },
    redirectto: function(t) {
        var a = t.currentTarget.dataset.link, e = t.currentTarget.dataset.linktype;
        app.redirectto(a, e);
    },
    getinfos: function() {
        var i = this;
        wx.showLoading({
            title: "二维码生成中"
        }), wx.getStorage({
            key: "openid",
            success: function(t) {
                var a = t.data;
                i.setData({
                    openid: a
                }), wx.request({
                    url: i.data.baseurl + "dopageglobaluserinfo",
                    data: {
                        uniacid: i.data.uniacid,
                        openid: a
                    },
                    success: function(t) {
                        wx.showLoading({
                            title: "二维码生成中"
                        }), i.setData({
                            globaluser: t.data.data
                        });
                    }
                });
                var e = i.data.id;
                i.data.types;
                e ? (i.setData({
                    id: e
                }), i.getproinfo(e), i.ewm(e, 2)) : (i.ewm(0, 1), i.setData({
                    id: 0
                }));
            }
        });
    },
    getproinfo: function(t) {
        var e = this, a = wx.getStorageSync("openid"), i = e.data.types;
        if (console.log(i), "PT" == i) {
            wx.showLoading({
                title: "二维码生成中"
            });
            var o = e.data.baseurl + "doPagePtproductinfo";
            wx.request({
                url: o,
                data: {
                    id: t,
                    openid: a,
                    uniacid: e.data.uniacid
                },
                success: function(t) {
                    wx.showLoading({
                        title: "二维码生成中"
                    });
                    var a = t.data.data.products;
                    e.setData({
                        pro: a
                    });
                }
            });
        } else wx.showLoading({
            title: "二维码生成中"
        }), wx.request({
            url: e.data.baseurl + "doPageProductsDetail",
            data: {
                id: t,
                openid: a,
                uniacid: e.data.uniacid
            },
            success: function(t) {
                wx.showLoading({
                    title: "二维码生成中"
                });
                var a = t.data.data;
                console.log(a), e.setData({
                    pro: a
                }), console.log(3333333333333), console.log(a);
            }
        });
    },
    ewm: function(t, a) {
        var e = this;
        wx.showLoading({
            title: "二维码生成中"
        });
        var i = wx.getStorageSync("openid"), o = e.data.types;
        wx.request({
            url: e.data.baseurl + "dopageshareewm",
            data: {
                uniacid: e.data.uniacid,
                openid: i,
                id: t,
                types: a,
                frompage: o
            },
            success: function(t) {
                console.log(t), wx.showLoading({
                    title: "二维码生成中"
                });
                var a = t.data.data;
                console.log(a), wx.getImageInfo({
                    src: a,
                    success: function(t) {
                        console.log(t);
                        var a = t.path;
                        e.jibxx(a);
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
        wx.showLoading({
            title: "二维码生成中"
        });
        var t = s.data.id;
        if (console.log(t), 0 != t) {
            var a = s.data.pro;
            if ("PT" == s.data.types) var e = a.thumb; else e = a.thumbimg;
            console.log(e);
            var n = 1;
            wx.getImageInfo({
                src: e,
                success: function(t) {
                    console.log(t), wx.showLoading({
                        title: "二维码生成中"
                    });
                    var a = t.path, e = t.width, i = t.height;
                    s.setData({
                        imgwidth: e,
                        imgheight: i
                    }), s.saveimg(a, o, n);
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
        } else {
            wx.showLoading({
                title: "二维码生成中"
            });
            n = 2;
            wx.request({
                url: s.data.baseurl + "dopageshareguiz",
                data: {
                    uniacid: s.data.uniacid
                },
                success: function(t) {
                    wx.showLoading({
                        title: "二维码生成中"
                    });
                    var a = t.data.data;
                    s.setData({
                        thumbimg: a
                    }), wx.getImageInfo({
                        src: a,
                        success: function(t) {
                            wx.showLoading({
                                title: "二维码生成中"
                            });
                            var a = t.width, e = t.height;
                            s.setData({
                                imgwidth: a,
                                imgheight: e
                            });
                            var i = t.path;
                            s.saveimg(i, o, n);
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
        }
    },
    saveimg: function(t, a, e) {
        wx.showLoading({
            title: "二维码生成中"
        });
        var i = this, o = i.data.baseinfo.name, s = wx.createCanvasContext("myCanvas"), n = i.data.imgwidth, d = i.data.imgheight, l = i.data.pwidth, c = i.data.pheight, g = i.data.types;
        s.setFillStyle("#ffffff"), c < 600 ? s.fillRect(0, 0, l, l + 140) : s.fillRect(0, 0, l, l + 160);
        var u = l * d / n;
        if (i.setData({
            heigts: u + 180
        }), s.drawImage(t, 0, 0, l, u), 1 == e) {
            var r = i.data.pro, w = r.title, h = r.price;
            s.setFillStyle("#333333"), s.setFontSize(14), s.setTextAlign("left");
            var f = w;
            if (s.fillText(f, 10, u + 30), "showArt" == g || "showPic" == g) {
                var x = "";
                s.fillText(x, l - 10, u + 30);
            } else {
                s.setFillStyle("#E7142F"), s.setFontSize(14), s.setTextAlign("right");
                x = "¥" + h;
                s.fillText(x, l - 10, u + 30);
            }
        }
        2 == e && (s.setFillStyle("#333333"), s.setFontSize(14), s.setTextAlign("center"), 
        s.fillText("<更多内容小程序内查看>", l / 2, u + 30)), s.setStrokeStyle("#dedede"), s.moveTo(10, u + 45), 
        s.lineTo(l - 10, u + 45), s.stroke(), s.setFillStyle("#666666"), c < 600 ? s.setFontSize(16) : s.setFontSize(18), 
        s.setTextAlign("left"), s.fillText("长按识别小程序码访问", 10, u + 80), s.setFillStyle("#666666"), 
        s.setFontSize(14), s.setTextAlign("left"), s.fillText(o, 10, u + 110), s.setFillStyle("#000000"), 
        s.setFontSize(14), s.setTextAlign("left"), s.fillText("", 80, 495), c < 600 ? s.drawImage(a, l - 100, u + 60, 80, 80) : s.drawImage(a, l - 120, u + 60, 100, 100), 
        s.draw(), wx.hideLoading();
    },
    saveimgdo: function() {
        var a = this;
        wx.getSetting({
            success: function(t) {
                t.authSetting["scope.writePhotosAlbum"] ? a.dosave() : wx.authorize({
                    scope: "scope.writePhotosAlbum",
                    success: function() {
                        a.dosave();
                    },
                    fail: function() {
                        wx.openSetting();
                    }
                });
            }
        });
    },
    dosave: function() {
        var t = this.data.pwidth, a = this.data.heigts, e = this.data.pixelRatio;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: t,
            height: a,
            destWidth: t * e,
            destHeight: a * e,
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
    }
});