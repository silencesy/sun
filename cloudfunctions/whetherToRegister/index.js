// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'jiang-an-test'
})

const db = cloud.database()
const _ = db.command
const userDB = db.collection('user')



// 云函数入口函数
exports.main = async (event, context) => {
  return await userDB.where({
    userInfo: event.userInfo
  }).get();
  
}