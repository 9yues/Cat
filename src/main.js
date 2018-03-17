import 'babel-polyfill'
import Vue from 'vue/dist/vue.esm.js'
import App from './App'
import router from './router'
import store from './store'

// import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
// Vue.use(MintUI);
// 引入基本样式
import './common/css/mint-ui.scss'
import './common/css/base.scss'
import './common/css/index.scss'


// 图片懒加载
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
	loading: require('@/common/images/img.png')
})




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

