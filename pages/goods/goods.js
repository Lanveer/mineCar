// pages/goods/goods.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosed: [],
    searchResult: [],
    chooseBox: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    // 从缓存中加载上次的货物
    var lastGoods = wx.getStorageSync('choosed');
     if(lastGoods!=''){
       that.setData({
         choosed: lastGoods
       })
     }
    var lastgoodsLength = lastGoods.length
    var chooseData = wx.getStorageSync('selectedResults');
    var storageLength = chooseData.length;
    var choosedLength = this.data.choosed.length;
    if (choosedLength == 0 && storageLength == 0 && lastgoodsLength == 0)  {
      this.setData({
        chooseBox: false
      })
    } else {
      if (chooseData==''){
        var data = lastGoods
      }else{
        var data = chooseData
      }
      this.setData({
        chooseBox: true,
        choosed: data
      });
      wx.setStorageSync('selectedResults', data);
      wx.setStorageSync('choosed', data)
    }

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

  },

  // 自定义函数开始
  search: function (e) {
    var that = this;
    var text = e.detail.value;
    wx.request({
      url: app.getMainServicePath() + "searchFreight/" + encodeURIComponent(text),
      data: { 
      },
      header: {
        "Content-Type": "text/plain"
      },
      method: "GET",
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          that.setData({
            searchResult: res.data
          })
        }
      },
      fail: function (err) {
        EasyToast.showMsgLong(err.errMsg);
      }
    })
  },
  // 去除重复
  hasSelected: function hasSelected(id) {
    for (var i = 0; i < this.data.choosed.length; i++) {
      if (this.data.choosed[i].id == id) {
        return true;
      }
    }
    return false;
  },

  //查找
  findSelectedIndex: function findSelectedIndex(id) {
    for (var i = 0; i < this.data.choosed.length; i++) {
      if (this.data.choosed[i].id == id) {
        return i;
      }
    }
    return -1;
  },

  delete: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var index = this.findSelectedIndex(id);
    if (index == -1) {
      return;
    }
    var temp = this.data.choosed;
    temp.splice(index, 1);
    that.setData({
      choosed: temp
    });
    wx.setStorageSync('selectedResults', temp)
    wx.setStorageSync('choosed', temp)
    if (temp.length==0 ||temp==''){
      that.setData({
        chooseBox:false
      })
    }
  },

  // 点击添加
  add: function (e) {
    var that = this;
    var flag = that.data.choosed.length;
    var id_name = e.currentTarget.id.split("-");
    var id = id_name[0];
    var name = id_name[1];
    var quoteIndex = name.indexOf("(");
    var shortName = name;
    if (quoteIndex != -1) {
      shortName = name.substring(0, quoteIndex);
    }
    var hasSelected = this.hasSelected(id);
    var temp = this.data.choosed || [];
    if (!hasSelected) {
      temp.unshift({ "id": id, "name": name, "shortName": shortName });
      console.log(temp)
      that.setData({
        choosed: temp,
        keyWords: '',
        chooseBox:true
      });
      wx.setStorageSync('selectedResults', temp)
    }
  },

  //确定按钮的点击
  onConfirm: function () {
    wx.navigateBack(1);
  }

})