<template>
  <div class="login-container">
      <video v-if="!isAndroid" ref="video" src="../common/images/cat.mp4" controls loop autoplay webkit-playsinline="true" playsinline="true" x-webkit-airplay="allow"></video>
      <img v-else src="../common/images/bg.jpg" class="login-bg" alt="">
      <div class="box flex-container">
          <div class="dialog" :class="loginCls">
              <div class="user group flex-container align-center">
                  <div class="icon">
                      <i class="iconfont icon-shouji"></i>
                  </div>
                  <div class="text flex">
                      <input type="tel" placeholder="请输入您的手机号" v-model="login.tel">
                  </div>
              </div>
              <div class="pass group flex-container align-center">
                  <div class="icon">
                      <i class="iconfont icon-mima"></i>
                  </div>
                  <div class="text flex">
                      <input type="password" placeholder="请输入您的密码" v-model="login.pass">
                  </div>
              </div>
              <div class="btn">
                  <button class="login-btn" type="button" @click="loginSubmit">登录</button>
                  <button class="login-reg" type="button" @click="switchState">还没有账号？立即注册</button>
              </div>
              <div class="desc flex-container">
                  <div class="flex">
                      <!-- <a href="javascript:;">找回</a> -->
                  </div>
              </div>
          </div>
          <div class="dialog" :class="regCls">
              <div class="user group flex-container align-center">
                  <div class="icon">
                      <i class="iconfont icon-shouji"></i>
                  </div>
                  <div class="text flex">
                      <input type="tel" placeholder="请输入您的手机号" v-model="reg.tel">
                  </div>
              </div>
              <!-- <div class="code group flex-container align-center">
                  <div class="icon">
                      <i class="iconfont icon-mail"></i>
                  </div>
                  <div class="text flex">
                      <input type="tel" maxlength="4" placeholder="请输入短信验证码" v-model="reg.code">
                      <button type="button" @click="getCode" :disabled="disabled">{{codeText}}</button>
                  </div>
              </div> -->
              <div class="pass group flex-container align-center">
                  <div class="icon">
                      <i class="iconfont icon-mima"></i>
                  </div>
                  <div class="text flex">
                      <input type="password" placeholder="请输入您的密码" v-model="reg.pass">
                  </div>
              </div>
              <div class="btn">
                  <button class="login-btn" type="button" @click="regSubmit">注册</button>
                  <button class="login-reg" type="button" @click="switchState">已有账号？立即登录</button>
              </div>
              <div class="desc flex-container">
                  <div class="flex">
                      <!-- <a href="javascript:;">找回</a> -->
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import {checkMobile} from '@/common/js/util'
import {addUser, login} from '@/api/index'
import { Toast,Indicator } from 'mint-ui'
import {mapMutations} from 'vuex'

