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
                        <img ref="previewImg" @click.stop="openImg($event, item, 0)" class="preview-img" :class="{'response': item.imgs[0].width > windowWidth}" v-if="item.imgs[0].type === 'gif'" v-lazy="item.imgs[0].gif" alt="">
                        <img ref="previewImg" @click.stop="openImg($event, item, 0)" class="preview-img" :class="{'response': item.imgs[0].width > windowWidth}" v-else v-lazy="item.imgs[0].key" alt="">
                    </template>
                    <template v-else>
                        <img ref="previewImg" @click.stop="openImg($event, item, 0)" class="preview-img response" v-if="item.imgs[0].type === 'gif'" v-lazy="item.imgs[0].gif" alt="">
                        <img ref="previewImg" @click.stop="openImg($event, item, 0)" class="preview-img response" v-else v-lazy="item.imgs[0].key" alt="">
                    </template>
                    <!-- 未知宽度 -->

                </div>
                <!-- 3栏布局 -->
                <div class="lxl-layout-3" v-else>
                    <div class="img" v-if="imgItem.key" :class="{'gif': imgItem.type === 'gif'}" v-for="(imgItem, imgIndex) in item.imgs" :key="imgIndex">
                        <img ref="previewImg" @click.stop="openImg($event, item, imgIndex)" class="preview-img" v-if="imgItem.type === 'gif'" v-lazy="imgItem.gif" alt="">
                        <img ref="previewImg" @click.stop="openImg($event, item, imgIndex)" class="preview-img" v-else v-lazy="imgItem.key" alt="">
                    </div>
                </div>
            </div>
            <!-- <div class="video" v-else-if="item.videos.length">
                <video :src="item.videos[0].key"></video>
            </div> -->
        </div>
        <div class="ft flex-container">
            <div @click.stop="clickZan(item)" :class="{'on': item.isPraise}">
                <i class="iconfont icon-dianzan"></i>
                <span v-if="item.praiseCount">{{item.praiseCount}}</span>
            </div>
            <div @click.stop="clickComment">
                <i class="iconfont icon-xiaoxi"></i>
                <span v-if="item.commentList.length">{{item.commentList.length}}</span>
            </div>
            <div>
                <i class="iconfont icon-zhuanfa00"></i>
            </div>
        </div>
    </div>
</template>
<script>
import {addZan} from '@/api/index'
import {mapGetters} from 'vuex'
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
        }
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    methods: {

        // 点赞
        clickZan(item) {
            item.isPraise = !item.isPraise;
            this._addZan({
                userId: this.userInfo.userId,
                catId: this.item.id
            })
            .then(res => {
                item.praiseCount = res.result;
            })
        },

        // 评论
        clickComment() {
            localStorage.setItem('current_cat', JSON.stringify(this.item));
            this.$router.push({
                path: `index/${this.item._id}`,
                query: {
                    isComment: 1
                }
            });
        },

        // 打开图片预览
        openImg(e, item, index) {
            console.log(item);
            console.log(e);
            item.imgs.forEach(item => {
                item.w = e.target.naturalWidth;
                item.h = e.target.naturalHeight;
            });

            this.$emit('openImg', {
                imgIndex: index,
                imgList: item.imgs
            })
        },

        // 点赞接口
        _addZan(obj) {
            return new Promise((resolve, reject) => {
                addZan(obj).then(res => {
                    resolve(res)
                })
            })
        }


    }
}
</script>
