import Vue from "vue";
import router from "./router";
import store from "./store";
import { sync } from "vuex-router-sync";

import "./registerServiceWorker";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueHotkey from "v-hotkey";

import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(VueHotkey);

sync(store, router);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
