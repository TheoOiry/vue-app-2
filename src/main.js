import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$base_url = "http://127.0.0.1:8000"

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
