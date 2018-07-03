import Vue from 'vue'
import shortid from 'shortid'
import axios from '@/axios'

const state = {
  todos: [],
}
/* eslint no-shadow: [2, { allow: ["state", "getters"] }] */

const getters = {
  todo: state => id => state.todos.find(todo => todo.id === id),
  activeTodos: state => state.todos.filter(todo => !todo.done && !todo.removed),
  doneTodos: state => state.todos.filter(todo => todo.done && !todo.removed),
}

const mutations = {
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
    const todo = state.todos[index]
    const updatedTodo = Object.assign({}, todo, payload.todo)
    Vue.set(state.todos, index, updatedTodo)
  },
  setTodoDone: (state, payload) => {
    state.todos.find(todo => todo.id === payload.id).done = payload.done
  },
  removeTodo: (state, id) => {
    state.todos = state.todos.filter(todo => todo.id !== id)
  },
  log: (rootState, text) => {
    // eslint-disable-next-line
    console.log(text)
    rootState.log = text
  },
}

const actions = {
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
            const updatedTodo = Object.assign({ dirty: false }, response.data)
            commit('updateTodo', { todo: updatedTodo, id: todo.id })
            resolve(response)
          })
          .catch((error) => {
            const errorData = error.response.data.errors
            if (errorData && errorData['date does not match']) {
              commit('updateTodo', {
                todo: errorData.currentTodo,
                id: errorData.currentTodo.id,
              })
              resolve('overwritten from server')
            } else {
              reject(error)
            }
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
    return new Promise((resolve, reject) => {
      // get all todos from server
      axios
        .get('/todos')
        .then((response) => {
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
      dispatch('sendNewTodos')
        .then(() => {
          commit('log', 'sending updated todos')
          return dispatch('sendUpdatedTodos')
        })
        .then(() => {
          commit('log', 'sending deleted todos')
          return dispatch('sendDeletedTodos')
        })
        .then(() => {
          commit('log', 'loading todos from server')
          return dispatch('loadTodos')
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
