// pages/category/index.js
import {request} from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    rightContent:[],
    // 被点击的左侧的菜单
    currentIndex:0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },
  // 接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 0、以前web中的本地存储 和 小程序 的本地存储区别
      // 1、写代码方式不一样了
        // web:localStorage.setItem("key","value") ;localStorage.getItem("key")
        // 小程序中：wx.setStorageSync("key","value");wx.getStorageSync("key")
      // 2、寸的时候有没有做类型转换
        // web:不管存入的是什么类型的数据，最终都会先调用一下 toString()，
            // 把数据变成了字符串，再存入进去
        // 小程序：不存在 类型转换的这个操作 存什么类型的数据 获取就是什么类型的数据
    // 1、先判断一下本地存储中有没有旧的数据
      // {time:Data.now(),data:[...]}
    // 2、没有旧数据 直接发送新请求
    // 3、有旧的数据 同时 就得数据也没有过期 就使用 本地存储中的旧数据即可

    // 1、获取本地存储中的数据（小程序中也是存储本地存储 技术）
    const Cates=wx.getStorageSync("cates");
    // 2、判断
    if(!Cates){
      // 不存在 发送请求获取数据
      this.getCates();
    }else{
      // 有旧的数据 定义过期时间 10s 改成 5分钟
      if(Date.now() - Cates.time > 1000 *1000){
        // 重新发送请求
        this.getCates();
      }else{
        // 可以使用旧数据
        this.Cates = Cates.data;
        // 更新左侧菜单和右侧商品的数据
        this.setLeftRightData();
      }
    }
    
  },
  // 获取分类数据
  async getCates(){
    // request({
    //   url:"/categories"
    // })
    // .then(res=>{
    //   this.Cates=res.data.message;
    //   // 把接口的数据存储到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
    //   // 更新左侧菜单和右侧商品的数据
    //   this.setLeftRightData();
    // })

    // 1、使用es7的async await来发送请求
    const res = await request({url:"/categories"});
    this.Cates = res;
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
    // 更新左侧菜单和右侧商品的数据
    this.setLeftRightData();
  },
  // 更新左侧菜单和右侧商品的数据
  setLeftRightData(){
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[this.data.currentIndex].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e){
    // console.log(e)
    const {index} = e.currentTarget.dataset;

    // 构造右侧的商品数据
    let rightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      // 重新设置 右侧内容的 scroll-view标签距离顶部的距离
      scrollTop:0
    })
    
  }
})