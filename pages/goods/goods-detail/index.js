// pages/goods/goods-detail/index.js
const app = getApp()
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goods: {},
    goodsNum: 0,
    shopCart: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      id: options.goodsId
    })
    this.getGoods(options.goodsId);
    var bookList = wx.getStorageSync("shopCart");
    if (bookList) {
      this.setData({
        goodsNum: bookList.length
      })
    }
    this.isLike();
  },

  toChat(){
    var that = this;
    wx.navigateTo({
      url: '/pages/chat/index/index?adminId='+that.data.goods.member.id,
    })
  },

  getGoods: function (goodsId) {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/goods/detail',
      data: {
        id: goodsId
      },
      success: function (res) {
        that.setData({
          goods: res.data.goods,
        });
        that.getEvaluation(res.data.goods.id)
        WxParse.wxParse('article', 'html', res.data.goods.describe == null ? '' : res.data.goods.describe, that, 5);
      }
    })

  },

  getPhoneNumber: function (e) {
    console.log(e)
    var encryptedData = "";
    var iv = "";
    if (e.detail.encryptedData) {
      encryptedData = e.detail.encryptedData;
      iv = e.detail.iv;
    }
    wx.navigateTo({
      url: "/pages/order/appoint-add/index?id=" + e.currentTarget.dataset.id + "&encryptedData=" + encryptedData + "&iv=" + iv
    })
  },

  goShopCart: function(){
    wx.switchTab({
      url: '/pages/shop-cart/index',
    })
  },

  tapBuy: function(e){
    if (!app.globalData.token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      return;
    }
    if (this.data.goods.stock < 1) {
      wx.showToast({
        title: '库存不足',
      })
      return;
    }
    var goodsList = [{
      id: this.data.goods.id,
      goodsName: this.data.goods.goodsName,
      picUrl: this.data.goods.picUrl,
      num: 1,
      author: this.data.goods.author,
      price: this.data.goods.price
    }];
    wx.navigateTo({
      url: '/pages/order/order-confirm/index?goodsList=' + JSON.stringify(goodsList),
    })
  },

  tapAddShopCart: function (e) {
    // 加入购物车
    var goodsList = wx.getStorageSync("shopCart");
    var goods = this.data.goods;
    var num = 1;
    if (goodsList) {
      var isExist = false;
      for (var i = 0; i < goodsList.length; i++) {
        if (goodsList[i].id == goods.id) {
          isExist = true;
          goodsList[i].num += 1;
          break;
        }
      }
      if (!isExist) {
        var temp = {
          id: goods.id,
          goodsName: goods.goodsName,
          picUrl: goods.picUrl,
          price: goods.price,
          num: num
        }
        goodsList.push(temp);
      }
    } else {
      goodsList = [{
        id: goods.id,
        goodsName: goods.goodsName,
        picUrl: goods.picUrl,
        price: goods.price,
        num: 1,
        author: goods.author
      }];
    }
    wx.setStorageSync("shopCart", goodsList);
    wx.showToast({
      title: '加入购物车成功',
      icon: 'none'
    })

    this.setData({
      goodsNum: goodsList.length
    })
  },

  telPhone(){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.goods.member.mobile,
    })
  },

  toMsg(){
    var that = this;
    wx.navigateTo({
      url: '/pages/goods/message/index?id=' + that.data.goods.id,
    })
  },

  getEvaluation: function (goodsId) {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/order/evaluation/list',
      data: {
        goodsId: goodsId
      },
      success: function (res) {
        that.setData({
          evaluations: res.data.evaluations
        })
      }
    })
  },

  isLike: function(){
    var that = this
    wx.getStorage({
      key: 'favorite',
      success: function (res) {
        var favorite = res.data
          for (var i = 0; i < favorite.length; i++) {
            if (favorite[i].id == that.data.id) {
              that.setData({
                isGoodsFavorite: true
              })
            }
          }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  like: function () {
    var that = this
    // 判断原来是否收藏，是则删除，否则添加
    wx.getStorage({
      key: 'favorite',
      success: function (res) {
        var favorite = res.data
        if (that.data.isGoodsFavorite) {
          // 删除
          for (var i = 0; i < favorite.length; i++) {
            if (favorite[i].id == that.data.goods.id) {
              favorite.splice(i, 1)
              that.setData({
                isGoodsFavorite: false
              })
            }
          }
          wx.setStorage({
            key: 'favorite',
            data: favorite,
            success: function (res) {
              console.log(res)
              console.log('----设置成功----')
            }
          })
        } else {
          // 添加
          favorite.push(that.data.goods)
          wx.setStorage({
            key: 'favorite',
            data: favorite,
            success: function (res) {
              that.setData({
                isGoodsFavorite: true
              })
            }
          })
        }
      },
      fail: function (res) {
        console.log(res)
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