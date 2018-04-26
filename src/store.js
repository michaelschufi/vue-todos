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
      state.todos.push(todo)
    }
  },
  actions: {}
});
