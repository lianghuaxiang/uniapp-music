import App from './App'
import store from './store/index'
// #ifndef VUE3
import Vue from 'vue'
Vue.prototype.$store=store
Vue.config.productionTip = false


App.mpType = 'app'
import PubFn from 'common/js/utils.js'
Vue.prototype.$pubFn=PubFn

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif