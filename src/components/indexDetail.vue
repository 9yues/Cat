<template>
    <div class="index-detail-container">
        <cat-header>详情</cat-header>
        <ul class="index-list-ul">
            <li>
                <cat-box :item="item" @openImg="openImg"></cat-box>
            </li>
        </ul>

        <ul class="comments-container">
            <li class="flex-container" v-for="commentItem in item.commentList" :key="item.id">
                <div class="comments-l">
                    <img v-lazy="commentItem.avatar" />
                </div>
                <div class="comments-r flex">
                    <div class="nickName">
                        {{commentItem.nickName}}
                        <div class="more">
                            <span class="zan">
                                <i class="iconfont icon-dianzan"></i>

                            </span>
                            <span class="com">
                                <i class="iconfont icon-xiaoxi"></i>
                            </span>
                        </div>
                    </div>
                    <div class="time">{{commentItem.commentTime | getDateDiff}}</div>
                    <div class="content">{{commentItem.commentContent}}</div>
                </div>
            </li>
        </ul>

        <div class="comments-fixed">
            <div class="comments-input flex-container align-center">
                <input ref="input" class="flex" type="text" placeholder="喵了个咪..." @click="inputClick" v-model="content">
                <button class="btn" type="button" @click="send">发送</button>
            </div>
            <div class="expression">

            </div>
        </div>
        <vue-photo-swipe :list="imgList" :imgIndex="imgIndex" @close="imgClose"></vue-photo-swipe>
        <back-top ref="backTop"></back-top>
    </div>
</template>
<script>
import {addComment} from '@/api/index'
import {mapMutations, mapGetters} from 'vuex'
import { Toast,Indicator } from 'mint-ui'
import VuePhotoSwipe from '@/base/photoswipe/photoswipe'
import CatBox from '@/base/catList/catBox'
import CatHeader from '@/base/header/header'
import BackTop from '@/base/backtop/backtop'
export default {
    data() {
        return {
            item: {},
            imgList: [],
            imgIndex: 0,
            content: ''
        }
    },
    mounted() {
        this.setIsTab(false);
        this.item = JSON.parse(localStorage.getItem('current_cat'));
        this.item.commentList = JSON.parse(this.item.commentList);
        if (this.$route.query.isComment) {
            this.$refs.input.click();
        }
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    methods: {
        // 打开图片
        openImg(obj) {
            this.imgList = obj.imgList;
            this.imgIndex = obj.imgIndex;
        },
        // 关闭图片
        imgClose() {
            this.imgList = [];
            this.imgIndex = 0;
        },
        inputClick(e) {
            setTimeout(() =>{
                $('html,body').animate({
                    scrollTop: $(document).height()
                },0);
            },300);
        },
        // 发送
        send() {
            if (!this.content.length) {
                Toast('喵~请输入内容噢')
                return;
            }
            this._addComment({
                userId: this.userInfo.userId,
                nickName: this.userInfo.nickName,
                avatar: this.userInfo.avatar,
                catId: this.item.id,
                content: this.content
            });
        },
        // 评论接口
        _addComment(obj) {
            addComment(obj).then(res => {
                console.log(res);
                if (res.status === 1) {
                    Toast('喵~评论失败')
                    return;
                }
                this.item.commentList = res.result.list;
                localStorage.setItem('current_cat', JSON.stringify(this.item))
                Toast({
                    message: '评论成功',
                    iconClass: 'iconfont icon-zhengque'
                });
                this.content = '';
                $('html,body').animate({
                    scrollTop: $(document).height()
                },500);
            })
        },
        ...mapMutations({
            setIsTab: 'SET_IS_TAB'
        })
    },
    components: {
        BackTop,
        CatHeader,
        CatBox,
        VuePhotoSwipe
    }
}
</script>
<style lang="scss">
@import "../common/css/theme.scss";
.index-detail-container{
    padding-top: 1.2rem;
    padding-bottom: 1rem;
}
.comments-container{
    margin-top: .3rem;
    background: #fff;
    li {
        padding: .2rem;
        border-bottom: .5px solid $border_color;
    }
    .comments-l{
        padding-right: .2rem;
        img {
           width: 1rem;
           height: 1rem;
           border-radius: 50%;
        }
    }
    .comments-r{
        .nickName{
            position: relative;
            color: $title_color;
            font-size: .32rem;
            .more{
                position: absolute;
                right: 0;
                top: 0;
                color: $desc_color;
                span {
                    font-size: .22rem;
                }
                .zan{
                    margin-right: .1rem;
                }
            }
        }
        .time{
            margin: .1rem 0;
            color: $desc_color;
            font-size: .22rem;
        }
        .content{
            font-size: .28rem;
            line-height: .5rem;
        }
    }
}

.comments-fixed{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    // padding: .1rem;
    background: rgba(255,255,255,.8);
    backdrop-filter:blur(10px);
    box-sizing: border-box;
    border-top: .5px solid $border_color;
    .comments-input {
        .flex {
            padding: .2rem .2rem;
            border: none;
            border-radius: 0;
            background: none;
        }
        .btn{
            padding: .2rem .2rem;
            background: $color;
            color: #fff;
        }
    }
}
</style>
