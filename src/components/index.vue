<template>
    <div class="index-container">
        <yd-pullrefresh :callback="loadList" ref="pullrefreshDemo">
            <ul>
                <li v-for="item in catList" :key="item.id">
                    <div class="index-hd flex-container align-center">
                        <div class="avatar">
                            <img v-lazy="item.avatar" alt="">
                        </div>
                        <div class="msg flex">
                            <h3 class="title">{{item.nickName}}</h3>
                            <p class="desc">{{item.createTime | getDateDiff}}</p>
                        </div>
                    </div>
                    <div class="index-bd">
                        <div class="text" v-html="item.html"></div>
                        <div class="multimedia">
                            <!-- 1栏布局 -->
                            <div class="lxl-layout-1 flex-container" :class="{'gif': item.imgs[0].type === 'gif'}" v-if="item.imgs.length === 1 && item.imgs[0].url">
                                <!-- 已知宽度 -->
                                <template v-if="item.imgs[0].width">
                                    <img @click="openImg($event, item)" :class="{'response': item.imgs[0].width > windowWidth}" v-if="item.imgs[0].type === 'gif'" v-lazy="item.imgs[0].gif" alt="">
                                    <img @click="openImg($event, item)" :class="{'response': item.imgs[0].width > windowWidth}" v-else v-lazy="item.imgs[0].url" alt="">
                                </template>
                                <template v-else>
                                    <img @click="openImg($event, item)" class="response" v-if="item.imgs[0].type === 'gif'" v-lazy="item.imgs[0].gif" alt="">
                                    <img @click="openImg($event, item)" class="response" v-else v-lazy="item.imgs[0].url" alt="">
                                </template>
                                <!-- 未知宽度 -->

                            </div>
                            <!-- 3栏布局 -->
                            <div class="lxl-layout-3" v-else>
                                <div class="img" v-if="imgItem.url" :class="{'gif': imgItem.type === 'gif'}" v-for="(imgItem, imgIndex) in item.imgs" :key="imgIndex">
                                    <img @click="openImg($event, item)" v-if="imgItem.type === 'gif'" v-lazy="imgItem.gif" alt="">
                                    <img @click="openImg($event, item)" v-else v-lazy="imgItem.url" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="index-ft flex-container">
                        <div>
                            <i class="iconfont icon-dianzan"></i>
                            <!-- <span>10</span> -->
                        </div>
                        <div>
                            <i class="iconfont icon-xiaoxi"></i>
                            <!-- <span>10</span> -->
                        </div>
                        <div>
                            <i class="iconfont icon-zhuanfa00"></i>
                        </div>
                    </div>
                </li>
            </ul>
        </yd-pullrefresh>

        <yd-backtop class="yd-backtop">
            <i class="iconfont icon-jiantoushang"></i>
        </yd-backtop>
    </div>
</template>

<script>

import {mapMutations} from 'vuex'
import {getCatList} from '@/api/index'
export default {
    data() {
        return {
            windowWidth: window.innerWidth - 30,
            catList: []
        }
    },
    mounted() {
        this.setTabBar('index');
        this._getCatList();
    },
    methods: {
        init() {
            this._getCatList();
        },
        // 打开图片预览
        openImg(e, item) {
            console.log(e);
            console.log(item);
            fancyBox(e.target, item.imgs);
        },
        // 下拉刷新
        loadList() {
            console.log('刷新');
            setTimeout(() => {
                this.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad');
            }, 3000);
        },
        // 获取列表数据
        _getCatList() {
            this.$dialog.loading.open('正在加载中...');
            getCatList().then(res => {
                this.$dialog.loading.close();
                console.log(res);
                res.result.forEach(item => {
                    try {
                        console.log(item);
                        item.imgs = JSON.parse(item.imgs);
                        item.videos = JSON.parse(item.videos);
                        if (item.imgs.length) {
                            item.imgs.forEach(img => {
                                img.url = img.key;
                                // 获取 .后缀
                                let index = img.key.lastIndexOf('.') + 1;
                                let str = img.key.substring(index).toLowerCase();
                                if (index === 0) {
                                    img.key = '';
                                    img.url = '';
                                    return;
                                }
                                if (str === 'gif' && index > 0) {
                                    img.gif = img.key.replace(/large/, 'thumb180');
                                    // img.key = img.key.replace(/.gif/, '.png');
                                }
                            })
                        }
                    } catch (err) {
                        console.log(err);
                    }

                });
                // thumb180
                // "https://wx2.sinaimg.cn/large/63e5c1e1gy1fhu679co41g209q05cu0x.gif"

                this.catList = res.result;
            })
        },
        ...mapMutations({
            setTabBar: 'SET_TAB_BAR'    // 映射 this.setTabBar() 为 this.$store.commit('SET_TAB_BAR')
        })
    }
}
</script>
<style lang="scss" scoped>
@import "../common/css/theme.scss";

.index-container {
    ul{
        padding-top: .3rem;
        padding-bottom: 1rem;
    }
    li{
        padding: .2rem .2rem 0 .2rem;
        margin-bottom: .3rem;
        background: #fff;
        .index-hd{
            .avatar{
                padding-right: .2rem;
                img{
                    display: block;
                    width: 1.1rem;
                    height: 1.1rem;
                    border-radius: 50%;
                }
            }
            .msg{
                .title{
                    padding-bottom: .06rem;
                    color: $title_color;
                    font-size: .32rem;
                    font-weight: normal;
                }
                .desc{
                    color: $desc_color;
                    font-size: .24rem;
                }
            }
        }
        .index-bd{
            .text{
                padding: .3rem 0;
                font-size: .28rem;
                color: $title_color;
            }
            .multimedia{
                .lxl-layout-1{
                    height: auto;
                    max-height: 3rem;
                    overflow: hidden;
                    &.gif{
                        &::before{
                            bottom: 0;
                        }
                    }
                    .response{
                        height: 100%;
                    }
                }
                .lxl-layout-3{
                    width: 100%;
                    overflow: hidden;
                    margin-left: -.1rem;
                    .img{
                        display: block;
                        float: left;
                        padding-left: .1rem;
                        padding-bottom: .1rem;
                        height: 2rem;
                        font-size: 0;
                        width: 33.33%;
                        box-sizing: border-box;
                        img{
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
                .gif{
                    position: relative;
                    &::before{
                        content: "GIF";
                        position: absolute;
                        bottom: .1rem;
                        right: 0;
                        padding: .02rem .05rem;
                        background-color: rgba(0,0,0,.4);
                        color: #fff;
                        text-align: center;
                        font-size: .18rem;

                    }
                }
            }
        }
        .index-ft{
            padding: .3rem 0;
            // border-bottom: .5px solid $border_color;
            justify-content: flex-end;
            align-content: center;
            div{
                display: flex;
                align-items: center;
                padding-left: .4rem;
                .iconfont{
                    color: $desc_color;
                    font-size: .4rem;
                }
                span {
                    color: $desc_color;
                    font-size: .28rem;
                }
                &:nth-child(1) {
                    .iconfont{
                        font-size: .38rem;
                    }
                }
            }
        }
    }
}
</style>

