const regeneratorRuntime = require('regenerator-runtime')
Page({
  data: {
    route: 'index', // or main
    avatarUrl: '',
    nickName: '',
    gender: 0
  },

  onLoad() {
    this.loging()
  },

  loging() {
    wx.checkSession({
      success: async () => {
        // 当前仍然有效的话直接去云函数获取用户信息
        const { result } = await wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'verifyIdentity',
          // 传递给云函数的参数
          data: {
            session: wx.getStorageSync('session')
          }
        });

        if (result.code === 0) {
          const { avatarUrl, gender, nickName } = result.data
          this.setData({ avatarUrl, nickName, gender, route: 'main' })
        }
        // 登陆态失效
        else if (result.code === 401) {
          wx.removeStorageSync('session');
        }
      },
      fail: () => {
        wx.showToast({
          title: '会话过期....',
          icon: 'none',
          duration: 1500,
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
    wx.showLoading({
      title: '请求调用云函数中...'
    });
    const { result } = await wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'verifyIdentity',
      // 传递给云函数的参数
      data: {
        session: wx.getStorageSync('session')
      }
    });

    wx.hideLoading()
    const { message } = result
    if (result.code === 0) {
      wx.showToast({
        title: message,
        icon: 'none',
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
      });
    }
  }
})