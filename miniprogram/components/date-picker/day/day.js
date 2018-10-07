// components/day/day.js
Component({
  /** 组件的属性列表 */
  properties: {},

  /** 组件的初始数据 */
  data: {},

  /** 组件的方法列表 */
  methods: {},

  /** 与父组件关系定义 */
  relations: {
    '/components/date-picker/date-picker': {
      type: 'parent',
      linked: function(target) {
        console.log(target)
      }
    }
  },

  /** 生命周期 */
  lifetimes: {}
})
