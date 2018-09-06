const EMPLOYEE = {
  _id: "AUTO",
  idCard_no: "1  ^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$",
  last_edit_time: "db.serverDate()",
  name: "^([\u4e00-\u9fa5]{2,4})$",
  openid: "^([\w\d_-]{10,})$",
  position: "^([a-z_-]+)$",
  start_date: "db.serverDate()",
  tel_using: "^(\d{11})$",
  userInfo: {
    avatarUrl: "^(https?:\/\/[^\s]*)",
    city: "^([A-Z][a-z]+)",
    country: "^([A-Z][a-z]+)",
    gender: "^(1|0)$",
    language: "^([\w_]+)",
    nickName: "^(.+)",
    province: "^([A-Z][a-z]+)"
  }
}

const SCHEDULE = {
  _id: "AUTO",
  booking_date: {                           //日期，格式：0000-00-00
    year: "^(\d{4})$",                      //年 格式：0000
    month: "^(\d{2})$",                     //月 格式： 00
    day: "^(\d{2})$"                        //日 格式： 00
  },
  lastInput_user: "^([\w\d_-]{10,})$",      //此日期下当前最后一个选班用户的 _id
  lastInput_time: "db.serverDate()",        //最近一次发生变化的时间
  have_rested: "^(true|false)$",            //当日是否有选择休假的员工
  confirmed_users: "^\d$",                  //当日已经确认班次的员工数
  detail: {
    morning: ["^([\w\d_-]{10,})$"],         //早班    request
    noon: ["^([\w\d_-]{10,})$"],            //中班    request
    long_noon: "^([\w\d_-]{10,})$",          //大中班 
    night: ["^([\w\d_-]{10,})$"],           //晚班
    rest: "^([\w\d_-]{10,})$"                //轮休    
  }

}