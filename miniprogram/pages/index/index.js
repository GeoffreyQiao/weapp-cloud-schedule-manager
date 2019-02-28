import * as regeneratorRuntime from 'regenerator-runtime'
const app = getApp()
let config

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
    nickName: '',
    gender: null,
    logging: false,
    avatarUrl: ''
  },

  onLoad(options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    config = JSON.parse(wx.getStorageSync('config'))
    this.setData({ tabItems: config.tabItems })
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
      success: res => {}
    })
  },

  findUser(event) {
    try {
      wx.cloud
        .callFunction({
          name: 'employee',
          data: {}
        })
        .then(res => console.log('res for findUser method: ', res))
    } catch (err) {
      console.error('Error', err)
    }
  },

  confirmSchedule() {
    try {
      wx.cloud
        .callFunction({
          name: 'schedule',
          data: {
            date: '2018-09-11'
          }
        })
        .then(res => console.log('confirmSchedule:', res))
    } catch (err) {
      console.error(err)
    }
  },

  getPhoneNo({ detail: { encryptedData, iv } }) {
    wx.showLoading({
      title: '验证中...',
      mask: true
    })
    wx.checkSession({
      success: async () => {
        const { result } = await wx.cloud.callFunction({
          name: 'phoneNo',
          data: {
            encryptedData,
            iv,
            session: wx.getStorageSync('session')
          }
        })
        if (result.code === 0) {
          wx.hideLoading()
          wx.showToast({
            title: '获取您的手机号码成功',
            icon: 'sucess'
          })
          this.setData({
            phoneNumber: result.data.phoneNumber
          })
        }
      }
    })
  },

  showTab(e) {
    wx.showTabBar({ animation: false })
    // wx.showTabBar({ animation: true })
  }
})
