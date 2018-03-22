<template>
    <div class="user-container">
        <div class="user-panel" :style="{backgroundImage: `url(${userInfo.avatar})`}">
            <div class="info flex-container align-center justify-center flex-column">
                <div class="avatar">
                    <img :src="userInfo.avatar" alt="">
                </div>
                <div class="username">
                    {{userInfo.nickName}}
                    <i class="iconfont" :class="sexCls"></i>
                </div>
                <div class="sign">
                    {{userInfo.sign}}
                </div>
            </div>
        </div>
        <div class="user-info">
            <ul>
                <li class="flex-container align-center">
                    <div class="flex label">头像</div>
                    <div class="more">
                        <img class="avatar" :src="userInfo.avatar" alt="">
                        <i class="iconfont icon-jiantoushang"></i>
                    </div>
                    <input class="file" ref="file" type="file" name="file" accept="image/jpg,image/jpeg,image/png,image/gif" @change="fileSelect" />
                </li>
                <li class="flex-container align-center" @click="showUserInfo('nickname')">
                    <div class="flex label">昵称</div>
                    <div class="more">
                        {{userInfo.nickName || '未填写'}}
                        <i class="iconfont icon-jiantoushang"></i>
                    </div>
                </li>
                <li class="flex-container align-center" @click="showUserInfo('sex')">
                    <div class="flex label">性别</div>
                    <div class="more">
                        {{userInfo.sex === 0 ? '女' : '男'}}
                        <i class="iconfont icon-jiantoushang"></i>
                    </div>
                </li>
                <li class="flex-container align-center" @click="showUserInfo('tel')">
                    <div class="flex label">手机号</div>
                    <div class="more">
                        {{userInfo.userTel || '未绑定'}}
                        <i class="iconfont icon-jiantoushang"></i>
                    </div>
                </li>
                <li class="flex-container align-center" @click="showUserInfo('wx')">
                    <div class="flex label">微信号</div>
                    <div class="more">
                        {{userInfo.wx || '未绑定'}}
                        <i class="iconfont icon-jiantoushang"></i>
                    </div>
                </li>
                <li class="flex-container align-center" @click="showUserInfo('email')">
                    <div class="flex label">邮箱</div>
                    <div class="more">
                        {{userInfo.email || '未绑定'}}
                        <i class="iconfont icon-jiantoushang"></i>
                    </div>
                </li>
                <li class="flex-container align-center" @click="showUserInfo('sign')">
                    <div class="flex label">个性签名</div>
                    <div class="more sign flex-container flex">
                        <span class="flex">{{userInfo.sign || '未填写'}}</span>
                        <i class="iconfont icon-jiantoushang"></i>
                    </div>
                </li>
            </ul>
            <ul class="last">
                <li class="flex-container align-center justify-center last" @click="loginBack">
                    退出登录
                </li>
            </ul>
        </div>
        <mt-actionsheet :actions="sexList" v-model="sexFlag">
</mt-actionsheet>
    </div>
</template>

