// miniprogram/components/date-picker/date-picker.js
const computed = require('miniprogram-computed')
const Today = new Date()

let today = {
  year: Today.getFullYear(),
  month: Today.getMonth() + 1,
  day: Today.getDate(),
  weeks: Today.getDay() + 1
}

const co = Component({
  behaviors: [computed],

  /* 外部组件传入的参数列表 */
  properties: {
    year: {
      type: Number,
      value: today.year
    },
    month: {
      type: Number,
      value: today.month
    },
    selectedFunc: {     //使用该组件页面的获取数据库数据的方法名
      type: String
    },
    monthlySchedules: {
      type: Array,
      value: []
    }
  },
  /**
   * @description 自定义实现的 computed 功能。
   * @see https://github.com/wechat-miniprogram/computed
   */
  computed: {
    monthly() {
      return this.data.month < 10 ? '0' + this.data.month : this.data.month
    },
    ids() {
      // return this.data.app
    }
  },

  /* 组件的初始数据 */
  data: {
    WEEK: ['一', '二', '三', '四', '五', '六', '日'],
    currentYear: today.year,
    currentMonth: today.month,
    currentDay: today.day,
    currentWeeks: today.weeks,
    currentMonthLength: 0,
    emptyDayCol: null,
    days: [],
    recentlySelectedDay: 0

  },

  lifetimes: {
    created() {
      //生命周期，此周期无法操作this.setData
    },

    attached() {
      this.init()
    }
  },

  relations: {
    '/components/date-picker/day/day': {
      type: 'child',
      linked: target => {
        this.setData({
          month: 1
        })
      }
    }
  },

  /* 组件的方法列表 */
  methods: {

    tapOnDay(event) {
      let dayIdx = event.currentTarget.id - 1
      let selected = !this.data.days[dayIdx].selected
      this.setData({
        [`days[${dayIdx}].selected`]: selected,
        recentlySelectedDay: dayIdx - 1
      })
      let detail = {
        id: event.currentTarget.id,
        selected
      }
      this.triggerEvent('onselected', detail)
    },

    init(options) {
      let { year, month } = options ? options : this.data
      if (!year) {
        year = this.data.currentYear
        month = this.data.currentMonth
      } else if (!month) {
        month = 1
      }
      this.setData({
        year,
        month
      })
      return this.getDaysListByYearMonth()
    },

    getDaysListByYearMonth() {
      let { dayMount } = this.howManyDaysForMonth()
      /**@todo 云数据库中查询指定月份的排版记录，有则取，无则建。返回数据为 alreadyHasData  */
      let alreadyHasData = []

      return this.getDaysArr({
        alreadyHasData,
        dayMount
      })
    },
    /**
     * 获取指定月份的天数
     * @param {number?|string?} param0 顺序是[年,月]
     */
    howManyDaysForMonth(day = 0) {
      let { year, month } = this.data
      let monthly = new Date(year, month, day)
      let dayMount = monthly.getDate()
      let firstDay = new Date(`${year}/${month}/01`)
      let firstDayWeeks = firstDay.getDay()

      this.setData({
        currentMonthLength: dayMount,
        emptyDayCol: (firstDayWeeks + 6) % 7
      })
      return {
        dayMount
      }
    },

    getDaysArr({ dayMount, alreadyHasData = [] }) {
      let days = []
      for (let i = 1; i <= dayMount; i++) {
        let scheduleByDay = alreadyHasData[i - 1]
        let oneDay = {
          dayNo: i,
          weeks: (this.data.emptyDayCol + i) % 7,
          schedule: scheduleByDay || {},
          selected: false
        }
        days.push(oneDay)
      }
      this.setData({
        days
      })
      return { success: true }
    },
    nearMonth(event) {
      if (event.currentTarget.dataset.month === 'next') {
        this.setData({
          month: this.data.month + 1
        })
      } else {
        this.setData({
          month: this.data.month - 1
        })
      }
      return this.getDaysListByYearMonth()
    }
  }


  /**
   * 数据库中查询指定月份排班计划，有则获取，无则创建
   */
  // getScheduleByMonth({ year, month }) {

  // }
})

  // howManyDaysForMonth([year, month]) {
  //   let actualMonth = month - 1;
  //   let timeDistance = +new Date(year, month) - +new Date(year, actualMonth);
  //   return timeDistance / (1000 * 60 * 60 * 24);
  // }

