// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'jiang-an-test'
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const openid = event.userInfo.openId;
    var data = await db.collection('article').orderBy('article_date','desc').skip(event.page * event.pageSize).limit(event.pageSize).get();

    data.data.forEach(element=>{
      element.article_date = handlePublishTimeDesc(element.article_date)
      element.article_comment_number = element.article_comment.length + element.article_comment_reply.length;
      if (openid && element.article_like.includes(openid)) {
        element.isLike =true;
      } else {
        element.isLike = false;
      }
    })

    console.log(data)
    return data;
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
        return post_modified;
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


  } catch (e) {
    console.error(e)
  }
}