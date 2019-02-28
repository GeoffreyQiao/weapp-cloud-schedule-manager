// @flow
import * as regeneratorRuntime from 'regenerator-runtime'
import * as computed from 'miniprogram-computed'
const {
  wxPromise
} = require('customer-utils')
let config
const db = wx.cloud.database()
const StatusCol = db.collection('status')

Page({
  behaviors: [computed],
  computed: {
    name() {
      return 'Geo'
    }
  },

  data: {
    currentRoute: 'login',
    route: 'index' // or main
  },

  onLoad() {
    let appData = getApp().globalData
    this.setData({ ...appData
    })
    this.logging()
  },
  async onShow() {
    let {
      data: tempData
    } = await wxPromise(wx.getStorage)({
      key: 'config'
    })
    config = JSON.parse(tempData)
    this.setData({
      tabItems: config.tabItems
    })
  },

  async logging() {
    let session1 = ''
    let {
      keys
    } = await wxPromise(wx.getStorageInfo)()
    if (!keys.includes('session')) {
      let {
        data: {
          openId
        }
      } = await wxPromise(wx.getStorage)({
        key: 'userInfo'
      })
      const {data:result} = await StatusCol.where({
        openId
      }).get()
      const {
        session
      } = result[0]
      session1 = session
      console.log('sess1:',session1)
      await wxPromise(wx.setStorage)({
        key: 'session',
        data: session
      })
    }
    const {
      data: session
    } = await wxPromise(wx.getStorage)({
      key: 'session'
    })
    let SESSION = session
    console.log('SESSION:', SESSION)
    await wx.checkSession({
        success: async function () {
            const {
              result
            } = await wx.cloud.callFunction({
              // 要调用的云函数名称
              name: 'verifyIdentity',
              // 传递给云函数的参数
              data: {
                session1
              }
            })

            if (result.code === 0) {
              wx.showToast({
                title: `登录成功
            请等待自动跳转`,
                icon: 'none',
                mask: true
              })
              const {
                avatarUrl,
                gender,
                nickName
              } = result.data
              this.onLoginSuccess({
                detail: {
                  avatarUrl,
                  gender,
                  nickName
                }
              })
            }
            // 登陆态失效
            else if (result.code === 401) {
              wx.showToast({
                title: '登录信息过期，请重新登录',
                icon: 'none',
                mask: true,
                // duration: 2500,
                complete: () => {
                  wx.removeStorageSync('session')
                  this.setData({
                    route: 'login'
                  })
                }
              })
            }
          },
      fail: (err) => {
        console.log('ERR:', err)
        wx.showToast({
          title: '会话过期,请重新授权',
          icon: 'none',
          mask: true,
          // duration: 2500,
          complete: () => {
            wx.removeStorageSync('session')
            this.setData({
              route: 'login'
            })
          }
        })
      }
      })
  },

  onLoginSuccess(e) {
    // 登录成功的回调
    const {
      avatarUrl,
      nickName,
      gender
    } = e.detail
    this.setData({
      route: 'index',
      avatarUrl,
      nickName,
      gender
    })
    const app = getApp()
    app.globalData = {
      avatarUrl,
      nickName,
      gender,
      logging: true,
      ...app.globalData
    }
    this.naviToIdx()
  },

  async bindLogout() {
    const {
      data: session
    } = await wxPromise(wx.getStorage)({
      key: 'session'
    })
    const {
      result
    } = await wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'loginRegister',
      // 传递给云函数的参数
      data: {
        session,
        isLogout: true
      }
    })

    if (result.code === 0) {
      wx.showToast({
        title: result.message,
        icon: 'none',
        duration: 1500,
        complete: () => {
          wx.removeStorageSync('session')
          this.setData({
            route: 'login'
          })
        }
      })
    }
  },

  async bindTap() {
    const session = await wxPromise(wx.getStorage)({
      key: 'session'
    })
    const {
      result
    } = await wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'verifyIdentity',
      // 传递给云函数的参数
      data: {
        session
      }
    })

    const {
      message
    } = result
    if (result.code === 0) {
      wx.showToast({
        title: message,
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000,
        complete: () => {
          wx.removeStorageSync('session')
          this.setData({
            route: 'login'
          })
        }
      })
    }
  },

  naviToIdx: function (e) {
    wx.redirectTo({
      url: '../index/index'
    })
  }
})