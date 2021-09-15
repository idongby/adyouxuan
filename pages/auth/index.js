import {login} from "../../utils/asyncWx.js"
import {request} from "../../request/index.js"
Page({
  // 获取用户信息
  async handleGetUserInfo(e){
    try{
      // 1获取用户信息
      const {encryptedData,rawData,iv,signature}=e.detail;
      // 2 获取小程序登录成功后的code
      const {code} = await login();
      const loginParams = {encryptedData,rawData,iv,signature,code};
      // 3 发送请求 获取用户的token
      // const {token}=await request({url:"/users/wxlogin",data:loginParams,method:"POST"})
      // 4 把token 存入缓存中，同时跳转回上一个页面
      // wx.setStorageSync("token", token);

      // 因为是个人用户开发，没有权限，所以这里使用其他存在的token
      wx.setStorageSync("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
      wx.navigateBack({
        delta: 1
      });
    } catch(error){
      console.log(error)
    }
  }
})