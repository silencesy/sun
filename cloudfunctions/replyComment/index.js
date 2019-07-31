// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'jiang-an-test'
})

const db = cloud.database()
const _ = db.command
const articleDB = db.collection('article')
const messageDB = db.collection('message')

// 云函数入口函数
exports.main = async (event, context) => {
  var data = event;
  const _id = event._id;
  const date = new Date();
  const id = Number(String(new Date().getTime()) + String(Math.floor(Math.random() * 100000)));
  delete data.userInfo;
  delete data._id;
  data.id = id;
  data.date = date;

  try {
    // 插入评论
    await articleDB.doc(_id).update({
      data: {
        article_comment_reply: _.push([data])
      }
    })
    await messageDB.add({
      data: {
        date: new Date(),
        article_id: _id,
        content: data.content,
        is_delete: false,
        is_read: false,
        type: "comment",
        trigger: data.openid,
        passive: data.superior_openid
      }
    })
    // 获取评论
    let commentData = await articleDB.doc(_id).field({
      article_comment_reply: true
    }).get();
    return commentData.data.article_comment_reply
  } catch(e) {
    return e;
  }

 
}