// pages/address/address-list/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: null,
    fromType: ""
  },

  radioChange: function(e){
    console.log(e)
  },

  tabAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    if (that.data.fromType == "order") {

      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面

      var index = e.currentTarget.dataset.index;
      var address = this.data.addressList[index]

      var orderShipment = {
        contacts: address.contacts,
        mobile: address.mobile,
        provinceName: address.provinceName,
        cityName: address.cityName,
        districtName: address.districtName,
        address: address.address
      }
      prevPage.setData({
        orderShipment: orderShipment
      })
      wx.navigateBack()

      return
      wx.request({
        url: app.globalData.domain + '/api/memberaddress/setDft',
        data: {
          token: app.globalData.token,
          id: id
        },
        success: (res) => {
          wx.navigateBack()
        }
      })
    } else if (that.data.fromType == "my") {
      wx.navigateTo({
        url: '/pages/address/address-add/index?id=' + id
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fromType: options.fromType
    });
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
    this.getAddress();
  },

  getAddress: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/memberaddress/list',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        that.setData({
          addressList: res.data.memberAddressList
        });
      }
    })
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

  },

  tabAddressAdd: function () {
    wx.navigateTo({
      url: '/pages/address/address-add/index',
    })
  }
})