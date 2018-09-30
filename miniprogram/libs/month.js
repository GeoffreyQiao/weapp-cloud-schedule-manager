const Day = require('./text')
/**
 * @class Month
 */
class Month {
  /**
   * @constructor
   * @param {Date|String|Number|Array<string>} date 代表日期的 Date 对象、字符串、数字或者字符串数组
   * @property {Day[]} daysList  当月日期集合
   */
  constructor(date) {
    this._date = Month._initParser(date)
    console.log("_date:   ", this._date.getMonth())
    this.year = this._date.getFullYear()
    this._realMonth = this._date.getMonth()
    this.month = this._realMonth + 1
    this.dayMount = this.getDayMount()
    this.firstDayWeeks = Month._weeksOfFirstDay([this.year, this._realMonth])
    this.daysList = Month.daysListInMonth(this)
    return this
  }

  static daysListInMonth({ year, month, firstDayWeeks, dayMount }) {
    let emptyBeforeMonth = firstDayWeeks ? (firstDayWeeks - 1) % 7 : 6
    const dayList = new Array(dayMount - 1)
    let dateObj = { year, month, firstDayWeeks }
    for (let d = 1; d <= dayMount; d++) {
      dateObj.day = d
      dayList[d - 1] = new Day(dateObj)
    }
    return dayList
  }

  /**
   * @static 把参数解析成统一的 Date 对象
   * @param {Date|String|Number|Array<string>} date  
   * @return {Date}
   */
  static _initParser(date) {
    const type = date.constructor.name
    console.log("type:   ", type)
    switch (type) {
      case 'Date':
        break
      case 'Object':
        let { year, day = 0, month } = date
        date = new Date(`${year}/${month}/${day}`)
        break
      default:
        date = new Date(date)
    }
    return date
    // return type == 'Date' ? date : new Date(date)
  }

  /**
   * @static 返回当月1号时星期几 1-6 对于周一至周六；0 对应周日
   * @param {Array<Number>} param0 
   * @return {Number}
   */
  static _weeksOfFirstDay([year, month]) {
    let day = new Date(year, month, 1)
    return day.getDay()
  }

  /**
   * @method 获取当月天数
   * @return {Number} 返回当月天数
   */
  getDayMount() {
    const month = new Date(this.year, this.month, 0)
    return month.getDate()
  }
}

let nine = new Month([2018, 2])
module.exports = Month