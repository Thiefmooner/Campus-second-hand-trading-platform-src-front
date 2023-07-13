const app = getApp()

Page({
  data: {
    useTime: 0,
    surplusTime: 0,
    isSignIn: false,
    list: [
      { "name": "我的信息", "url": "/pages/my/info/index" },
      { "name": "我的订单", "url": "/pages/order/order-list/index" },
      { "name": "我的发布", "url": "/pages/goods/publish-mine/index" },
      { "name": "我的收藏", "url": "/pages/goods/goods-like/index" },
      { "name": "收货地址", "url": "/pages/address/address-list/index?fromType=my" }
    ]
  },

  onLoad() {

  },

  signIn: function(e){
    if(this.data.isSignIn){
      return;
    }
    var that = this;
    wx.request({
      url: app.globalData.domain + '/app/signin/signIn',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            isSignIn: true,
          })
        }
      }
    })
  },

  tabNav: function(e){
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  },

  onShow() {
    if (!app.globalData.token) {
      return;
    }

    this.getMember();
  },

  getMember: function () {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/member/info',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            member: res.data.member
          })
        }
      }
    })
  },

  getSignIn: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/app/signin/isSignIn',
      data: {
        token: app.globalData.token,
        storeId: app.globalData.storeId
      },
      success: function(res) {
        if(res.data.code == 0){
          that.setData({
            isSignIn: res.data.isSignIn
          })
        }
      }
    })
  },

  explain: function(){
    if(!app.globalData.token){
      wx.navigateTo({
        url: '/pages/auth/index',
      })
    }
    wx.navigateTo({
      url: '/pages/cms/article-info/index?columnCode=xyxz',
    })
  },

  mybag: function() {
    if (!app.globalData.token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
    }
    wx.navigateTo({
      url: '/pages/bms/order-list/index',
    })
  },

  deposit: function(){
    if (!app.globalData.token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
    }
    var hasDeposit = this.data.hasDeposit;
    wx.navigateTo({
      url: '/pages/bms/deposit-no/index',
    })
  },

  getMemberCard: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/app/membercard/get',
      data: {
        token: app.globalData.token,
        storeId: app.globalData.storeId
      },
      success: function(res) {
        if (res.data.memberCard) {
          that.setData({
            surplusTime: res.data.memberCard.cardTime
          });
        }
      }
    })
  },

  getOrderMoney: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/app/order/orderTotalMoney',
      data: {
        token: app.globalData.token,
        storeId: app.globalData.storeId
      },
      success: function(res) {
        if (res.data.totalMoney) {
          that.setData({
            useTime: res.data.totalMoney
          });
        } else {
          that.setData({
            useTime: 0
          });
        }
      }
    })
  },

  onShareAppMessage: function () {
    var path = '/pages/index/index';
    if (app.globalData.distributor) {
      path = path + "?distributor=" + app.globalData.distributor;
    }
    return {
      title: wx.getStorageSync('storeName'),
      path: path,
      imageUrl: app.globalData.domain + '/images/share-bill.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  
  login: function(){
    wx.navigateTo({
      url: '/pages/auth/index',
    })
  }

})