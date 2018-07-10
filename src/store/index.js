import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import todos from './modules/todos'
import subtasks from './modules/subtasks'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  strictMode: true,
  modules: ['todos', 'subtasks'],
})

export default new Vuex.Store({
  strict: true,
  modules: {
    todos,
    subtasks,
  },
  plugins: [vuexLocal.plugin],
  state: {
    syncing: false,
    subtasks: [],
    log: '',
  },
  getters: {},
  mutations: {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION, // this mutation **MUST** be named "RESTORE_MUTATION"
    setSyncing: (state, val) => {
      state.syncing = val
    },
  },
  actions: {},
})
