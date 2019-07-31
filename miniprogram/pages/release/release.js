const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleData: [],
  },
  params: {
    user: true,
    page: 0,
    pageSize: 10,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setUserInfo();
    this.getArticleData();
  },
  setUserInfo() {
    console.log(app)
    let userInfo = app.globalData.userInfo || '';
    this.setData({
      userInfo
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.params.page = 0;
    this.getArticleData(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.params.page++;
    this.getArticleData(false);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getArticleData(isInit) {
    const that = this;
    wx.cloud.callFunction({
      name: 'articleList',
      data: that.params
    }).then(res => {
      if (isInit) {
        that.setData({
          articleData: res.result.data
        })
      } else {
        that.setData({
          articleData: that.data.articleData.concat(res.result.data)
        })
      }
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh()
    }).catch(err => {
      console.log(err)
    })
  }
})