export default {
    data() {
        return {
            isAndroid,
            login: {
                tel: '15521054523',
                pass: '000000'
            },
            reg: {
                tel: '',
                code: '',
                pass: ''
            },
            disabled: false,
            state: 'login',
            codeText: '获取验证码'
        }
    },
    mounted() {
        this.setIsTab(false);
        document.addEventListener('WeixinJSBridgeReady', () => {
            this.$refs.video.play();
        }, false);
    },
    computed: {
        loginCls() {
            return this.state === 'reg' ? 'login-dialog' : ''
        },
        regCls() {
            return this.state === 'login' ? 'reg-dialog' : ''
        }
    },
    methods: {
        // 登录
        loginSubmit() {
            if (!checkMobile(this.login.tel)) {
                Toast('喵~请输入正确的手机号噢');
                return;
            }
            if (this.login.pass.length < 6) {
                Toast('喵~密码不能少于6位噢');
                return;
            }
            this._login();
        },
        // 注册
        regSubmit() {
            if (!checkMobile(this.reg.tel)) {
                Toast('喵~请输入正确的手机号噢');
                return;
            }
            // if (!this.reg.code.length < 4) {
            //     Toast('喵~请输入正确的验证码噢');
            //     return;
            // }
            if (this.reg.pass.length < 6) {
                Toast('喵~密码不能少于6位噢');
                return;
            }
            this._addUser();
        },
        // 获取验证码
        getCode() {
            if (!checkMobile(this.reg.tel)) {
                Toast('喵~请输入正确的手机号噢');
                return;
            }
            this.disabled = true;
            // 开始倒计时
            let n = 60;
            let t = setInterval(() => {
                n--;
                if (n === 0) {
                    clearInterval(t);
                    this.codeText = '重新获取';
                    this.disabled = false;
                    return;
                }
                this.codeText = `${n}秒`;
            }, 1000);
        },
        // 切换状态
        switchState() {
            if (this.state === 'login') {
                this.state = 'reg'
            } else {
                this.state = 'login'
            }
        },
        // 用户登录
        _login() {
            Indicator.open({
                text: '登录中',
                spinnerType: 'fading-circle'
            });
            login({
                tel: this.login.tel,
                pass: this.login.pass
            }).then(res => {
                Indicator.close();
                if (res.status === 2) {
                    Toast({
                        message: res.msg,
                        iconClass: 'iconfont icon-guanbi'
                    });
                    return;
                }
                Toast({
                    message: res.msg,
                    iconClass: 'iconfont icon-zhengque'
                });
                localStorage.setItem('userInfo', JSON.stringify(res.result))
                this.setUserInfo(res.result)
                this.setIsTab(true)
                console.log(this);
                this.$router.push('index')
            })
        },
        //  添加用户
        _addUser() {
            Indicator.open();
            addUser({
                tel: this.reg.tel,
                pass: this.reg.pass
            }).then(res => {
                Indicator.close();
                if (res.status === 2) {
                    Toast({
                        message: res.msg,
                        iconClass: 'iconfont icon-guanbi'
                    });
                    return;
                }
                Toast({
                    message: res.msg,
                    iconClass: 'iconfont icon-zhengque'
                });
                this.switchState();
            })
        },
        ...mapMutations({
            setUserInfo: 'SET_USER_INFO',
            setIsTab: 'SET_IS_TAB'
        })
    }
}
</script>

<style lang="scss">
@import "../common/css/theme.scss";
.login-container{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background: #FCFCF2 url(../common/images/login_bg.jpg) no-repeat;
    // background-size: 100%;
    // background: #fff;
    overflow: hidden;
    .box{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.3);
        backdrop-filter:blur(10px);
        box-sizing: border-box;
        .dialog{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 0 .3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            transition: all .8s cubic-bezier(.55,0,.1,1);
            box-sizing: border-box;
            .group{
                width: 100%;
                padding: .3rem;
                box-sizing: border-box;
                background: rgba(255,255,255,.5);
                border-bottom: .5px solid rgba(255,255,255,.8);
                .icon{
                    padding-right: .2rem;
                    border-right: .5px solid rgba(255,255,255,.8);
                    .iconfont{
                        color: #fff;
                        font-size: .4rem;
                    }
                }
                .text{
                    position: relative;
                    padding-left: .2rem;
                    input{
                        display: block;
                        width: 100%;
                        box-sizing: border-box;
                        background: none;
                        border: none;
                        color: #fff;
                        &::-webkit-input-placeholder{
                            color: #fff;
                        }
                        &:-webkit-autofill {
                            background: none !important;
                            color: #fff;
                        }
                    }
                    button{
                        position: absolute;
                        right: 0;
                        top: 0;
                        padding: 0 .3rem;
                        background: none;
                        border-left: 1px solid rgba(255,255,255,.8);
                        color: #fff;
                        &.disabled{

                        }
                    }
                }
                &.user{
                    border-radius: 5px 5px 0 0;
                }
                &.pass{
                    border-radius: 0 0 5px 5px;
                    border-bottom: none;
                }
            }
            .btn{
                width: 100%;
                margin-top: .6rem;
                button {
                    margin-bottom: .3rem;
                    display: block;
                    width: 100%;
                    padding: .3rem 0;
                    text-align: center;
                    background: none;
                    border: none;
                    border-radius: 5px;
                    color: #fff;
                    &.login-btn{
                        background: rgba(246, 192, 28, .9);
                    }
                    &.login-reg{
                        background: rgba(255,255,255,.5);
                    }
                }
            }
        }
        .login-dialog{
            transform: translate3d(0, -100%, 0);
        }
        .reg-dialog{
            transform: translate3d(0, 100%, 0);
        }
    }
    video{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 100%;
        min-width: 100%;
        width: auto;
        height: auto;
        // -webkit-filter: grayscale(100%);
        // filter:grayscale(100%);
    }
    .login-bg{
        width: 100%;

    }
}
</style>
