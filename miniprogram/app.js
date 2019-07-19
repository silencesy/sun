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
