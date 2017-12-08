
import MyToast from '../../utils/toast.js'
function imgUpload(filePath, waybillId, truckId, flag, callback) {
  var url = getApp().getMainServicePath() + 'uploadObjectAndSomeFile';
  // wx.showLoading({
  //   title: '上传中',
  // });
  wx.uploadFile({
    url: url,
    filePath: filePath,
    name: 'file',
    formData: {
      uploadType: 'uploadWaybill',
      theFilePathInClient: 'p.png',
      waybillId: waybillId,
      forderName: waybillId,
      truckId: truckId
    },
    success: function (res) {
      console.log(res)
      if (res.statusCode == 200) {
        wx.hideLoading();
        var host = getApp().getMainPicturePath()
        // var img= host + res.data;
        var imgUrl = host + res.data;
        var imgPath = res.data;
        var imgData = {
          'imgUrl': imgUrl,
          'imgPath': imgPath
        }
        wx.setStorageSync(flag, imgData)
        MyToast.showMsgShort('上传成功', 0)
      } else {
        MyToast.showMsgLong('上传失败', 2)
      }
    },
    fail: function (err) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '上传出错！',
        showCancel: false
      })
    }
  })
}
module.exports = {
  imgUpload: imgUpload
}