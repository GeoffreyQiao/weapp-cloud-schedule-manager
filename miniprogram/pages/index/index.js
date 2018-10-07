const regeneratorRuntime = require('regenerator-runtime')
const app = getApp()

wx.cloud.init({
    traceUser: true
})

/**
 * @todo 1.在用户端保存session，免去每次登录都要与服务器频繁通信。、
 * @todo 2.完善组件 datepicker 的全部功能
 */
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        isLogin: false,
        avatarUrl: '',
        openId: '',
        years: [2015, 2017, 2019],
        months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        app: app
    },

    async onLoad(options) {
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            this.setData({
                                avatarUrl: res.userInfo.avatarUrl,
                                userInfo: res.userInfo,
                                isLogin: true
                            })
                            return
                        }
                    })
                }
                // this.star()
                // this.doLogin()
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: async function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    onGetUserInfo(event) {
        if (!this.data.isLogin && event.detail.userInfo) {
            this.setData({
                isLogin: true,
                avatarUrl: event.detail.userInfo.avatarUrl,
                userInfo: event.detail.userInfo
            })
        }
    },

    tapOnAvator() {
        wx.showToast({
            title: '成功', //提示的内容,
            icon: 'success', //图标,
            //   duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => { }
        })
    },

    findUser(event) {
        try {
            wx.cloud.callFunction({
                name: 'employee',
                data: {}
            }).then(res => console.log('res for findUser method: ', res))
        }
        catch (err) { console.error('Error', err) }
    },

    confirmSchedule() {
        try {
            wx.cloud.callFunction({
                name: "schedule",
                data: {
                    date: "2018-09-11"
                }
            }).then(res => console.log('confirmSchedule:', res))
        }
        catch (err) { console.error(err) }
    },

    async getPhoneNo({ detail: { encryptedData, iv } }) {
        await wx.checkSession({
            success: async () => {
                const { result } = await wx.cloud.callFunction({
                    name: 'phoneNo',
                    data: {
                        encryptedData,
                        iv,
                        session: await wx.getStorageSync('session')
                    }
                })
                if (result.code === 0) {
                    this.setData({
                        phoneNumber: result.data.phoneNumber
                    })
                }
            },
            complete: async () => {
                await wx.getSetting({
                    success: r => console.log(r)
                })
            }
        })
    }
})