// miniprogram/pages/scancode/scancode.js
// const vant = require('vant-weapp')
const regeneratorRuntime = require('regenerator-runtime')
const SelectedDays = new Set()
if (!wx.cloud) {
  wx.cloud.init()
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // show: false,
    // isShow: 'disabled',
    contant: '',
    userName: 'Geoffrey',
    currentMonth: [],
    route: 'index', // or main
    avatarUrl: '',
    nickName: '',
    gender: 0
  },

  onLoad() {
    let appData = getApp().globalData
    this.setData(appData)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    this.setData({
      selectedDays: Array.from(SelectedDays)
    })
  },

  onReady() {
    wx.hideTabBar({
      animation: true
    })
  },

  setUserName(e) {
    let name = e.detail.value
    if (name) this.setData({ userName: name })
  },

  onClose() {
    this.setData({
      show: false,
      contant: ''
    })
  },

  /**
   * 指定月份的天数
   * @param {*} param0
   */
  howManyDaysForMonth([year, month]) {
    return new Date(year, month + 1, 0).getDate()
  },

  selectedDayChange(e) {
    let id = e.detail.id.toString()
    let days = SelectedDays.has(id)
      ? SelectedDays.delete(id)
      : SelectedDays.add(id)
    this.setData({ [`currentMonth[${id - 1}].selected`]: e.detail.selected })
  },

  onPickerInited(e) {
    const dayList = e.detail
    this.setData({ currentMonth: dayList })
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
