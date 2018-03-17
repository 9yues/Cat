<template>
  <div v-show="flag" class="backtop" @click="returnTop">
      <i class="iconfont icon-jiantoushang"></i>
  </div>
</template>
<script>
export default {
    data() {
        return {
            flag: false
        }
    },
    mounted() {
        let self = this;
        $(document).on('scroll', function(){
            if ($(this).scrollTop() > 100) {
                self.flag = true;
            } else {
                self.flag = false;
            }
        })
    },
    methods: {
        returnTop() {
            $('html,body').animate({
                scrollTop: 0
            });
        }
    }
}
</script>
<style lang="scss">
.backtop{
    position: fixed;
    right: .6rem;
    bottom: 1.5rem;
    width: .8rem;
    height: .8rem;
    line-height: .8rem;
    text-align: center;
    border: none;
    border-radius: 3px;
    background: rgba(0,0,0,.3);
    .iconfont{
        color: #fff;
    }
    &:after{
        display: none;
    }
}
</style>
