import Vue from 'vue'
import shortid from 'shortid'
import axios from '@/axios'

const state = {
  todos: [],
}
/* eslint no-shadow: [2, { allow: ["state", "getters"] }] */

const getters = {
  todo: state => id => state.todos.find(todo => todo.id === id),
  active: state => state.todos.filter(todo => !todo.done && !todo.removed),
  done: state => state.todos.filter(todo => todo.done && !todo.removed),
}

const mutations = {
  add: (state, todo) => {
    const id = shortid.generate()
    const newTodo = Object.assign(
      {
        id,
      },
      todo,
    )
    state.todos.push(newTodo)
    return id
  },
  update: (state, payload) => {
    const index = state.todos.findIndex(todo => todo.id === payload.id)
    const todo = state.todos[index]
    const updatedTodo = Object.assign({}, todo, payload.todo)
    Vue.set(state.todos, index, updatedTodo)
  },
  remove: (state, id) => {
    state.todos = state.todos.filter(todo => todo.id !== id)
  },
  log: (rootState, text) => {
    // eslint-disable-next-line
    console.log(text)
    rootState.log = text
  },
}

const actions = {
  sendNew({ commit, state }) {
    // get new todos
    const newTodos = state.todos.filter(todo => !todo.createdAt)
    // inform server about new todos
    const requests = newTodos.map(todo =>
      new Promise((resolve, reject) => {
        const params = Object.assign({}, todo, { id: undefined })
        axios
          .post('/todos', params)
          .then((response) => {
            commit('update', { todo: response.data, id: todo.id })
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }))
    return Promise.all(requests)
  },
  sendUpdated({ commit, state }) {
    // get updated todos
    const updatedTodos = state.todos.filter(todo => todo.dirty && !todo.removed)

    // inform server about updated todos
    const requests = updatedTodos.map(todo =>
      new Promise((resolve, reject) => {
        axios
          .put(`/todos/${todo.id}`, todo)
          .then((response) => {
            const updatedTodo = Object.assign({ dirty: false }, response.data)
            commit('update', { todo: updatedTodo, id: todo.id })
            resolve(response)
          })
          .catch((error) => {
            const errorData = error.response.data.errors
            if (errorData && errorData['date does not match']) {
              commit('update', {
                todo: errorData.current,
                id: errorData.current.id,
              })
              resolve('overwritten from server')
            } else {
              reject(error)
            }
          })
      }))
    return Promise.all(requests)
  },
  sendDeleted({ commit, state }) {
    // get deleted todos
    const deletedTodos = state.todos.filter(todo => todo.removed)

    // inform server about deleted todos
    const requests = deletedTodos.map(todo =>
      new Promise((resolve, reject) => {
        axios
          .delete(`/todos/${todo.id}`)
          .then((response) => {
            commit('remove', todo.id)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }))
    return Promise.all(requests)
  },
  load({ commit, state, getters }) {
    return new Promise((resolve, reject) => {
      // get all todos from server
      axios
        .get('/todos')
        .then((response) => {
          // remove deleted ones
          const deletedTodos = state.todos.filter(localTodo =>
            !response.data.find(serverTodo => serverTodo.id === localTodo.id))
          deletedTodos.forEach((todo) => {
            commit('remove', todo.id)
          })

          // update existing ones
          response.data.forEach((todo) => {
            const localTodo = getters.todo(todo.id)

            // create new ones for the others
            if (!localTodo) {
              commit('add', todo)
            } else if (localTodo.modifiedAt < todo.modifiedAt) {
              // update the ones which already exist
              commit('update', { todo, id: todo.id })
            }
          })
          resolve()
        })
        .catch(() => reject())
    })
  },
  sync({ commit, state, dispatch }) {
    if (!state.syncing) {
      commit('setSyncing', true, { root: true })
      commit('log', 'starting sync of todos')
      commit('log', 'sending new todos')
      dispatch('sendNew')
        .then(() => {
          commit('log', 'sending updated todos')
          return dispatch('sendUpdated')
        })
        .then(() => {
          commit('log', 'sending deleted todos')
          return dispatch('sendDeleted')
        })
        .then(() => {
          commit('log', 'loading todos from server')
          return dispatch('load')
        })
        .then(() => {
          commit('log', 'ended sync of todos (OK)')
          commit('setSyncing', false, { root: true })
        })
        .catch(() => {
          commit('log', 'ended sync of todos (FAIL)')
          commit('setSyncing', false, { root: true })
        })
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
