<template>
  <div id="home" class="wrapper">
    <!-- 顶部导航栏 -->
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <scroll class="content" ref="scroll" :probe-type="3"
            @scroll="contentScroll" :pull-up-load="true"
            @pullingUp="loadMore">
      <!-- 轮播图 -->
      <home-swiper :banners="banners"></home-swiper>
      <!-- 推荐模块 -->
      <recommend-view :recommends="recommends"></recommend-view>
      <!-- 本周流行模块 -->
      <feature-view></feature-view>
      <!-- 列表展示模块 -->
      <!--@tabClick是TabControl.vue里面组件传出的，加了@是对它进项绑定-->
      <tab-control :titles="['流行','新款','精选']" class="tab-control" @tabClick="tabClick"></tab-control>
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
          isShowBackTop: false
        }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
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
        },
        // 返回顶部
        backClick(){
          this.$refs.scroll.scrollTo(0, 0)
        },
        // 返回顶部按钮的显示和影藏
        contentScroll(position){
          // console.log(position)
          // 因为向下滑动y是负值，所以给它加个负号
          (-position.y) < 1000 ? this.isShowBackTop = false : this.isShowBackTop = true;
        },
        // 上拉加载
        loadMore(){
          console.log('上拉加载更多');
          // 调用getHomeGoods方法，之前的在created里面调用过，所以page已经是1了，再次调用后page的加1变成2了，这样就加载了第二页的数据进来
          this.getHomeGoods(this.currentType)
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
  .tab-control{
    position: sticky;
    top: 44px;
    z-index: 99;
  }
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /*.content{*/
  /*  overflow: hidden;*/
  /*  height: calc(100% - 93px);*/
  /*  margin-top: 44px;*/
  /*}*/

</style>
