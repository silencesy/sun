// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'jiang-an-test'
})

const db = cloud.database()
const articleDB = db.collection('article')
const messageDB = db.collection('message')
const _ = db.command
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

// 云函数入口函数
exports.main = async (event, context) => {
  const openid = event.userInfo.openId;
  const id = event.id;
  const isLike = event.isLike;
  const data = await articleDB.doc(id).get()
  if (!data.data.article_like.includes(openid) && isLike == true) {
    data.data.article_like.push(openid);
    await articleDB.doc(id).update({
      data: {
        article_like: data.data.article_like
      }
    })
    // 获取发布者的id 
    const articleUserId = await articleDB.doc(id).field({
      _openid: true
    }).get();
    await messageDB.add({
      data: {
        date: new Date(),
        article_id: id,
        is_delete: false,
        is_read: false,
        type: "like",
        trigger: openid,
        passive: articleUserId.data._openid
      }
    })
    return {
      code: 1,
      message: '点赞成功'
    }
  } else if (data.data.article_like.includes(openid) && isLike == false) {
    data.data.article_like.remove(openid)
    await articleDB.doc(id).update({
      data: {
        article_like: data.data.article_like
      }
    })
    await messageDB.where({
      article_id: id,
      trigger: openid,
      type: 'like'
    }).remove();
    return {
      code: 1,
      message: '取消点赞'
    }
  }
  
}