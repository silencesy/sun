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
    }
  }
})
