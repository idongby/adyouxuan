// 0、引入 用来发送请求的 方法，一定要把路径补全
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList:[],
    // 导航 数组
    catesList:[],
    // 楼层 数组
    floorList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // // 1、发送异步请求 获取轮播图数据
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result.data.message  //接收到返回的数据进行赋值
    //     })
    //   },
    // });
    this.getSwiperList(); //获取轮播图数据
    this.getCatesList(); // 获取分类导航数据
    this.getFloorList(); //获取楼层数据
      
  },
  // 请求获取轮播图
  async getSwiperList(){
    // request({url:"/home/swiperdata"})
    // .then(result=>{
    //   this.setData({
    //     swiperList:result.data.message  //接收到返回的数据进行赋值
    //   })
    // })
    const res = await request({url:"/home/swiperdata"})
    res.map((item) => (item.navigator_url = item.navigator_url.replace(/main/, 'index')))
    this.setData({
      swiperList:res  //接收到返回的数据进行赋值
    })
  },
  // 请求获取 分类导航数据
  async getCatesList(){
    // request({url:"/home/catitems"})
    // .then(result=>{
    //   this.setData({
    //     catesList:result.data.message  //接收到返回的数据进行赋值
    //   })
    // })
    const res = await request({url:"/home/catitems"});
    this.setData({
      catesList:res  //接收到返回的数据进行赋值
    })
  },
  // 请求获取 楼层数据
  async getFloorList(){
    // request({url:"/home/floordata"})
    // .then(result=>{
    //   this.setData({
    //     floorList:result.data.message  //接收到返回的数据进行赋值
    //   })
    // })
    const res = await request({url:"/home/floordata"})
    res.map(v=>{
      v.product_list.map(Value=>{
        Value.navigator_url = Value.navigator_url.replace(/\?/,'/index?')
      })   
    })
    this.setData({
      floorList:res  //接收到返回的数据进行赋值
    })
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
    
  }
})