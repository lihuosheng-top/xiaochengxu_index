var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp(), innerAudioContext = wx.createInnerAudioContext(), BackgroundAudioManager = wx.getBackgroundAudioManager();

BackgroundAudioManager.title = "", Page({
    data: {
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        id: "",
        datas: "",
        pagedata: {},
        imgcount_xz: 0,
        pagedata_set: [],
        zh_all: 0,
        zh_now: 0,
        zhixin: !1,
        is_comment: 0,
        comm: 0,
        commSelf: 0,
        comments: [],
        commShow: 0,
        shareShow: 0,
        shareScore: 0,
        shareNotice: 0,
        pd_val: [],
        videopay: 0,
        autoplay: !1,
        poster: "",
        navtel: "",
        xuanz: 0,
        lixuanz: -1,
        ttcxs: 0,
        share: 0,
        shareHome: 0,
        fxsid: 0,
        showLike: 0,
        art_price: "",
        music_price: "",
        loopPlay: "",
        music: "",
        musicAutoPlay: "",
        musicTitle: "",
        musicpay: 0,
        artpay: 1,
        audioplay: 1,
        duration: "",
        curTimeVal: "",
        durationDay: "播放获取",
        curTimeValDay: "00:00",
        musictype: ""
    },
    onReady: function() {
        this.refreshSessionkey(), this.audioCtx = wx.createAudioContext("myAudio");
    },
    audioPlay: function() {
        var s = this, a = s.data.musictype;
        s.setData({
            audioplay: 2
        }), 1 == a && (innerAudioContext.play(), innerAudioContext.onPlay(function(a) {
            innerAudioContext.onTimeUpdate(function(a) {
                var t = innerAudioContext.duration, e = parseInt(t / 60);
                e < 10 && (e = "0" + e);
                var i = parseInt(t - 60 * e);
                i < 10 && (i = "0" + i);
                var n = innerAudioContext.currentTime, d = parseInt(n / 60);
                d < 10 && (d = "0" + d);
                var o = parseInt(n - 60 * d);
                o < 10 && (o = "0" + o), s.setData({
                    duration: 100 * innerAudioContext.duration.toFixed(2),
                    curTimeVal: 100 * innerAudioContext.currentTime.toFixed(2),
                    durationDay: e + ":" + i,
                    curTimeValDay: d + ":" + o
                });
            }), innerAudioContext.onEnded(function() {
                s.setStopState(s);
            });
        })), 2 == a && ("" != s.data.music && (BackgroundAudioManager.src = s.data.music), 
        BackgroundAudioManager.play());
    },
    audioPause: function() {
        var a = this.data.musictype;
        this.setData({
            audioplay: 1
        }), 1 == a && innerAudioContext.pause(), 2 == a && BackgroundAudioManager.pause();
    },
    slideBar: function(a) {
        var t = a.detail.value;
        this.setData({
            curTimeVal: t / 100
        }), innerAudioContext.seek(this.data.curTimeVal);
    },
    updateTime: function(s) {
        innerAudioContext.onTimeUpdate(function(a) {
            var t = innerAudioContext.duration, e = parseInt(t / 60);
            e < 10 && (e = "0" + e);
            var i = parseInt(t - 60 * e);
            i < 10 && (i = "0" + i);
            var n = innerAudioContext.currentTime, d = parseInt(n / 60);
            d < 10 && (d = "0" + d);
            var o = parseInt(n - 60 * d);
            o < 10 && (o = "0" + o), s.setData({
                duration: 100 * innerAudioContext.duration.toFixed(2),
                curTimeVal: 100 * innerAudioContext.currentTime.toFixed(2),
                durationDay: e + ":" + i,
                curTimeValDay: d + ":" + o
            });
        }), innerAudioContext.duration.toFixed(2) - innerAudioContext.currentTime.toFixed(2) <= 0 && s.setStopState(s), 
        innerAudioContext.onEnded(function() {
            s.setStopState(s);
        });
    },
    setStopState: function(a) {
        var t = this.data.musictype;
        a.setData({
            curTimeVal: 0
        }), 1 == t && innerAudioContext.stop(), 2 == t && BackgroundAudioManager.stop();
    },
    onPullDownRefresh: function() {
        var a = this;
        a.refreshSessionkey();
        var t = a.data.id;
        a.getPoductDetail(t), a.setData({
            zhixin: !1
        });
    },
    onLoad: function(a) {
        var t = this, e = a.id;
        t.refreshSessionkey(), t.setData({
            id: e,
            page_signs: "/sudu8_page/showArt/showArt?id=" + e
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
            url: t.data.baseurl + "doPageBaseMin",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                a.data.data;
                t.setData({
                    baseinfo: a.data.data,
                    comm: a.data.data.commA,
                    comms: a.data.data.commAs
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
                e.getPoductDetail(t), e.givepscore();
            }
        });
    },
    huoqusq: function() {
        var r = this, u = wx.getStorageSync("openid");
        wx.getUserInfo({
            success: function(a) {
                var t = a.userInfo, e = t.nickName, i = t.avatarUrl, n = t.gender, d = t.province, o = t.city, s = t.country;
                wx.request({
                    url: r.data.baseurl + "doPageUseupdate",
                    data: {
                        uniacid: r.data.uniacid,
                        openid: u,
                        nickname: e,
                        avatarUrl: i,
                        gender: n,
                        province: d,
                        city: o,
                        country: s
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        wx.setStorageSync("golobeuid", a.data.data.id), wx.setStorageSync("golobeuser", a.data.data), 
                        r.setData({
                            isview: 0,
                            globaluser: a.data.data
                        }), r.getPoductDetail();
                    }
                });
            },
            fail: function() {
                app.selfinfoget(r.chenggfh, r.data.uniacid);
            }
        });
    },
    follow: function(a) {
        var t = a.currentTarget.dataset.id;
        wx.request({
            url: this.data.baseurl + "commentFollow",
            cachetime: "0",
            data: {
                uniacid: this.data.uniacid,
                id: t
            },
            success: function(a) {
                1 == a.data.data.result && wx.showToast({
                    title: "点赞成功",
                    icon: "success",
                    duration: 1e3
                });
            }
        });
    },
    pinglun: function(a) {
        this.setData({
            pinglun_t: a.detail.value
        });
    },
    pinglun_sub: function() {
        var a = this.data.pinglun_t, t = this.data.id, e = wx.getStorageSync("openid");
        if ("" == a || null == a) return wx.showModal({
            content: "评论不能为空"
        }), !1;
        wx.request({
            url: this.data.baseurl + "comment",
            cachetime: "30",
            data: {
                uniacid: this.data.uniacid,
                pinglun_t: a,
                id: t,
                openid: e
            },
            success: function(a) {
                1 == a.data.data.result && (wx.showToast({
                    title: "评价提交成功",
                    icon: "success",
                    duration: 2e3
                }), setTimeout(function() {
                    wx.redirectTo({
                        url: "/sudu8_page/showArt/showArt?id=" + t
                    });
                }, 2e3));
            }
        });
    },
    getPoductDetail: function(t) {
        var p = this, a = wx.getStorageSync("openid");
        wx.request({
            url: p.data.baseurl + "dopageglobaluserinfo",
            data: {
                uniacid: p.data.uniacid,
                openid: a
            },
            success: function(a) {
                var t = a.data.data;
                t.nickname && t.avatar || p.setData({
                    isview: 1
                }), p.setData({
                    globaluser: a.data.data
                });
            }
        }), wx.request({
            url: p.data.baseurl + "doPageMymoney",
            data: {
                uniacid: p.data.uniacid,
                openid: a
            },
            success: function(a) {
                var t = a.data.data;
                p.setData({
                    mymoney: t.money,
                    globaluser: t
                });
            }
        }), wx.request({
            url: p.data.baseurl + "doPageproductsDetail",
            data: {
                id: t,
                uniacid: p.data.uniacid,
                openid: a
            },
            cachetime: "0",
            success: function(a) {
                if (null != a.data.data.share_score && "null" != a.data.data.share_score) {
                    if (-1 != a.data.data.share_score.indexOf("http")) {
                        var t = encodeURIComponent(a.data.data.share_score);
                        wx.redirectTo({
                            url: "/sudu8_page/webpage/webpage?url=" + t
                        });
                    }
                    -1 != a.data.data.share_score.indexOf("sudu8_page") && wx.redirectTo({
                        url: a.data.data.share_score
                    });
                }
                if (0 != a.data.data.edittime) var e = a.data.data.edittime; else if ("" == a.data.data.etime) e = a.data.data.ctime; else e = a.data.data.etime;
                if ("" == a.data.data.labels) var i = a.data.data.thumb; else i = a.data.data.labels;
                if ("false" == a.data.data.market_price) var n = !1; else n = !0;
                if (0 < parseInt(a.data.data.pro_flag)) {
                    if (a.data.data.navlistnum) {
                        var d = (100 / a.data.data.navlistnum).toFixed(2);
                        p.setData({
                            pro_flag: a.data.data.pro_flag,
                            navlist: a.data.data.navlist,
                            navwidth: d + "%",
                            likeArtList: a.data.data.likeArtList
                        });
                    }
                } else p.setData({
                    pro_flag: a.data.data.pro_flag
                });
                var o = a.data.data.likeArtList;
                o && 0 < o.length && p.setData({
                    showLike: 1
                });
                var s = a.data.data.music_art_info.music, r = a.data.data.musicpay, u = a.data.data.music_art_info.autoPlay, c = a.data.data.music_art_info.loopPlay, l = 1;
                a.data.data.music_art_info.musictype && (l = a.data.data.music_art_info.musictype), 
                console.log(u + "////" + c), 2 == l ? 1 == r && 1 == u && ("" != s && (BackgroundAudioManager.src = s), 
                BackgroundAudioManager.play(), Math.ceil(BackgroundAudioManager.duration) - Math.ceil(BackgroundAudioManager.currentTime) <= 0 && (c ? BackgroundAudioManager.onEnded(function() {
                    p.audioPlay();
                }) : (BackgroundAudioManager.onEnded(function() {
                    p.setStopState(p);
                }), p.setData({
                    audioplay: 2
                })))) : (p.setData({
                    audioSrc: s
                }), innerAudioContext.src = s, 1 == r && 1 == u && (console.log(1 == r && u), p.setData({
                    audioplay: 2
                }), innerAudioContext.autoplay = !0, innerAudioContext.onPlay(function() {
                    innerAudioContext.onTimeUpdate(function(a) {
                        var t = innerAudioContext.duration, e = parseInt(t / 60);
                        e < 10 && (e = "0" + e);
                        var i = parseInt(t - 60 * e);
                        i < 10 && (i = "0" + i);
                        var n = innerAudioContext.currentTime, d = parseInt(n / 60);
                        d < 10 && (d = "0" + d);
                        var o = parseInt(n - 60 * d);
                        o < 10 && (o = "0" + o), p.setData({
                            duration: 100 * innerAudioContext.duration.toFixed(2),
                            curTimeVal: 100 * innerAudioContext.currentTime.toFixed(2),
                            durationDay: e + ":" + i,
                            curTimeValDay: d + ":" + o
                        });
                    }), innerAudioContext.onEnded(function() {
                        p.setStopState(p);
                    });
                }))), 1 == c && (innerAudioContext.loop = !0), p.setData({
                    id: a.data.data.id,
                    title: a.data.data.title,
                    time: e,
                    v: a.data.data.video,
                    videopay: a.data.data.videopay,
                    autoplay: n,
                    poster: i,
                    price: a.data.data.price,
                    block: a.data.data.btn.pic_page_btn,
                    pmarb: a.data.data.pmarb,
                    ptit: a.data.data.ptit,
                    datas: a.data.data,
                    formdescs: a.data.data.formdescs,
                    pagedata: a.data.data.forms,
                    commSelf: a.data.data.comment,
                    art_price: a.data.data.music_art_info.art_price,
                    music_price: a.data.data.music_art_info.music_price,
                    loopPlay: c,
                    music: s,
                    musicTitle: a.data.data.music_art_info.musicTitle,
                    musicpay: r,
                    artpay: a.data.data.artpay,
                    musictype: l
                }), a.data.data.text && WxParse.wxParse("content", "html", a.data.data.text, p, 0), 
                wx.setNavigationBarTitle({
                    title: p.data.title
                }), wx.setStorageSync("isShowLoading", !1), wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        }), setTimeout(function() {
            if (1 == p.data.comm && 0 != p.data.commSelf || 1 == p.data.commSelf) {
                p.setData({
                    commShow: 1
                });
                var a = p.data.comms;
                wx.request({
                    url: p.data.baseurl + "getComment",
                    cachetime: "0",
                    data: {
                        id: t,
                        uniacid: p.data.uniacid,
                        comms: a
                    },
                    success: function(a) {
                        "" != a.data && p.setData({
                            comments: a.data.data,
                            is_comment: 1
                        });
                    }
                });
            }
        }, 500);
    },
    makePhoneCall: function(a) {
        var t = a.currentTarget.dataset.navtel;
        if ("" != t) wx.makePhoneCall({
            phoneNumber: t
        }); else {
            var e = this.data.baseinfo.tel;
            wx.makePhoneCall({
                phoneNumber: e
            });
        }
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
    shareClo: function() {
        this.setData({
            shareShow: 0
        });
    },
    onShareAppMessage: function() {
        var t = this, e = 1, i = wx.getStorageSync("openid"), n = t.data.id, a = "";
        return a = 1 == t.data.globaluser.fxs ? "/sudu8_page/showArt/showArt?id=" + n + "&userid=" + i : "/sudu8_page/showArt/showArt?id=" + n + "&fxsid=" + i + "&userid=" + i, 
        {
            title: t.data.title,
            path: a,
            success: function(a) {
                void 0 !== a.shareTickets ? a.shareTickets[0] && (e = 2) : e = 1, wx.request({
                    url: t.data.baseurl + "dopagesharejf",
                    data: {
                        uniacid: t.data.uniacid,
                        openid: i,
                        types: e,
                        id: n
                    },
                    success: function(a) {
                        t.setData({
                            shareScore: a.data.data.score,
                            shareShow: 1,
                            share: 0,
                            shareNotice: a.data.data.notice
                        });
                    }
                });
            }
        };
    },
    bindInputChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, i = this.data.pagedata;
        i[e].val = t, this.setData({
            pagedata: i
        });
    },
    bindPickerChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, i = this.data.pagedata, n = i[e].tp_text[t];
        i[e].val = n, this.setData({
            pagedata: i
        });
    },
    bindDateChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, i = this.data.pagedata;
        i[e].val = t, this.setData({
            pagedata: i
        });
    },
    bindTimeChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, i = this.data.pagedata;
        i[e].val = t, this.setData({
            pagedata: i
        });
    },
    checkboxChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, i = this.data.pagedata;
        i[e].val = t, this.setData({
            pagedata: i
        });
    },
    radioChange: function(a) {
        var t = a.detail.value, e = a.currentTarget.dataset.index, i = this.data.pagedata;
        i[e].val = t, this.setData({
            pagedata: i
        });
    },
    formSubmit: function(a) {
        var e = this, t = a.detail.formId, i = (e.data.datas, e.data.id), n = !0, d = e.data.pagedata;
        console.log(d);
        for (var o = 0; o < d.length; o++) {
            if (1 == d[o].ismust && "" == d[o].val) return n = !1, wx.showModal({
                title: "提醒",
                content: d[o].name + "为必填项！",
                showCancel: !1
            }), !1;
            if (5 == d[o].type && 0 < d[o].z_val.length) for (var s = 0; s < d[o].z_val.length; s++) {
                var r = d[o].z_val[s].substr(d[o].z_val[s].indexOf("/upimages"));
                d[o].z_val[s] = r;
            }
        }
        n && wx.request({
            url: e.data.baseurl + "doPageFormval",
            data: {
                uniacid: e.data.uniacid,
                id: i,
                pagedata: JSON.stringify(d),
                types: "showArt",
                openid: wx.getStorageSync("openid"),
                form_id: t
            },
            cachetime: "30",
            success: function(a) {
                var t = a.data.data.id;
                wx.showModal({
                    title: "提示",
                    content: a.data.data.con + "，请支付款项",
                    showCancel: !1,
                    success: function(a) {
                        e.sendMail_form(i, t);
                    }
                });
            }
        });
    },
    sendMail_form: function(t, a) {
        wx.request({
            url: this.data.baseurl + "doPagesendMail_form",
            data: {
                id: t,
                cid: a,
                uniacid: this.data.uniacid
            },
            success: function(a) {
                wx.redirectTo({
                    url: "/sudu8_page/showArt/showArt?id=" + t
                });
            },
            fail: function(a) {
                console.log("sendMail_order_fail");
            }
        });
    },
    choiceimg1111: function(a) {
        var d = this, t = 0, o = d.data.zhixin, s = a.currentTarget.dataset.index, r = d.data.pagedata, e = r[s].val, i = r[s].tp_text[0];
        e ? t = e.length : (t = 0, e = []);
        var n = i - t, u = d.data.baseurl + "wxupimg", c = d.data.pd_val;
        wx.chooseImage({
            count: n,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                o = !0, d.setData({
                    zhixin: o
                }), wx.showLoading({
                    title: "图片上传中"
                });
                var t = a.tempFilePaths;
                e = e.concat(t), r[s].val = e, d.setData({
                    pagedata: r
                });
                var i = 0, n = t.length;
                !function e() {
                    wx.uploadFile({
                        url: u,
                        filePath: t[i],
                        name: "file",
                        success: function(a) {
                            var t = a.data;
                            c.push(t), r[s].z_val = c, d.setData({
                                pagedata: r,
                                pd_val: c
                            }), ++i < n ? e() : (o = !1, d.setData({
                                zhixin: o
                            }), wx.hideLoading());
                        }
                    });
                }();
            }
        });
    },
    delimg: function(a) {
        var t = a.currentTarget.dataset.index, e = a.currentTarget.dataset.id, i = this.data.pagedata, n = i[t].val;
        n.splice(e, 1), 0 == n.length && (n = ""), i[t].val = n, this.setData({
            pagedata: i
        });
    },
    onPreviewImage: function(a) {
        app.util.showImage(a);
    },
    ffgk: function(a) {
        var t = this, e = t.data.id, i = t.data.mymoney, n = a.currentTarget.dataset.pay, d = a.currentTarget.dataset.type, o = wx.getStorageSync("openid");
        if (1 * n <= 1 * i) wx.showModal({
            title: "提醒",
            content: "您的余额为" + i + "元，本次将扣除" + n + "元",
            success: function(a) {
                a.confirm && wx.request({
                    url: t.data.baseurl + "doPagevideozhifu",
                    data: {
                        uniacid: t.data.uniacid,
                        openid: o,
                        mykoumoney: n,
                        types: 1,
                        id: e,
                        artType: d
                    },
                    header: {
                        "content-type": "application/json"
                    },
                    success: function(a) {
                        "1" == a.data.count && t.payover_fxs(a.data.order_id), t.getPoductDetail(e);
                    }
                });
            }
        }); else {
            var s = n - i;
            0 == i ? wx.showModal({
                title: "提醒",
                content: "您将微信支付" + s + "元",
                success: function(a) {
                    a.confirm && t.zhifu(s, i, e, d);
                }
            }) : wx.showModal({
                title: "提醒",
                content: "您将余额支付" + i + "元，微信支付" + s + "元",
                success: function(a) {
                    a.confirm && t.zhifu(s, i, e, d);
                }
            });
        }
    },
    zhifu: function(e, i, n, d) {
        var o = this, a = wx.getStorageSync("openid");
        wx.request({
            url: o.data.baseurl + "doPagevideozhifu",
            data: {
                uniacid: o.data.uniacid,
                openid: a,
                money: e,
                mykoumoney: i,
                types: 2,
                id: n
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                var t = a.data.order_id;
                "success" == a.data.message && wx.requestPayment({
                    timeStamp: a.data.data.timeStamp,
                    nonceStr: a.data.data.nonceStr,
                    package: a.data.data.package,
                    signType: "MD5",
                    paySign: a.data.data.paySign,
                    success: function(a) {
                        wx.showToast({
                            title: "支付成功",
                            icon: "success",
                            duration: 3e3,
                            success: function(a) {
                                o.dosetmoney(e, i, n, t, d);
                            }
                        });
                    }
                });
            }
        });
    },
    dosetmoney: function(a, t, e, i, n) {
        var d = this, o = wx.getStorageSync("openid");
        e = d.data.id;
        wx.request({
            url: d.data.baseurl + "doPagevideogeng",
            data: {
                uniacid: d.data.uniacid,
                openid: o,
                money: a,
                mykoumoney: t,
                orderid: i,
                id: e,
                artType: n
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                "1" == a.data.count && d.payover_fxs(a.data.order_id), d.getPoductDetail(e);
            }
        });
    },
    namexz: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.pagedata[t], i = [], n = 0; n < e.tp_text.length; n++) {
            var d = {};
            d.keys = e.tp_text[n], d.val = 1, i.push(d);
        }
        this.setData({
            ttcxs: 1,
            formindex: t,
            xx: i,
            xuanz: 0,
            lixuanz: -1
        }), this.riqi();
    },
    riqi: function() {
        for (var a = new Date(), t = new Date(a.getTime()), e = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate(), i = this.data.xx, n = 0; n < i.length; n++) i[n].val = 1;
        this.setData({
            xx: i
        }), this.gettoday(e);
        var d = [], o = [], s = new Date();
        for (n = 0; n < 5; n++) {
            var r = new Date(s.getTime() + 24 * n * 3600 * 1e3), u = r.getFullYear(), c = r.getMonth() + 1, l = r.getDate(), p = c + "月" + l + "日", g = u + "-" + c + "-" + l;
            d.push(p), o.push(g);
        }
        this.setData({
            arrs: d,
            fallarrs: o,
            today: e
        });
    },
    xuanzd: function(a) {
        for (var t = a.currentTarget.dataset.index, e = this.data.fallarrs[t], i = this.data.xx, n = 0; n < i.length; n++) i[n].val = 1;
        this.setData({
            xuanz: t,
            today: e,
            lixuanz: -1,
            xx: i
        }), this.gettoday(e);
    },
    goux: function(a) {
        var t = a.currentTarget.dataset.index;
        this.setData({
            lixuanz: t
        });
    },
    gettoday: function(a) {
        var n = this, t = n.data.id, e = n.data.formindex, d = n.data.xx;
        wx.request({
            url: n.data.baseurl + "doPageDuzhan",
            data: {
                uniacid: n.data.uniacid,
                id: t,
                types: "showArt",
                days: a,
                pagedatekey: e
            },
            header: {
                "content-type": "application/json"
            },
            success: function(a) {
                for (var t = a.data.data, e = 0; e < t.length; e++) d[t[e]].val = 2;
                var i = 0;
                t.length == d.length && (i = 1), n.setData({
                    xx: d,
                    isover: i
                });
            }
        });
    },
    save: function() {
        var a = this, t = a.data.today, e = a.data.xx, i = a.data.lixuanz;
        if (-1 == i) return wx.showModal({
            title: "提现",
            content: "请选择预约的选项",
            showCancel: !1
        }), !1;
        var n = "已选择" + t + "，" + e[i].keys, d = a.data.pagedata, o = a.data.formindex;
        d[o].val = n, d[o].days = t, d[o].indexkey = o, d[o].xuanx = i, a.setData({
            ttcxs: 0,
            pagedata: d
        });
    },
    quxiao: function() {
        this.setData({
            ttcxs: 0
        });
    },
    weixinadd: function() {
        var o = this;
        wx.chooseAddress({
            success: function(a) {
                for (var t = a.provinceName + " " + a.cityName + " " + a.countyName + " " + a.detailInfo, e = a.userName, i = a.telNumber, n = o.data.pagedata, d = 0; d < n.length; d++) 0 == n[d].type && 2 == n[d].tp_text[0] && (n[d].val = e), 
                0 == n[d].type && 3 == n[d].tp_text[0] && (n[d].val = i), 0 == n[d].type && 4 == n[d].tp_text[0] && (n[d].val = t);
                o.setData({
                    myname: e,
                    mymobile: i,
                    myaddress: t,
                    pagedata: n
                });
            }
        });
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
                types: "showArt",
                openid: e,
                fxsid: t,
                uniacid: this.data.uniacid
            },
            success: function(a) {}
        });
    },
    payover_fxs: function(a) {
        var t = wx.getStorageSync("openid"), e = wx.getStorageSync("fxsid");
        wx.request({
            url: this.data.baseurl + "doPagepayoverFxs",
            data: {
                openid: t,
                order_id: a,
                fxsid: e,
                types: "art"
            },
            success: function(a) {
                console.log(a);
            },
            fail: function(a) {
                console.log(a);
            }
        });
    },
    refreshSessionkey: function() {
        var t = this;
        wx.login({
            success: function(a) {
                wx.request({
                    url: t.data.baseurl + "doPagegetNewSessionkey",
                    data: {
                        uniacid: t.data.uniacid,
                        code: a.code
                    },
                    success: function(a) {
                        console.log(a), t.setData({
                            newSessionKey: a.data.data
                        });
                    }
                });
            }
        });
    },
    getPhoneNumber: function(a) {
        var i = this, t = a.detail.iv, e = a.detail.encryptedData;
        "getPhoneNumber:ok" == a.detail.errMsg ? wx.checkSession({
            success: function() {
                wx.request({
                    url: i.data.baseurl + "doPagejiemiNew",
                    data: {
                        uniacid: i.data.uniacid,
                        newSessionKey: i.data.newSessionKey,
                        iv: t,
                        encryptedData: e
                    },
                    success: function(a) {
                        if (a.data.data) {
                            for (var t = i.data.pagedata, e = 0; e < t.length; e++) 0 == t[e].type && 5 == t[e].tp_text[0] && (t[e].val = a.data.data);
                            console.log(t), i.setData({
                                wxmobile: a.data.data,
                                pagedata: t
                            });
                        } else wx.showModal({
                            title: "提示",
                            content: "sessionKey已过期，请下拉刷新！"
                        });
                    },
                    fail: function(a) {
                        console.log(a);
                    }
                });
            },
            fail: function() {
                wx.showModal({
                    title: "提示",
                    content: "sessionKey已过期，请下拉刷新！"
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "请先授权获取您的手机号！",
            showCancel: !1
        });
    }
});