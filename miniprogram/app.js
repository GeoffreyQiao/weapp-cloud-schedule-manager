//app.js
const regeneratorRuntime = require('regenerator-runtime')

App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true
      })
    }

    this.globalData = {}
  },

  /**
   * @method  检查用户登陆态
   */
  checkLoginStatus() {
    wx.checkSession({
      success: async () => {
        const { result } = await wx.cloud.callFunction({
          name: 'verifyIdentity',
          data: {
            session: wx.getStorageInfoSync('session')
          }
        })

        if (result.code == 0) {
          console.log(result.data)
          return this.globalData = {
            openid,
            session_status
          }
        }
        return wx.removeStorageSync("session")

      }
    })
  }

})

