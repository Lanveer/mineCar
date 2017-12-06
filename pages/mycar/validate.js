function doValidate(truck) {

  if(truck!=null){
    if (truck.plateNumber == '' || truck.plateNumber == null || truck.plateNumber.length != 7) {
      return '请输入7位车牌号';
    }
    if (truck.axleCount == null || truck.axleCount == "" || truck.axleCount == undefined) {
      return '请选择车轴数';
    }
    if (truck.crateType == null || truck.crateType == "" || truck.crateType == undefined) {
      return '请选择货箱型号';
    }

    if (truck.allWeight == null || truck.allWeight == " ") {
      return '请输入整备质量';
    }
    if (truck.goodsWeight == null || truck.goodsWeight == " ") {
      return '请输入总重量';
    }
    if (truck.limitWeight == null || truck.limitWeight == " ") {
      return '请输入核定载质量';
    }
    if (truck.ownerName == null || truck.ownerName == " ") {
      return '请输入车主姓名';
    }
    if (!(new RegExp("^1[0-9]{10}$").test(truck.ownerPhone))) {
      return '请按照规则输入手机号';
    }

    return null;
  }else{
    return '请依次填写信息';
  }

}

module.exports = {
  doValidate
}