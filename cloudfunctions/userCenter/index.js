// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'jiang-an-test'
})

const db = cloud.database()
const articleDB = db.collection('article')
const messageDB = db.collection('message')
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const articleNumber = await articleDB.where({
    _openid: wxContext.OPENID
  }).count()
  return {
    articleNumber
  }
}