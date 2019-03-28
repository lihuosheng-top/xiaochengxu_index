var WxParse = require("../../sudu8_page/resource/wxParse/wxParse.js"), app = getApp();

Page({
    data: {
        page_signs: "/sudu8_page_plugin_shop/register/register",
        baseurl: app.globalData.baseurl,
        uniacid: app.globalData.uniacid,
        imgUrls: [],
        indicatorDots: !1,
        autoplay: !1,
        interval: 5e3,
        duration: 1e3,
        check: 0,
        yyzz: "",
        logo: "",
        avatar: "",
        nickname: "",
        slide: "",
        catename: "请选择所属分类",
        apply_success: !1
    },
    onLoad: function(a) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "商户注册"
        }), t.getBase(), wx.getSystemInfo({
            success: function(a) {
                t.setData({
                    h: a.windowHeight
                });
            }
        }), t.getslide_m(), wx.getStorageSync("openid") ? t.is_apply() : t.getopenid();
    },
    redirectto: function(a) {
        var t = a.currentTarget.dataset.link, e = a.currentTarget.dataset.linktype;
        app.redirectto(t, e);
    },
    getBase: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageBase",
            data: {
                uniacid: t.data.uniacid,
                vs1: 1
            },
            success: function(a) {
                t.setData({
                    baseinfo: a.data.data
                }), wx.setNavigationBarColor({
                    frontColor: t.data.baseinfo.base_tcolor,
                    backgroundColor: t.data.baseinfo.base_color
                }), wx.setNavigationBarTitle({
                    title: "全部分类"
                });
            }
        });
    },
    getslide_m: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPagegetslide_m",
            data: {
                uniacid: t.data.uniacid
            },
            success: function(a) {
                console.log(a), console.log("dopagegetslide_m"), a.data.data.protocol && WxParse.wxParse("content", "html", a.data.data.protocol, t, 5), 
                t.setData({
                    system_name: a.data.data.system_name,
                    slide: a.data.data.bg,
                    category: a.data.data.category
                });
            }
        });
    },
    is_apply: function() {
        var t = this;
        wx.request({
            url: t.data.baseurl + "doPageis_apply",
            data: {
                uniacid: t.data.uniacid,
                openid: wx.getStorageSync("openid")
            },
            success: function(a) {
                console.log(a), 1 == a.data.data.is_apply && wx.showModal({
                    title: "提示",
                    showCancel: !1,
                    content: "您已提交申请，请等待管理员审核",
                    success: function(a) {
                        wx.redirectTo({
                            url: "/sudu8_page/index/index"
                        });
                    }
                }), 2 == a.data.data.is_apply && t.setData({
                    apply_success: !0,
                    data_username: a.data.data.data.username,
                    data_password: a.data.data.data.password,
                    data_url: a.data.data.data.url
                }), 3 == a.data.data.is_apply && wx.showModal({
                    title: "提示",
                    showCancel: !1,
                    content: "您的申请未通过，请重新申请！"
                });
            }
        });
    },
    getopenid: function() {
        var t = this;
        wx.login({
            success: function(a) {
                wx.request({
                    url: t.data.baseurl + "getopenid",
                    data: {
                        code: a.code
                    },
                    success: function(a) {
                        1 == a.data.openid ? wx.showModal({
                            title: "提示",
                            content: "获取openid失败"
                        }) : (wx.setStorage({
                            key: "openid",
                            data: a.data.openid
                        }), t.is_apply());
                    },
                    fail: function() {}
                });
            }
        });
    },
    onShareAppMessage: function() {},
    check_change: function() {
        var a = this;
        0 == a.data.check ? a.setData({
            check: 1
        }) : a.setData({
            check: 0
        });
    },
    xieyi_close: function() {
        this.setData({
            xieyi_block: 0
        });
    },
    xieyi_hidden: function() {
        this.setData({
            xieyi_block: 1,
            check: 0
        });
    },
    yyzz_upload: function() {
        var e = this, o = e.data.baseurl + "wxupimg";
        wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                wx.showLoading({
                    title: "图片上传中"
                });
                var t = a.tempFilePaths;
                wx.uploadFile({
                    url: o,
                    filePath: t[0],
                    name: "file",
                    success: function(a) {
                        var t = a.data;
                        e.setData({
                            yyzz: t
                        }), wx.hideLoading();
                    }
                });
            }
        });
    },
    logo_upload: function() {
        var e = this, o = e.data.baseurl + "wxupimg";
        wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                wx.showLoading({
                    title: "图片上传中"
                });
                var t = a.tempFilePaths;
                wx.uploadFile({
                    url: o,
                    filePath: t[0],
                    name: "file",
                    success: function(a) {
                        var t = a.data;
                        e.setData({
                            logo: t
                        }), wx.hideLoading();
                    }
                });
            }
        });
    },
    formSubmit: function(a) {
        var t = this;
        if (0 == t.data.check) return wx.showToast({
            title: "请先阅读协议",
            icon: "none"
        }), !1;
        var e = a.detail.value;
        return "" == e.username ? (wx.showModal({
            title: "提示",
            content: "请输入手机号",
            showCancel: !1
        }), !1) : "" == e.password ? (wx.showModal({
            title: "提示",
            content: "请输入密码",
            showCancel: !1
        }), !1) : "" == e.cid ? (wx.showModal({
            title: "提示",
            content: "请选择分类",
            showCancel: !1
        }), !1) : "" == e.name ? (wx.showModal({
            title: "提示",
            content: "请输入商户名称",
            showCancel: !1
        }), !1) : "" == e.tel ? (wx.showModal({
            title: "提示",
            content: "请输入商户电话",
            showCancel: !1
        }), !1) : "" == e.address ? (wx.showModal({
            title: "提示",
            content: "请输入商户地址",
            showCancel: !1
        }), !1) : "" == e.latlong ? (wx.showModal({
            title: "提示",
            content: "请填写经纬度",
            showCancel: !1
        }), !1) : "" == e.worktime ? (wx.showModal({
            title: "提示",
            content: "请输入营业时间",
            showCancel: !1
        }), !1) : "" == e.intro ? (wx.showModal({
            title: "提示",
            content: "请输入一句话简介",
            showCancel: !1
        }), !1) : "" == e.yyzz ? (wx.showModal({
            title: "提示",
            content: "请上传营业执照",
            showCancel: !1
        }), !1) : "" == e.logo ? (wx.showModal({
            title: "提示",
            content: "请上传商户logo",
            showCancel: !1
        }), !1) : (e.openid = wx.getStorageSync("openid"), e.cid = t.data.cid, wx.uploadFile({
            url: t.data.baseurl + "doPageuploadImg",
            uniacid: t.data.uniacid,
            filePath: t.data.yyzz,
            name: "file",
            success: function(a) {
                console.log(a.data);
                var t = JSON.parse(a.data);
                e.yyzz = t.data.substr(t.data.indexOf("/upimages")), console.log(t.data);
            }
        }), void wx.uploadFile({
            url: t.data.baseurl + "doPageuploadImg",
            uniacid: t.data.uniacid,
            filePath: t.data.logo,
            name: "file",
            success: function(a) {
                var t = JSON.parse(a.data);
                e.logo = t.data.substr(t.data.indexOf("/upimages"));
            },
            complete: function(a) {
                e.yyzz = e.yyzz.substr(e.yyzz.indexOf("/upimages")), e.logo = e.logo.substr(e.logo.indexOf("/upimages")), 
                wx.request({
                    url: t.data.baseurl + "doPageshopApply",
                    data: {
                        uniacid: t.data.uniacid,
                        formdata: JSON.stringify(e)
                    },
                    method: "POST",
                    header: {
                        "content-type": "application/x-www-form-urlencoded"
                    },
                    success: function(a) {
                        console.log(a), wx.showModal({
                            title: "提示",
                            content: "申请成功",
                            showCancel: !1,
                            success: function() {
                                wx.redirectTo({
                                    url: "/sudu8_page/index/index"
                                });
                            }
                        });
                    }
                });
            }
        }));
    },
    bindPickerChange: function(a) {
        var t = a.detail.value;
        this.setData({
            cid: this.data.category[t].id,
            catename: this.data.category[t].name
        });
    },
    getLatlong: function() {
        var t = this;
        wx.chooseLocation({
            success: function(a) {
                t.setData({
                    latlong: Math.floor(1e6 * a.latitude) / 1e6 + "," + Math.floor(1e6 * a.longitude) / 1e6
                });
            }
        });
    }
});