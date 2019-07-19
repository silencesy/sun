const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    data: null,
    visible: false,
    focus: false,
    commentValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    },function () {
      this.getData(options.id);
    })
    
  },
  getData(id) {
    const that = this;
    wx.cloud.callFunction({
      name: 'articleDetails',
      data: {
        id: id,
        openid: app.globalData.userInfo ? app.globalData.userInfo.openid : null
      }
    }).then(res => {
      console.log(res);
      that.setData({
        data: res.result.data
      })
    }).catch(err => {
      console.log(err)
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(res);
  },
  like() {
    if (app.globalData.userInfo) {
      wx.cloud.callFunction({
        name: 'like',
        data: {
          openid: app.globalData.userInfo.openid,
          id: this.data.data._id,
          isLike: !this.data.data.isLike
        }
      }).then(res => {
        let data = this.data.data;
        data.isLike = !data.isLike;
        data.isLike ? data.article_like.push(app.globalData.userInfo.openid) : data.article_like.pop()
        this.setData({
          data: data
        })
      })
    } else {
      wx.navigateTo({
        url: '../../pages/authorization/authorization',
      })
    }

  },
  showComment() {
    // wx.  ({
    //   title: '待开发'
    // })

    this.setData({
      visible: true
    });
    setTimeout(()=>{
      this.setData({
        focus: true
      });
    },400);
  },
  handleCancel() {
    this.setData({
      visible: false
    });
  },
  inputComment({ detail }) {
    let commentValue = detail.value;
    this.setData({
      commentValue: commentValue
    })
  },
  submitComment() {
    let commentValue = this.data.commentValue;
    if (commentValue.length == 0) {
      wx.showToast({
        title: '请输入评论内容！',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        visible: false
      });
    }
  }
})