<script>
import {checkMobile, checkEmail } from '@/common/js/util'
import {logout, updateUserInfo, userAvatarFile} from '@/api/index'
import { Toast,MessageBox,Actionsheet,Indicator } from 'mint-ui'
import {mapMutations, mapGetters} from 'vuex'
export default {
    data() {
        return {
            // userInfo: JSON.parse(localStorage.getItem('userInfo')),
            sexFlag: false,
            sexList: [
                {
                    name: '男',
                    method: this.sexCallback
                },
                {
                    name: '女',
                    method: this.sexCallback
                }
            ]
        }
    },
    mounted() {
        this.setTabBar('user');
    },
    watch: {
        userInfo: {
            deep: true,
            handler(val) {
                console.log(val)
                this._updateUserInfo();
            }
        }
    },
    computed: {
        sexCls() {
            return this.userInfo.sex === 0 ? 'icon-nv' : 'icon-nan'
        },
        ...mapGetters([
            'userInfo'
        ])
    },
    methods: {
        // 头像
        fileSelect(e) {
            console.log(e)
            // 创建 formDate对象
            let formDate = new FormData();
            formDate.append('avatar', e.target.files[0]);
            formDate.append('userId', this.userInfo.userId);
            this._userAvatarFile(formDate);
        },
        // 显示用户信息
        showUserInfo(type) {
            switch (type) {
                case 'nickname':
                    MessageBox.prompt('请输入昵称', {inputPlaceholder: this.userInfo.nickName}).then(({value, action}) => {
                        if (action === 'confirm' && value) {
                            let data = Object.assign({}, this.userInfo, {
                                type: 'nickName',
                                value
                            })
                            this.setUserInfo(data);
                        }
                    });
                    break;
                case 'sex':
                    this.sexFlag = true;
                    break;
                case 'tel':
                    MessageBox.prompt('请输入手机号', {inputPlaceholder: this.userInfo.userTel}).then(({value, action}) => {
                        if (action === 'confirm' && value) {
                            if (!checkMobile(value)) {
                                Toast({
                                    message: '喵~修改失败，请输入正确的手机号',
                                    iconClass: 'iconfont icon-guanbi'
                                });
                                return;
                            }
                            let data = Object.assign({}, this.userInfo, {
                                type: 'userTel',
                                value
                            })
                            this.setUserInfo(data);
                        }
                    });
                    break;
                case 'wx':
                   MessageBox.prompt('请输入微信号', {inputPlaceholder: this.userInfo.wx}).then(({value, action}) => {
                        let data = Object.assign({}, this.userInfo, {
                                type: 'wx',
                                value
                            })
                            this.setUserInfo(data);
                    });
                    break;
                case 'email':
                    MessageBox.prompt('请输入邮箱', {inputPlaceholder: this.userInfo.email}).then(({value, action}) => {
                        if (action === 'confirm' && value) {
                            if (!checkEmail(value)) {
                                Toast({
                                    message: '喵~修改失败，请输入正确的邮箱',
                                    iconClass: 'iconfont icon-guanbi'
                                });
                                return;
                            }
                            let data = Object.assign({}, this.userInfo, {
                                type: 'email',
                                value
                            })
                            this.setUserInfo(data);
                        }
                    });
                    break;
                case 'sign':
                    MessageBox.prompt('请输入个性签名', {inputPlaceholder: this.userInfo.sign}).then(({value, action}) => {
                        if (action === 'confirm' && value) {
                            let data = Object.assign({}, this.userInfo, {
                                type: 'sign',
                                value
                            })
                            this.setUserInfo(data);
                        }
                    });
                    break;
            }
        },
        // 用户性别更改回调
        sexCallback(val) {
            if (val.name === '男') {
                let data = Object.assign({}, this.userInfo, {
                    type: 'sex',
                    value: 1
                })
                this.setUserInfo(data);
            } else {
                let data = Object.assign({}, this.userInfo, {
                    type: 'sex',
                    value: 0
                })
                this.setUserInfo(data);
            }
        },
        // 退出登录
        loginBack() {
            this._logout();
        },
        // 用户头像上传接口
        _userAvatarFile(obj) {
            Indicator.open({
                text: '请稍后...',
                spinnerType: 'fading-circle'
            });
            userAvatarFile(obj).then(res => {
                Indicator.close();
                if (res.status === 1) {
                    Toast({
                        message: res.msg,
                        iconClass: 'iconfont icon-guanbi'
                    });
                    return;
                }
                this.$refs.file.value = '';
                let data = Object.assign({}, this.userInfo, {
                    type: 'avatar',
                    value: res.result
                })
                this.setUserInfo(data);
            })
        },
        // 修改用户信息接口
        _updateUserInfo() {
            updateUserInfo(this.userInfo).then(res => {
                if (res.status === 1) {
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
            })
        },
        // 登出接口
        _logout() {
            logout().then(res => {
                if (res.status === 0) {
                    Toast({
                        message: res.msg,
                        iconClass: 'iconfont icon-zhengque'
                    });
                    this.$router.push('/')
                }
            })
        },
        ...mapMutations({
            setTabBar: 'SET_TAB_BAR',    // 映射 this.setTabBar() 为 this.$store.commit('SET_TAB_BAR')
            setUserInfo: 'SET_USER_INFO'
        })
    },
    components: {
        'mt-actionsheet': Actionsheet
    }
}
</script>
<style lang="scss">
@import "../common/css/theme.scss";
.user-container{
    padding-bottom: 1.4rem;
    .user-panel{
        position: relative;
        height: 4rem;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100%;
        .info{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,.5);
            backdrop-filter:blur(10px);
            .avatar{
                position: relative;
                img{
                    display: block;
                    width: 1.4rem;
                    height: 1.4rem;
                    border-radius: 50%;
                    border: 3px solid rgba(255,255,255,.6);
                }
            }
            .username{
                margin-top: .2rem;
                color: #fff;
                font-size: .32rem;
            }
            .sign{
                margin-top: .2rem;
                font-size: .24rem;
                color: rgba(255,255,255,.7);
            }
        }
    }
    .user-info{
        margin-top: .3rem;
        ul{
            padding: 0 .2rem;
            border-top: .5px solid $border_color;
            border-bottom: .5px solid $border_color;
            background: #fff;
            &.last{
                margin-top: .3rem;
                li{
                    color: $red;
                    font-size: .32rem;
                }
            }
        }
        li{
            position: relative;
            padding: .2rem .0;
            border-bottom: .5px solid $border_color;
            .avatar{
                width: .8rem;
                height: .8rem;
                border-radius: 6px;
            }
            .label{
                font-size: .32rem;
                color: $title_color;
            }
            .more{
                color: $desc_color2;
                .iconfont{
                    display: inline-block;
                    transform: rotate(90deg);
                    color: $desc_color2;
                }
                &.sign{
                    display: flex;
                    .flex{
                        padding-right: 2px;
                        @extend %textHidden1;
                        text-align: right;
                    }
                }
            }
            .file{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
            &:last-child{
                border-bottom: none;
            }
        }
    }
}
</style>

