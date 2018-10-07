const WXBizDataCrypt = require('./lib/WXBizDataCrypt.js')
const db = require('./lib/db')
const Res = require('./lib/res')

/**
 * @async
 * @param {Event} event  返回结构似于 {errMsg: "cloud.callFunction:ok", result: {真正返回的结果}}
 */

exports.main = async (event) => {
    const statusCon = db.collection('status')
    const userCon = db.collection('users')

    const { encryptedData, iv, session, userInfo } = event
    const { appId, openId } = userInfo

    const { data: userDoc } = await userCon.where({ openId }).get()
    console.log('\n userDoc:', userDoc)
    if (userDoc[0].phoneNumber) {
        return new Res({ data: { phoneNumber: userDoc[0].phoneNumber } })
    }
    const { data: res } = await statusCon.where({ session }).get()
    const { session_key } = res[0]

    const pc = new WXBizDataCrypt(appId, session_key)
    const result = pc.decryptData(encryptedData, iv)
    if (result.phoneNumber) {
        console.log('\n phoneNo:', result.phoneNumber)
        await userCon.doc(userDoc[0]._id).update({ phoneNumber: result.phoneNumber })
        return new Res({ data: result })
    }
    return new Res({ code: 419, message: '没找到手机号，咋办' })
}
