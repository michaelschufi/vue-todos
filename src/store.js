import Vue from "vue";
import Vuex from "vuex";
import Axios from "axios";

Vue.use(Vuex);

const axios = Axios.create({
  baseURL: "https://example.com:2403/",
  // baseURL: "http://localhost:2403/",
  timeout: 3000
});

export default new Vuex.Store({
  state: {
    todos: [],
    requestQueue: [],
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
    loadTodos: (state, todos) => {
      state.todos = todos;
    },
    addTodo: (state, todo) => {
      state.todos.push(todo);
    },
    setTodoDone: (state, payload) => {
      state.todos[payload.index].done = payload.done;
    },
    removeTodo: (state, index) => {
      state.todos.splice(index, 1);
    },
    addToRequestQueue: (state, request) => {
      state.requestQueue.push(request);
    }
  },
  actions: {
    loadTodos({ commit }) {
      axios.get("/todos").then(response => {
        commit("loadTodos", response.data);
      });
    },
    addTodo({ commit }, todo) {
      axios
        .post("/todos", todo)
        .then(response => {
          commit("addTodo", response.data);
        })
        .catch(() => {
          commit("addTodo", todo);
          commit("addToRequestQueue", {
            url: "/todos",
            data: todo
          });
        });
    },
    removeTodo({ commit, state }, index) {
      const todo = state.todos[index];
      axios.delete("/todos/" + todo.id).then(() => {
        commit("removeTodo", index);
      });
    }
  }
});
