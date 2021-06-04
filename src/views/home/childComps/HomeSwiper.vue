
<template>
  <swiper>
    <swiper-item v-for="item in banners">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
// import {Swiper} from "components/common/swiper";
// import {SwiperItem} from "components/common/swiper";
// swiper里面创建了index.js对Swiper和SwiperItem的进行导出
import {Swiper, SwiperItem} from 'components/common/swiper'

export default {
  name: "HomeSwiper",
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data(){
    return{
      isLoad: false
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods:{
    imageLoad(){
      if(!this.isLoad){
        this.$emit('swiperImageLoad')
        this.isLoad = true
      }
    }
  }
}
</script>

<style scoped>

</style>
