// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'jiang-an-test'
})

const db = cloud.database()
const messageDB = db.collection('message')
const articleDB = db.collection('article')
const userDB = db.collection('user')
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { page, pageSize } = event;
  const openid = event.userInfo.openId;
  var articleArr = [];
  var userArr = [];
  var middleWareData = {}
  var middleWareData2 = {}
  var { data: messageData } = await messageDB.where({
    passive: openid,
    type: 'comment'
  }).orderBy('date', 'desc')
    .skip(page * pageSize)
    .limit(pageSize)
    .get();
  messageData.map((item) => {
    articleArr.push(item.article_id);
    userArr.push(item.trigger);
  })
  var { data: articleData } = await articleDB.where({
    _id: _.in(articleArr)
  }).field({
    article_content: true,
    article_images: true,
    user_avatar: true,
    user_name: true
  }).get();
  var { data: userData } = await userDB.where({
    openid: _.in(userArr)
  }).field({
    avatarUrl: true,
    nickName: true,
    openid: true
  }).get();
  articleData.forEach(element => {
    middleWareData[element._id] = element;
  })
  userData.forEach(element => {
    middleWareData2[element.openid] = element;
  })
  messageData.forEach((element, index) => {
    messageData[index].article = middleWareData[element.article_id];
    messageData[index].userinfo = middleWareData2[element.trigger];
    messageData[index].date = handlePublishTimeDesc(element.date);
  });
  return messageData
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