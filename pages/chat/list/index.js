// pages/message-list/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: null,
    type: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMessage();
  },

  getMessage: function(){
    var that = this;
    var token = app.globalData.token;
    wx.request({
      url: app.globalData.domain + '/api/chat/list',
      data: { token: token },
      success: function (res) {
        that.setData({
          messageList: res.data.chatList
        })
      }
    })
  },

  detail: function(e){
    var cvId = e.currentTarget.dataset.id;
    var adminId = e.currentTarget.dataset.adminid;
    var userId = e.currentTarget.dataset.userid;
    var sessionId = e.currentTarget.dataset.sessionid;
    var type = this.data.type;
    wx.navigateTo({
      url: '/pages/message/index?adminId=' + adminId + "&sessionId=" + sessionId + "&userId=" + userId,
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