// miniprogram/components/datepicker/datepicker.js

const Today = Date.now()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    weekDays: ['一', '二', '三', '四', '五', '六', '日']
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  howManyDaysForMonth([year, month]) {
    let actualMonth = month - 1;
    let timeDistance = +new Date(year, month) - +new Date(year, actualMonth);
    return timeDistance / (1000 * 60 * 60 * 24);
  }

})
