import Vue from 'vue'
import Router from 'vue-router'
import PageTransition from '@/components/PageTransition'
import Index from '@/components/index'
import IndexDetail from '@/components/indexDetail'
import Login from '@/components/login'
import Message from '@/components/message'
import User from '@/components/user'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}

Vue.use(Router)
const router = new Router({
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            path: '/',
            name: 'PageTransition',
            component: PageTransition,
            children: [
                {
                    path: '',
                    name: 'login',
                    component: Login
                },
                {
                    path: '/index',
                    name: 'index',
                    component: Index
                },
                {
                    path: '/index/:id',
                    name: 'indexDetail',
                    component: IndexDetail
                },
                {
                    path: '/message',
                    name: 'message',
                    component: Message
                },
                {
                    path: '/user',
                    name: 'user',
                    component: User
                },
            ]
        }
    ]
})

// 关键在这里，设置afterEach钩子函数
router.afterEach((to, from, next) => {
    localStorage.setItem('routerName', to.name);
    // document.title = to.name;
})

export default router
