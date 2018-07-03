import Vue from 'vue'
import Vuetify from 'vuetify'
import VueShortkey from 'vue-shortkey'
import { sync } from 'vuex-router-sync'

import 'vuetify/dist/vuetify.min.css'

import router from './router'
import store from './store/'

import './registerServiceWorker'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueShortkey, { prevent: ['.disablehotkeys', '.disablehotkeys input, .disablehotkeys textarea'] })
sync(store, router)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
