<template>
  <div>
    <transition :name="transitionName">
        <router-view class="child-view"></router-view>
    </transition>
    <tab-bar></tab-bar>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
import TabBar from '@/base/tabBar/tabBar'
export default {
    data () {
        return {
            transitionName: 'slide-left'
        }
    },
    mounted() {
        // 刷新页面从缓存里面拿用户信息
        if (localStorage.getItem('userInfo')) {
            this.setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
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
    beforeRouteLeave (to, from, next) {
        console.log('name = ' + this.$route.name)
        if (this.$route.name === 'login') {
            this.setIsTab(false);
        } else {
            this.setIsTab(true);
        }
    },
    methods: {
        ...mapMutations({
            setIsTab: 'SET_IS_TAB',
            setUserInfo: 'SET_USER_INFO'
        })
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
