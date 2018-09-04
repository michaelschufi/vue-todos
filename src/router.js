import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Add from './views/Add.vue'
import Folder from './views/Folder.vue'
import constants from './constants'
import store from './store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      title: 'Home',
    },
    {
      path: '/add',
      name: 'add',
      component: Add,
      title: 'Add Todos',
    },
    {
      path: '/:folder',
      component: Folder,
      name: 'folder',
      beforeEnter: (to, from, next) => {
        const currentFolder = constants.folders.find(folder => folder.value === to.params.folder)
        store.commit('setPageTitle', currentFolder.text)
        next()
      },
    },
  ],
})
