// pages/address/address-add/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    provinceName: '',
    cityName: '',
    districtName: '',
    cityChange: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    if(id){
      this.getAddress(id)
      this.setData({
        id: id
      })
    }
  },

  getAddress(id){
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/memberaddress/detail',
      data: {
        token: app.globalData.token,
        id: id
      },
      success: function (res) {
        that.setData({
          address: res.data.memberAddress,
          cityName: res.data.memberAddress.cityName,
          provinceName: res.data.memberAddress.provinceName,
          districtName: res.data.memberAddress.districtName
        });
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

  cityChange: function(e){
    console.log(e.detail.value)
    this.setData({
      provinceName: e.detail.value[0],
      cityName: e.detail.value[1],
      districtName: e.detail.value[2]
    })
  },

  openMap: function (e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        var addressData = that.data.addressData;
        addressData.address = res.address;
        addressData.addressName = res.name;
        addressData.latitude = res.latitude;
        addressData.longitude = res.longitude;
        that.setData({
          addressData: addressData
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.domain + '/api/memberaddress/delete',
            data: {
              token: app.globalData.token,
              id: id
            },
            success: (res) => {
              wx.navigateBack({})
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  bindSave: function (e) {
    var that = this;
    var contacts = e.detail.value.contacts;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;

    if (contacts == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
    var action = "add";
    var apiAddid = that.data.id;
    if (apiAddid) {
      action = "update";
    } else {
      apiAddid = 0;
    }
    wx.request({
      url: app.globalData.domain + '/api/memberaddress/' + action,
      method: 'POST',
      header: {
        token: app.globalData.token
      },
      data: {
        id: apiAddid,
        provinceName: that.data.provinceName,
        cityName: that.data.cityName,
        districtName: that.data.districtName,
        contacts: contacts,
        address: address,
        mobile: mobile,
        zipcode: code,
        dft: 1
      },
      success: function (res) {
        if (res.data.code != 0) {
          // 登录错误 
          wx.hideLoading();
          wx.showModal({
            title: '失败',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        // 跳转到结算页面
        wx.navigateBack({})
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

  }
})