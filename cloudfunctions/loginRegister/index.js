/* @flow */
// 本函数处理登录/注册、注销流程

const { WXMINIUser } = require('wx-js-utils');
const db = require('./lib/db');
const Res = require('./lib/res');

const {
    secret,
    time
} = require('./config/index');

const createSession = require('./lib/createSession');

/**
 * @param {string} event.code  用户的code
 * @param {string} event.rawData 用户信息的json字符串
 * @param {boolean} event.isLogout 是否登出操作
 * @param {string} event.session 用户的登录信息凭证
 */
exports.main = async (event) => {
    // avatarUrl, gender, nickName
    const { code, rawData, isLogout, userInfo } = event;
    const { appId } = userInfo;
    const statusCollection = db.collection('status');

    if (!isLogout) {
        // 处理登录/注册
        const wxMiniUser = new WXMINIUser({ appId, secret });
        const { openid : openId, session_key } = await wxMiniUser.codeToSession(code);

        if (openId) {
            const { avatarUrl, gender, nickName } = JSON.parse(rawData)
            const userCollection = db.collection('users')
            const session = createSession(openId, session_key)
            const userRes = userCollection.where({ openId }).get()
            const statusRes = statusCollection.where({ openId }).get()
            const [status, user] = await Promise.all([statusRes, userRes])
            const statusDoc = status.data[0]

            if (statusDoc) {
                await statusCollection
                    .doc(statusDoc._id)
                    .update({ timeout: Date.now() + time, session, openId, session_key })
            } else {
                await statusCollection.add({
                    openId,
                    timeout: Date.now() + time,
                    session,
                    session_key
                })
            }

            const userDoc = user.data[0]
            if (userDoc) {
                await userCollection
                    .doc(userDoc._id)
                    .update({ avatarUrl, gender, nickName, openId })
            } else {
                await userCollection.add({ avatarUrl, gender, nickName, openId })
            }
            return new Res({ data: { session, rawData: JSON.parse(rawData) } })
        } else {
            return new Res({ code: 401, message: '登录/注册失败' })
        }
    } else {
        // 处理注销 清除相应的session
        const status = await statusCollection
            .where({ session: event.session })
            .get()
        if (status.data[0]) {
            await statusCollection.doc(status.data[0]._id).remove()
        }
        return new Res({ message: '注销成功' })
    }
}