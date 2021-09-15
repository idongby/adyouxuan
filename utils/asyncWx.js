// promise 形式 showModel
// @param {object} param0 参数
export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '温馨提示',
            content: content,
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                resolve(result)
            },
            fail:(err)=>{
                reject(err);
            }
          });
    })
}
// showToast
export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon:'none',
            success: (result) => {
                resolve(result)
            },
            fail:(err)=>{
                reject(err);
            }
          });
    })
}

// login 登录封装
export const login=()=>{
   return new Promise((resolve,reject)=>{
       wx.login({
           timeout:10000,
           success: (result) => {
               resolve(result)
           },
           fail: (err) => {
               reject(err);
           }
       });
         
   })
}

// requestPayment 支付
export const requestPayment=(pay)=>{
    return new Promise((resolve,reject)=>{
        wx.requestPayment({
            ...pay,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
          
    })
 }

// 用户登录
export const getUserProfile=()=>{
    return new Promise((resolve,reject)=>{
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              resolve(res.userInfo);
            },
            fail:(err) => {
                reject(err);
            }
        })
    })
}
