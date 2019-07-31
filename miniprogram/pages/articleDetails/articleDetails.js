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
    commentValue: '',
    commentPlaceholder: '评论',
    superior_id: '',
    parents_id: ''
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
        id: id
      }
    }).then(res => {
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
      visible: false,
      commentPlaceholder: '评论',
      parents_id: '',
      superior_id: ''
    });
  },
  inputComment({ detail }) {
    let commentValue = detail.value;
    this.setData({
      commentValue: commentValue
    })
  },
  submitComment() {
    if (app.globalData.userInfo) {
      const that = this;
      let commentValue = that.data.commentValue;
      if (commentValue.length == 0) {
        wx.showToast({
          title: '请输入评论内容！',
          icon: 'none',
          duration: 2000
        })
      } else {
        if (that.data.commentPlaceholder == '评论') {
          wx.cloud.callFunction({
            name: 'addComment',
            data: {
              avatarUrl: app.globalData.userInfo.avatarUrl,
              content: that.data.commentValue,
              openid: app.globalData.userInfo.userInfo.openId,
              user_name: app.globalData.userInfo.nickName,
              _id: that.data.id,
            }
          }).then(res => {
            let data = that.data.data;
            data.article_comment = res.result;
            wx.showToast({
              title: '成功！',
              duration: 2000
            })
            that.setData({
              data: data,
              commentValue: '',
              visible: false
            })
          }).catch(err => {
            console.log(err)
          })
        } else {
          wx.cloud.callFunction({
            name: 'replyComment',
            data: {
              avatarUrl: app.globalData.userInfo.avatarUrl,
              content: that.data.commentValue,
              openid: app.globalData.userInfo.userInfo.openId,
              user_name: app.globalData.userInfo.nickName,
              _id: that.data.id,
              parents_id: that.data.parents_id,
              superior_id: that.data.superior_id,
              superior_name: that.data.superior_name,
              superior_openid: that.data.superior_openid,
            }
          }).then(res => {
            console.log(res);
            let data = that.data.data;
            data.article_comment_reply = res.result;
            wx.showToast({
              title: '成功！',
              duration: 2000
            })
            that.setData({
              data: data,
              commentValue: '',
              visible: false
            })
          }).catch(err => {
            console.log(err)
          })
        }
      }
    } else {
      wx.navigateTo({
        url: '../../pages/authorization/authorization',
      })
    }
  },
  replyComment({ currentTarget }) {
    console.log(currentTarget);
    var { name, parents_id, superior_id, superior_openid } = currentTarget.dataset;
    name = '回复 ' + currentTarget.dataset.name;
    this.setData({
      commentPlaceholder: name,
      superior_name: currentTarget.dataset.name,
      parents_id,
      superior_id,
      superior_openid
    })
    this.showComment();
  },
  goUserHome() {
    wx.showToast({
      title: '用户主页待开发',
      icon: 'none',
      duration: 2000
    })
  }
})