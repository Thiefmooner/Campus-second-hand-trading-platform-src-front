// pages/goods-list/index.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    categoryId: -1
  },

  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.categoryId) {
      this.setData({
        categoryId: options.categoryId
      })
    }
    this.getGoodsList();
  },

  getGoodsList: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/goods/mine',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        that.setData({
          goodsList: res.data.goodsList
        });
      }
    })
  },


  delGoods: function(e){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/goods/delete',
      data: {
        token: app.globalData.token,
        id: e.currentTarget.dataset.id
      },
      success: function (res) {
        that.getGoodsList();
      }
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
  onShareAppMessage: function () {

  }
})