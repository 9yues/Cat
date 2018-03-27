<template>
    <div class="index-detail-container">
        <cat-header>详情</cat-header>
        <ul class="index-list-ul">
            <li>
                <cat-box :item="item"></cat-box>
            </li>
        </ul>
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
import CatBox from '@/base/catList/catBox'
import CatHeader from '@/base/header/header'
export default {
    data() {
        return {
            item: {}
        }
    },
    mounted() {
        this.setIsTab(false)
        this.item = JSON.parse(localStorage.getItem('current_cat'));
    },
    methods: {
        ...mapMutations({
            setIsTab: 'SET_IS_TAB'
        })
    },
    components: {
        CatHeader,
        CatBox
    }
}
</script>
<style lang="scss">
.index-detail-container{
    padding-top: 1.2rem;
}
</style>
