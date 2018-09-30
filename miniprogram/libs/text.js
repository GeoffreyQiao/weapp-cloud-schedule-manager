/**
 * @typedef Day
 * @param {Number} year   年
 * @param {Number} month  月
 * @param {Number} day    日
 * @param {Number} weeks  周几
 * @param {String} str    日期字符串，如： '2018-9-11'
 */
class Day {
  /**
   * @constructor
   * @param {{year, month, day, firstDayWeeks}} param0
   * @return {Day}
   */
  constructor({ year, month, day, firstDayWeeks }) {
    this.year = year
    this.month = month
    this.day = day
    this.weeks = (firstDayWeeks + this.day - 1) % 7
    return this
  }
  get str() {
    return `${this.year}-${this.month}-${this.day}`
  }
}

module.exports = Day