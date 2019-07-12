// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'jiang-an-test'
})

const db = cloud.database()
const _ = db.command
const articleDB = db.collection('article')
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const id = event.id;
    const updateData = (id) => new Promise((resolve, reject) => {
      articleDB.doc(id).update({
        data: {
          article_pageviews: _.inc(1)
        }
      }).then(res=>{
        resolve(res);
      })
    })
    const getData = (id) => new Promise((resolve, reject) => {
      articleDB.doc(id).get().then(res=>{
        resolve(res);
      })
    })
    let data = await Promise.all([updateData(id),getData(id)]);
    return data[1];
  } catch (e) {
    return {
      code: 0,
      err: '服务端报错'
    }
  }
}