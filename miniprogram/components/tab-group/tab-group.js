// components/tabGroup/tab-group.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},
  lifetimes: {
    attached() {}
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange({ detail }) {
      this.setData({
        active: detail
      })
      const route = this.data.tabs[detail].route
      wx.navigateTo({
        url: `/pages/${route}/${route}`
      })
      // wx.redirectTo({
      //   url: `/pages/${route}/${route}`
      // })
    }
  }
})
