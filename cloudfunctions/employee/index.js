// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const employeeCon = db.collection('employee')

// 云函数入口函数
exports.main = async (event, context) => {
    let openid = event.userInfo.openid
    return await employeeCon.get({ openid }).then(res => res.result.data).catch(err => console.error(err))
}