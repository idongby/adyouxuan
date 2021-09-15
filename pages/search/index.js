/**
 * 1、输入框绑定 值改变事件 input 事件
 *  1、获取到输入框的值
 *  2、合法性判断
 *  3、检验通过，把输入框的值，发送到后台
 *  4、返回的数据打印到页面上
 * 2、防抖 定时器
 *  0、防抖 一般 输入框中 防止重复输入 重复发送请求
 *  1、节流 一般是用在页面下拉和上拉
 *  1、定义全局的定时器id
 */
 import {request} from "../../request/index.js"
Page({
  data: {
    goods:[],
    isFocus:false, //取消 按钮 是否显示
    inpValue:"", // 输入框的值
  },
  TimeId:-1,
  // 输入框的值改变了就会触发
  handleInput(e){
    // 1、获取输入框的值
    const {value} = e.detail;
    // 2、检查合法性
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
        //  值不合法
      return;
    }
    // 3、发送请求获取数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(()=>{
      this.qsearch(value)
    },1000)
    
  },
  // 发送请求获取搜素建议 数据
  async qsearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}})
    this.setData({
      goods:res
    })
  },
  // 点击 取消 按钮
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  }

})