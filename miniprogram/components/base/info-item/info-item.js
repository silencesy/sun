// components/base/info-item/info-item.js
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
      console.log(this.data.data);
      wx.openLocation({
        latitude: this.data.data.article_location.latitude,
        longitude: this.data.data.article_location.longitude,
        name: this.data.data.article_address
      })
    },
    like() {
      
    }
  }
})
