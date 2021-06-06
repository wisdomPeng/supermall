import BackTop from "components/content/backTop/BackTop";

// 返回顶部的混入封装，之后其他地方要使用返回顶部只需要先导入这个组件，然后再组件内加一行mixins: [backTopMixin]就可以使用了
export const backTopMixin = {
  components:{
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick(){
      this.$refs.scroll.scrollTo(0, 0, 300)
    },
    listenShowBackTop(position){
      (-position.y) < 1000 ? this.isShowBackTop = false : this.isShowBackTop = true;
    }
  }
}
