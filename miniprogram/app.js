//app.js
const regeneratorRuntime = require('regenerator-runtime')
const {
  wxPromise
} = require('customer-utils')
const cloudEnvID = 'a-cow-plan-0e733e'
const wxFile = wx.getFileSystemManager()

if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
} else {
  wx.cloud.init({
    traceUser: true
  })
}
const db = wx.cloud.database()
const UserCol = db.collection('users')

const _ = db.command

App({
  onLaunch() {
    this.getConfig()
  },

  async onShow() {
    let {
      result: {
        openId
      }
    } = await wx.cloud.callFunction({
      name: 'basic'
    })
    let {
      data: userList
    } = await UserCol.where({
      openId
    }).get()
    let userDoc = userList[0]
    return await wxPromise(wx.setStorage)({
      key: 'userInfo',
      data: JSON.stringify(userDoc)
    })
  },

  async getConfig() {
    const {
      tempFilePath
    } = await wx.cloud.downloadFile({
      fileID: `${cloudEnvID}.${cloudEnvID}/configs/config.json`
    })
    let {
      data: config
    } = await this.getFileContent(tempFilePath)

    await wxPromise(wx.removeStorage)({
      key: 'config'
    })
    return await wx.setStorage({
      key: 'config',
      data: config
    })
  },

  async getFileContent(tempFilePath) {
    return new Promise(resolve => {
      return wxFile.readFile({
        filePath: tempFilePath,
        encoding: 'utf8',
        success: res => resolve(res)
      })
    })
  }
})