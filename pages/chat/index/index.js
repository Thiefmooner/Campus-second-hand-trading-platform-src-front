// pages/message/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: null,
    messageHeight: null,
    adminId: null,
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          messageHeight: res.windowHeight - 42
        });
      }
    });

    var sessionId = options.sessionId;
    if (!sessionId){
      sessionId = new Date().getTime() + '';
    }

    that.setData({
      adminId: options.adminId,
      sessionId: sessionId,
    })
    this.loadMessage(options.adminId, options.sessionId)
  },

  loadMessage: function (adminId, sessionId) {
    var that = this;
    var token = app.globalData.token;
    wx.request({
      url: app.globalData.domain + '/api/chat/detail',
      data: {
        adminId: adminId,
        sessionId: sessionId,
        token: token
      },
      success: function(res) {
        that.setData({
          messageList: res.data.chatList
        })
      }
    })
  },

  sendMessage: function(e) {
    var that = this;
    var token = app.globalData.token;
    var content = e.detail.value.content;
    if (content.length == 0) {
      wx.showModal({
        title: '错误',
        content: '发送内容不能为空',
        showCancel: false
      })
      return;
    }
    wx.showLoading();
    that.setData({
      content: ''
    })
    var type = this.data.type;
    var msgType = 1;
    if (type == 'admin'){
      msgType == 2;
    }
    wx.request({
      url: app.globalData.domain + '/api/chat/add?type='+type,
      header: {token: token},
      data: {
        content: content,
        msgType: msgType,
        sessionId: that.data.sessionId,
        adminId: that.data.adminId
      },
      method: "POST",
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 0) {
          var messageList = that.data.messageList;
          messageList.push(res.data.chat);
          that.setData({
            messageList: messageList
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.uploadFile({
          url: app.globalData.domain + '/app/fileupload/upload',
          filePath: res.tempFilePaths[0],
          name: 'file',
          success: function(res) {
            var data = JSON.parse(res.data);
            if (data.code == 0) {
              wx.request({
                url: app.globalData.domain + '/app/message/add?token=' + app.globalData.token,
                data: {
                  cvId: that.data.cvId,
                  content: data.url,
                  msgType: 2,
                  jobId: that.data.jobId
                },
                method: "POST",
                success: function(res) {
                  if (res.data.code == 0) {
                    var messageList = that.data.messageList;
                    messageList.push(res.data.message);
                    that.setData({
                      messageList: messageList
                    })
                  }
                }
              })
            }
          },
          fail: function(res) {}
        })
      }
    })
  }
})