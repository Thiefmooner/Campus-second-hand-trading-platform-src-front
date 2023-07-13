// pages/confirm-order/index.js
const app = getApp();
var WxPay = require('../../../utils/pay.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    distribution: [{
        name: '0',
        value: '自取',
        checked: 'true'
      },
      {
        name: '1',
        value: '邮寄'
      }
    ],
    distributionIndex: 0,
    totalAmount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var goodsList = JSON.parse(options.goodsList);
    console.log(goodsList)
    var totalAmount = 0;
    for (var i = 0; i < goodsList.length; i++) {
      totalAmount += goodsList[i].price;
    }

    this.setData({
      goodsList: goodsList,
      totalAmount: totalAmount
    })
  },

  getLendplan: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/app/lendplan/info',
      data: {
        storeId: app.globalData.storeId
      },
      success: function(res) {
        that.setData({
          lendPlan: res.data.lendPlan
        });
      }
    })
  },

  getDeposit: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/app/deposit/get',
      data: {
        storeId: app.globalData.storeId
      },
      success: function(res) {
        that.setData({
          freight: res.data.deposit.freight
        });
      }
    })
  },

  distributionChange: function(e) {
    var totalAmount = this.data.totalAmount;
    var freight = 0;
    if (e.detail.value == 1){
      totalAmount = (parseFloat(totalAmount) + freight).toFixed(2);
    }else{
      totalAmount = (parseFloat(totalAmount) - freight).toFixed(2);
    }
    this.setData({
      distributionIndex: e.detail.value,
      totalAmount: totalAmount
    })
  },

  selectAddress: function(e) {
    wx.navigateTo({
      url: '/pages/address/address-list/index?fromType=order',
    })
    return;
    var that = this;
    wx.chooseAddress({
      success: function(res) {
        console.log(res)

        if (res.errMsg == 'chooseAddress:ok') {
          var orderShipment = {
            contacts: res.userName,
            mobile: res.telNumber,
            provinceName: res.provinceName,
            cityName: res.cityName,
            districtName: res.countyName,
            address: res.detailInfo
          }
          that.setData({
            orderShipment: orderShipment
          })
        }

      }
    })
  },

  getContent: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/app/cms/content',
      data: {
        type: 3
      },
      success: function(res) {
        if (res.data.code == 0) {
          that.setData({
            content: res.data.content
          })
        }
      }
    })
  },

  getGoods: function(id) {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/app/goods/detail',
      data: {
        id: id
      },
      success: function(res) {
        that.setData({
          goods: res.data.goods,
        });
      }
    })
  },

  confirmOrder: function(e) {
    console.log(e);
    var remark = e.detail.value.remark;
    var that = this;
    var loginToken = app.globalData.token // 用户登录 token
    var orderStatus = 1;
    if (this.data.distributionIndex == 1) { //快递
      if (!this.data.orderShipment) {
        wx.showToast({
          title: '请选择收货地址',
        })
        return;
      }
      orderStatus = 0;
    }

    var orderGoodsList = [];
    var goodsList = this.data.goodsList;
    for (var i = 0; i < goodsList.length; i++) {
      var ordergoods = {
        goodsId: goodsList[i].id,
        goodsName: goodsList[i].goodsName,
        picUrl: goodsList[i].picUrl,
        author: goodsList[i].author,
        price: goodsList[i].price,
        num: 1
      };
      orderGoodsList.push(ordergoods)
    }
    
    var order = {
      orderGoodsList: orderGoodsList,
      storeId: app.globalData.storeId,
      orderStatus: orderStatus,
      formId: e.detail.formId,
      orderShipment: that.data.orderShipment,
      distributionType: that.data.distribution[that.data.distributionIndex].name,
      totalAmount: that.data.totalAmount,
      orderType: 1,
      remark: remark
    };
    wx.showLoading({})

    wx.request({
      url: app.globalData.domain + '/api/order/create',
      method: 'POST',
      header: {
        token: loginToken
      },
      data: order,
      success: (res) => {
        if (res.data.code != 0) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function(e) {

            }
          })
          return;
        }
        //模拟支付
        wx.navigateTo({
          url: '/pages/order/order-pay/index?id=' + res.data.id,
        })

        return;
        if (this.data.distributionIndex == 1) {
          WxPay.wxpay(app, res.data.totalAmount, res.data.orderNum, '商品购买', function(code) {
            // 下单成功，跳转到订单管理界面
            if (code == 0) {
              wx.navigateTo({
                url: "/pages/shop/order/order-list/index"
              });
            }
          });
        } else {
          wx.navigateTo({
            url: "/pages/shop/order/order-list/index"
          });
        }

      },
      complete: function(res) {
        wx.hideLoading();
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

  }
})