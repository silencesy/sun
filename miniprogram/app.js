 //app.js


App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,        //是否记录用户访问记录
        env: 'jiang-an-test'    //程序环境
      })
    }

    // 获取用户是否注册，如果注册就返回用户信息
    wx.cloud.callFunction({
      name: 'whetherToRegister',
    }).then(res => {
      if (res.result.data.length>0){
        this.globalData.userInfo = res.result.data[0];
        wx.setStorageSync('userInfo', res.result.data[0]);
        const db = wx.cloud.database()
        const watcher = db.collection('message').where({
          passive: this.globalData.userInfo.openid,
          is_read: false
        }).watch({
          onChange: (res) => {
            if (res.docs.length>0) {
              wx.setTabBarBadge({
                index: 1,
                text: String(res.docs.length)
              })
            } else {
              wx.removeTabBarBadge({
                index: 1
              })
            }
            
          },
          onError: (err) => {
            console.error(err)
          }
        })
      } else {
        this.globalData.userInfo = null;
        wx.setStorageSync('userInfo', null);
      }
    }).catch(err => {
      console.log(err)
    })



    this.globalData = {
      //用户ID
      userId: '',
      //用户信息
      userInfo: wx.getStorageSync('userInfo') || null,
      //授权状态
      auth: {
        'scope.userInfo': false
      },
      //登录状态
      logged: false
    }
  }
})
