<template>
    <div class="index-container">
        <cat-list></cat-list>
        <back-top></back-top>
    </div>
</template>

<script>
import CatList from '@/base/catList/catList'
import BackTop from '@/base/backtop/backtop'
import {mapMutations} from 'vuex'
export default {
    data() {
        return {

        }
    },
    mounted() {
        this.setTabBar('index');
    },
    methods: {
        init() {

        },
        ...mapMutations({
            setTabBar: 'SET_TAB_BAR'    // 映射 this.setTabBar() 为 this.$store.commit('SET_TAB_BAR')
        })
    },
    components: {
        CatList,
        BackTop
    }
}
</script>
<style lang="scss" scoped>

.index-container {
    padding: 0 .3rem;
    box-sizing: border-box;
    background: url(../common/images/bg.jpg) repeat-y;
    background-attachment: fixed;
    background-size: 100%;
}
</style>

