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
    subtasks: [],
    requestQueue: []
  },
  getters: {
    todo: state => id => {
      return state.todo.find(todo => todo.id === id);
    },
    activeTodos: state => {
      return state.todos.filter(todo => !todo.done);
    },
    doneTodos: state => {
      return state.todos.filter(todo => todo.done);
    },
    subtasks: state => todoId => {
      return state.subtasks.filter(subtask => subtask.todoId === todoId);
    }
  },
  mutations: {
    loadTodos: (state, todos) => {
      state.todos = todos;
    },
    loadSubtasks: (state, subtasks) => {
      state.subtasks = subtasks;
    },
    addTodo: (state, todo) => {
      state.todos.push(todo);
    },
    updateTodo: (state, newTodo) => {
      let index = state.todos.findIndex(todo => todo.id === newTodo.id);
      Vue.set(state.todos, index, newTodo);
    },
    setTodoDone: (state, payload) => {
      state.todos.find(todo => todo.id === payload.id).done = payload.done;
    },
    removeTodo: (state, id) => {
      state.todos = state.todos.filter(todo => todo.id != id);
    },
    addSubtask: (state, subtask) => {
      state.subtasks.push(subtask);
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
    loadSubtasks({ commit }) {
      axios.get("/subtasks").then(response => {
        commit("loadSubtasks", response.data);
      });
    },
    addTodo({ commit, dispatch }, todo) {
      axios
        .post("/todos", todo)
        .then(response => {
          commit("addTodo", response.data);
          todo.subtasks.forEach(title => {
            dispatch("addSubtask", {
              todoId: response.data.id,
              title
            });
          });
        })
        .catch(() => {
          commit("addTodo", todo);
          commit("addToRequestQueue", {
            url: "/todos",
            data: todo
          });
        });
    },
    updateTodo({ commit }, newTodo) {
      axios
        .put("/todos/" + newTodo.id, newTodo)
        .then(response => {
          commit("updateTodo", response.data);
        })
        .catch(() => {
          // commit("addTodo", todo);
          // commit("addToRequestQueue", {
          //   url: "/todos",
          //   data: todo
          // });
        });
    },
    removeTodo({ commit }, id) {
      axios.delete("/todos/" + id).then(() => {
        commit("removeTodo", id);
      });
    },
    addSubtask({ commit }, subtask) {
      axios
        .post("/subtasks", subtask)
        .then(response => {
          commit("addSubtask", response.data);
        })
        .catch(() => {
          // commit("addTodo", todo);
          // commit("addToRequestQueue", {
          //   url: "/todos",
          //   data: todo
          // });
        });
    }
  }
});
