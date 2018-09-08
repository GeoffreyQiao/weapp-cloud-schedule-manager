// miniprogram/pages/scancode/scancode.js
// const vant = require('vant-weapp')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    isShow: "disabled",
    contant: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  doScan(event) {
    wx.scanCode({
      onlyFromCamera: false, //是否只能从相机扫码，不允许从相册选择图片,
      success: res => {
        if (res.result) {
          this.setData({
            contant: res.result,
            show: true
          })
        }
      }
    })
  },

  onClose(event) {
    this.setData({
      show: false,
      contant: ''
    })
  }
})