// @flow
const regeneratorRuntime = require('regenerator-runtime')
const computed = require('../../libs/computed-page')

Page({
  behaviors: [computed],
  computed: {
    name() {
      console.log('geo')
      return 'Geo'
    }
  },


  data: {
    route: 'index', // or main
    avatarUrl: '',
    nickName: '',
    gender: 0
  },

  async onLoad() {
    await this.loging()
  },

  async loging() {
    await wx.checkSession({
      success: async () => {
        // 当前仍然有效的话直接去云函数获取用户信息
        const { result } = await wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'verifyIdentity',
          // 传递给云函数的参数
          data: {
            session: wx.getStorageSync('session')
          }
        })

        if (result.code === 0) {
          const { avatarUrl, gender, nickName } = result.data
          this.onLoginSuccess({ detail: { avatarUrl, gender, nickName } })
        }
        // 登陆态失效
        else if (result.code === 401) {
          wx.removeStorageSync('session')
          wx.showToast({
            title: '登录信息已过期，请重新登录',
            icon: 'none',
            duration: 2500,
            complete: () => {
              wx.removeStorageSync('session');
              this.setData({ route: 'index' });
            }
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '会话过期,请重新登录授权',
          icon: 'none',
          duration: 2500,
          complete: () => {
            wx.removeStorageSync('session');
            this.setData({ route: 'index' });
          }
        })
      }
    })
  },

  onLoginSuccess(e) {
    // 登录成功的回调
    const { avatarUrl, nickName, gender } = e.detail
    this.setData({ route: 'main', avatarUrl, nickName, gender })
    wx.switchTab({
      url: '/pages/index/index',
      success: () => console.log('成功跳转')
    })
  },

  async bindLogout() {
    const { result } = await wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'loginRegister',
      // 传递给云函数的参数
      data: {
        session: wx.getStorageSync('session'),
        isLogout: true
      }
    });
    if (result.code === 0) {
      wx.showToast({
        title: result.message,
        icon: 'none',
        duration: 1500,
        complete: () => {
          wx.removeStorageSync('session');
          this.setData({ route: 'index' });
        }
      });
    }
  },

  async bindTap() {
    const { result } = await wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'verifyIdentity',
      // 传递给云函数的参数
      data: {
        session: wx.getStorageSync('session')
      }
    });

    const { message } = result
    if (result.code === 0) {
      wx.showToast({
        title: message,
        icon: 'success',
        duration: 2000
      });
    } else {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000,
        complete: () => {
          wx.removeStorageSync('session')
          this.setData({ route: 'index' })
        }
      })
    }
  }
})