module.exports = class Day {
  /**
   * @static 返回解析后的date参数
   * @param {string|{year:string|number,month:string|number,day:string|number}|Array<string|number>} date 接受代表日期的字符串、对象、字符串数组或数字数组
   * @return {{year, month, day, weeks}}
   */
  static getDetail(date) {
    if (typeof date === 'string') {
      let dayObj = new Date(date)
      return Day.dateParser(dayObj)
    }
    // @ts-ignore
    let { year, month, day = 0 } = date
    if (year && month && day) {
      let dayObj = new Date(year, month, day)
      return Day.dateParser(dayObj)
    }
    let dayObj = new Date(date[0], date[1], date[2] = 0)
    return Day.dateParser(dayObj)
  }

  /**
   * @static 解析Date并返回
   * @param {Date} dateObj
   * @return dayDetail
   */
  static dateParser(dateObj) {
    let dayDetail = {}
    dayDetail.year = dateObj.getFullYear()
    dayDetail.month = dateObj.getMonth() + 1
    dayDetail.day = dateObj.getDate()
    dayDetail.weeks = dateObj.getDay()
    return dayDetail
  }

  /**
   * @static 解析配置项
   * @param {object} options
   * @see schdules.json
   */
  static optionParser(options) {
    let { schedules } = options
    let scheduleList = []
    let workersList = []
    for (const ban of schedules) {
      scheduleList.push(ban)
      if (ban.workers.length) {
        workersList = [...workersList, ...ban.workers]
      }
    }
    return {
      scheduleList,
      workersList: new Set(workersList)
    }
  }


  /**
   * @constructor 
   * @return this
   */
  constructor({ date, options, alreadyHas = {} }) {
    let { year, month, day, weeks } = Day.getDetail(date)
    this.year = year
    this.month = month
    this.day = day
    this.weeks = weeks
    let option = Day.optionParser(options)
    this.schedules = option.scheduleList
    this.workers = option.workersList
    return this
  }

  get no() {
    return this.day
  }

  booking(user_id, schdule_id) {
    if (this.workers.has(user_id)) return new Error('this user already booked today~')
    for (let ban of this.schedules) {
      if (ban._id === schdule_id && ban.available) {
        ban.workers.push(user_id)
        this.workers.add(user_id)
        ban.available = Day.scheduleCheckAvailable(ban)
      }
    }
  }

  static scheduleCheckAvailable(schedule) {
    let worker_mount = schedule.workers.length
    let max = schedule.worker_max
    return (worker_mount < max) ? true : false
  }

}