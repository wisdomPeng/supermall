<template>
<!-- 通过绑定ref之后能明确拿到这个元素 -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  props:{
    probeType:{
      type:Number,
      default: 0
    },
    pullUpLoad:{
      type:Boolean,
      default: false
    }
  },
  data(){
    return{
      scroll: null
    }
  },
  mounted() {
    // 1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      observeDOM: true,
      observeImage:true,
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })

    // 2.监听滚动的位置
    if(this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', (position) => {
        // console.log(position)
        this.$emit('scroll', position)
      })
    }

    // 3.监听上拉事件
    if(this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        // console.log('上拉加载更多');]
        this.$emit('pullingUp')
      })
    }
  },
  methods:{
    scrollTo(x, y, time=300){
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    // 因为上拉加载更多只能调用一次，所以可以用finishPullUp，这样就能多次调用
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    // 记录home页面离开之前的位置
    getScrollY(){
      // 判断是否有值，有的话取出来，没有的话赋值等于0
      return this.scroll ? this.scroll.y : 0
    },
    refresh(){
      // console.log('------')
      this.scroll && this.scroll.refresh()
    }
  }
}
</script>

<style scoped>

</style>
