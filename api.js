let app = getApp();
import DB from 'databank'
//查询协议
function getLastServiceAgreement() {
  return new Promise((resolve, reject) => {
    let saVer = DB.get(DB.keys.saVer);
    let params = {
      url: app.getMainServicePath() + 'api/v1.0/lastServiceAgreement?version=' + (saVer ? saVer : ''),
      success: function (res) {
        (res.statusCode == 200) ? resolve(res.data) : reject(res);
      },
      fail: function (res) {
        reject(res);
      },
    };
    wx.request(params);
  });
}
// 查询code
function requestCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res);
        }
      },
      fail: function (res) {
        console.log('requestCode fail' + res)
        reject(res);
      }
    });
  });
}

//识别用户
function identifyUser() {
  return requestCode()
    .then(function (code) {
      return new Promise((resolve, reject) => {
        let params = {
          url: app.getMainServicePath() + 'identifyUser',
          data: {
            code: code,
          },
          success: function (res) {
            (res.statusCode == 200) ? resolve(res.data) : reject(res);
          },
          fail: function (res) {
            reject(res);
          }
        };
        wx.request(params);
      });
    });
}



//查询司机车辆
function getDefaultTruckOfDriver(driverId) {
  return new Promise((resolve, reject) => {
    let params = {
      url: app.getMainServicePath() + 'defaultTruckOfDriver/' + driverId,
      success: function (res) {
        (res.statusCode == 200 || res.statusCode == 204) ? resolve(res.data) : reject(res);
      },
      fail: function (res) {
        reject(res);
      },
    };
    wx.request(params);
  });
}

//上报系统信息
function uploadSystemInfo() {
  let driverId = DB.get(DB.keys.driverId);
  if (driverId == null) {
    return;
  }
  let si = wx.getSystemInfoSync();
  let userSysInfo = DB.get(DB.keys.userSysInfo);
  let curUserSysInfo = driverId + '@' + si.model + '|' + si.pixelRatio + '|' + si.screenWidth + '|' + si.screenHeight + '|' + si.windowWidth + '|' + si.windowHeight + '|' + si.language + '|' + si.version + '|' + si.system + '|' + si.platform + '|' + si.SDKVersion;
  if (userSysInfo == curUserSysInfo) {
    return;
  }
  let params = {
    url: app.getMainServicePath() + 'uploadSystemInfo/' + driverId,
    data: si,
    method: 'POST',
    success: function (res) {
      if (res.statusCode == 200 && res.data.status == 0) {
        console.info('上传设备信息成功, o%', res);
        DB.set(DB.keys.userSysInfo, curUserSysInfo)
      } else {
        console.error('上传设备信息失败, o%', res);
      }
    },
    fail: function (res) {
      console.error('上传设备信息失败, o%', res);
    }
  };
  wx.request(params);
}

//获取用户openId
function queryUserOpenId() {
  var that = this;
  return requestCode()
    .then(function (code) {
      return new Promise((resolve, reject) => {
        let params = {
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxa153df20e8888c68&secret=562d18ef381c1c575d6ad516c8c533af&grant_type=authorization_code&js_code=' + code,
          success: function (res) {
            (res.statusCode == 200) ? resolve(res.data) : reject(res);
          },
          fail: function (res) {
            reject(res);
          }
        };
        wx.request(params);
      });
    });
}

//查询最新运单
function getLastWaybillOfTruck(truckId) {
  return new Promise((resolve, reject) => {
    let params = {
      url: app.getMainServicePath() + 'getLastWayBill/truck/' + truckId,
      success: function (res) {
        (res.statusCode == 200 || res.statusCode == 204) ? resolve(res.data) : reject(res);
      },
      fail: function (res) {
        reject(res);
      },
      complete: function () {
        wx.hideLoading();
      }
    };
    wx.showLoading({
      title: '正在查询...',
      mask: true,
    });
    wx.request(params);
  });
}
//查询资源
function searchResources(resources) {
  return new Promise((resolve, reject) => {
    let params = {
      url: app.getMainServicePath() + 'searchResources?resources=' + resources,
      success: function (res) {
        res.statusCode == 200 ? resolve(res.data) : reject(res);
      },
      fail: function (res) {
        reject(res);
      }
    };
    wx.request(params);
  });
}

//取消运单
function cancelWaybill(waybillId, userId) {
  return new Promise((resolve, reject) => {
    let params = {
      url: app.getMainServicePath() + 'cancelWaybill/' + waybillId + '/' + userId,
      success: function (res) {
        console.log(res)
        res.statusCode == 200 ? resolve(res.data) : reject(res);
      },
      fail: function (res) {
        reject(res);
      },
      complete: function () {
        wx.hideLoading();
      }
    };
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    });
    wx.request(params);
  });
}



module.exports = {
  getLastServiceAgreement: getLastServiceAgreement,
  identifyUser: identifyUser,
  getDefaultTruckOfDriver: getDefaultTruckOfDriver,
  getLastWaybillOfTruck: getLastWaybillOfTruck,
  cancelWaybill: cancelWaybill,
  searchResources: searchResources,
  uploadSystemInfo: uploadSystemInfo,
  queryUserOpenId: queryUserOpenId,
}