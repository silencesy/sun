// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'jiang-an-test'
})

const db = cloud.database()
const articleDB = db.collection('article')
const _ = db.command
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

// 云函数入口函数
exports.main = async (event, context) => {
  const openid = event.openid;
  const id = event.id;
  const isLike = event.isLike;
  const data = await articleDB.doc(id).get()
  console.log(data.data.article_like, openid)
  console.log(data.data.article_like.includes(openid));
  if (!data.data.article_like.includes(openid) && isLike == true) {
    data.data.article_like.push(openid);
    await articleDB.doc(id).update({
      data: {
        article_like: data.data.article_like
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
    return {
      code: 1,
      message: '取消点赞'
    }
  }
  
}