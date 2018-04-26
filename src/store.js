import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    todos: []
  },
  getters: {
    activeTodos: state => {
      return state.todos.filter(todo => !todo.done);
    },
    doneTodos: state => {
      return state.todos.filter(todo => todo.done);
    }
  },
  mutations: {
    addTodo: (state, todo) => {
      state.todos.push(todo);
    },
    setTodoDone: (state, payload) => {
      state.todos[payload.index].done = payload.done;
    },
    removeTodo: (state, payload) => {
      state.todos.splice(payload.index, 1);
    }
  },
  actions: {}
});
