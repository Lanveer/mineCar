//简化Toast的显示
function showMsgShort(msg, msgType = 0) {
  var options = {
    title: msg,
  };
  setImage(options, msgType);
  wx.showToast(options);
}

function showMsgLong(msg, msgType = 0) {
  showMsg(msg, 3500, msgType);
}

function showMsg(msg, duration, msgType = 0) {
  var options = {
    title: msg,
    duration: duration,
  };
  setImage(options, msgType);
  wx.showToast(options);
}

//消息类型，0：成功，1：加载中，2：错误
function setImage(options, msgType) {
  if (msgType == 0) {
    options.icon = 'success'
  } else if (msgType == 1) {
    options.icon = 'loading'
  } else if (msgType == 2) {
    options.image = '/images/error.png';
  }
}

module.exports = {
  showMsgShort: showMsgShort,
  showMsgLong: showMsgLong,
  showMsg: showMsg
}