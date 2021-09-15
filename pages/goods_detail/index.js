/**
 * 1、发送请求获取数据
 * 2、点击轮播图 预览大图
 *    1、给轮播图绑定点击事件
 *    2、调用小程序的api previewImage
 * 3、点击加入购物车
 *    1、先绑定点击事件
 *    2、获取缓存中的购物车数据 数组格式
 *    3、先判断一下 当前的商品是否已经存在 购物车 里了
 *    4、已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
 *    5、不存在于购物车的数组中 直接给购物车数组添加一个新元素 带上 购买数量属性 num 
 *        重新把购物车数组 填充回缓存中
 *    6、弹出提示
 * 4、商品收藏
 *  1、页面onShow的时候，加载缓存中的商品收藏的数据
 *  2、判断当前商品是不是被收藏
 *    1、是 改变页面的图标
 *    2、不是。。不动
 *  3、点击商品收藏按钮
 *    1、判断该商品是否存在于缓存数组中
 *    2、已经存在 把该商品删除
 *    3、没有存在 把商品添加到收藏数组中 存入到缓存中
 */
import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:false
  },
  // 商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    // 获得商品的id
    let pages =  getCurrentPages();
    let currentPages = pages[pages.length-1]
    let options = currentPages.options;
    const {goods_id}=options;
    this.getGoodsDetail(goods_id)

  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:"/goods/detail",data:{goods_id}})
    this.GoodsInfo = goodsObj;
    // 1、获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect")||[];
    // 2、判断当前商品是否被收藏了  some返回的值,一个为true就为true
    let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id)
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone部分收集 不识别 webp图片格式
        // 最好找到后台工程师 让他进行修改
        // 临时自己修改 确保后台存在 1.webp => 1.jpg
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
  },
  // 点击轮播图 放大预览
  handlePreviewImage(e){
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
    // 接受被点击图片的index下标
    const {index} = e.currentTarget.dataset
    // console.log(index)
    wx.previewImage({
      current: urls[index],
      urls: urls
    });
      
  },

  // 点击加入购物车
  handleCartAdd(){
    // 1、先获取缓存中的购物车 数组
    let cart=wx.getStorageSync("cart")||[];
    // 2、判断 商品对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      // 不存在，第一次添加
      this.GoodsInfo.num=1; //购买数量
      // 商品的选中状态，给购物车用
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo)
    }else{
      // 已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    // 5 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 6、弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止用户手抖 疯狂点击按钮
      mask: true
    });
      
      
  },
  // 点击 商品收藏图标
  handleCollect(){
    // let isCollect = false
    // 1、获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    // 2、判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    // 3、当index！=-1表示 已经收藏过
    if(index!==-1){
      // 能找到，已经收藏过了，再数组中删除该商品
      collect.splice(index,1)
      // isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
        
    }else{
      // 没有收藏过
      collect.push(this.GoodsInfo);
      // isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    // 4、把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5、修改data中的属性 isCollect
    this.setData({
      isCollect:!this.data.isCollect
    })
  },
  // 立即购买
  handeleBuy(){
    const address = wx.getStorageSync("address");
    const cartBuy = [this.GoodsInfo];
    cartBuy[0].checked = true;
    cartBuy[0].num = 1;
    wx.setStorageSync("cartBuy", cartBuy);
    if(!address){
      wx.chooseAddress({
        success: (result) => {
          let address = result;
          address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
          // 把地址缓存到本地
          wx.setStorageSync("address", address);
        }
      });
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });
        
  }
})