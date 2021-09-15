// 同时发送异步代码的次数
let ajaxTiems = 0
export const request=(params)=>{
  // 判断 url 中是否带有 /my/ 请求的是私有路径 带上header token
  let header={...params.header};
  if(params.url.includes("/my/")){
    // 拼接 header 带上 token
    header["Authorization"]=wx.getStorageSync("token");
  }
  ajaxTiems++;
  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });
    
  const baseURL="https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      url:baseURL+params.url,
      success:(result)=>{
        resolve(result.data.message);
      },
      fail:(err)=>{
        reject(err)
      },
      complete:()=>{
        ajaxTiems--;
        if(ajaxTiems === 0){
          // 关闭正在加载图标
        wx.hideLoading();  
        }
      }
    });
  })
}