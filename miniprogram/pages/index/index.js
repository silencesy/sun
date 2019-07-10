const db = wx.cloud.database()
const articleDB = db.collection('article')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperData: null,
    articleData: [],
    params: {
      page: -1,
      pageSize: 10
    }
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
    const that = this;
    let params = that.data.params;
    params.page = -1;
    that.setData({
      params: params
    })
    this.getArticleData(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getArticleData(false);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getArticleData(isInit) {
    // wx.cloud.callFunction({
    //   name: 'articleList'
    // }).then(res=>{
    //   console.log(res)
    // }).catch(err=>{
    //   console.log(err)
    // })
    const that = this;
    let params = that.data.params;
    params.page++;
    that.setData({
      params: params
    })
    console.log(params.page * params.pageSize);
    articleDB.skip(params.page * params.pageSize == 0 ? 1 : params.page * params.pageSize).limit(params.pageSize).get({
      success: function (res) {
        console.log(res);
        if (isInit) {
          console.log('-------')
          that.setData({
            articleData: res.data
          })
        } else {
          console.log('++++++++')
          that.setData({
            articleData: that.data.articleData.concat(res.data)
          })
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh()
      }
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
        let obj = {};
        obj._id = _id;
        obj.pic = article_images[0];
        swiperData.push(obj);
      })
      that.setData({
        swiperData
      })
    })
  }
})