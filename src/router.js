import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Add from './views/Add.vue'
import Folder from './views/Folder.vue'
import constants from './constants'
import store from './store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/add',
      name: 'add',
      component: Add,
      meta: {
        title: 'Add Todo',
      },
    },
    {
      path: '/:folder',
      component: Folder,
      name: 'folder',
    },
  ],
})

router.beforeEach((to, from, next) => {
  let title = '?'
  if (to.name === 'folder') {
    title = constants.folders.find(folder => folder.value === to.params.folder).text
  } else {
    title = to.meta.title
  }
  store.commit('setPageTitle', title)
  next()
})

export default router
