<template>
    <div>
        <header class="header-container">
            <div class="header-l" @click="goBack">
                <i class="iconfont icon-jiantou"></i>
                返回
            </div>
            <div class="header-m text-center"><slot></slot></div>
            <div class="header-r">
                <i class="iconfont icon-diandiandianshu"></i>
            </div>
        </header>
    </div>
</template>
<script>
export default {
    methods: {
        goBack() {
            console.log('back');
            this.$router.back();
        }
    }
}
</script>
<style lang="scss">
@import "../../common/css/theme.scss";
.header-container{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    padding: .45rem 0;
    background: #fff;
    .header-l{
        position: absolute;
        left: 0;
        top: 0;
        z-index: 9;
        padding: .25rem .2rem;
    }
    .header-m{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        line-height: .9rem;
        color: $title_color;
    }
    .header-r{
        position: absolute;
        right: 0;
        top: 0;
        z-index: 9;
        padding: .2rem .3rem;
        .iconfont{
            font-size: .4rem;
        }
    }
}
</style>
