import Vue from 'vue'
import shortid from 'shortid'
import axios from '@/axios'

const state = {
  subtasks: [],
}
/* eslint no-shadow: [2, { allow: ["state", "getters"] }] */

const getters = {
  subtask: state => id =>
    state.subtasks.find(subtask => subtask.id === id),
  byTodo: state => id =>
    state.subtasks.filter(subtask => subtask.todoId === id && !subtask.removed),
}

const mutations = {
  add: (state, subtask) => {
    const newSubtask = Object.assign(
      {
        id: shortid.generate(),
      },
      subtask,
    )
    state.subtasks.push(newSubtask)
  },
  update: (state, payload) => {
    const newSubtask = Object.assign({ dirty: !payload.notDirty }, payload.subtask)
    const lookupId = payload.id ? payload.id : newSubtask.id

    const index = state.subtasks.findIndex(subtask => subtask.id === lookupId)
    Vue.set(state.subtasks, index, newSubtask)
  },
  remove: (state, id) => {
    state.subtasks = state.subtasks.filter(subtask => subtask.id !== id)
  },
  log: (rootState, text) => {
    // eslint-disable-next-line
    console.log(text)
    rootState.log = text
  },
}

const actions = {
  sendNew({ commit, state }) {
    // get new subtasks
    const newSubtasks = state.subtasks.filter(subtask => !subtask.createdAt)
    // inform server about new subtasks
    const requests = newSubtasks.map(subtask =>
      new Promise((resolve, reject) => {
        const params = Object.assign({}, subtask, { id: undefined })
        axios
          .post('/subtasks', params)
          .then((response) => {
            commit('update', { subtask: response.data, id: subtask.id })
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }))
    return Promise.all(requests)
  },
  sendUpdated({ commit, state }) {
    // get updated subtasks
    const updatedSubtasks = state.subtasks.filter(subtask => subtask.dirty && !subtask.removed)

    // inform server about updated subtasks
    const requests = updatedSubtasks.map(subtask =>
      new Promise((resolve, reject) => {
        axios
          .put(`/subtasks/${subtask.id}`, subtask)
          .then((response) => {
            const updatedSubtask = Object.assign({ dirty: false }, response.data)
            commit('update', { subtask: updatedSubtask, notDirty: true, id: subtask.id })
            resolve(response)
          })
          .catch((error) => {
            const errorData = error.response.data.errors
            if (errorData && errorData['date does not match']) {
              commit('update', {
                subtask: errorData.current,
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
    // get deleted subtask
    const deletedSubtasks = state.subtasks.filter(subtask => subtask.removed)

    // inform server about deleted subtask
    const requests = deletedSubtasks.map(subtask =>
      new Promise((resolve, reject) => {
        axios
          .delete(`/subtasks/${subtask.id}`)
          .then((response) => {
            commit('remove', subtask.id)
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
      // get all subtasks from server
      axios
        .get('/subtasks')
        .then((response) => {
          // remove deleted ones
          const deletedSubtasks = state.subtasks.filter(localSubtask =>
            !response.data.find(serverSubtask => serverSubtask.id === localSubtask.id))
          deletedSubtasks.forEach((subtask) => {
            commit('remove', subtask.id)
          })

          // update existing ones
          response.data.forEach((subtask) => {
            const localSubtask = getters.subtask(subtask.id)

            // create new ones for the others
            if (!localSubtask) {
              commit('add', subtask)
            } else if (localSubtask.modifiedAt < subtask.modifiedAt) {
              // update the ones which already exist
              commit('update', { subtask, id: subtask.id })
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
      commit('log', 'starting sync of subtasks')
      commit('log', 'sending new subtasks')
      dispatch('sendNew')
        .then(() => {
          commit('log', 'sending updated subtasks')
          return dispatch('sendUpdated')
        })
        .then(() => {
          commit('log', 'sending deleted subtasks')
          return dispatch('sendDeleted')
        })
        .then(() => {
          commit('log', 'loading subtasks from server')
          return dispatch('load')
        })
        .then(() => {
          commit('log', 'ended sync of subtasks (OK)')
          commit('setSyncing', false, { root: true })
        })
        .catch((error) => {
          commit('log', error)
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
