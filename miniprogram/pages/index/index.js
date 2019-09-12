const app = getApp()
const db = wx.cloud.database()
const articleDB = db.collection('article')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperData: null,
    articleData: [],
  },
  params: {
    user: false,
    page: 0,
    pageSize: 10,
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleData();
    this.getSwiperData();
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
    this.isRefresh();
  },
  isRefresh() {
    let isRefreshFlag = wx.getStorageSync('release') || false;
    if (isRefreshFlag) {
      wx.pageScrollTo({
        scrollTop: 0
      })
      this.refresh();
    }
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
    this.refresh();
  },
  refresh() {
    wx.removeStorage({
      key: 'release'
    })
    wx.showNavigationBarLoading();
    this.params.page = 0;
    this.getArticleData(true);
    this.getSwiperData();
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
    }).then(res=>{
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
    }).catch(err=>{
      console.log(err)
    })
  },
  getSwiperData() {
    const that = this;
    articleDB.orderBy('article_pageviews', 'desc').limit(3).field({
      _id: true,
      article_images: true
    }).get({}).then(res=>{
      let data = res.data;
      let swiperData = [];
      data.forEach(element=>{
        let { _id, article_images} = element;
        if (article_images[0]) {
          let obj = {};
          obj._id = _id;
          obj.pic = article_images[0];
          swiperData.push(obj);
        }
        
      })
      that.setData({
        swiperData
      })
    })
  }
})