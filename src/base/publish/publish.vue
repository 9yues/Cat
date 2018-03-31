<template>
  <div class="publish-container" :class="publishCls">
      <div class="publish-hd">
          <textarea name="" placeholder="分享新鲜猫..." v-model="text"></textarea>
      </div>
      <div class="publish-bd">
          <ul>
              <li v-for="(item,index) in imgs" :key="index">
                  <div class="response" :style="`backgroundImage: url(${item.key})`">
                    <span class="close" @click="deleteImg(index)"><i class="iconfont icon-guanbi"></i></span>
                  </div>
              </li>
          </ul>
          <ul class="publish-col">
              <li class="align-center justify-center flex-column">
                  <i class="iconfont icon-camera-b"></i>
                  <p>照片</p>
                  <input ref="file" class="file" type="file" accept="image/jpg,image/jpeg,image/png,image/gif" multiple @change="fileSelect">
              </li>
          </ul>
          <div class="publish-position">
              <span class="pos" @click="getLocation">
                  <i class="iconfont icon-dingwei"></i>
                  {{posText}}
              </span>
          </div>
      </div>
      <div class="publish-ft">
          <button type="button" @click="publish">发猫</button>
      </div>
      <div class="publish-close" @click="close">
          <i class="iconfont icon-guanbi"></i>
      </div>
  </div>
</template>
<script>
import {addCat, imgUpload} from '@/api/index'
import { Toast,Indicator } from 'mint-ui';
import {mapGetters, mapMutations} from 'vuex'
export default {
    data() {
        return {
            text: '',
            imgs: [],
            posText: '所在位置',
            latitude: '',
            longitude: ''
        }
    },
    computed: {
        publishCls() {
            return this.isPublish ? 'on' : ''
        },
        ...mapGetters([
            'isPublish',
            'userInfo'
        ])
    },
    methods: {
        // 多图上传
        fileSelect(e) {

            let files = e.target.files;
            let num = 0;
            console.log(files);
            if (files.length > 9) {
                Toast('喵~最多只能上传九张图片噢');
            }
            for (let i = 0; i < files.length; i++) {
                if (num === files.length) {
                    return;
                }
                // 创建 formDate对象
                let formDate = new FormData();
                formDate.append('avatar', files[i]);
                this._imgUpload(formDate).then(res => {
                    console.log(res);
                    this.createImage(res.result).then(img => {
                        this.imgs.push({
                            key: res.result,
                            src: res.result,
                            width: img.width,
                            height: img.height,
                            type: res.result.substring(res.result.lastIndexOf('.')+1)
                        });
                        num++;
                    });
                })
            }
        },
        // 动态生成image
        createImage(src) {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.src = src;
                img.onload = () => {
                    resolve(img);
                }
            });
        },
        // 删除图片
        deleteImg(index) {
            this.imgs.splice(index, 1);
        },
        // 发布
        publish() {
            if (this.text.length < 5) {
                Toast('喵~至少输入五个字噢');
                return;
            }
            if (this.imgs.length > 9) {
                Toast('喵~最多只能上传九张图片噢');
                return;
            }
            this._addCat({
                userId: this.userInfo.userId,
                nickName: this.userInfo.nickName,
                avatar: this.userInfo.avatar,
                html: this.text,
                imgs: JSON.stringify(this.imgs)
            });
        },
        // 获取当前位置
        getLocation() {
            if (navigator.geolocation){
                console.log(navigator.geolocation);
                navigator.geolocation.getCurrentPosition((position) => {
                    console.log(position);
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.posText = `经度：${this.latitude}  纬度：${this.longitude}`;
                });
            } else {
                Toast('你的浏览器太旧了，赶紧升级一下吧，喵~');
            }
        },
        // 关闭发布弹层
        close() {
            this.setIsPublish(false)
        },
        //多图上传接口
        _imgUpload(obj) {
            Indicator.open({
                text: '请稍后...'
            });
            return new Promise((resolve, reject) => {
                imgUpload(obj).then(res => {
                    Indicator.close();
                    resolve(res)
                })
            });

        },
        // 发布猫猫接口
        _addCat(obj) {
            Indicator.open({
                text: '请稍后...'
            });
            addCat(obj).then(res => {
                console.log(res)
                Indicator.close();
                this.setIsPublish(false);

                this.$refs.file.value = '';
                this.imgs = [];

                // 重新获取列表
                this.$parent.$refs.catList.pageIndex = 1;
                this.$parent.$refs.catList._getCatList();

                // 滚动到顶部
                this.$parent.$refs.backTop.returnTop();

                // console.log(this.$parent.);
            })
        },
        ...mapMutations({
            setIsPublish: 'SET_IS_PUBLISH'
        })
    }
}
</script>
<style lang="scss">
@import "../../common/css/theme.scss";
.publish-container{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 100%;
    opacity: 0;
    transform: translateY(100%);
    transition: all .4s cubic-bezier(0.82, 0.74, 0, 1.07);
    background: rgba(0,0,0,.8);
    backdrop-filter:blur(10px);
    .publish-hd{
        padding: 0 .2rem;
        textarea{
            display: block;
            padding: .2rem 0;
            width: 100%;
            height: 2rem;
            box-sizing: border-box;
            font-size: .28rem;
            color: $desc_color;
            background: none;
            border-bottom: .5px solid $desc_color;
            border-radius: 0;
            &::-webkit-input-placeholder{
                color: $desc_color;
            }
        }
    }
    .publish-bd{
        padding: .3rem .2rem;
        ul {
            width: 100%;
            li {
                position: relative;
                margin-right: .3rem;
                margin-bottom: .3rem;
                display: inline-block;
                width: 1.45rem;
                height: 1.45rem;
                color: $color;
                box-sizing: border-box;
                font-size: 0;
                .response{
                    position: relative;
                    height: 1.45rem;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: 100%;
                    .close{
                        position: absolute;
                        right: -.2rem;
                        top: -.2rem;
                        width: .4rem;
                        height: .4rem;
                        line-height: .45rem;
                        text-align: center;
                        border-radius: 50%;
                        background: rgba(0,0,0,.8);
                        .iconfont{
                            color: #fff;
                            font-size: .18rem;
                        }
                    }
                }
            }
            &.publish-col{
                li{
                    display: flex;
                    border: .5px solid $desc_color;
                    p{
                        color: $desc_color;
                        font-size: .24rem;
                    }
                    .file{
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        opacity: 0;
                    }
                    .iconfont{
                        font-size: .4rem;
                        color: $desc_color;
                    }
                    &:after{
                        content: '';
                        position: absolute;
                        right: -3px;
                        top: -3px;
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background-color: red;
                    }
                }
            }
        }
        .publish-position{
            color: $desc_color;
            .pos {
                padding: .1rem;
                border-radius: 20px;
                border: .5px solid $desc_color;
                font-size: .2rem;
                .iconfont{
                    position: relative;
                    top: 2px;
                }
            }
        }
    }
    .publish-ft{
        width: 100%;
        padding: 0 .2rem 1rem .2rem;
        box-sizing: border-box;
        button{
            display: block;
            width: 100%;
            padding: .25rem 0;
            background: $color;
            color: #fff;
            border-radius: 5px;
        }
    }
    .publish-close{
        position: absolute;
        bottom: .1rem;
        width: 100%;
        text-align: center;
        .iconfont{
            color: #fff;
            font-size: .6rem;
        }
    }
    &.on{
        opacity: 1;
        transform: translateY(0);
    }
}
</style>

