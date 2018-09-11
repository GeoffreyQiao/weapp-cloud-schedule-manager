//app.js
const regeneratorRuntime = require('regenerator-runtime')

if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
} else {
  wx.cloud.init({
    traceUser: true
  })
}

App({
  async onLaunch() {
    let s = await this.getOpenid()
    console.log(s)
    let { result } = s
    this.globalData = {
      openId: result.openId
    }
    // console.log(this.globalData)
  },

  onShow() {
  },

  async getOpenid() {
    return await wx.cloud.callFunction({
      name: 'login',
      data: {}
    })
  }


})

