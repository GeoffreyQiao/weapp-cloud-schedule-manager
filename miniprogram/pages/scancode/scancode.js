// miniprogram/pages/scancode/scancode.js
// const vant = require('vant-weapp')
// @ts-ignore
const regeneratorRuntime = require('regenerator-runtime')
// import SCHEDULES from '../libs/schedules.json'
const SelectedDays = new Set()
if (!wx.cloud) {
  wx.cloud.init()
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    isShow: "disabled",
    contant: '',
    userName: 'Geoffrey',
    selectedDays: [],
    route: 'index', // or main
    avatarUrl: '',
    nickName: '',
    gender: 0
  },

  /**
   * 生命周期函数--监听页面显示
   !=
*/
  async onShow() {
    // console.log(this)
    this.setData({
      selectedDays: Array.from(SelectedDays)
    })
    this.testing()
  },
  async testing() {
    wx.cloud.callFunction({
      name: 'test',
      success: res => console.log(res.result)
    })
  },
  setUserName(e) {
    let name = e.detail.value
    if (name) this.setData({ userName: name })
  },

  doScan() {
    wx.scanCode({
      onlyFromCamera: false, //是否只能从相机扫码，不允许从相册选择图片,
      success: res => {
        if (res && res.result) {
          this.setData({
            contant: res.result,
            show: true
          })
        }
      }
    })
  },

  onClose() {
    this.setData({
      show: false,
      contant: ''
    })
  },

  howManyDaysForMonth([year, month]) {
    return new Date(year, month + 1, 0).getDate()
  },

  selectedDayChange(e) {
    let id = e.detail.id.toString()
    let days = SelectedDays.has(id) ? SelectedDays.delete(id) : SelectedDays.add(id)
    this.setData({
      // selectedDays: Array.from(SelectedDays)
      [`selectedDays[${id}]`]: e.detail.selected
    })
    console.log(SCHEDULES)
  }
  // /**
  //  * 生命周期函数--监听页面加载
  //  */
  // onLoad: function (options) {

  // },

  // /**
  //  * 生命周期函数--监听页面初次渲染完成
  //  */
  // onReady: function () {

  // },



  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {

  // },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // },

})