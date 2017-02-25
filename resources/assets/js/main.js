import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './views/App'
import router from './router'
import store from './store'

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store
})
