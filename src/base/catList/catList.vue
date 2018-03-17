<template>
    <div>
        <ul class="index-list-ul">
            <li v-for="item in catList" :key="item.id">
                <div class="hd flex-container align-center">
                    <div class="avatar">
                        <img v-lazy="item.avatar" alt="">
                    </div>
                    <div class="msg flex">
                        <h3 class="title">{{item.nickName}}</h3>
                        <p class="desc">{{item.createTime | getDateDiff}}</p>
                    </div>
                </div>
                <div class="bd">
                    <div class="text" v-html="item.html"></div>
                    <div class="multimedia">
                        <!-- 1栏布局 -->
                        <div class="lxl-layout-1 flex-container" :class="{'gif': item.imgs[0].type === 'gif'}" v-if="item.imgs.length === 1 && item.imgs[0].key">
                            <!-- 已知宽度 -->
                            <template v-if="item.imgs[0].width">
                                <img ref="previewImg" @click="openImg($event, item, 0)" class="preview-img" :class="{'response': item.imgs[0].width > windowWidth}" v-if="item.imgs[0].type === 'gif'" v-lazy="item.imgs[0].gif" alt="">
                                <img ref="previewImg" @click="openImg($event, item, 0)" class="preview-img" :class="{'response': item.imgs[0].width > windowWidth}" v-else v-lazy="item.imgs[0].key" alt="">
                            </template>
                            <template v-else>
                                <img ref="previewImg" @click="openImg($event, item, 0)" class="preview-img response" v-if="item.imgs[0].type === 'gif'" v-lazy="item.imgs[0].gif" alt="">
                                <img ref="previewImg" @click="openImg($event, item, 0)" class="preview-img response" v-else v-lazy="item.imgs[0].key" alt="">
                            </template>
                            <!-- 未知宽度 -->

                        </div>
                        <!-- 3栏布局 -->
                        <div class="lxl-layout-3" v-else>
                            <div class="img" v-if="imgItem.key" :class="{'gif': imgItem.type === 'gif'}" v-for="(imgItem, imgIndex) in item.imgs" :key="imgIndex">
                                <img ref="previewImg" @click="openImg($event, item, imgIndex)" class="preview-img" v-if="imgItem.type === 'gif'" v-lazy="imgItem.gif" alt="">
                                <img ref="previewImg" @click="openImg($event, item, imgIndex)" class="preview-img" v-else v-lazy="imgItem.key" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ft flex-container">
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
        <vue-photo-swipe :list="imgList" :img-index="imgIndex" @close="imgClose"></vue-photo-swipe>
    </div>
</template>
<script>
import VuePhotoSwipe from '@/base/photoswipe/photoswipe'
import {getCatList} from '@/api/index'
import { Indicator } from 'mint-ui'

export default {
    data() {
        return {
            windowWidth: window.innerWidth - 30,
            catList: [],
            imgList: [],
            imgIndex: 0
        }
    },
    mounted() {
        this.init();
    },
    methods: {

        init() {
            this._getCatList();
        },

        // 打开图片预览
        openImg(e, item, index) {
            console.log(item);
            console.log(e);
            item.imgs.forEach(item => {
                item.w = e.target.naturalWidth;
                item.h = e.target.naturalHeight;
            });
            this.imgIndex = index;
            this.imgList = item.imgs;
        },

        // 关闭图片预览
        imgClose() {
            this.imgList = [];
            this.imgIndex = 0;
        },


        // 获取列表数据
        _getCatList() {
            Indicator.open();
            getCatList().then(res => {
                Indicator.close();
                console.log(res);
                res.result.forEach(item => {
                    try {
                        console.log(item);
                        item.imgs = JSON.parse(item.imgs);
                        item.videos = JSON.parse(item.videos);
                        if (item.imgs.length) {
                            item.imgs.forEach(img => {
                                img.src = img.key;
                                // 获取 .后缀
                                let index = img.key.lastIndexOf('.') + 1;
                                let str = img.key.substring(index).toLowerCase();
                                if (index === 0) {
                                    img.key = '';
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
        }
    },
    components: {
        VuePhotoSwipe
    }
}
</script>
<style lang="scss">
@import "../../common/css/theme.scss";

.index-container {
    .index-list-ul{
        padding-top: .3rem;
        padding-bottom: 1rem;
        li{
        padding: .2rem .2rem 0 .2rem;
        margin-bottom: .3rem;
        background: #fff;
            .hd{
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
            .bd{
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
            .ft{
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

}
</style>
