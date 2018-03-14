import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'vue-ydui/dist/ydui.base.css'
// import 'vue-ydui/dist/ydui.rem.css';
import {BackTop} from 'vue-ydui/dist/lib.rem/backtop';
import {PullRefresh} from 'vue-ydui/dist/lib.rem/pullrefresh';
import { Loading } from 'vue-ydui/dist/lib.rem/dialog';
import VuePreview from 'vue-preview'
Vue.use(VuePreview)
// 图片懒加载
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
	loading: require('@/common/images/img.png')
})

Vue.component(PullRefresh.name, PullRefresh);
Vue.component(BackTop.name, BackTop);
Vue.prototype.$dialog = {
    loading: Loading,
};
import './common/css/index.scss'


// 过滤器
import { getDateDiff } from './filters'

Vue.filter('getDateDiff', getDateDiff);

Vue.config.productionTip = false




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

