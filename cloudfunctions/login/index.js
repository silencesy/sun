// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: 'jiang-an-test'
})

const db = cloud.database()
const userDB = db.collection('user')

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  var data = event;
  data.openid = data.userInfo.openId;
  data.appid = data.userInfo.appId;
  delete data.userInfo;
  let userData = await userDB.where({
    openid: data.openid
  }).get();
  if (userData.data.length>0) {
    await userDB.where({
      openid: data.openid
    }).update({
      data: data
    })
  } else {
    await userDB.add({
      data: data
    })
  }
  return event
}
