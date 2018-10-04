const WXBizDataCrypt = require('./lib/WXBizDataCrypt.js')
const db = require('./lib/db')
const Res = require('./lib/res')

/**
 * @async
 * @param {Event} event  返回结构似于 {errMsg: "cloud.callFunction:ok", result: {真正返回的结果}}
 */

exports.main = async (event) => {
  const statusCon = db.collection('status')

  const { encryptedData, iv, session, userInfo } = event
  const { appId } = userInfo
  const { data: res } = await statusCon.where({ session }).get()
  const { session_key } = res[0]

  const pc = new WXBizDataCrypt(appId, session_key)
  const result = pc.decryptData(encryptedData, iv)
  if (result.phoneNumber) return new Res({ data: result })
  return new Res({ code: 419, message: '没找到手机号，咋办' })
}
