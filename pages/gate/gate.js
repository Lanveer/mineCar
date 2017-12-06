// pages/gate/gate.js
var app = getApp();
import MyToast from '../../utils/toast.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pl: '',
    searchResult: [],
    selectedEntry: {},
    selectedExit: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 从缓存获取之前输入的信息
    var enterData = wx.getStorageSync('enterData');
    var exitData = wx.getStorageSync('exitData');
    if (enterData != '') {
      that.setData({
        name: enterData.name
      })
    } else {
      that.setData({
        name: ''
      })
    }

    if (exitData != '') {
      that.setData({
        name2: exitData.name
      })
    } else {
      that.setData({
        name2: ''
      })
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

  // 自定义函数
  search: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    that.setData({
      flag: flag
    })
    console.log(flag)
    var text = e.detail.value;
    if (text.replace(" ", "") == '') {
      return;
    }
    if (flag == 'enter') {
      wx.request({
        url: app.getMainServicePath() + "searchTollgate/" + encodeURIComponent(text) + '/' + 0,
        data: {},
        header: {
          "Content-Type": "text/plain"
        },
        method: 'get',
        success: function (res) {
          if (res.statusCode && res.statusCode == 200) {
            that.setData({
              searchResult: res.data
            })
          }

        },
        fail: function (err) {
          MyToast.showMsgLong(err.errMsg)
        }

      })
    } else if (flag == 'exit') {
      wx.request({
        url: app.getMainServicePath() + "searchTollgate/" + encodeURIComponent(text) + '/' + 1,
        data: {},
        header: { 
          "Content-Type": "text/plain"
        },
        method: 'get',
        success: function (res) {
          if (res.statusCode && res.statusCode == 200) {
            that.setData({
              searchResult: res.data
            })
          }
        },
        fail: function (err) {
          MyToast.showMsgLong(err.errMsg)
        }

      })
    }
  },
  itemClick: function (e) {
    var that = this;
    var id_name = e.currentTarget.id.split("-");
    var id = id_name[0];
    var name = id_name[1];
    var quoteIndex = name.indexOf("(");
    var shortName = name;
    var flag = that.data.flag;
    if (quoteIndex != -1) {
      shortName = name.substring(0, quoteIndex);
    }
    var speratorIndex = shortName.lastIndexOf(">");
    if (speratorIndex != -1) {
      shortName = name.substring(speratorIndex + 1);
    }
    if (flag == 'enter') {
      that.setData({
        selectedEntry: { 'id': id, 'name': name, 'shortName': shortName },
        searchResult: [],
        name:shortName
      });
      var enterData = {
        'id': id, 'name': name, 'shortName': shortName
      }

      console.log(enterData);
      wx.setStorageSync('enterData', enterData)


    } else if (flag == 'exit') {
      that.setData({
        selectedExit: { 'id': id, 'name': name, 'shortName': shortName },
        searchResult: [],
        name2: shortName
      });

      var exitData = {
        'id': id, 'name': name, 'shortName': shortName
      }
      wx.setStorageSync('exitData', exitData)
    }
    if (that.data.selectedExit.id != null) {
      wx.navigateBack(1);
    }
  }
})