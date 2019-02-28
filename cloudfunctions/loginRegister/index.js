/* @flow */
// 本函数处理登录/注册、注销流程

const {
  WXMINIUser
} = require('wx-js-utils')
const db = require('./lib/db')
const _ = db.command
const Res = require('./lib/res')

const {
  secret,
  time
} = require('./config/index')

const createSession = require('./lib/createSession')

/**
 * @param {string} event.code  用户的code
 * @param {string} event.rawData 用户信息的json字符串
 * @param {boolean} event.isLogout 是否登出操作
 * @param {string} event.session 用户的登录信息凭证
 */
exports.main = async event => {
  // avatarUrl, gender, nickName
  const {
    code,
    rawData,
    isLogout,
    userInfo
  } = event
  const {
    appId
  } = userInfo
  const UserCollection = db.collection('users')
  const StatusCollection = db.collection('status')

  if (!isLogout) {
    qqqqqqqqqqqqqqqqqqqqqqqqqqsd
    // 处理登录/注册
    const wxMiniUser = new WXMINIUser({
      appId,
      secret
    })
    const {
      openid: openId,
      session_key
    } = await wxMiniUser.codeToSession(code)

    if (openId) {
      const {
        avatarUrl,
        gender,
        nickName
      } = JSON.parse(rawData)
      const session = createSession(openId, session_key)
      const userRes = UserCollection.where({
        openId
      }).get()
      const statusRes = StatusCollection.where({
        openId
      }).get()
      const [status, user] = await Promise.all([statusRes, userRes])
      const statusDoc = status.data[0]

      if (statusDoc) {
        await StatusCollection.doc(statusDoc._id).update({
          timeout: Date.now() + time,
          session,
          openId,
          session_key
        })
      } else {
        await StatusCollection.add({
          openId,
          timeout: Date.now() + time,
          session,
          session_key
        })
      }

      const userDoc = user.data[0]
      if (userDoc) {
        await UserCollection.doc(userDoc._id).update({
          avatarUrl,
          gender,
          nickName,
          openId,
          loginTimes: _.inc(1)
        })
      } else {
        await UserCollection.add({
          avatarUrl,
          gender,
          nickName,
          openId,
          loginTimes: 0
        })
      }
      return new Res({
        data: {
          session,
          rawData: JSON.parse(rawData)
        }
      })
    } else {
      return new Res({
        code: 401,
        message: '登录/注册失败'
      })
    }
  } else {
    // 处理注销 清除相应的session
    const status = await StatusCollection.where({
      session: event.session
    }).get()
    if (status.data[0]) {
      await StatusCollection.doc(status.data[0]._id).remove()
    }
    return new Res({
      message: '注销成功'
    })
  }
}