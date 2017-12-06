function get(key) {
  let v = wx.getStorageSync(key);
  return v != '' ? v : null;
}

function set(key, value) {
  wx.setStorageSync(key, value);
}

function remove(key) {
  wx.removeStorageSync(key);
}

module.exports = {
  keys: {
    appVer: 'appVer',
    saVer: 'saVer',
    driverId: 'driverId',
    defaultTruck: 'defaultTruck',
    truckPhoto_5: 'truckPhoto_5',
    userSysInfo: 'userSysInfo',
  },

  get: get,
  set: set,
  remove: remove,
}