// pages/mycar/mycar.js

var app = getApp();
import MyToast from '../../utils/toast.js';
import validator from 'validate';
import DB from '../../databank'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carNum: ['选择车轴数','2', '3', '4', '5', '6'],
    carNumIdx: 0,
    carType: ['选择车辆样式', '开放式', '密封式', '帆布包裹式'],
    carTypeIdx: 0,
    verCodeCountdown: 0,
    verCode: '',
    obtainVerCodeBtnVisibale: true,
    truck: '',
    alxeIndex: 0,
    crateIndex: 0,
    truck: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var truck = DB.get(DB.keys.defaultTruck);
    console.log(truck);
    var that = this;
    that.setData({
      truck: truck
    })

  },
  getObtainVerCodeBtnVisibale: function (pboneNumber, verCodeCountdown) {
    pboneNumber == null && (pboneNumber = this.data.truck.ownerPhone);
    verCodeCountdown == null && (verCodeCountdown = this.data.verCodeCountdown);
    return pboneNumber.length == 11 && verCodeCountdown == 0;
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

  // 车牌输入
  onPlateNumberInput: function (e) {
    var that=this;
    var pn = e.detail.value;
    pn = pn.replace(/ /g, '');
    pn = pn.toUpperCase();
    that.setData({
      'truck.plateNumber': pn,
    });
  },

  // 车轴数量
  carNum: function (e) {
    var idx = e.detail.value * 1;
    var axleCount = this.data.carNum[idx];
    console.log(axleCount)
    this.setData({
      carNumIdx: e.detail.value,
      'truck.axleCount': axleCount,
    });
  },
  // 货箱类型
  carType: function (e) {
    var idx = e.detail.value;
    var crateType = this.data.carType[idx];
    this.setData({
      carTypeIdx: e.detail.value,
      // 'truck.crateType': crateType,
      'truck.crateType': idx,
    })
  },
  // 获取整备质量
  allWeight: function (e) {
    var allWeight = e.detail.value;
    this.setData({
      'truck.allWeight': allWeight,
    })
  },

  // 获取总质量

  goodsWeight: function (e) {
    var goodsWeight = e.detail.value;
    this.setData({
      'truck.goodsWeight': goodsWeight,
    })
  },

  // 获取载质量

  limitWeight: function (e) {
    var limitWeight = e.detail.value;
    this.setData({
      'truck.limitWeight': limitWeight,
    })
  },

  // 获取车主姓名
  carOwner: function (e) {
    this.setData({
      'truck.ownerName': e.detail.value,
    });
  },

  // 获取电话
  carTel: function (e) {
    var tel = e.detail.value;
    if (tel.length > 11) {
      tel = tel.substring(0, 11);
    }
    this.setData({
      'truck.ownerPhone': tel,
      obtainVerCodeBtnVisibale: this.getObtainVerCodeBtnVisibale(tel),
    });
  },

  // 填写验证码
  onVerCodeInput: function (e) {
    this.setData({
      verCode: e.detail.value,
    });
  },



  // 获取验证码开始
  getCode: function (e) {

// 验证信息
    var that = this
    console.log(that.data.truck)
    var check = validator.doValidate(this.data.truck);
    if (check != null) {
      MyToast.showMsgShort(check, 2);
      return;
    }
// 验证信息
    var tel = that.data.truck.ownerPhone;

console.log(tel)
    if (tel==undefined) {
      wx.showModal({
        title: '提示',
        content: '请先填写电话号码',
      })
      return
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    });
    wx.request({
      url: app.getMainServicePath() + 'r/' + tel + '/u',
      success: function (msg) {
        console.log(msg)
        if (msg.statusCode && msg.statusCode != 200) {
          MyToast.showMsgShort(msg.data.msg, 2)
        } else {
          wx.hideLoading();
          countdownVerCode.apply(that);
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '获取失败验证码，请重试',
          showCancel: false
        })
      }
    })

    //倒计时获取验证码
    function countdownVerCode() {
      let that = this;
      this.verCodeCountdownTimer = setInterval(function () {
        var cd = --that.data.verCodeCountdown;
        if (cd == 0) {
          clearInterval(that.verCodeCountdownTimer);
          that.verCodeCountdownTimer = -1;
        }
        that.setData({
          verCodeCountdown: cd,
          obtainVerCodeBtnVisibale: that.getObtainVerCodeBtnVisibale(null, cd)
        });
      }, 1000);
      this.setData({
        verCodeCountdown: 60,
        obtainVerCodeBtnVisibale: false
      });
    }
  },

  // 取消按钮点击
  onCancel: function (e) {
    wx.navigateBack(1);
  },

  // 确认按钮点击
  onConfirm: function (e) {
    var that =this
    console.log(that.data.truck)
    var check = validator.doValidate(this.data.truck);
    if (check != null) {
      MyToast.showMsgShort(check, 2);
      return;
    }

    if (that.data.verCode.length < 6) {
      MyToast.showMsgShort('请输入6位验证码', 2);
      return;
    }
    // 获取code
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    });
    wx.login({
      success: function (res) {
        var code = res.code;
        var verCode = that.data.verCode;
        wx.request({
          url: app.getMainServicePath() + 'truck/infomaintenance?verCode=' + verCode + '&code=' + code,
          data: that.data.truck,
          method: 'post',
          success: function (msg) {
            console.log(msg)
            if (msg.statusCode!= 200) {
              wx.showModal({
                title: '提示',
                content: '验证码错误',
              })
            } else {
              MyToast.showMsgShort('注册成功！', 0)
              //请求成功回调函
              var truckData = msg.data;
              wx.setStorageSync('truckData', truckData);
              DB.set(DB.keys.defaultTruck, truckData);
              wx.redirectTo({
                url: '../index/index',
              })
            }
          },
          fail: function (err) {
           wx.showModal({
             title: '提示',
             content: '注册失败！',
             showCancel:false
           })
          },
          complete: function () {
            wx.hideLoading();
          }
        })
      },
      error: function (err) {
        wx.showModal({
          title: '提示',
          content: '获取用户code失败！',
          showCancel:false
        })
      }
    })


  }

})