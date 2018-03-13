<template>
  <div>
    <transition :name="transitionName">
        <router-view class="child-view"></router-view>
    </transition>
    <tab-bar></tab-bar>
  </div>
</template>

<script>
import TabBar from '@/base/tabBar/tabBar'
export default {
    data () {
        return {
            transitionName: 'slide-left'
        }
    },
    beforeRouteUpdate (to, from, next) {
        let isBack = this.$router.isBack
        if (isBack) {
        this.transitionName = 'slide-right'
        } else {
        this.transitionName = 'slide-left'
        }
        this.$router.isBack = false
        next()
    },
    components: {
        TabBar
    }
}
</script>

<style scoped>
  .child-view {
  position: absolute;
  left: 0;
  width:100%;
  transition: all .8s cubic-bezier(.55,0,.1,1);
  }
  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(50px, 0);
    transform: translate(50px, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-50px, 0);
    transform: translate(-50px, 0);
  }
  .header {
    position:absolute;
    height:44px;
    background:#0058f1;
    width:100%
  }
</style>
