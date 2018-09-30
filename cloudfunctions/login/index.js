// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含
 * - 小程序端调用传入的 data
 * - 经过微信鉴权直接可信的用户唯一标识 openid 
 * 
 */
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true
})

const db = cloud.database()

const _ = db.command

const employeeCon = db.collection('employee')

const DefaultUserForCreateMode = {
  name: null,
  // openId: null,
  position: null,
  // start_date: new Date(),
  phone_no: null,
  aboutUser: {
    id_card_no: null,
    id_card_img: null,
    health_certificate_id: null,
    health_certificate_img: null
  }
}
/**
 * @async
 * @param {Event} event  返回结构似于 {errMsg: "cloud.callFunction:ok", result: {真正返回的结果}}
 */

exports.main = async (event) => {
  let openId = event.userInfo.openId
  let { isNewUser, info } = await countUser(openId)
  return {
    openId,
    info,
    isNewUser
  }
}

/**
 * 创建新用户，参数 Oid 为用户的openId
 * @param {openId} Oid 
 */
async function createUser(Oid) {
  let detail = {
    ...DefaultUserForCreateMode,
    create_time: db.serverDate(),
    last_login: db.serverDate(),
    openId: Oid
  }
  return await employeeCon.add({ data: detail })

}

/**
* 通过用户打开应用时必传的参数openId 判断是否是新用户，否则查询并返回老用户信息，是则创建新用户并返回用户信息。
* @param {openId} Oid 
*/
async function countUser(Oid) {
  let { total } = await employeeCon.where({ openId: Oid }).count()
  if (total) {
    let oldInfo = await getUserByKey({ openId: Oid })
    return {
      isNewUser: false,
      info: oldInfo
    }
    let { _id } = await createUser(Oid)
    let newInfo = await getUserByKey(_id)
    return {
      isNewUser: true,
      info: newInfo
    }
  }
}

/**
 * 根据参数类型。使用不同方法查询并返回当前用户信息
 * @param {String|Object} Oid 
 */
async function getUserByKey(key) {
  let info
  if (typeof key === 'string') {
    info = await employeeCon.doc(key).get().data
  } else {
    let actionRes = await employeeCon.where(key).get()
    info = actionRes.data[0]
  }
  return info
}
