// pages/goodsshelf/index.js
var app = getApp()
Page({
  data: {
    goodsList: [],
    goodsNum: 0,
    totalAmount: 0,
    checkedGoodsIds: []
  },

  onLoad: function () { },

  onShow: function () {
    // 获取购物车数据
    var goodsList = wx.getStorageSync('shopCart');
    if (goodsList) {
      this.setData({
        goodsList: goodsList
      })
    }

  },

  goShop: function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  buy: function () {
    var goodsList = this.data.goodsList;
    var checkedGoodsList = this.getCheckedGoodses();
    if (checkedGoodsList.length == 0) {
      wx.showToast({
        title: '请选择需要购买的商品',
        icon: 'none'
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/order/order-confirm/index?goodsList=' + JSON.stringify(checkedGoodsList),
    })
  },

  getCheckedGoodses: function () {
    var checkedGoodsIds = this.data.checkedGoodsIds;
    var checkedGoodses = [];
    if (checkedGoodsIds.length == 0) {
      return checkedGoodses;
    }
    for (var i = 0; i < checkedGoodsIds.length; i++) {
      checkedGoodses.push(this.getGoodsById(checkedGoodsIds[i]));
    }
    return checkedGoodses;
  },

  getGoodsById: function (goodsId) {
    var goodsList = this.data.goodsList;
    for (var i = 0; i < goodsList.length; i++) {
      if (goodsId == goodsList[i].id) {
        return goodsList[i];
      }
    }
  },

  remove: function (e) {
    var index = e.currentTarget.dataset.index;
    var goodsList = this.data.goodsList;
    goodsList.splice(index, 1);
    this.setData({
      goodsList: goodsList
    })
    wx.setStorageSync("shopCart", goodsList);
  },

  getTotalAmount(ids) {
    var totalAmount = 0;
    for (var i = 0; i < ids.length; i++) {
      var goods = this.getGoodsById(ids[i]);
      totalAmount += goods.price * goods.num;
    }
    return totalAmount;
  },

  checkboxChange: function (e) {
    console.log(e)
	var totalAmount = this.getTotalAmount(e.detail.value);
    this.setData({
      checkedGoodsIds: e.detail.value,
      goodsNum: e.detail.value.length,
      totalAmount: totalAmount
    })
  }

})