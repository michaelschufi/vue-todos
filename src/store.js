import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import Axios from 'axios'
import shortid from 'shortid'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  strictMode: true,
})

const axios = Axios.create({
  baseURL: 'https://example.com:2403/',
  // baseURL: "http://localhost:2403/",
  timeout: 3000,
})

export default new Vuex.Store({
  strict: true,
  plugins: [vuexLocal.plugin],
  state: {
    syncing: false,
    todos: [],
    subtasks: [],
    requestQueue: [],
    log: '',
  },
  getters: {
    todo: state => id => state.todos.find(todo => todo.id === id),
    activeTodos: state => state.todos.filter(todo => !todo.done),
    doneTodos: state => state.todos.filter(todo => todo.done),
    subtasks: state => todoId =>
      state.subtasks.filter(subtask => subtask.todoId === todoId),
  },
  mutations: {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION, // this mutation **MUST** be named "RESTORE_MUTATION"
    addTodo: (state, todo) => {
      const newTodo = Object.assign(
        {
          id: shortid.generate(),
        },
        todo,
      )
      state.todos.push(newTodo)
    },
    updateTodo: (state, payload) => {
      const index = state.todos.findIndex(todo => todo.id === payload.id)
      Vue.set(state.todos, index, payload.todo)
    },
    setTodoDone: (state, payload) => {
      state.todos.find(todo => todo.id === payload.id).done = payload.done
    },
    removeTodo: (state, id) => {
      state.todos = state.todos.filter(todo => todo.id !== id)
    },
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
    log: (state, text) => {
      // eslint-disable-next-line
      console.log(text)
      state.log = text
    },
  },
  actions: {
    loadSubtasks({ commit }) {
      axios.get('/subtasks').then((response) => {
        commit('loadSubtasks', response.data)
      })
    },
    sendNewTodos({ commit, state }) {
      // get new todos
      const newTodos = state.todos.filter(todo => !todo.createdAt)
      // inform server about new todos
      const requests = newTodos.map(todo =>
        new Promise((resolve, reject) => {
          const params = Object.assign({}, todo, { id: undefined })
          axios
            .post('/todos', params)
            .then((response) => {
              commit('updateTodo', { todo: response.data, id: todo.id })
              resolve(response)
            })
            .catch((error) => {
              reject(error)
            })
        }))
      return Promise.all(requests)
    },
    sendUpdatedTodos({ commit, state }) {
      // get updated todos
      const updatedTodos = state.todos.filter(todo => todo.dirty && !todo.removed)

      // inform server about updated todos
      const requests = updatedTodos.map(todo =>
        new Promise((resolve, reject) => {
          axios
            .put(`/todos/${todo.id}`, todo)
            .then((response) => {
              commit('updateTodo', { todo: response.data, id: todo.id })
              resolve(response)
            })
            .catch((error) => {
              reject(error)
            })
        }))
      return Promise.all(requests)
    },
    sendDeletedTodos({ commit, state }) {
      // get deleted todos
      const deletedTodos = state.todos.filter(todo => todo.removed)

      // inform server about deleted todos
      const requests = deletedTodos.map(todo =>
        new Promise((resolve, reject) => {
          axios
            .delete(`/todos/${todo.id}`)
            .then((response) => {
              commit('removeTodo', todo.id)
              resolve(response)
            })
            .catch((error) => {
              reject(error)
            })
        }))
      return Promise.all(requests)
    },
    loadTodos({ commit, state, getters }) {
      // get all todos from server
      axios.get('/todos').then((response) => {
        // remove deleted ones
        const deletedTodos = state.todos.filter(localTodo =>
          !response.data.find(serverTodo => serverTodo.id === localTodo.id))
        deletedTodos.forEach((todo) => {
          commit('removeTodo', todo.id)
        })

        // update existing ones
        response.data.forEach((todo) => {
          const localTodo = getters.todo(todo.id)

          // create new ones for the others
          if (!localTodo) {
            commit('addTodo', todo)
          } else if (localTodo.modifiedAt < todo.modifiedAt) {
            // update the ones which already exist
            commit('updateTodo', { todo, id: todo.id })
          }
        })
      })
    },
    sync({ commit, state, dispatch }) {
      if (!state.syncing) {
        commit('log', 'starting sync')
        dispatch('sendNewTodos')
          .then(() => {
            commit('log', 'sending updated todos')
            dispatch('sendUpdatedTodos')
          })
          .then(() => {
            commit('log', 'sending deleted todos')
            dispatch('sendDeletedTodos')
          })
          .then(() => {
            commit('log', 'loading todos from server')
            dispatch('loadTodos')
          })
          .then(() => {
            commit('log', 'ended sync (then)')
          })
          .catch(() => {
            commit('log', 'ended sync (catch)')
          })
      }
    },
    addTodo({ commit, dispatch }, todo) {
      commit('addTodo', todo)
      dispatch('sync')
    },
    updateTodo({ commit }, newTodo) {
      axios.put(`/todos/${newTodo.id}`, newTodo).then((response) => {
        commit('updateTodo', { todo: response.data, id: response.data.id })
      })
    },
    removeTodo({ commit }, id) {
      axios.delete(`/todos/${id}`).then(() => {
        commit('removeTodo', id)
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
