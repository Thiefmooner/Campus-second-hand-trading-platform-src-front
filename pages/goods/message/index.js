// pages/evaluation/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goodsId = options.id;
    var orderId = options.orderId;
    this.setData({
      goodsId: goodsId
    })
    if(orderId){
      this.setData({
        orderId: orderId
      })
      
    }
  },

  submitComment: function (e) {
    var content = e.detail.value.content;
    if (content == "") {
      wx.showToast({
        title: '请输入评论',
      })
      return;
    }
    var that = this;
    wx.showLoading();
    wx.request({
      url: app.globalData.domain + '/api/order/evaluation/save',
      header: {
        token: app.globalData.token
      },
      method: "POST",
      data: {
        goodsId: that.data.goodsId,
        content: content
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '评价成功',
          })
          wx.navigateBack({

          })
        }
      },
      complete: function (res) {
        wx.hideLoading();
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