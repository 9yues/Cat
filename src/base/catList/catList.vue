<template>
    <div>
        <mt-loadmore
        :top-method="loadTop"
        :bottom-all-loaded="allLoaded"
        @top-status-change="handleTopChange"
        ref="loadmore">
            <ul class="index-list-ul">
                <li v-for="item in catList" :key="item.id" @click="goDetail(item)">
                    <cat-box :item="item" @openImg="openImg"></cat-box>
                </li>
            </ul>
            <div slot="top" class="mint-loadmore-top">
                <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
                <span v-show="topStatus === 'loading'">
                    <img src="../../common/images/loading.svg">
                </span>
            </div>
        </mt-loadmore>
        <vue-photo-swipe :list="imgList" :imgIndex="imgIndex" @close="imgClose"></vue-photo-swipe>
    </div>
</template>
<script>
import VuePhotoSwipe from '@/base/photoswipe/photoswipe'
import CatBox from '@/base/catList/catBox'
import {getCatList} from '@/api/index'
import { Indicator,Loadmore } from 'mint-ui'
import {mapGetters} from 'vuex'
export default {
    name: 'catList',
    data() {
        return {
            windowWidth: window.innerWidth - 30,
            catList: [],
            pageIndex: 1,
            pageSize: 10,
            topStatus: '',
            imgList: [],
            imgIndex: 0,
            allLoaded: false,
            loadingFlag: false
        }
    },
    watch: {
        pageIndex(val) {
            if (val > 1) {
                this._getCatList();
            }
        }
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    mounted() {
        this.init();
    },
    methods: {

        init() {
            this._getCatList();
            console.log(this.$route)

            //  监听全局滚动
            this.loadMore();
        },

        // 跳转至详情
        goDetail(item) {
            localStorage.setItem('current_cat', JSON.stringify(item));
            this.$router.push(`index/${item._id}`);
        },

        // 监听下拉的状态
        handleTopChange(status) {
            this.topStatus = status;
        },
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

        // 下拉刷新
        loadTop() {
            console.log('刷新');
            this.pageIndex = 1;
            this._getCatList().then(() => {
                this.$refs.loadmore.onTopLoaded();
            });
        },
        // 上拉加载更多
        loadMore() {
            let self = this;
            $(document).on('scroll', function(){
                if ($(window).height() + $(this).scrollTop() + 50 >= $(document).height() && !self.loadingFlag) {
                    // 执行加载
                    console.log('加载');
                    self.pageIndex++;
                }
            })
        },

        // 获取列表数据
        _getCatList() {
            return new Promise((resolve, reject) => {
                this.loadingFlag = true;
                Indicator.open();
                getCatList({
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize
                }).then(res => {
                    Indicator.close();
                    res.result.forEach(item => {

                        // 根据id设置说说的主人头像和昵称
                        if (item.userId == this.userInfo.userId) {
                            item.nickName = this.userInfo.nickName;
                            item.avatar = this.userInfo.avatar;
                        }

                        // 解析点赞列表
                        item.praiseList = JSON.parse(item.praiseList);
                        if (item.praiseList.length) {
                            let praiseCount = 0;
                            item.praiseList.forEach(commentItem => {
                                // 判断自己是否点赞
                                if (commentItem.userId == this.userInfo.userId && commentItem.isPraise) {
                                    item.isPraise = true;
                                }
                                // 计算有多少人点赞
                                if (commentItem.isPraise) {
                                    praiseCount++;
                                }
                                // 计算有多少人评论
                                if (commentItem.comment) {
                                    commentCount++
                                }
                            });
                            item.praiseCount = praiseCount;
                        }
                        if (item.isPraise === undefined) item.isPraise = false;
                        if (item.praiseCount === undefined) item.praiseCount = 0;

                        // 解析评论列表
                        item.commentList = JSON.parse(item.commentList);

                        // 解析图片
                        try {
                            if (item.imgs.length) item.imgs = JSON.parse(item.imgs);
                            if (item.videos.length) item.videos = JSON.parse(item.videos);
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

                                    if (str === 'gif') {
                                        if (index > 0) {
                                            img.gif = img.key.replace(/large/, 'thumb180');
                                        }
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

                    if (!this.catList.length || this.pageIndex === 1) {
                        this.catList = res.result;
                    } else {
                        if (this.pageIndex > 1) this.catList = this.catList.concat(res.result);
                    }

                    this.$nextTick(() => {
                        this.loadingFlag = false;
                    });
                    resolve(res);
                })
            });
        }
    },
    components: {
        CatBox,
        VuePhotoSwipe,
        'mt-loadmore': Loadmore
    }
}
</script>
