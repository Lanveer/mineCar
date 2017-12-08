// pages/index/index.js
var app = getApp();
import api from '../../api';
import DB from '../../databank';
import MyToast from '../../utils/toast.js'
// import Waybill from 'Waybill';
var picTime = require('date.js');
var picUpload = require('uploadPic.js');
Page({
  data: {
    freshFlag: false,
    imgDelFlag: false,
    onShowFlag: false,
    infoFlag: '',
    tt: 2,
    carflag: '',
    choosedFlag: true,
    choosed: '',
    enterData: '',
    exitData: '',
    tempFilePaths: '',
    truck: null,
    // 行驶证
    cardPic: {
      text: '行驶证',
      label: '选拍',
      img: '',
      flag: false,
      latitude: 0,
      longitude: 0,
      time: '',
    },

    // 车头照片
    carHeaderPic: {
      text: '车头照',
      label: '必拍',
      img: '',
      flag: false,
      latitude: 0,
      longitude: 0,
      time: ''
    },
    //装货前
    carBeforePic: {
      text: '装货前',
      label: '必拍',
      img: '',
      flag: false,
      latitude: 0,
      longitude: 0,
      time: ''
    },
    // 装完货
    carAfterPic: {
      text: '完成装货',
      label: '必拍',
      img: '',
      flag: false,
      latitude: 0,
      longitude: 0,
      time: ''
    },
    zhuanghuo: [
      {
        text: '装货照1',
        label: '必拍',
        id: 4,
        img: '',
        flag: false,
        latitude: 0,
        longitude: 0,
        time: ''
      },
      {
        text: '装货照2',
        label: '必拍',
        id: 4,
        img: '',
        flag: false,
        latitude: 0,
        longitude: 0,
        time: ''
      }
    ],

    //检测微信基础库，低版本时提示用户升级后使用弹出框
    dialog_lowSdkVersion: {
      visible: false,
      titles: ['微信版本过低'],
      tips: [{ value: '请将微信升级至最新版本', style: 'text-align:center' }],
      tipsLines: 2,
      buttons: [{ value: '知道了,马上去升级', style: 'color: #3CC51F;' }],
      horizontalButtons: false,
      buttonTapHandler: 'lowSdkVersionDialogButtonTapHandler',
    },
    //服务协议弹出框
    dialog_serviceAgreement: {
      visible: false,
      titles: ['用户协议'],
      tips: [],
      tipsLines: 14,
      buttons: [{ value: '知道了', style: 'color: #3CC51F;' }],
      horizontalButtons: true,
      buttonTapHandler: 'serviceAgreementDialogButtonTapHandler',
    },
    //识别用户或加载您的数据失败弹出框
    dialog_loadUserDataFail: {
      visible: false,
      titles: ['提示'],
      tips: [{ value: '识别用户或加载您的数据失败', style: 'text-align:center' }],
      tipsLines: 1,
      buttons: ['重试'],
      horizontalButtons: true,
      buttonTapHandler: 'loadUserDataFailDialogButtonTapHandler',
    },


    //拍照要求弹出框
    dialog_takePhoto: {
      visible: false,
      titles: ['拍照要求'],
      icon: {
        src: 'truck_head.png',
        width: 228,
        height: 255
      },
      buttons: [{
        value: '知道了',
        style: 'color: #3CC51F;'
      }],
      horizontalButtons: true,
      buttonTapHandler: 'takePhotoDialogButtonTapHandler',
    },

    //  报送成功的弹窗
    dialog_reportScuuess: {
      visible: false,
      titles: ['运输'],
      icon: {
        src: '../../images/success.png'
      },
      tips: ['·该运单结束前您无法报送新运单', '·到站后，请向收费员主动说明是', {
        value: '电子运单',
        style: "margin-left: 14px;"
      }, ''],
      tipsLines: 4,
      buttons: [{
        value: '终止本次运输',
        noSeparate: true,
        style: "color: #fc3f3f; font-size: 12px;",
      }, '退出绿通车小程序'],
      buttonTapHandler: 'reportScuuessDialogButtonTapHandler',
    },

    //放弃运单弹出框
    dialog_cancelReportWaybill: {
      visible: false,
      titles: ['要放弃？'],
      tips: ['即将放弃当前数据', '是否需要放弃'],
      tipsLines: 2,
      buttons: [{
        value: '是',
        noSeparate: true,
        style: "color: #fc3f3f;",
      }, '否'],
      horizontalButtons: true,
      buttonTapHandler: 'cancelReportWaybillDialogButtonTapHandler',
    },

    //终止运单弹出框
    dialog_cancelWaybill: {
      visible: false,
      titles: ['请谨慎操作'],
      icon: { src: '../../images/warning.png' },
      tips: ['您即将废弃本次电子运单，废弃后车辆到站无法享受快速放行，需要', '进行人工查验'],
      tipsLines: 3,
      buttons: [{
        value: '终止运输',
        noSeparate: true,
        style: "color: #fc3f3f;",
      }, '取消'],
      horizontalButtons: true,
      buttonTapHandler: 'cancelWaybillDialogButtonTapHandler',
    },
  },
  // 微信低版本检测
  isLowSdkVersion: wx.getSystemInfoSync().SDKVersion < '1.1.1',
  onLoad: function (options) {
    var that = this;

    // 获取网络状态
    wx.getNetworkType({
      success: function (res) {
        var networkType = res.networkType;
        console.log(networkType);
        that.setData({
          networkType: networkType
        })
        if (networkType == '2g') {
          wx.showModal({
            title: '提示',
            content: '您现在网络不通畅，请稍后再试或开启飞行模式，再关闭飞行模式后重试',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.showLoading({
                  title: '加载中',
                })
                wx.redirectTo({
                  url: 'index',
                })
              }
            }
          })
        } else {
          wx.hideLoading();
        }
        wx.hideLoading()
      }
    })
    // 获取是否需要清除照片信息
    var clearFlag = wx.getStorageSync('clearFlag');
    if (clearFlag == true) {
      console.log('here');
      wx.removeStorageSync('carHeaderPic');
      wx.removeStorageSync('carBeforePic');
      wx.removeStorageSync('carAfterPic');
      wx.removeStorageSync('car_b');
      wx.removeStorageSync('car_c');
      wx.removeStorageSync('car_d');
      wx.removeStorageSync('car_e');
      wx.removeStorageSync('car_f');
      wx.removeStorageSync('car_g');
      wx.removeStorageSync('car_h');
      wx.removeStorageSync('car_i');
      wx.removeStorageSync('car_j');
      wx.removeStorageSync('zhuanghuo');
      var zh = [
        {
          text: '装货照1',
          label: '必拍',
          id: 4,
          img: '',
          flag: false,
          latitude: 0,
          longitude: 0,
          time: ''
        },
        {
          text: '装货照2',
          label: '必拍',
          id: 4,
          img: '',
          flag: false,
          latitude: 0,
          longitude: 0,
          time: ''
        }
      ]
      that.setData({
        'carHeaderPic.flag': false,
        'carBeforePic.flag': false,
        'carAfterPic.flag': false,
        zhuanghuo: zh
      })

    } else {
      console.log('no')
    }

    // 获取waybill id
    var waybillId = that.createWayBillId();
    that.setData({
      waybillId: waybillId
    })
    //从缓存获取图片信息
    var cardPic = wx.getStorageSync('cardPic');
    if (cardPic == '') {
      //在这里处理没有行驶证照片的情况
    } else {
      that.setData({
        'cardPic.img': cardPic.img,
        'cardPic.flag': true,
        'cardPic.latitude': cardPic.latitude,
        'cardPic.longitude': cardPic.longitude,
        'cardPic.time': cardPic.time
      })
    }
    // 获取车头照片
    var carHeaderPic = wx.getStorageSync('carHeaderPic');
    if (carHeaderPic == '') {
      //在这里处理没有车头照片的情况
    } else {
      that.setData({
        'carHeaderPic.img': carHeaderPic.img,
        'carHeaderPic.flag': true,
        'carHeaderPic.latitude': carHeaderPic.latitude,
        'carHeaderPic.longitude': carHeaderPic.longitude,
        'carHeaderPic.time': carHeaderPic.time
      })
    }
    // 获取装货前照片
    var carBeforePic = wx.getStorageSync('carBeforePic');
    if (carBeforePic == '') {

    } else {
      that.setData({
        'carBeforePic.img': carBeforePic.img,
        'carBeforePic.flag': true,
        'carBeforePic.latitude': carBeforePic.latitude,
        'carBeforePic.longitude': carBeforePic.longitude,
        'carBeforePic.time': carBeforePic.time
      })
    }

    // 获取装完货前照片
    var carAfterPic = wx.getStorageSync('carAfterPic');
    if (carAfterPic == '') {

    } else {
      that.setData({
        'carAfterPic.img': carAfterPic.img,
        'carAfterPic.flag': true,
        'carAfterPic.latitude': carAfterPic.latitude,
        'carAfterPic.longitude': carAfterPic.longitude,
        'carAfterPic.time': carAfterPic.time
      })
    }

    // 获取装货照
    var zhuanghuo = wx.getStorageSync('zhuanghuo');
    if (zhuanghuo !== '') {
      for (var i = 0; i < zhuanghuo.length; i++) {
        var time = zhuanghuo[i].time;
        var latitude = zhuanghuo[i].latitude;
        var longitude = zhuanghuo[i].longitude;
        var img = zhuanghuo[i].img;
        var flag = zhuanghuo[i].flag;
        var text = zhuanghuo[i].text;
        var label = zhuanghuo[i].label;

        var time1 = 'zhuanghuo[' + i + '].time';
        var latitude1 = 'zhuanghuo[' + i + '].latitude';
        var longitude1 = 'zhuanghuo[' + i + '].longitude';
        var img1 = 'zhuanghuo[' + i + '].img';
        var flag1 = 'zhuanghuo[' + i + '].flag';
        var text1 = 'zhuanghuo[' + i + '].text';
        var label1 = 'zhuanghuo[' + i + '].label';
        var id1 = 'zhuanghuo[' + i + '].id';
        that.setData({
          [time1]: time,
          [latitude1]: latitude,
          [longitude1]: longitude,
          [img1]: img,
          [flag1]: true,
          [id1]: 4,
          [text1]: text,
          [label1]: label
        });
      }

    } else {

    }

    // 获取微信版本信息的提示框

    if (this.isLowSdkVersion) {
      this.setData({
        'dialog_lowSdkVersion.visible': true,
      });
      return;
    }


    //获取上一次信息以及现在的状态
    this.identifyAndLoadUserData();
    // 获取到协议
    // api.getLastServiceAgreement()
    //   .then(function (res) {
    //     if (res.status == 0) {
    //       that.setData({
    //         'dialog_serviceAgreement.version': res.version,
    //         'dialog_serviceAgreement.tips': res.contents,
    //         'dialog_serviceAgreement.visible': true,
    //       });
    //     }
    //   });

    that.setData({
      choosed: 'hello'
    })

  },


  // obload 结束

  // 获取用户信息
  identifyAndLoadUserData() {
    var that = this;
    let driverId = DB.get(DB.keys.driverId);
    console.log('司机id', driverId)
    if (driverId == null) {
      wx.showLoading({
        title: '请稍候...',
        mask: true,
      });
      api.identifyUser()
        .then(function (res) {
          if (res.driverId.length > 0) {
            DB.set(DB.keys.driverId, res.driverId);
            that.loadData();
            api.uploadSystemInfo();
          } else {
            console.log("系统中未查询到该用户信息");
          }
          wx.hideLoading();
        }, function (res) {
          wx.hideLoading();
          that.setData({
            'dialog_loadUserDataFail.visible': true,
          });
        });
    } else {
      this.loadData();
      api.uploadSystemInfo();
    }
  },
  // 加载数据
  loadData: function () {
    let that = this;
    let driverId = DB.get(DB.keys.driverId);
    api.getDefaultTruckOfDriver(driverId)
      .then(function (truck) {
        console.log('返回的车辆数据：', truck)
        DB.set(DB.keys.defaultTruck, truck);
        var host = getApp().getMainPicturePath();
        if (truck.photos.length != 0) {
          var l_imgs = host + truck.photos[0].path;
        }
        console.log(l_imgs)
        that.setData({
          truck: truck,
          'cardPic.img': l_imgs,
        });
        that.loadLastWaybill();
      });
  },
  // 查询上次运单
  loadLastWaybill: function (e) {
    var that = this;
    that.setData({
      imgDelFlag: false
    })
    var truck = DB.get(DB.keys.defaultTruck);
    if (truck != null) {
      api.getLastWaybillOfTruck(truck.id)
        .then(function (waybill) {
          console.log('上次运单：', waybill);
          if (waybill != "") {
            if (waybill.state == '1') {
              that.data.lastWaybillId = waybill.id;
              wx.setStorageSync('lastWaybillId', waybill.id)
              that.setData({
                'dialog_reportScuuess.visible': true,
                'dialog_reportScuuess.tips[3]': { value: '·运单号:' + waybill.id },
                infoFlag: false
              })
            } else if (waybill.state == '2') {
              wx.setStorageSync('clearFlag', true)
              var host = getApp().getMainPicturePath();
              var imgPath = waybill.loadPlaces["0"].loadPhotos[0].path;
              var license = host + waybill.loadPlaces["0"].loadPhotos[0].path;

              var l_imgs = that.data.cardPic.img;
              that.setData({
                infoFlag: true,
                'cardPic.img': l_imgs,
                'cardPic.flag': true,
                'cardPic.imgPath': imgPath,
                'dialog_reportScuuess.visible': false,
              });
              // clear the photo
              wx.removeStorageSync('carHeaderPic');
              wx.removeStorageSync('carBeforePic');
              wx.removeStorageSync('carAfterPic');
              wx.removeStorageSync('car_b');
              wx.removeStorageSync('car_c');
              wx.removeStorageSync('car_d');
              wx.removeStorageSync('car_e');
              wx.removeStorageSync('car_f');
              wx.removeStorageSync('car_g');
              wx.removeStorageSync('car_h');
              wx.removeStorageSync('car_i');
              wx.removeStorageSync('car_j');
              wx.removeStorageSync('zhuanghuo');
              var zh = [
                {
                  text: '装货照1',
                  label: '必拍',
                  id: 4,
                  img: '',
                  flag: false,
                  latitude: 0,
                  longitude: 0,
                  time: ''
                },
                {
                  text: '装货照2',
                  label: '必拍',
                  id: 4,
                  img: '',
                  flag: false,
                  latitude: 0,
                  longitude: 0,
                  time: ''
                }
              ]
              that.setData({
                'carHeaderPic.flag': false,
                'carBeforePic.flag': false,
                'carAfterPic.flag': false,
                zhuanghuo: zh
              })
              that.autoFillWaybill(waybill);
              // clear the photo
            }
          } else {
            that.setData({
              infoFlag: false
            })
          }

          that.setData({
            'dialog_queryLastWaybillFail.visible': false,
          });
          that.loadingLastWaybill = false;
        })
    } else {
      // 新用户,这里的truck为null，默认为不处理
    }

  },
  // 自动补全信息
  autoFillWaybill: function (lastWaybill) {
    var that = this;
    var tgs = lastWaybill.sourceTollgateId + '@tg,' + lastWaybill.destTollgateId + '@tg,';
    var fts = '';
    for (var i = 0; i < lastWaybill.loadPlaces.length; ++i) {
      var lp = lastWaybill.loadPlaces[i];
      for (var i = 0; i < lp.loadedFreights.length; ++i) {
        var lft = lp.loadedFreights[i];
        fts += lft.typeId + '@ft,'
      }
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    });
    api.searchResources(tgs + fts)
      .then(function (res) {
        var tollgates = [];
        var freightTypes = [];
        var freightNames = '';
        for (var i = 0; i < res.length; ++i) {
          if (res[i] == null) {
            continue;
          }
          if (i < 2) {
            tollgates.push({ id: res[i].id, name: res[i].subName, shortName: res[i].name });
          } else {
            freightTypes.push({ id: res[i].id, shortName: res[i].name });
            if (freightNames.length > 0) {
              freightNames += '、';
            }
            freightNames += res[i].name;
          }
        }
        wx.setStorageSync('onShowFlag', true);
        wx.setStorageSync('choosed', freightTypes);
        wx.setStorageSync('enterData11', tollgates[0]);
        wx.setStorageSync('exitData11', tollgates[1]);
        wx.hideLoading();

        console.log('货物是：', freightTypes)
        console.log('入口是', tollgates[0])
        console.log('出口是', tollgates[1])


      }, function (e) {
        wx.hideLoading();
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
    var that = this;
    var imgDelFlag = that.data.imgDelFlag;
    if (!imgDelFlag) {
      that.loadLastWaybill();
    }
    console.log('aaaaaaaaa:', imgDelFlag)
    var onShowFlag = wx.getStorageSync('onShowFlag');
    if (onShowFlag) {
      that.setData({
        freshFlag: false
      })
      // 处理正常结束的订单
      console.log('老用户通过上次订单结束的')
      var oldData = wx.getStorageSync('choosed');
      var editData = wx.getStorageSync('selectedResults');
      if (editData != '') {
        //  oldData = oldData.concat(editData);
        console.log(editData)
        that.setData({
          choosed: editData,
        })
      } else {
        console.log('应该显示的货物是', oldData);
        that.setData({
          choosed: oldData,
        })
      }

      // 运单结束的时候自动加载上次的货物信息
      // that.setData({
      //   choosed: oldData,
      // })
      // 运单结束的时候自动加载上次的货物信息
      // add
      // if (editData == '') {
      //   that.setData({
      //     choosed: oldData,
      //   });
      // } else {
      //   that.setData({
      //     choosed: editData,
      //   });
      // }
      // add

      var enterData = wx.getStorageSync('enterData11');
      var editEnter = wx.getStorageSync('enterData');
      if (editEnter != '') {
        this.setData({
          enterData: editEnter
        });
      } else {
        this.setData({
          enterData: enterData
        });
      }

      var exitData = wx.getStorageSync('exitData11');
      var editExit = wx.getStorageSync('exitData');

      if (editExit == '') {
        this.setData({
          exitData: exitData
        })
      } else {
        this.setData({
          exitData: editExit
        })
      }


    } else {
      console.log('这是新用户，没有上报过运单的')
      that.setData({
        freshFlag: true
      })
      // 这里处理自动填充数据不成立的时候
      // 获得选中的货物信息
      var choosed = wx.getStorageSync('selectedResults');
      this.setData({
        choosed: choosed,
      });

      // 获得入口收费站信息
      var enterData = wx.getStorageSync('enterData');
      this.setData({
        enterData: enterData
      })

      // 获得出口信息
      var exitData = wx.getStorageSync('exitData');
      this.setData({
        exitData: exitData
      })
    }
    // 处理多个货物的选择开始
    var datas = that.data.choosed;
    if (datas.length > 4) {
      var temp1 = [];
      for (var i = 0; i < datas.length; i++) {
        temp1.push(datas[i].shortName);
      }
      var a = temp1;
      var b = a.join().substring(0, 16) + '...';
      that.setData({
        goods: b
      })
    } else {
      var temp1 = [];
      for (var i = 0; i < datas.length; i++) {
        temp1.push(datas[i].shortName);
      }
      var a = temp1;
      var b = a.join()
      that.setData({
        goods: b
      })
    }
    // 处理多个货物的选择结束

    // var freshFlag = that.data.freshFlag;
    // if (!freshFlag) {
    //   var oldData = wx.getStorageSync('choosed');
    //   var editData = wx.getStorageSync('selectedResults');
    //   if (editData != '') {
    //     //  oldData = oldData.concat(editData);
    //     console.log(editData)
    //     that.setData({
    //       choosed: editData,
    //     })
    //   } else {
    //     console.log('应该显示的货物是', oldData);
    //     that.setData({
    //       choosed: oldData,
    //     })
    //   }
    //   wx.clearStorage();
    // }

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
  // 处理协议点击事件
  serviceAgreementDialogButtonTapHandler: function (e) {
    this.setData({
      'dialog_serviceAgreement.visible': false,
    });
    DB.set(DB.keys.saVer, this.data.dialog_serviceAgreement.version);
  },
  // 用户识别错误
  loadUserDataFailDialogButtonTapHandler: function (e) {
    var that = this
    that.setData({
      'dialog_loadUsthaterDataFail.visible': false,
    })
    that.identifyAndLoadUserData();
  },

  // 上报成功
  reportScuuessDialogButtonTapHandler: function (e) {
    var that = this;
    if (e.target.dataset.index == 0) {
      that.setData({
        'dialog_cancelWaybill.visible': true,
      })
    } else {
      wx.navigateBack();
    }
  },

  cancelWaybillDialogButtonTapHandler: function (e) {
    var that = this;
    if (e.target.dataset.index == 1) {
      that.setData({
        'dialog_cancelWaybill.visible': false,
      })
    } else {
      //  终止运单
      var lastWaybillId = that.data.lastWaybillId
      api.cancelWaybill(lastWaybillId, DB.get(DB.keys.driverId))
        .then(function (res) {
          MyToast.showMsgShort('终止成功');
          // 终止成功之后将照片信息删除
          wx.removeStorageSync('carHeaderPic');
          wx.removeStorageSync('carBeforePic');
          wx.removeStorageSync('carAfterPic');
          wx.removeStorageSync('car_b');
          wx.removeStorageSync('car_c');
          wx.removeStorageSync('car_d');
          wx.removeStorageSync('car_e');
          wx.removeStorageSync('car_f');
          wx.removeStorageSync('car_g');
          wx.removeStorageSync('car_h');
          wx.removeStorageSync('car_i');
          wx.removeStorageSync('car_j');
          wx.removeStorageSync('zhuanghuo');
          var zh = [
            {
              text: '装货照1',
              label: '必拍',
              id: 4,
              img: '',
              flag: false,
              latitude: 0,
              longitude: 0,
              time: ''
            },
            {
              text: '装货照2',
              label: '必拍',
              id: 4,
              img: '',
              flag: false,
              latitude: 0,
              longitude: 0,
              time: ''
            }
          ]
          that.setData({
            'dialog_reportScuuess.visible': false,
            'dialog_cancelWaybill.visible': false,
            'carHeaderPic.flag': false,
            'carBeforePic.flag': false,
            'carAfterPic.flag': false,
            zhuanghuo: zh
          })
          wx.redirectTo({
            url: 'index',
          })
        }, function (e) {
          MyToast.showMsgShort('请重试', 2);
        });
    }
  },
  // 放弃运单
  cancelReportWaybillDialogButtonTapHandler: function (e) {
    var that = this;
    that.setData({
      'dialog_cancelReportWaybill.visible': false,
    });
    if (e.target.dataset.index == 0) {
      this.doClear();
    }
  },


  // 点击添加车辆
  addCar: function (e) {
    wx.navigateTo({
      url: '../mycar/mycar',
    })
  },
  // 点击添加货物
  goods: function (e) {
    wx.navigateTo({
      url: '../goods/goods',
    })
  },
  // 入口收费站点击
  gate: function (e) {
    var flag = 'enter';
    wx.navigateTo({
      url: '../gate/gate?flag=' + flag,
    })
  },
  // 出口收费站点击
  gate2: function (e) {
    var flag = 'exit';
    wx.navigateTo({
      url: '../gate/gate?flag=' + flag,
    })
  },

  // 生成waybillid
  createWayBillId: function () {
    var that = this;
    var time = picTime.formatTime(new Date());
    // var driverId = DB.get(DB.keys.driverId);
    var driverId = wx.getStorageSync('driverId');
    var startIndex = driverId.length - 8;
    startIndex < 0 && (startIndex = 0);
    return time.replace(/-/g, '').replace(/:/g, '').replace(' ', '').substring(2) + driverId.substring(startIndex);
  },


  // 图片选择

  chooseWxImage: function (e) {
    var that = this;
    that.setData({
      imgDelFlag: true
    })
    // 获取当前的网络状态
    var networkType = that.data.networkType;
    if (networkType == '2g') {
      wx.showModal({
        title: '提示',
        content: '您现在网络不通畅，照片容易上传失败，请在网络状态好的情况下重试',
      })
    }
    var index = e.currentTarget.id;
    var flag = e.currentTarget.dataset.flag;
    var zhuangIdx = e.currentTarget.dataset.index;
    if (flag != 'add') {
      if (index == 0) {
        if (that.data.cardPic.flag == true) {
          wx.previewImage({
            current: that.data.cardPic.img,
            urls: [that.data.cardPic.img]
          });
          return
        }
      } else if (index == 1) {
        if (that.data.carHeaderPic.flag == true) {
          wx.previewImage({
            current: that.data.carHeaderPic.img,
            urls: [that.data.carHeaderPic.img]
          });
          return;
        }
      } else if (index == 2) {
        if (that.data.carBeforePic.flag == true) {
          wx.previewImage({
            current: that.data.carBeforePic.img,
            urls: [that.data.carBeforePic.img]
          });
          return;
        }
      } else if (index == 3) {
        if (that.data.carAfterPic.flag == true) {
          wx.previewImage({
            current: that.data.carAfterPic.img,
            urls: [that.data.carAfterPic.img]
          });
          return;
        }
      } else if (index == 4) {

        // 处理装货照的点击查看照片
        if (that.data.zhuanghuo[zhuangIdx].flag == true) {
          wx.previewImage({
            current: that.data.zhuanghuo[zhuangIdx].img,
            urls: [that.data.zhuanghuo[zhuangIdx].img]
          });
          return;
        }
      }
    } else {
      //必须先传了两张以后才能点击继续添加 
      var zhuanghuoAlready = that.data.zhuanghuo;
      var z_img = [];
      for (var i = 0; i < zhuanghuoAlready.length; i++) {
        z_img.push(zhuanghuoAlready[i].img)
      }
      if (z_img[0] == '' || z_img[1] == '') {
        wx.showModal({
          title: '提示',
          content: '请先上传装货照1和2之后再点击添加',
          showCancel: false
        })
        return
      } else {
        // 最多添加装货照限制
        var zhuanghuo = wx.getStorageSync('zhuanghuo');
        if (zhuanghuo.length >= 6) {
          wx.showModal({
            title: '提示',
            content: '最多只能添加六张',
          })
          return
        }
      }


    }
    that.showDialog(index, zhuangIdx);
  },
  // 点击拍照弹出框
  showDialog: function showDialog(index, zhuangIdx) {
    var path = '';
    if (index == 0) {
      path = '../../images/license.png';
    } else if (index == 1) {
      path = '../../images/truck_head.png';
    } else if (index == 2) {
      path = '../../images/before_load.png';
    } else if (index == 3) {
      path = '../../images/loaded.png';
    } else if (index == 4) {
      path = '../../images/loading.png';
    }
    this.setData({
      'dialog_takePhoto.index': index,
      'dialog_takePhoto.visible': true,
      'dialog_takePhoto.icon.src': path,
      'zhuangIdx': zhuangIdx
    })
  },
  takePhotoDialogButtonTapHandler: function (e) {
    var that = this;
    this.setData({
      'dialog_takePhoto.visible': false,
    });
    var idx = that.data.dialog_takePhoto.index
    var zhuangIdx = that.data.zhuangIdx
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function (resp) {
        wx.showLoading({
          title: '上传中',
        });
        if (idx == 0) {
          wx.getLocation({
            success: function (res) {
              var time = picTime.formatTime(new Date());
              var latitude = res.latitude;
              var longitude = res.longitude;
              var img = resp.tempFilePaths[0];
              picUpload.imgUpload(img, that.data.waybillId, that.data.truck.id, 'car_a');
              var cardPic = {
                time: time,
                latitude: latitude,
                longitude: longitude,
                img: img
              }
              wx.setStorageSync('cardPic', cardPic);
              that.setData({
                'cardPic.img': img,
                'cardPic.flag': true,
                'cardPic.latitude': latitude,
                'cardPic.longitude': longitude,
                'cardPic.time': time
              })
            },
          })
        } else if (idx == 1) {
          wx.getLocation({
            success: function (res) {
              var time = picTime.formatTime(new Date());
              var latitude = res.latitude;
              var longitude = res.longitude;
              var img = resp.tempFilePaths[0];
              var carHeaderPic = {
                time: time,
                latitude: latitude,
                longitude: longitude,
                img: img
              }
              picUpload.imgUpload(img, that.data.waybillId, that.data.truck.id, 'car_b');

              wx.setStorageSync('carHeaderPic', carHeaderPic);
              that.setData({
                'carHeaderPic.img': img,
                'carHeaderPic.flag': true,
                'carHeaderPic.latitude': latitude,
                'carHeaderPic.longitude': longitude,
                'carHeaderPic.time': time
              })
            },
          })
        } else if (idx == 2) {
          wx.getLocation({
            success: function (res) {
              var time = picTime.formatTime(new Date());
              var latitude = res.latitude;
              var longitude = res.longitude;
              var img = resp.tempFilePaths[0];
              var carBeforePic = {
                time: time,
                latitude: latitude,
                longitude: longitude,
                img: img
              }
              picUpload.imgUpload(img, that.data.waybillId, that.data.truck.id, 'car_c');
              wx.setStorageSync('carBeforePic', carBeforePic);
              that.setData({
                'carBeforePic.img': img,
                'carBeforePic.flag': true,
                'carBeforePic.latitude': latitude,
                'carBeforePic.longitude': longitude,
                'carBeforePic.time': time
              })
            },
          })
        } else if (idx == 3) {
          wx.getLocation({
            success: function (res) {
              var time = picTime.formatTime(new Date());
              var latitude = res.latitude;
              var longitude = res.longitude;
              var img = resp.tempFilePaths[0];
              var carAfterPic = {
                time: time,
                latitude: latitude,
                longitude: longitude,
                img: img
              }
              picUpload.imgUpload(img, that.data.waybillId, that.data.truck.id, 'car_d');
              wx.setStorageSync('carAfterPic', carAfterPic);
              that.setData({
                'carAfterPic.img': img,
                'carAfterPic.flag': true,
                'carAfterPic.latitude': latitude,
                'carAfterPic.longitude': longitude,
                'carAfterPic.time': time
              })
            },
          })
        } else if (idx == 4) {
          var zIndx = zhuangIdx;
          switch (zIndx) {
            case 0:
              var z = 'car_e'
              break;
            case 1:
              var z = 'car_f'
              break;
          }

          if (zIndx !== undefined) {
            // 这里是装货照1和2
            wx.getLocation({
              success: function (res) {
                var time = picTime.formatTime(new Date());
                var latitude = res.latitude;
                var longitude = res.longitude;
                var img = resp.tempFilePaths[0];
                var zhuanghuo = that.data.zhuanghuo;
                var time1 = 'zhuanghuo[' + zIndx + '].time';
                var latitude1 = 'zhuanghuo[' + zIndx + '].latitude';
                var longitude1 = 'zhuanghuo[' + zIndx + '].longitude';
                var img1 = 'zhuanghuo[' + zIndx + '].img';
                var flag1 = 'zhuanghuo[' + zIndx + '].flag';

                that.setData({
                  [time1]: time,
                  [latitude1]: latitude,
                  [longitude1]: longitude,
                  [img1]: img,
                  [flag1]: true
                });
                var item = {
                  time: time,
                  latitude: latitude,
                  longitude: longitude,
                  img: img
                }
                picUpload.imgUpload(img, that.data.waybillId, that.data.truck.id, z);
                var x = wx.getStorageSync('zhuanghuo');
                if (x != '') {
                  var y = x.concat(item);
                } else {
                  var y = [];
                  y.push(item);
                }
                wx.setStorageSync('zhuanghuo', y);
              },
            })
          } else {
            var i = that.data.tt;
            var p = i += 1;
            that.setData({
              tt: p
            });

            switch (p) {
              case 3:
                var z = 'car_g'
                break;
              case 4:
                var z = 'car_h'
                break;
              case 5:
                var z = 'car_i'
                break;
              case 6:
                var z = 'car_j'
                break;
            }

            if (i > 6) {
              wx.showModal({
                title: '提示',
                content: '最多只能添加六张',
              })
              return
            }
            var obj = {};
            var con = [];
            obj.text = '装货照 ' + p + '';
            obj.label = '选拍';
            obj.flag = true;
            obj.img = '';
            obj.latitude = '';
            obj.longitude = '';
            obj.time = '';
            obj.id = 4;
            con.push(obj);
            var oldData = that.data.zhuanghuo;
            console.log(oldData)
            var newData = oldData.concat(con);
            that.setData({
              zhuanghuo: newData
            })
            var pIndx = parseInt(p - 1);
            wx.getLocation({
              success: function (res) {
                var time = picTime.formatTime(new Date());
                var latitude = res.latitude;
                var longitude = res.longitude;
                var img = resp.tempFilePaths[0];
                var zhuanghuo = that.data.zhuanghuo;


                var time1 = 'zhuanghuo[' + pIndx + '].time';
                var latitude1 = 'zhuanghuo[' + pIndx + '].latitude';
                var longitude1 = 'zhuanghuo[' + pIndx + '].longitude';
                var img1 = 'zhuanghuo[' + pIndx + '].img';
                var flag1 = 'zhuanghuo[' + pIndx + '].flag';

                var text1 = 'zhuanghuo[' + pIndx + '].text';
                var label1 = 'zhuanghuo[' + pIndx + '].label';
                var id1 = 'zhuanghuo[' + pIndx + '].id';

                that.setData({
                  [time1]: time,
                  [latitude1]: latitude,
                  [longitude1]: longitude,
                  [img1]: img,
                  [flag1]: true,
                  [text1]: '装货照 ' + p + '',
                  [id1]: 4,
                  [label1]: '选拍'
                });

                var item = {
                  time: time,
                  latitude: latitude,
                  longitude: longitude,
                  img: img,
                  text: '装货照 ' + p + ''
                }
                var x = wx.getStorageSync('zhuanghuo');
                if (x != '') {
                  var y = x.concat(item);
                } else {
                  var y = [];
                  y.push(item);
                  console.log(y)
                }
                picUpload.imgUpload(img, that.data.waybillId, that.data.truck.id, z);
                wx.setStorageSync('zhuanghuo', y);
              },
            })
          }
        }
      },
    })
  },


  // 点击放弃
  cancel: function (e) {
    var that = this;
    that.setData({
      'dialog_cancelReportWaybill.visible': true,
    });
  },


  // 点击报送
  confirm: function (e) {
    var that = this;
    // 车辆信息校验
    var truck = that.data.truck;
    if (truck == null || truck == '') {
      MyToast.showMsgShort('请先补全车辆信息', 2);
      return;
    } else {
      //获取车辆信息

    }
    // 货物信息校验
    var goods = that.data.choosed;

    if (goods == '' || goods == null) {
      MyToast.showMsgShort('请选择货物', 2);
      return;
    } else {
      //获取货物信息

    }

    // 入口收费站校验

    var enterData = that.data.enterData;

    if (enterData == '' || enterData == null) {
      MyToast.showMsgShort('请选择入口收费站', 2);

      return;
    } else {

    }


    // 行驶证校验
    var cardPic = that.data.cardPic;
    var carImg = wx.getStorageSync('car_a');
    if (carImg == '' && cardPic == '') {
      MyToast.showMsgShort('请上传行驶证照片', 2);
      return;
    } else {
    }


    // 车头照片校验

    var carHeaderPic = that.data.cardPic;
    var carHeaderImg = wx.getStorageSync('car_b');
    if (carHeaderImg == '' || carHeaderPic == '') {
      MyToast.showMsgShort('请上传车头照片', 2);
      return;
    } else {
    }


    // 装货前校验

    var carBeforePic = that.data.cardPic;
    var carBeforePicImg = wx.getStorageSync('car_c');
    if (carBeforePicImg == '' || carBeforePic == '') {
      MyToast.showMsgShort('请上传装货前照片', 2);

      return;
    } else {
    }


    // 装货照校验
    var zhuanghuo = that.data.zhuanghuo;
    var z_imgs = [];
    for (var i = 0; i < zhuanghuo.length; i++) {
      z_imgs.push(zhuanghuo[i].img);
    }
    if (z_imgs[0] == '' || z_imgs[1] == '') {
      MyToast.showMsgShort('请先上传装货照片', 2);
      return;
    } else {

    }


    // 装完货照片校验
    var carAfterPic = that.data.carAfterPic;
    var carAfterPicImg = wx.getStorageSync('car_d');

    if (carAfterPicImg == '' || carAfterPic == '') {
      MyToast.showMsgShort('请上传装完货前照片', 2);
      return;
    } else {

    }


    // 参数组装
    var time = picTime.formatTime(new Date());
    var sourceTollgateId = that.data.enterData.id;
    var destTollgateId = that.data.exitData.id;
    var id = that.data.waybillId;
    var truckId = that.data.truck.id;
    var cardPic = that.data.cardPic;
    var carHeaderPic = that.data.carHeaderPic;
    var carBeforePic = that.data.carBeforePic;
    var carAfterPic = that.data.carAfterPic;
    var zhuanghuo = that.data.zhuanghuo;

    // 装货照片
    var all = [];
    var zhuanghuoImgs = [];
    for (var i = 0; i < zhuanghuo.length; i++) {
      var ou = {}
      var ner = {};
      // var x = parseInt(i + 4);
      var x = parseInt(i + 5);
      if (x == 4) {
        var na = 'car_d'
      } else if (x == 5) {
        var na = 'car_e'
      } else if (x == 6) {
        var na = 'car_f'
      } else if (x == 7) {
        var na = 'car_g'
      }
      ner.id = x
      ner.loadPlaceId = 'lp1';
      ner.path = wx.getStorageSync(na).imgPath;
      ner.positionX = zhuanghuo[i].longitude;
      ner.positionY = zhuanghuo[i].latitude;
      ner.time = zhuanghuo[i].time;
      ner.typeId = '6';
      zhuanghuoImgs.push(ner);
    }
    // 行驶证照片
    var licencepicture = wx.getStorageSync('car_a');
    if (licencepicture == '') {
      var licencePic = cardPic.imgPath;
      var posX = carHeaderPic.longitude;
      var posY = carHeaderPic.latitude;
      var time = carHeaderPic.time
    } else {
      var licencePic = licencepicture.imgPath;
      var posX = cardPic.longitude;
      var posY = cardPic.latitude;
      var time = cardPic.time
    }
    var cardPicP = {
      id: 1,
      loadPlaceId: 'lp1',
      path: licencePic,
      positionX: posX,
      positionY: posY,
      time: time,
      typeId: '5'
    }
    console.log(cardPicP);
    //精简版行驶证照片
    var cardPicSIngle = [];
    var cardPicS = {
      id: 0,
      path: licencePic,
      positionX: posX,
      positionY: posY,
      time: time,
      type: '5'
    }
    cardPicSIngle.push(cardPicS);
    console.log(cardPicSIngle);
    // 车头照片
    var carHeaderP = {
      id: 2,
      loadPlaceId: 'lp1',
      path: wx.getStorageSync('car_b').imgPath,
      positionX: carHeaderPic.longitude,
      positionY: carHeaderPic.latitude,
      time: carHeaderPic.time,
      typeId: '1'
    }
    // 装货前
    var carBeforeP = {
      id: 3,
      loadPlaceId: 'lp1',
      path: wx.getStorageSync('car_c').imgPath,
      positionX: carBeforePic.longitude,
      positionY: carBeforePic.latitude,
      time: carBeforePic.time,
      typeId: '5'

    }
    // 装完货
    var zids = zhuanghuo.length;
    var zid = parseInt(zids + 4);
    var carAfterP = {
      // id: zid,
      id: 4,
      loadPlaceId: 'lp1',
      path: wx.getStorageSync('car_d').imgPath,
      positionX: carAfterPic.longitude,
      positionY: carAfterPic.latitude,
      time: carAfterPic.time,
      typeId: '7'
    }


    // 货物
    var goods = that.data.choosed;
    var loadedFreights = [];
    for (var i = 0; i < goods.length; i++) {
      var goods_out = {}
      var goods_enter = {};
      goods_enter.id = 'lf' + i + '';
      goods_enter.loadPlaceId = 'lp1';
      goods_enter.typeId = goods[i].id
      var all = Object.assign(goods_enter)
      loadedFreights.push(all);
    }

    // 拼接参数
    var loadPlaces = {};
    var photos = [];
    // photos.push(cardPicP, carHeaderP, carBeforeP, carAfterP);
    // 如果本地已经上报过，就不需要行驶证了
     if(that.data.truck.photo!=''){
       photos.push(carHeaderP, carBeforeP);
     }else{
       photos.push(cardPicP, carHeaderP, carBeforeP);
     }

    var allPictures = photos;
    allPictures = allPictures.concat(zhuanghuoImgs);
    allPictures.push(carAfterP)
    loadPlaces.id = 'lp1';
    loadPlaces.beginTime = time;
    loadPlaces.loadPhotos = allPictures;
    loadPlaces.loadedFreights = loadedFreights;
    loadPlaces.positionX = cardPic.longitude;
    loadPlaces.positionY = cardPic.latitude;
    loadPlaces.waybillId = id;

    var params = {
      createTime: time,
      sourceTollgateId: sourceTollgateId,
      destTollgateId: destTollgateId,
      id: id,
      loadPlaces: [loadPlaces],
      origin: 1,
      state: '0',
      truckId: truckId,
      truckPhotos: cardPicSIngle
    }
    console.log(params)
    var pStr = '&uploadType=uploadWaybill&truckId=' + truckId + '';
    var url = getApp().getMainServicePath() + 'uploadObject?' + pStr;
    wx.showLoading({
      title: '正在报送中',
    })
    wx.request({
      url: url,
      data: JSON.stringify(params),
      method: 'post',
      header: {
        'Content-Type': 'text/plain',
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.statusCode !== 200) {
          //报送出错了
          wx.showModal({
            title: '提示',
            content: '报送出错，请重试！',
            showCancel: false
          })
        } else {
          //报送成功
          that.setData({
            'dialog_reportScuuess.visible': true,
            imgDelFlag: false
          });
          that.loadLastWaybill()
          // 清除一些信息
          wx.removeStorageSync('choosed');
          wx.removeStorageSync('selectedResults');
        }
      },
      fail: function (err) {
        wx.showModal({
          title: '提示',
          content: '报送出错，请重试！',
          showCancel: false
        })
      }
    })
  },
  // 点击清除缓存
  doClear: function () {
    var that = this;
    wx.clearStorage();
    wx.reLaunch({
      url: 'index',
    });
  },
  ClearStorage: function () {
    var that = this;
    wx.showModal({
      title: '请谨慎操作',
      content: '清理缓存会删除小程序所有数据，未报送的运单数据将会丢失。',
      confirmText: '清理',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '清除中',
          })
          wx.reLaunch({
            url: 'index',
            complete: function () {
              wx.removeStorageSync('saVer');
              wx.hideLoading();
            }
          })
        }
      },
    });
  }


})