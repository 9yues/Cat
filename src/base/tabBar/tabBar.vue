<template>
    <div>
        <footer class="tabbar-container flex-container align-center text-center" :class="{'on': !isTab}">
            <router-link class="flex" to="/index">
                <i class="iconfont" :class="indexCls"></i>
                <span class="tabbar-text">首页</span>
            </router-link>
            <router-link class="flex" to="/message">
                <i class="iconfont" :class="messageCls"></i>
                <span class="tabbar-text">消息</span>
            </router-link>
            <a class="flex tabbar-add" href="javascript:;" @click="showPublish">
                <img src="../../common/images/logo.png" alt="">
            </a>
            <router-link class="flex" to="/aaa">
                <i class="iconfont icon-search"></i>
                <span class="tabbar-text">发现</span>
            </router-link>
            <router-link class="flex" to="/user">
                <i class="iconfont" :class="userCls"></i>
                <span class="tabbar-text">我的</span>
            </router-link>
        </footer>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
    data() {
        return {

        }
    },
    computed: {
        indexCls() {
            return this.tabBar === 'index' ? 'icon-yduizhuyexuanzhong' : 'icon-yduizhuye'
        },
        messageCls() {
             return this.tabBar === 'message' ? 'icon-xiaoxi-shixin' : 'icon-xiaoxi-yuanshijituantubiao'
        },
        userCls() {
             return this.tabBar === 'user' ? 'icon-yduigerenzhongxinxuanzhong' : 'icon-yduigerenzhongxin'
        },
        ...mapGetters([
            'tabBar',    // 相当于 this.singer 为 this.$store.getters.singer
            'isTab'
        ])
    },
    methods: {
        showPublish() {
            this.setIsPublish(true);
        },
        ...mapMutations({
            setIsPublish: 'SET_IS_PUBLISH'
        })
    }
}
</script>
<style lang="scss" scoped>
.tabbar-container{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    transition: all .3s cubic-bezier(0.82, 0.74, 0, 1.07);
    background: rgba(255,255,255,.8);
    backdrop-filter:blur(10px);
    &.on{
        transform: translateY(1.2rem);
    }
    .flex{
        .iconfont{
            font-size: .5rem;
        }
        .tabbar-text{
            display: block;
            font-size: .24rem;
        }
        &.router-link-exact-active{
            color: #f6c01c;
        }
    }
    .tabbar-add{
        img{
            display: block;
            margin: 0 auto;
            width: 1rem;
            height: 1rem;
        }
    }
}
</style>
