// pages/addArticle/addArticle.js
const app = getApp()
const db = wx.cloud.database()
const articleDB = db.collection('article')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgData: [],
    article_images: [],
    article_classification: '',
    article_content: '',
    article_location: null,
    article_address: '你在哪里？'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindinput({ detail }) {
    let article_classification = detail.value;
    this.setData({
      article_classification: article_classification
    })
  },
  bindinputcontent({ detail }) {
    let article_content = detail.value;
    this.setData({
      article_content: article_content
    })
  },
  chooseImage() {
    const that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var imgData = that.data.imgData;
        var tempFilePaths = res.tempFilePaths
        that.setData({
          imgData: imgData.concat(tempFilePaths)
        })
      }
    })
  },
  deleteImg({ currentTarget }) {
    const index = currentTarget.dataset.index;
    const imgData = this.data.imgData;
    imgData.splice(index,1);
    this.setData({
      imgData: imgData
    })
  },
  submitFrom() {
    const that = this;
    if (app.globalData.userInfo) {
      if (this.data.article_content || that.data.article_images.length>0) {
        wx.showLoading({
          title: '提交中',
        })
        const promiseArr = []
        that.data.imgData.forEach(function (element, index) {
          let filePath = element;
          let suffix = /\.[^\.]+$/.exec(filePath)[0];
          promiseArr.push(new Promise((reslove, reject) => {
            wx.cloud.uploadFile({
              cloudPath: new Date().getTime() + suffix,
              filePath: filePath,
            }).then(res => {
              that.setData({
                article_images: that.data.article_images.concat(res.fileID)
              })
              reslove()
            }).catch(error => {
              console.log(error)
            })
          }))
        });

        Promise.all(promiseArr).then(res => {
          var data = {};
          data.user_name = app.globalData.userInfo.nickName;
          data.user_avatar = app.globalData.userInfo.avatarUrl;
          data.article_classification = this.data.article_classification;
          data.article_content = this.data.article_content;
          data.article_location = this.data.article_location;
          data.article_pageviews = 0;
          data.article_comment_number = 0;
          data.article_like = 0;
          data.article_date = new Date("2017-09-01");
          data.article_images = this.data.article_images;
          data.is_delete = false;
          data.article_address = this.data.article_address == '你在哪里？' ? '' : this.data.article_address;
          articleDB.add({
            // data 字段表示需新增的 JSON 数据
            data: data
          }).then(res => {
            wx.hideLoading();
            wx.showToast({
              title: '发布成功',
              icon: 'none',
              duration: 2000,
              success: function() {
                setTimeout(()=>{
                  wx.redirectTo({
                    url: '../articleDetails/articleDetails?id=' + res._id
                  })
                },2000)
              }
            })
            
          })
        })
      } else {
        wx.showToast({
          title: '发布内容或者图片',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.navigateTo({
        url: '../authorization/authorization',
      })
    }
    
  },
  chooseLocation(e) {
    var article_location = this.data.article_location;
    wx.chooseLocation({
      success: res => {
        this.setData({
          article_address: res.name,
          article_location: new db.Geo.Point(res.longitude, res.latitude),
        })
      }
    })
  }
})