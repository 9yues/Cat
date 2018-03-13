import Vue from 'vue'
import Router from 'vue-router'
import PageTransition from '@/components/PageTransition'
import Index from '@/components/index'
import Message from '@/components/message'
import User from '@/components/user'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}

Vue.use(Router)
const router = new Router({
    mode: 'history',
    routes: [
    {
        path: '/',
        name: 'PageTransition',
        component: PageTransition,
        children: [
            {
                path: '',
                name: 'index',
                component: Index
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

export default router
