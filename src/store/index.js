import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import axios from '@/axios'

import todos from './modules/todos'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  strictMode: true,
  modules: ['todos'],

  // reducer: state => ({
  //   todos: {
  //     todos: state.todos.todos,
  //   },
  //   subtasks: state.subtasks,
  // }),
})

export default new Vuex.Store({
  strict: true,
  modules: {
    todos,
  },
  plugins: [vuexLocal.plugin],
  state: {
    syncing: false,
    subtasks: [],
    log: '',
  },
  getters: {
    subtasks: state => todoId =>
      state.subtasks.filter(subtask => subtask.todoId === todoId),
  },
  mutations: {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION, // this mutation **MUST** be named "RESTORE_MUTATION"
    addSubtask: (state, subtask) => {
      state.subtasks.push(subtask)
    },
    updateSubtask: (state, newSubtask) => {
      const index = state.subtasks.findIndex(subtask => subtask.id === newSubtask.id)
      Vue.set(state.subtasks, index, newSubtask)
    },
    removeSubtask: (state, id) => {
      state.subtasks = state.subtasks.filter(subtask => subtask.id !== id)
    },
    addToRequestQueue: (state, request) => {
      state.requestQueue.push(request)
    },
    setSyncing: (state, val) => {
      state.syncing = val
    },
  },
  actions: {
    loadSubtasks({ commit }) {
      axios.get('/subtasks').then((response) => {
        commit('loadSubtasks', response.data)
      })
    },
    addSubtask({ commit }, subtask) {
      axios
        .post('/subtasks', subtask)
        .then((response) => {
          commit('addSubtask', response.data)
        })
        .catch(() => {
          // commit("addTodo", todo);
          // commit("addToRequestQueue", {
          //   url: "/todos",
          //   data: todo
          // });
        })
    },
    updateSubtask({ commit }, newSubtask) {
      axios
        .put(`/subtasks/${newSubtask.id}`, newSubtask)
        .then((response) => {
          commit('updateSubtask', response.data)
        })
        .catch(() => {
          // commit("addSubtask", Subtask);
          // commit("addToRequestQueue", {
          //   url: "/subtasks",
          //   data: subtask
          // });
        })
    },
    removeSubtask({ commit }, id) {
      axios.delete(`/subtasks/${id}`).then(() => {
        commit('removeSubtask', id)
      })
    },
  },
})
