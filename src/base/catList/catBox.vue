<template>
    <div v-if="item.id">
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
            <div class="multimedia" v-if="item.imgs.length">
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
            <!-- <div class="video" v-else-if="item.videos.length">
                <video :src="item.videos[0].key"></video>
            </div> -->
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
    </div>
</template>
<script>
import VuePhotoSwipe from '@/base/photoswipe/photoswipe'
export default {
    name: 'catBox',
    props: {
        item: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            windowWidth: window.innerWidth - 30,
            imgList: [],
            imgIndex: 0,
        }
    },
    methods: {

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
    },
    components: {
        VuePhotoSwipe
    }
}
</script>
