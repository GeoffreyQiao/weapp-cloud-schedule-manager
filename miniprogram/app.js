//app.js
const regeneratorRuntime = require('regenerator-runtime')

const fileSystem = wx.getFileSystemManager()
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
        let { result } = s
        this.globalData = {
            openId: result.openId
        }
        // console.log(this.globalData)
    },

    onShow() {
        // wx.openSetting()
    },

    async getOpenid() {
        return await wx.cloud.callFunction({
            name: 'login',
            data: {}
        })
    },

    async readFile(obj) {
        return await fileSystem.readFile(obj)
    }


})

