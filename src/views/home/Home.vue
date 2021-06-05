<template>
  <div id="home" class="wrapper">
    <!-- 顶部导航栏 -->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl1" v-show="isTbaFixed"/>
    <scroll class="content" ref="scroll" :probe-type="3"
            @scroll="contentScroll" :pull-up-load="true"
            @pullingUp="loadMore">
      <!-- 轮播图 -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <!-- 推荐模块 -->
      <recommend-view :recommends="recommends"></recommend-view>
      <!-- 本周流行模块 -->
      <feature-view></feature-view>
      <!-- 列表展示模块 -->
      <!--@tabClick是TabControl.vue里面组件传出的，加了@是对它进项绑定-->
      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl2"></tab-control>
      <!-- 商品展示 -->
      <goods-list :goods="showGoods"></goods-list>

    </scroll>
      <!-- 监听组件的点击必须数绑定.native -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import {getHomeMultidata,getHomeGoods} from "network/home";
//防抖动方法
import {debounce} from "common/utils";


export default {
    name: "Home",
    components: {
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,
      HomeSwiper,
      RecommendView,
      FeatureView,
    },
    data(){
        return{
          banners: [],
          recommends: [],
          goods: {
            'pop': {page: 0, list: []},
            'new': {page: 0, list: []},
            'sell': {page: 0, list: []},
          },
          currentType: 'pop',
          isShowBackTop: false,
          isTbaFixed: false,
          saveY: 0
        }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    // 离开页面，之前的页面会销毁，阻止销毁去App.vue中加上keep-view标签
    destroyed() {
      console.log('home destroyed')
    },
    // 页面处于活跃时触发
    activated() {
      // console.log(this.saveY)
      // this.$refs.scroll.scrollTo(0,this.saveY,0)
      // 网上找的，解决回到此页面自动回到顶部的bug
      setTimeout(() => {
        this.$refs.scroll.scrollTo(0, this.saveY, 0);
      }, 0);
      // 回来时最好进行一次refresh刷新，不然可能会返回此页面时可以会自动回到顶部
      this.$refs.scroll.refresh()
    },
    // 页面不活跃时触发，即离开时
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
    },
    created() {
      // 1.请求多个数据
      //this.getHomeMultidata()是methods是下面定义的方法
      this.getHomeMultidata()
      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted() {
      // 获取tabControl的offsetTop
      // 所以组件都有一个属性$el，用于获取组件中的元素
      // console.log(this.$refs.tabControl.$el.offsetTop)
    },
    methods: {
        /*
         事件监听相关的方法
       */
        tabClick(index){
          // console.log(index)
          switch (index){
            case 0: this.currentType='pop';break;
            case 1: this.currentType='new';break;
            case 2: this.currentType='sell';break;
          }
          // 为了使滑动固定的tabControl1和真正的列表展示栏tabControl2的显示一致
          this.$refs.tabControl1.currentIndex = index
          this.$refs.tabControl2.currentIndex = index
        },
        // 返回顶部
        backClick(){
          this.$refs.scroll.scrollTo(0, 0)
        },
        contentScroll(position){
          // console.log(position)
          // 1.返回顶部按钮的显示和影藏
          // 因为向下滑动y是负值，所以给它加个负号
          (-position.y) < 1000 ? this.isShowBackTop = false : this.isShowBackTop = true;

          // 2.决定tabControl是否吸顶（position: fixed）
          this.isTbaFixed = (-position.y) > this.tabOffsetTop
        },
        // 上拉加载
        loadMore(){
          console.log('上拉加载更多');
          // 调用getHomeGoods方法，之前的在created里面调用过，所以page已经是1了，再次调用后page的加1变成2了，这样就加载了第二页的数据进来
          this.getHomeGoods(this.currentType)
        },
        // 监听轮播图片加载完成，并获得tabControl的offsetTop
        swiperImageLoad(){
          // console.log(this.$refs.tabControl2.$el.offsetTop)
          this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
        },

        /*
          网络请求相关代码
        */
        getHomeMultidata(){
          //这里的getgetHomeMultidata()是"network/home"用import导入的
          getHomeMultidata().then( res => {
            // console.log(res);
            //将res返回的结果保存到data函数里面的参数中
            this.banners = res.data.banner.list;
            this.recommends = res.data.recommend.list;
          })
        },
        getHomeGoods(type){
          const page = this.goods[type].page + 1
          getHomeGoods(type,page).then(res => {
            // console.log(res)
            this.goods[type].list.push(...res.data.list)
            this.goods[type].page + 1;

            // 因为上拉加载更多只能调用一次，所以可以用finishPullUp，这样就能多次调用
            this.$refs.scroll.finishPullUp();
          })
        }
    }
}
</script>

<!--这里的scope表示的是作用域，加了这个之后，别的组件有相同名字的类名和样式，也互不影响-->
<style scoped>
  #home{
    position: relative;
    /*vh是viewport height,视口高度*/
    height: 100vh;
    padding-top: 44px;
  }
  .home-nav{
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 99;
    background-color: var(--color-tint);
    color: #fff;
  }
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control{
    position: relative;
    z-index: 99;
  }

  /*.content{*/
  /*  overflow: hidden;*/
  /*  height: calc(100% - 93px);*/
  /*  margin-top: 44px;*/
  /*}*/

</style>
