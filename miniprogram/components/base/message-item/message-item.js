// components/base/massage-item/message-item.js
Component({
  /**
   * 组件的属性列表
   */
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
    goArticle({ currentTarget }) {
      wx.navigateTo({
        url: '../../pages/articleDetails/articleDetails?id=' + currentTarget.dataset.id
      })
    }
  }
})
