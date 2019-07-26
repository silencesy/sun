// components/base/info-item/info-item.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['address', 'pageviews', 'date', 'like','comment'],
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetails({ currentTarget }) {
      const id = currentTarget.dataset.id;
      wx.navigateTo({
        url: '../../pages/articleDetails/articleDetails?id=' + id
      })
    },
    goDetails() {
      wx.navigateTo({
        url: '../../pages/articleDetails/articleDetails?id=' + this.data.data._id
      })
    },
    openLocation() {
      wx.openLocation({
        latitude: this.data.data.article_location.coordinates[1],
        longitude: this.data.data.article_location.coordinates[0],
        name: this.data.data.article_address
      })
    },
    like() {
      if (app.globalData.userInfo) {
        wx.cloud.callFunction({
          name: 'like',
          data: {
            id: this.data.data._id,
            isLike: !this.data.data.isLike
          }
        }).then(res => {
          console.log(res);
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
      
    }
  }
})
