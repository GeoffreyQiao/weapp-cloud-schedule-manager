// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const _ = db.command

const scheduleCon = db.collection('schedule')

const dayNumInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const SCHEDULE = {
  lastInput_employee: "",      //此日期下当前最后一个选班用户的 _id
  lastInput_time: db.serverDate(),        //最近一次发生变化的时间
  have_rested: "",            //当日是否有选择休假的员工
  confirmed_users: "",                  //当日已经确认班次的员工数
  detail: {
    morning: "",       //早班    request
    noon: "",          //中班    request
    long_noon: "",       //大中班 
    night: "",         //晚班
    rest: ""             //轮休    
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  let { date, month } = event
  if (month) return await createMonthly(month)
  let has = await alreadyHasDate(date)
  if (!has.total) return await addDate(date)

  return await scheduleCon.where({
    date_str: _.eq(date)
  }).get()
}

/**
 * 获取数据库中是否存在参数 the_date 所代表日期的记录
 * @param {String} date 
 */
async function alreadyHasDate(date) {
  let day = new Date(date)
  return await scheduleCon.where({
    date_str: _.eq(date)
  }).count()
  // .then(res => res.total).catch(err => err)
  // _.eq(day.toDateString)
}

/**
 * 新增工作日记录
 * @param {String} date
 * @return {Promise<{_id: String}>} 新增记录id
 */
async function addDate(date) {
  let doc = {
    date_str: date,
    booking_date: new Date(date),
    ...SCHEDULE
  }
  return await scheduleCon.add({
    data: doc
  }).then(res => res)
}

/**
 * 根据参数新建一整月的工作日记录
 * @param {{year:String, month:String}} month
 */
async function createMonthly(month) {

}