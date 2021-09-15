/**
 * 1、获取用户的收货地址
 *    1、绑定点击事件
 *    2、调用小程序内置api 获取用户的收货地址
 *    3、将获取到的收货地址 存入到 本地存储中
 * 2、页面加载完毕
 *    0、onLoad onShow
 *    1、获取本地存储中的地址数据
 *    2、把数据 设置给data中的一个变量
 * 3、onShow
 *    0、回到了商品详情页面，第一次添加商品的时候，手动添加了属性 用于判断是否勾选
 *    1、获取缓存中的购物车数组
 *    2、把购物车数据 填充到data中
 * 4、全选的实现 数据的展示
 *    1、onShow 获取缓存中的购物车数组
 *    2、根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就被选中
 * 5、总价格和总数量
 *    1、都需要商品被选中 我们才拿它计算
 *    2、获取购物车数组
 *    3、遍历
 *    4、判断商品是否被选中
 *    5、总价格 += 商品的单价 * 商品的数量
 *    5、总数量 += 商品的数量
 *    6、把计算后的价格和数量 设置回data中即可
 * 6、商品的选中
 *    1、绑定change事件
 *    2、获取到被修改的商品对象
 *    3、商品对象的选中状态 取反
 *    4、重新填充回data中和缓存中
 *    5、重新计算全选。总价格，总数量。。。
 * 7、全选和反选
 *    1、全选复选框绑定事件 change
 *    2、获取data中的全选变量 allChecked
 *    3、直接取反 allChecked=!allChecked
 *    4、遍历购物车数组，让里面 商品 选中状态跟随 allChecked 改变而改变
 *    5、把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中
 * 8、商品数量的编辑
 *    1、“+” “-” 按钮 绑定同一个点击事件 区分的关键 自定义属性
 *      1、“+” “+1”
 *      2、“-” “-1”
 *    2、传递被点击的商品id goods_id
 *    3、获取data中的购物车数组 来获取需要被修改的商品对象
 *    4、当 购物车的数量 =1 同时 用户 点击 “-”
 *        弹窗提示，询问用户 是否需要删除
 *        1、确定 直接执行删除
 *        2、取消 什么都不做
 *    4、直接修改商品对象的数量 num
 *    5、把cart数组 重新设置回 缓存中 和 data中 this.setCart
 * 9、点击结算
 *    1、判断有没有收货地址信息
 *    2、判断用户有没有选购商品
 *    3、经过以上的验证 跳转到 支付页面！
 */
import {showModal,showToast,getUserProfile} from "../../utils/asyncWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 页面显示
  onShow(){
    // 1、获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    // 1、获取缓存中的数据
    const cart = wx.getStorageSync("cart")||[];
    // 1、计算全选
    // every 数组方法 会遍历 会接受一个回调函数 那么 每个回调函数都返回true
    //    那么 every方法的返回值为true
    // 只要 有一个回调函数返回false 那么不再循环执行，直接返回false
    // 空数组 调用 every，返回值就是true
    // const allChecked = cart.length?cart.every(v=>v.checked):false
    this.setCart(cart)
    // 2、给data赋值
    this.setData({
      address
    })
  },
  // 点击 获取收货地址
  handleChooseAddress(){
    // 2获取收货地址
    wx.chooseAddress({
      success: (result) => {
        let address = result;
        address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
        // 把地址缓存到本地
        wx.setStorageSync("address", address);
      }
    });
      
  },
  // 商品的选中
  handleItemChange(e){
    // 1、获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id
    // 2、获取购物车数组
    let {cart} = this.data;
    // 3、找到被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id===goods_id)
    // 4、选中状态取反
    cart[index].checked=!cart[index].checked;
    
    this.setCart(cart)
    
    
  },
  // 设置购物车状态同时，重新计算 底部工具栏的 全选 总价格 购买的数量
  setCart(cart){
    let allChecked=true;
    // 1、总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length!=0?allChecked:false;
    this.setData({
      cart,
      totalPrice,totalNum,allChecked
    });
    wx.setStorageSync("cart",cart)
  },
  // 商品全选功能
  handleItemAllCheck(){
    // 1、获取data中的数据
    let {cart,allChecked} = this.data;
    // 2、修改值
    allChecked=!allChecked;
    // 3、循环修改cart数组 中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    // 4、把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e){
    // 1 获取商品id和加或减
    let {id,operation} = e.currentTarget.dataset;
    // 2 获取购物车数组
    let {cart} = this.data;
    // cart.forEach(v=>v.goods_id===id?v.num+=operation:v.num)
    // 3 找到需要修改的商品的索引
    const index = cart.findIndex(v=>v.goods_id===id)
    // 4 进行修改数量
    if(cart[index].num===1 && operation===-1){
      const res=await showModal({content:"您是否要删除？"})
      if(res.confirm){
        cart.splice(index,1);
      }   
    }else{
      cart[index].num+=operation;
    }
    // 更新购物车状态
    this.setCart(cart)
  },
  // 点击结算后的功能
  async handlePay(){
    const userinfo = wx.getStorageSync("userinfo");
    if(userinfo){
      // 1、判断收货地址
      const {address,totalNum}=this.data;
      if(!address.userName){
        await showToast({title:"您还没有选择收货地址"});  
        return;
      }
      // 2、判断用户有没有选购商品
      if(totalNum===0){
        await showToast({title:"您还没有选购商品"});
        return;
      }
      // 3、跳转到 支付页面
      wx.navigateTo({
        url: '/pages/pay/index'
      });   
    }else{
      const newUserInfo = await getUserProfile();
      wx.setStorageSync("userinfo", newUserInfo);
    }
    
    

  }
})