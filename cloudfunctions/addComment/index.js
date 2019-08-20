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
  try {
    const _id = event._id;
    var data = event;
    delete data._id;
    delete data.userInfo;
    const id = Number(String(new Date().getTime()) + String(Math.floor(Math.random() * 100000)));
    const date = new Date();
    data.id = id;
    data.date = date;
    // 插入评论
    await db.collection('article').doc(_id).update({
      data: {
        article_comment: _.unshift([data])
      }
    })
    // 获取发布者的id 
    const articleUserId = await articleDB.doc(_id).field({
      _openid: true
    }).get();
    await messageDB.add({
      data: {
        date: new Date(),
        article_id: _id,
        content: data.content,
        is_delete: false,
        is_read: false,
        type: "comment",
        trigger: data.openid,
        passive: articleUserId.data._openid
      }
    })
    // 获取评论
    let commentData = await articleDB.doc(_id).field({
      article_comment: true
    }).get();
    // 格式化时间
    commentData.data.article_comment.forEach(element => {
      element.date = handlePublishTimeDesc(element.date)
    });
    // 返回数据
    return commentData.data.article_comment;
    
  } catch (e) {
    console.error(e)
  }
}


function handlePublishTimeDesc(post_modified) {
  // 拿到当前时间戳和发布时的时间戳，然后得出时间戳差
  var curTime = new Date();
  var postTime = post_modified;
  var timeDiff = curTime.getTime() - postTime.getTime();

  // 单位换算
  var min = 60 * 1000;
  var hour = min * 60;
  var day = hour * 24;
  var week = day * 7;

  // 计算发布时间距离当前时间的周、天、时、分
  var exceedWeek = Math.floor(timeDiff / week);
  var exceedDay = Math.floor(timeDiff / day);
  var exceedHour = Math.floor(timeDiff / hour);
  var exceedMin = Math.floor(timeDiff / min);

  // 最后判断时间差到底是属于哪个区间，然后return
  if (exceedWeek > 0) {
    return dateFormatting(post_modified);
  } else {
    if (exceedDay < 7 && exceedDay > 0) {
      return exceedDay + '天前';
    } else {
      if (exceedHour < 24 && exceedHour > 0) {
        return exceedHour + '小时前';
      } else {
        if (exceedMin == 0) {
          return '刚刚';
        } else {
          return exceedMin + '分钟前';
        }
      }
    }
  }
}

function dateFormatting(data) {
  var date = new Date(data);
  Y = date.getFullYear() + '/';
  M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  D = date.getDate() + ' ';
  // h = date.getHours() + ':';
  // m = date.getMinutes() + ':';
  // s = date.getSeconds();
  return Y + M + D;
}